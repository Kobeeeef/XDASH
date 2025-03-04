package org.kobe.xbot.xdashbackend.entities;

import com.google.gson.Gson;
import com.jcraft.jsch.*;
import jakarta.servlet.http.HttpServletResponse;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;
import org.kobe.xbot.xdashbackend.websocket.WebSocketHandler;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;

public class SSHHostAddress {
    private static final Gson gson = new Gson();
    private static final XDashLogger logger = XDashLogger.getLogger();
    private final String server;
    private final String hostname;
    private final String address;
    private String status = "DISCONNECTED";
    private transient Session session = null;
    private transient ChannelShell channel = null;
    private transient OutputStream outputStream;
    private final String username;
    private final String password;
    private transient Thread journalThread = null;
    private transient Thread rioThread = null;


    public SSHHostAddress(String hostname, String username, String password, String address, String server) {
        this.username = username;
        this.password = password;
        this.hostname = hostname;
        this.address = address;
        this.server = server;
    }

    @Override
    public String toString() {
        return String.format(
                "{\"username\": \"%s\", \"password\": \"%s\", \"hostname\": \"%s\", \"address\": \"%s\", \"server\": \"%s\"}",
                username, password, hostname, address, server
        );
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getStatus() {
        return status;
    }

    public SSHHostAddress setStatus(String status) {
        this.status = status;
        return this;
    }

    public Session getSession() {
        return session;
    }

    public SSHHostAddress setSession(Session session) {
        this.session = session;
        return this;
    }

    public String getHostname() {
        return hostname;
    }

    public String getAddress() {
        return address;
    }

    public String getServer() {
        return server;
    }

    public void closeSession() {
        if (session != null && forceIsConnected()) {
            if (channel != null && channel.isConnected()) {
                channel.disconnect();
            }
            session.disconnect();
            setStatus("DISCONNECTED");
        }
    }

    public boolean isChannelActive() {
        return channel != null && channel.isConnected() && !channel.isClosed();
    }

    public boolean createNewChannel(Consumer<String> lineConsumer) {
        try {
            if (lineConsumer != null) lineConsumer.accept("\u001B[33mXDASH: Creating new shell channel...");
            if (channel != null && channel.isConnected()) {
                channel.disconnect();
                if (lineConsumer != null)
                    lineConsumer.accept("\u001B[33mXDASH: Previous channel disconnected successfully.");
            }
            channel = (ChannelShell) session.openChannel("shell");
            outputStream = channel.getOutputStream();
            InputStream inputStream = channel.getInputStream();
            InputStream errStream = channel.getExtInputStream();

            new Thread(() -> readStream(inputStream, lineConsumer, false)).start();
            new Thread(() -> readStream(errStream, lineConsumer, true)).start();
            channel.connect();
            setStatus("CONNECTED");
            if (lineConsumer != null) lineConsumer.accept("\u001B[33mXDASH: Shell channel connected successfully.");
            return true;
        } catch (JSchException | IOException e) {
            if (lineConsumer != null)
                lineConsumer.accept("\u001B[33mXDASH: Failed to create new channel: " + e.getMessage());
            setStatus("DISCONNECTED");
            return false;
        }
    }
    /**
     * Runs the rsync command with SSH, piping in the password, and processes updates with a Consumer.
     *
     * @param hostDir    The local directory to sync.
     * @param targetDir  The remote directory to sync to.
     * @param consumer   The Consumer that processes updates.
     * @throws IOException If an I/O error occurs.
     */
    public boolean runRsync(String hostDir, String targetDir,
                                Consumer<DockerImportReturn> consumer) {
        try {
            // Construct the rsync command with sshpass for password authentication
            String command = String.format(
                    "sshpass -p '%s' rsync -avzp -e \"ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null\" %s %s@%s:%s",
                    this.password, hostDir, this.username, this.address, targetDir
            );

            // Execute the command
            ProcessBuilder processBuilder = new ProcessBuilder("bash", "-c", command);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            // Read and output the command output, passing each line to the consumer
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    consumer.accept(new DockerImportReturn(line, this.server, true, false)); // Ongoing updates
                }
            }

            // Wait for the process to complete
            boolean success = false;
            try {
                int exitCode = process.waitFor();
                success = (exitCode == 0);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new IOException("Rsync process was interrupted", e);
            }
            return success;
        } catch (Exception e) {
            consumer.accept(new DockerImportReturn("There was a exception: " + e.getMessage(), this.server, false, false));
            return false;
        }
        // Notify consumer that process has finished
    }
    public String sendCommandWithSudoPermissions(String command, Consumer<String> lineConsumer) {
        return sendCommand(String.format("echo \"%1$s\" | sudo -S %2$s", password, command), lineConsumer);
    }

    public String sendCommand(String command, Consumer<String> lineConsumer) {
        return send(command + "\n", lineConsumer);
    }

    public String sendControlCharacter(ControlCharacter controlChar, Consumer<String> lineConsumer) {
        return send(String.valueOf(controlChar.getCharacter()), lineConsumer);
    }

    private String send(String input, Consumer<String> lineConsumer) {
        if (session == null || !forceIsConnected()) {
            throw new IllegalStateException("SSH session is not connected.");
        }

        try {
            if (channel == null || !channel.isConnected()) {
                createNewChannel(lineConsumer);
            }

            // Send the input to the shell
            outputStream.write(input.getBytes());
            outputStream.flush();
        } catch (IOException e) {
            if (lineConsumer != null) lineConsumer.accept("\u001B[33mXDASH: Error Occurred: \n" + e.getMessage());
            setStatus("DISCONNECTED");
            logger.severe("Failed to execute command: " + input + "\n" + e);
            return null;
        }
        return "Input sent.";
    }

    private void readStream(InputStream input, Consumer<String> lineConsumer, boolean isErrorStream) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(input))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (isErrorStream && lineConsumer != null) {
                    lineConsumer.accept("\u001B[33mXDASH: Error Stream started");
                }
                if (lineConsumer != null) {
                    lineConsumer.accept(line);
                }
                setStatus("CONNECTED");
            }
        } catch (IOException e) {
            logger.warning("Failed to consume line from " + (isErrorStream ? "error" : "input") + " stream: " + e.getMessage());
        }
    }

    public boolean forceIsConnected() {
        if (session != null) {
            try {
                session.sendKeepAliveMsg();
                setStatus("CONNECTED");
                return true;
            } catch (Exception e) {
                setStatus("DISCONNECTED");
                return false;
            }
        }
        setStatus("DISCONNECTED");
        return false;
    }

    public String sendExecCommandWithSudoPermissions(String command) {
        return sendExecCommand(String.format("echo \"%1$s\" | sudo -S %2$s", password, command));
    }

    public void sendExecCommandWithSudoPermissions(String command, int step, Consumer<MessageLinePair> s) {
        sendExecCommand(String.format("echo \"%1$s\" | sudo -S %2$s", password, command), step, s);
    }

    public String sendExecCommand(String command) {
        if (session == null || !forceIsConnected()) {
            throw new IllegalStateException("SSH session is not connected.");
        }

        StringBuilder response = new StringBuilder();
        int exitStatus;  // Default value for error

        try {
            ChannelExec execChannel = (ChannelExec) session.openChannel("exec");
            execChannel.setCommand(command);

            InputStream inputStream = execChannel.getInputStream();
            InputStream errStream = execChannel.getErrStream();

            execChannel.connect();

            // Read the input stream (standard output)
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line).append("\n");
                }
            }

            // Read the error stream (standard error)
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(errStream))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line).append("\n");
                }
            }

            exitStatus = execChannel.getExitStatus();  // Get the exit status of the command
            execChannel.disconnect();
        } catch (JSchException | IOException e) {
            logger.severe("Failed to execute command: " + command + "\n" + e);
            return "Error: " + e.getMessage();
        }

        // Append exit status to the response string
        response.append("\nExit Status: ").append(exitStatus);

        return response.toString();
    }

    public void sendExecCommand(String command, int step, Consumer<MessageLinePair> consumer) {
        if (session == null || !forceIsConnected()) {
            throw new IllegalStateException("SSH session is not connected.");
        }

        int exitStatus;  // Default value for error
        MessageLinePair messageLinePair = new MessageLinePair("Reading stream...", 0);
        try {
            ChannelExec execChannel = (ChannelExec) session.openChannel("exec");
            execChannel.setCommand(command);

            InputStream inputStream = execChannel.getInputStream();
            InputStream errStream = execChannel.getErrStream();

            execChannel.connect();
            // Read the input stream (standard output)
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
                String line;
                int i = 0;
                while ((line = reader.readLine()) != null) {

                    i++;
                    messageLinePair.setLine(i);
                    messageLinePair.setMessage(line);
                    if (i == 1) consumer.accept(messageLinePair);
                    else if (i % step == 0) consumer.accept(messageLinePair);
                }
            }

            // Read the error stream (standard error)
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(errStream))) {
                String line;
                int i = 0;
                while ((line = reader.readLine()) != null) {
                    i++;
                    messageLinePair.setLine(i);
                    messageLinePair.setMessage(line);
                    if (i == 1) consumer.accept(messageLinePair);
                    else if (i % step == 0) consumer.accept(messageLinePair);
                }
            }

            execChannel.disconnect();
        } catch (JSchException | IOException e) {
            logger.severe("Failed to execute command: " + command + "\n" + e);
            messageLinePair.setMessage("Error: " + e.getMessage());
            consumer.accept(messageLinePair);
        }

    }

    public List<FileInfo> listFilesAndDirectories(String remoteDir) {
        List<FileInfo> filesList = new ArrayList<>();

        if (session == null || !forceIsConnected()) {
            throw new IllegalStateException("SSH session is not connected.");
        }

        Channel channel = null;
        try {
            channel = session.openChannel("exec");
            ChannelExec execChannel = (ChannelExec) channel;

            // Use ls -lh to list files with human-readable sizes
            execChannel.setCommand(String.format("echo \"%1$s\" | sudo -S %2$s", password, "ls -lh " + remoteDir));

            InputStream inputStream = execChannel.getInputStream();
            execChannel.connect();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    // Parse the line to extract file details
                    FileInfo fileInfo = parseLsOutput(line, remoteDir);
                    if (fileInfo != null && !fileInfo.isSymbolicLink()) { // Filter out symbolic links
                        filesList.add(fileInfo);
                    }
                }
            }
            execChannel.disconnect();
        } catch (JSchException | IOException e) {
            logger.severe("Failed to list files in directory: " + remoteDir + "\n" + e);
        } finally {
            if (channel != null) {
                channel.disconnect();
            }
        }

        // Sort filesList: directories first, then files
        filesList.sort(Comparator.comparing(FileInfo::isDirectory).reversed());

        return filesList;
    }

    private FileInfo parseLsOutput(String line, String directory) {
        // Example of `ls -lh` output:
        // "-rw-r--r-- 1 user group 1.2 K Jan 01 12:00 filename.txt"
        String[] parts = line.split("\\s+");
        if (parts.length < 9) {
            return null; // Invalid line format
        }

        String permissions = parts[0];
        String size = parts[4];
        String date = parts[5] + " " + parts[6] + " " + parts[7];
        String name = parts[8];

        return new FileInfo(directory, permissions, size, date, name);
    }


    public List<JournalEntry> getLogs(int startIndex, int endIndex) throws IOException {
        // Validate startIndex and endIndex


        // Validate log file
        File logFile = new File("XDASH_LOGS" + File.separator + getHostname() + ".txt");
        if (!logFile.exists() || logFile.isDirectory()) {
            throw new FileNotFoundException("Log file not found or is a directory.");
        }

        if (logFile.length() == 0) {
            throw new IOException("Log file is empty.");
        }

        List<JournalEntry> journalEntries = new ArrayList<>();

        try (RandomAccessFile file = new RandomAccessFile(logFile, "r")) {
            long fileLength = file.length();
            int linesRead = 0;
            int targetLines = endIndex - startIndex + 1;  // Calculate number of lines we need to read
            long pointer = fileLength - 1;

            // Start reading from the end of the file
            file.seek(pointer);
            StringBuilder currentLine = new StringBuilder();

            while (pointer >= 0 && linesRead < targetLines) {
                file.seek(pointer);  // Move the pointer
                char c = (char) file.readByte();  // Read a byte (character)
                pointer--;

                if (c == '\n' || pointer == -1) {  // End of a line or start of file
                    if (pointer == -1 && c != '\n') {
                        currentLine.append(c);  // Add last char if not a newline
                    }

                    // If we have a full line, process it
                    if (!currentLine.isEmpty()) {
                        String line = currentLine.reverse().toString().trim();
                        currentLine.setLength(0);  // Reset StringBuilder for next line

                        if (!line.isEmpty()) {
                            try {
                                JournalEntry entry = gson.fromJson(line, JournalEntry.class);
                                entry.setServer(server);
                                journalEntries.add(entry);
                            } catch (Exception ignored) {
                            }
                        }

                        linesRead++;
                    }
                } else {
                    currentLine.append(c);  // Keep adding characters until newline
                }
            }
        }

        return journalEntries;
    }

    public boolean isJournalCtlReaderRunning() {
        return journalThread != null && journalThread.isAlive() && !journalThread.isInterrupted();
    }
    public boolean isRioLogReaderRunning() {
        return rioThread != null && rioThread.isAlive() && !rioThread.isInterrupted();
    }

    public boolean startRoboRIOLogger() {
        if (session == null || !forceIsConnected()) {
            throw new IllegalStateException("RIO SSH session is not connected.");
        }
        if (isRioLogReaderRunning()) {
            logger.severe("RIO logger reader already running...");
            return true;
        }

        // Create the directory if it doesn't exist
        File logDir = new File("XDASH_RIO_LOGS");
        if (!logDir.exists() && !logDir.mkdir()) {
            logger.severe("Failed to create XDASH_RIO_LOGS directory");
            return false;
        }

        // Log file path in XDASH_LOGS directory
        String logFileName = "XDASH_RIO_LOGS" + File.separator + getHostname() + "-" +
                new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date()) + "-RIO.txt";
        File logFile = new File(logFileName);

        try {
            // Open a new exec channel for running the command
            ChannelExec channel = (ChannelExec) session.openChannel("exec");
            channel.setCommand("tail -f /var/local/natinst/log/FRC_UserProgram.log");

            // Set up the input stream and output file
            InputStream inputStream = channel.getInputStream();
            channel.connect(); // Connect the channel

            // Start a new thread to keep the channel open and stream logs
            this.rioThread = new Thread(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                     BufferedWriter writer = new BufferedWriter(new FileWriter(logFile, false))) {  // 'false' for overwrite mode
                    writer.newLine();
                    writer.newLine();
                    writer.write("----------------------------------------------------------------");
                    writer.newLine();
                    writer.newLine();
                    writer.write("LOG START - " + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
                    writer.newLine();
                    writer.newLine();
                    writer.write("----------------------------------------------------------------");
                    writer.newLine();
                    writer.newLine();

                    String line;
                    while ((line = reader.readLine()) != null) {
                        String trimmed = line.trim();
                        writer.write(trimmed);
                        writer.newLine();
                        writer.flush();

                        // Broadcast log line over WebSocket (if needed)
                        try {
                            WebSocketHandler.getBroadcastService().queueBroadcast(trimmed, "RIO-LOGS");
                        } catch (Exception ignored) {
                        }
                    }

                } catch (IOException e) {
                    logger.severe("Error writing rio logs to file: " + e.getMessage());
                } finally {
                    // Ensure the channel is closed properly
                    if (channel.isConnected()) {
                        channel.disconnect();
                    }
                }
            });
            rioThread.start(); // Start the log streaming thread

        } catch (JSchException | IOException e) {
            logger.severe("Failed to start RIO logs reader on host: " + getHostname() + "\n" + e.getMessage());
            return false;
        }

        return true;
    }

    public boolean startJournalCtlReader() {
        if (session == null || !forceIsConnected()) {
            throw new IllegalStateException("SSH session is not connected.");
        }
        if (isJournalCtlReaderRunning()) {
            logger.severe("Journal CTL reader already running...");
            return true;
        }
        // Create the directory if it doesn't exist
        File logDir = new File("XDASH_LOGS");
        if (!logDir.exists()) {
            if (!logDir.mkdir()) {
                logger.severe("Failed to create XDASH_LOGS directory");
                return false;
            }
        }

        // Log file path in XDASH_LOGS directory
        String logFileName = "XDASH_LOGS" + File.separator + getHostname() + ".txt";
        File logFile = new File(logFileName);

        try {
            // Open a new exec channel for running the command
            ChannelExec channel = (ChannelExec) session.openChannel("exec");
            channel.setCommand("journalctl -o json -p 0..5 --follow");

            // Set up the input stream and output file
            InputStream inputStream = channel.getInputStream();
            channel.connect(); // Connect the channel

            // Start a new thread to keep the channel open and stream logs
            this.journalThread = new Thread(() -> {
                // Overwrite the file if it exists (non-append mode)
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                     BufferedWriter writer = new BufferedWriter(new FileWriter(logFile, false))) {  // 'false' for overwrite mode

                    String line;
                    while ((line = reader.readLine()) != null) {
                        String trimmed = line.trim();
                        writer.write(trimmed);
                        writer.newLine();
                        writer.flush();
                        try {
                            JournalEntry entry = gson.fromJson(trimmed, JournalEntry.class);
                            entry.setServer(server);
                            if (entry.getPRIORITY() < 5 && !entry.get_COMM().equals("update-notifier")) {
                                WebSocketHandler.getBroadcastService().queueBroadcast(entry, "DEVICE-ERROR-LOG");
                            }
                        } catch (Exception ignored) {
                        }
                    }

                } catch (IOException e) {
                    logger.severe("Error writing logs to file: " + e.getMessage());
                } finally {
                    // Ensure the channel is closed properly
                    if (channel != null && channel.isConnected()) {
                        channel.disconnect();
                    }
                }
            });
            journalThread.start(); // Start the log streaming thread

        } catch (JSchException | IOException e) {
            logger.severe("Failed to start journalctl reader on host: " + getHostname() + "\n" + e.getMessage());
            return false;
        }

        return true;
    }


    public static class FileInfo {
        private final String directory;
        private final String permissions;
        private final String size;
        private final String date;
        private final String name;

        public FileInfo(String directory, String permissions, String size, String date, String name) {
            this.directory = directory;
            this.permissions = permissions;
            this.size = size;
            this.date = date;
            this.name = name;
        }

        public String getDirectory() {
            return directory;
        }

        public String getPermissions() {
            return permissions;
        }

        public String getSize() {
            return size;
        }

        public String getDate() {
            return date;
        }

        public String getName() {
            return name;
        }

        public boolean isDirectory() {
            return permissions.startsWith("d");
        }

        public boolean isFile() {
            return permissions.startsWith("-");
        }

        public boolean isSymbolicLink() {
            return permissions.startsWith("l");
        }

        @Override
        public String toString() {
            return String.format("%s/%s: %s %s %s %s", directory, name, permissions, size, date, name);
        }
    }

    public boolean transferAndExtract(String tarFilePath, String remoteTargetDir, boolean useLocalSCP, Consumer<TransferProgress> progressConsumer) {
        TransferProgress progress = new TransferProgress("Uploading file now...", 0, 0, 0);
        progressConsumer.accept(progress);
        boolean uploaded = this.uploadFile(tarFilePath, remoteTargetDir + "/" + new File(tarFilePath).getName(), progressConsumer, useLocalSCP);

        if (!uploaded) {
            return false;
        }
        String remoteTarPath = remoteTargetDir + "/" + new File(tarFilePath).getName();
        progress.setMessage("Extracting files onto target machine...");
        progressConsumer.accept(progress);
        String untarCommand = String.format("tar -xzvf %s -C %s", remoteTarPath, remoteTargetDir);
        this.sendExecCommandWithSudoPermissions(untarCommand, 4, (s) -> {
            progress.setMessage(s.getMessage() + " | " + s.getLine() + " files processed.");
            progressConsumer.accept(progress);
        });

        String rmTarCommand = String.format("rm %1$s", remoteTarPath);
        this.sendExecCommandWithSudoPermissions(rmTarCommand);

        progress.setMessage("Successfully extracted all files onto machine.");
        progressConsumer.accept(progress);

        return true;
    }

    public boolean uploadFile(String localFilePath, String remoteFilePath, Consumer<TransferProgress> progressConsumer, boolean useLocalSCP) {
        if (session == null || !forceIsConnected()) {
            logger.severe("SSH session is not connected.");
            throw new IllegalStateException("SSH session is not connected.");
        }
        if (useLocalSCP) {
            return uploadFileUsingLocalSFTP(localFilePath, remoteFilePath, username, password, address, progressConsumer);
        }
        Channel channel = null;
        try {
            channel = session.openChannel("exec");
            ChannelExec execChannel = (ChannelExec) channel;

            // Execute SCP command to upload file
            execChannel.setCommand("scp -t " + remoteFilePath);
            OutputStream out = execChannel.getOutputStream();
            InputStream in = execChannel.getInputStream();

            execChannel.connect();
            logger.info("Connected to remote server for file upload.");
            if (progressConsumer != null)
                progressConsumer.accept(new TransferProgress("Connected to remote server for file upload.", 0, 0, 0));

            if (checkAck(in, progressConsumer) != 0) {
                logger.severe("Failed during SCP initialization acknowledgment.");
                return false;
            }

            File localFile = new File(localFilePath);
            long fileSize = localFile.length();
            String command = "C0644 " + fileSize + " " + localFile.getName() + "\n";
            out.write(command.getBytes());
            out.flush();
            logger.info("Sent file information for " + localFile.getName());
            if (progressConsumer != null)
                progressConsumer.accept(new TransferProgress("Sent file information for " + localFile.getName(), 0, 0, fileSize));

            if (checkAck(in, progressConsumer) != 0) {
                logger.severe("Failed during file information acknowledgment.");
                return false;
            }

            // Read file into memory and send in chunks
            try (FileInputStream fis = new FileInputStream(localFile)) {
                byte[] buffer = new byte[8192];
                int length;
                long totalRead = 0;
                while ((length = fis.read(buffer)) > 0) {
                    out.write(buffer, 0, length);
                    totalRead += length;
                    if (progressConsumer != null) {
                        double percentage = ((double) totalRead / fileSize) * 100;
                        progressConsumer.accept(new TransferProgress("Writing data to server...", percentage, totalRead, fileSize));
                    }
                }
            }

            // Send '\0' to indicate end of file transfer
            out.write(0);
            out.flush();

            if (checkAck(in, progressConsumer) != 0) {
                logger.severe("Failed during end-of-file acknowledgment.");
                return false;
            }

            logger.info("File upload completed successfully.");
            if (progressConsumer != null)
                progressConsumer.accept(new TransferProgress("File upload completed successfully.", 100, fileSize, fileSize));
            return true;
        } catch (JSchException | IOException e) {
            e.printStackTrace();
            if (progressConsumer != null)
                progressConsumer.accept(new TransferProgress("Error during file upload: " + e.getMessage(), 0, 0, 0));
            return false;
        } finally {
            if (channel != null) {
                channel.disconnect();
            }
        }
    }

    public boolean uploadFileUsingLocalSFTP(String localFilePath, String remoteFilePath, String username, String password, String host, Consumer<TransferProgress> progressConsumer) {

        ChannelSftp channel = null;

        try {

            // Open SFTP channel
            channel = (ChannelSftp) session.openChannel("sftp");
            channel.connect();

            // Upload the file using the SFTP put method
            File localFile = new File(localFilePath);
            long fileSize = localFile.length();

            // You can track the progress by using the following method to handle chunks
            try (FileInputStream fis = new FileInputStream(localFile)) {
                channel.put(fis, remoteFilePath, new ProgressMonitor(progressConsumer, fileSize));
            }

            // Success
            logger.info("File upload completed successfully.");
            if (progressConsumer != null)
                progressConsumer.accept(new TransferProgress("File upload completed successfully.", 100, fileSize, fileSize));

            return true;

        } catch (JSchException | SftpException | IOException e) {
            logger.severe("Error during SFTP upload: " + e.getMessage());
            if (progressConsumer != null)
                progressConsumer.accept(new TransferProgress("Error during SFTP upload: " + e.getMessage(), 0, 0, 0));
            return false;
        } finally {
            if (channel != null) {
                channel.exit();
            }
        }
    }

    public boolean uploadContentUsingSFTP(String content, String remoteFilePath, String username, String password, String host, Consumer<TransferProgress> progressConsumer) {
        ChannelSftp channel = null;

        try {
            // Open SFTP channel
            channel = (ChannelSftp) session.openChannel("sftp");
            channel.connect();

            // Convert the String content to an InputStream
            byte[] contentBytes = content.getBytes(StandardCharsets.UTF_8);
            long contentSize = contentBytes.length;

            try (InputStream inputStream = new ByteArrayInputStream(contentBytes)) {
                // Upload the InputStream as the remote file
                channel.put(inputStream, remoteFilePath, new ProgressMonitor(progressConsumer, contentSize));
            }

            // Success
            logger.info("Content upload completed successfully.");
            if (progressConsumer != null) {
                progressConsumer.accept(new TransferProgress("Content upload completed successfully.", 100, contentSize, contentSize));
            }

            return true;

        } catch (JSchException | SftpException | IOException e) {
            logger.severe("Error during SFTP upload: " + e.getMessage());
            if (progressConsumer != null) {
                progressConsumer.accept(new TransferProgress("Error during SFTP upload: " + e.getMessage(), 0, 0, 0));
            }
            return false;

        } finally {
            if (channel != null) {
                channel.exit();
            }
        }
    }

    public void uploadDockerImage(
            File image,
            String containerName,
            DockerFlashType type,
            File composeFile,
            Consumer<DockerImportReturn> updates)
    {

        String imageName = image.getName().toLowerCase().replace(".tar", ""); // Assuming the image name is the file name
        containerName = containerName.toLowerCase();
        String remoteFilePath = "/tmp/" + image.getName(); // Path to upload the Docker image on the remote server
        if (Thread.currentThread().isInterrupted()) return;
        try {
            // Check if Docker is installed
            updates.accept(new DockerImportReturn("Checking if Docker is installed...", server, true, false));
            if (!isDockerInstalled(session, updates)) {
                updates.accept(new DockerImportReturn("Docker is not installed. Please install docker.io manually and try again.", server, true, false));
                return;
            } else {
                updates.accept(new DockerImportReturn("Docker is already installed.", server, true, false));
            }
            if (Thread.currentThread().isInterrupted()) return;
            // Step 1: Upload the Docker image file using SFTP
            updates.accept(new DockerImportReturn("Uploading Docker image file...", server, true, false));
            AtomicReference<Double> lastPercentage = new AtomicReference<>(0.0);
            boolean uploadSuccess = uploadFileUsingLocalSFTP(
                    image.getAbsolutePath(),
                    remoteFilePath,
                    username,
                    password,
                    address,
                    progress -> {
                        double currentPercentage = progress.getPercentage();
                        double lastLoggedPercentage = lastPercentage.get();

                        if (currentPercentage - lastLoggedPercentage >= 0.8) {
                            updates.accept(new DockerImportReturn(
                                    String.format(
                                            "Uploading image file: %.2f%% complete (%d/%d bytes)",
                                            currentPercentage,
                                            progress.getCurrentBytes(),
                                            progress.getTotalBytes()
                                    ),
                                    server,
                                    true,
                                    false
                            ));
                            lastPercentage.set(currentPercentage); // Update the last logged percentage
                        }
                    }
            );
            if (Thread.currentThread().isInterrupted()) return;

            if (!uploadSuccess) {
                updates.accept(new DockerImportReturn("Failed to upload Docker image file.", server, true, false));
                return;
            }
            updates.accept(new DockerImportReturn("File uploaded successfully.", server, true, false));

            // Step 2: Remove existing containers and images
            if (composeFile == null) {
                if (type.equals(DockerFlashType.LIGHT)) {
                    executeCommandDocker(session, "sudo -S docker rm -f " + containerName + " 2>&1", updates);
                    executeCommandDocker(session, "sudo -S docker rmi -f " + imageName + " 2>&1", updates);
                } else {
                    executeCommandDocker(session, "sudo -S docker rm -f $(sudo -S docker ps -q -a) 2>&1", updates);
                    executeCommandDocker(session, "sudo -S docker rmi -f $(sudo -S docker images -a -q) 2>&1", updates);
                }
            } else {
                if (type.equals(DockerFlashType.LIGHT)) {
                    executeCommandDocker(session, "sudo -S docker rmi -f " + imageName + " 2>&1", updates);
                } else {
                    executeCommandDocker(session, "sudo -S docker rm -f $(sudo -S docker ps -q -a) 2>&1", updates);
                    executeCommandDocker(session, "sudo -S docker rmi -f $(sudo -S docker images -a -q) 2>&1", updates);
                }
            }
            if (Thread.currentThread().isInterrupted()) return;
            // Step 3: Load the Docker image
            updates.accept(new DockerImportReturn("Loading Docker image...", server, true, false));
            String loadCommand = "sudo -S docker load --input " + remoteFilePath + " 2>&1";
            boolean loadSuccess = executeCommandDocker(session, loadCommand, updates);

            if (!loadSuccess) {
                updates.accept(new DockerImportReturn("Failed to load Docker image.", server, false, false));
                return;
            }
            if (Thread.currentThread().isInterrupted()) return;
            updates.accept(new DockerImportReturn("Docker image loaded successfully.", server, true, false));
            if (composeFile == null) {
                // Step 4: Run a new container
                String runCommand = "sudo -S docker run -d --name " + containerName + " " + imageName;
                boolean runSuccess = executeCommandDocker(session, runCommand, updates);

                if (runSuccess) {
                    updates.accept(new DockerImportReturn("Container started successfully.", server, true, false));
                } else {
                    updates.accept(new DockerImportReturn("Failed to start container.", server, true, true));
                }
            } else {
                // Step 4: Run a new compose
                try (InputStream inputStream = SSHHostAddress.class.getResourceAsStream("/docker/xdash-docker-watchdog.sh")) {
                    if (inputStream == null) {
                        updates.accept(new DockerImportReturn("Script file not found in resources.", server, false, false));
                        return;
                    }
                    if (Thread.currentThread().isInterrupted()) return;
                    String dockerComposeContent = Files.readString(Path.of(composeFile.getAbsolutePath()), StandardCharsets.UTF_8);
                    String script = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
                    script = script.replace("${DOCKER_COMPOSE}", dockerComposeContent).replace("${TIMEOUT}", "2");

                    AtomicReference<Double> lastScriptPercentage = new AtomicReference<>(0.0);
                    String remoteScriptFilePath = "/tmp/xdash-watchdog.sh";
                    boolean scriptUploadSuccess = uploadContentUsingSFTP(script, remoteScriptFilePath, username, password, address, (progress) -> {
                        double currentPercentage = progress.getPercentage();
                        double lastLoggedPercentage = lastScriptPercentage.get();

                        if (currentPercentage - lastLoggedPercentage >= 0.8) {
                            updates.accept(new DockerImportReturn(
                                    String.format(
                                            "Uploading script file: %.2f%% complete (%d/%d bytes)",
                                            currentPercentage,
                                            progress.getCurrentBytes(),
                                            progress.getTotalBytes()
                                    ),
                                    server,
                                    true,
                                    false
                            ));
                            lastScriptPercentage.set(currentPercentage); // Update the last logged percentage
                        }
                    });
                    if (!scriptUploadSuccess) {
                        updates.accept(new DockerImportReturn("Failed to upload watchdog script file.", server, false, false));
                        return;
                    }
                    updates.accept(new DockerImportReturn("Moving script file to /usr/local/bin", server, true, false));
                    boolean moveScriptSuccess = executeCommandDocker(session, "sudo -S mv " + remoteScriptFilePath + " /usr/local/bin/ 2>&1", updates);
                    if(!moveScriptSuccess) {
                        updates.accept(new DockerImportReturn("Failed to move XDASH watchdog script to /usr/local/bin", server, false, false));
                        return;
                    }
                    try (InputStream serviceInputStream = SSHHostAddress.class.getResourceAsStream("/docker/xdash-watchdog.service")) {
                        if (serviceInputStream == null) {
                            updates.accept(new DockerImportReturn("Service file not found in resources.", server, false, false));
                            return;
                        }
                        String service = new String(serviceInputStream.readAllBytes(), StandardCharsets.UTF_8);
                        service = service.replace("${SCRIPT}", "/bin/bash /usr/local/bin/xdash-watchdog.sh");
                        updates.accept(new DockerImportReturn("Uploading Watchdog Service file...", server, true, false));
                        AtomicReference<Double> lastServicePercentage = new AtomicReference<>(0.0);
                        String remoteServiceFilePath = "/tmp/xdash-watchdog.service";
                        boolean serviceUploadSuccess = uploadContentUsingSFTP(service, remoteServiceFilePath, username, password, address, (progress) -> {
                            double currentPercentage = progress.getPercentage();
                            double lastLoggedPercentage = lastServicePercentage.get();

                            if (currentPercentage - lastLoggedPercentage >= 0.8) {
                                updates.accept(new DockerImportReturn(
                                        String.format(
                                                "Uploading service file: %.2f%% complete (%d/%d bytes)",
                                                currentPercentage,
                                                progress.getCurrentBytes(),
                                                progress.getTotalBytes()
                                        ),
                                        server,
                                        true,
                                        false
                                ));
                                lastServicePercentage.set(currentPercentage); // Update the last logged percentage
                            }
                        });
                        if (!serviceUploadSuccess) {
                            updates.accept(new DockerImportReturn("Failed to upload watchdog service file.", server, false, false));
                            return;
                        }
                        updates.accept(new DockerImportReturn("Moving file to /etc/systemd/system/", server, true, false));
                        boolean moveSuccess = executeCommandDocker(session, "sudo -S mv " + remoteServiceFilePath + " /etc/systemd/system/", updates);
                        if (moveSuccess) {
                            boolean success1 = executeCommandDocker(session, "sudo -S systemctl daemon-reload 2>&1", updates);
                            boolean success2 = executeCommandDocker(session, "sudo -S systemctl enable xdash-watchdog.service 2>&1", updates);
                            boolean success3 = executeCommandDocker(session, "sudo -S systemctl restart xdash-watchdog.service 2>&1", updates);
                            if (success2 && success1 && success3) {
                                updates.accept(new DockerImportReturn("XDASH watchdog script started successfully.", server, true, false));
                            } else {
                                updates.accept(new DockerImportReturn("One of the systemctl commands failed! Printing logs for further details.", server, false, false));
                                boolean success4 = executeCommandDocker(session, "sudo -S systemctl status xdash-watchdog.service 2>&1", updates);
                                if(!success4) {
                                    updates.accept(new DockerImportReturn("Failed to get status on watchdog service. Giving up on host.", server, false, false));
                                }
                            }
                        } else {
                            updates.accept(new DockerImportReturn("Failed to move XDASH watchdog script.", server, false, false));
                        }

                    } catch (Exception e) {
                        updates.accept(new DockerImportReturn("Exception while attempting XDASH watchdog service flow: " + e.getMessage(), server, false, false));
                    }

                } catch (Exception e) {
                    updates.accept(new DockerImportReturn("Exception while attempting XDASH watchdog script flow: " + e.getMessage(), server, false, false));
                }
            }

        } catch (Exception e) {
            updates.accept(new DockerImportReturn("Error: " + e.getMessage(), server, false, false));
        }
    }


    // DockerProgress monitor class to show progress
    public static class ProgressMonitor implements SftpProgressMonitor {

        private final Consumer<TransferProgress> progressConsumer;
        private final long totalSize;
        private long bytesTransferred;

        public ProgressMonitor(Consumer<TransferProgress> progressConsumer, long totalSize) {
            this.progressConsumer = progressConsumer;
            this.totalSize = totalSize;
            this.bytesTransferred = 0;
        }

        @Override
        public void init(int op, String src, String dest, long max) {
            // Initializing progress monitor
        }

        @Override
        public boolean count(long bytes) {
            bytesTransferred += bytes;
            if (progressConsumer != null) {
                double percentage = (double) bytesTransferred / totalSize * 100;
                progressConsumer.accept(new TransferProgress("Uploading...", percentage, bytesTransferred, totalSize));
            }
            return true;
        }

        @Override
        public void end() {
                // Upload complete
        }
    }

    public boolean uploadFile(MultipartFile multipartFile, String remoteFilePath, Consumer<TransferProgress> progressConsumer) {
        if (session == null || !forceIsConnected()) {
            logger.severe("SSH session is not connected.");
            throw new IllegalStateException("SSH session is not connected.");
        }

        Channel channel = null;
        try {
            channel = session.openChannel("exec");
            ChannelExec execChannel = (ChannelExec) channel;

            // Execute SCP command to upload file
            execChannel.setCommand("scp -t " + remoteFilePath);
            OutputStream out = execChannel.getOutputStream();
            InputStream in = execChannel.getInputStream();

            execChannel.connect();
            logger.info("Connected to remote server for file upload.");
            if (progressConsumer != null)
                progressConsumer.accept(new TransferProgress("Connected to remote server for file upload.", 0, 0, 0));

            if (checkAck(in, progressConsumer) != 0) {
                logger.severe("Failed during SCP initialization acknowledgment.");
                return false;
            }

            long fileSize = multipartFile.getSize();
            String command = "C0644 " + fileSize + " " + multipartFile.getOriginalFilename() + "\n";
            out.write(command.getBytes());
            out.flush();
            logger.info("Sent file information for " + multipartFile.getOriginalFilename());
            if (progressConsumer != null)
                progressConsumer.accept(new TransferProgress("Sent file information for " + multipartFile.getOriginalFilename(), 0, 0, fileSize));

            if (checkAck(in, progressConsumer) != 0) {
                logger.severe("Failed during file information acknowledgment.");
                return false;
            }

            // Read file into memory
            byte[] fileBytes = multipartFile.getBytes();
            try (InputStream fis = new ByteArrayInputStream(fileBytes)) {
                byte[] buffer = new byte[1024];
                int length;
                long totalRead = 0;
                while ((length = fis.read(buffer)) > 0) {
                    out.write(buffer, 0, length);
                    totalRead += length;
                    if (progressConsumer != null) {
                        double percentage = ((double) totalRead / fileSize) * 100;
                        progressConsumer.accept(new TransferProgress("Writing data to server...", percentage, totalRead, fileSize));
                    }
                }
            }

            // Send '\0' to indicate end of file transfer
            out.write(0);
            out.flush();

            if (checkAck(in, progressConsumer) != 0) {
                logger.severe("Failed during end-of-file acknowledgment.");
                return false;
            }

            logger.info("File upload completed successfully.");
            if (progressConsumer != null)
                progressConsumer.accept(new TransferProgress("File upload completed successfully.", 100, fileSize, fileSize));
            return true;
        } catch (JSchException | IOException e) {
            e.printStackTrace();
            if (progressConsumer != null)
                progressConsumer.accept(new TransferProgress("Error during file upload: " + e.getMessage(), 0, 0, 0));
            return false;
        } finally {
            if (channel != null) {
                channel.disconnect();
            }
        }
    }


    private boolean isDockerInstalled(Session session, Consumer<DockerImportReturn> updates) throws JSchException, IOException {
        try {
            return executeCommandDocker(session, "docker --version", updates);
        } catch (IOException e) {
            updates.accept(new DockerImportReturn("Docker not found.", server, true, false));
            return false;
        }
    }

    private boolean executeCommandDocker(Session session, String command, Consumer<DockerImportReturn> updates) throws JSchException, IOException {
        updates.accept(new DockerImportReturn("Executing: " + command, server, true, false));

        ChannelExec channel = (ChannelExec) session.openChannel("exec");
        channel.setCommand(command);
        channel.setErrStream(System.err);

        InputStream responseStream = channel.getInputStream();
        OutputStream outputStream = channel.getOutputStream();

        channel.connect();


        if (command.startsWith("sudo")) {
            int length = command.split("sudo").length;
            for (int i = 0; i < length; i++) {
                outputStream.write((password + "\n").getBytes());
                outputStream.flush();
                if (length > 1) {
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException ignored) {
                    }
                }
            }

        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(responseStream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                updates.accept(new DockerImportReturn(line, server, true, false));
            }
        } finally {
            channel.disconnect();
        }

        int exitStatus = channel.getExitStatus();
        if (exitStatus == 0) {
            updates.accept(new DockerImportReturn("Command executed successfully. Exit code: 0", server, true, false));
            return true; // Success
        } else {
            updates.accept(new DockerImportReturn("Command failed with exit code: " + exitStatus, server, false, false));
            return false; // Failure
        }
    }


    public String getSudoPrefix() {
        return String.format("echo \"%1$s\" | sudo -S ", password);
    }

    public boolean streamFile(String remoteFilePath, HttpServletResponse response, String id) {
        if (session == null || !forceIsConnected()) {
            throw new IllegalStateException("SSH session is not connected.");
        }

        Channel channel = null;
        try {
            channel = session.openChannel("exec");
            ChannelExec execChannel = (ChannelExec) channel;

            // Execute SCP command to download file
            execChannel.setCommand(prefixWithSudoPassword("scp -f " + remoteFilePath));
            OutputStream out = execChannel.getOutputStream();
            InputStream in = execChannel.getInputStream();

            execChannel.connect();

            // Send '\0' to start file transfer
            out.write(0);
            out.flush();

            if (checkAck(in, null) != 'C') {
                return false;
            }

            // Read file details
            in.read(new byte[5]);
            long fileSize = 0;
            while (true) {
                int c = in.read();
                if (c == ' ') break;
                fileSize = fileSize * 10 + (c - '0');
            }

            StringBuilder fileNameBuilder = new StringBuilder();
            for (int i = 0; i < 256; i++) {
                int c = in.read();
                if (c == 0x0A) break;
                fileNameBuilder.append((char) c);
            }
            String fileName = fileNameBuilder.toString();

            // Send '\0' to confirm
            out.write(0);
            out.flush();

            // Set response headers
            response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=\"" + fileName + "\"");
            response.setHeader(HttpHeaders.CONTENT_LENGTH, String.valueOf(fileSize));

            try (OutputStream responseOutputStream = response.getOutputStream()) {
                byte[] buffer = new byte[1024];
                int length;
                long totalRead = 0;
                TransferProgress progress = new TransferProgress("Reading from server...", 0, 0, 0);
                while (fileSize > 0 && (length = in.read(buffer, 0, (int) Math.min(buffer.length, fileSize))) != -1) {
                    responseOutputStream.write(buffer, 0, length);
                    totalRead += length;
                    fileSize -= length;

                    // Broadcast progress
                    double percentage = ((double) totalRead / (fileSize + totalRead)) * 100;
                    progress.setMessage("Writing to client from server...").setPercentage(percentage).setCurrentBytes(totalRead).setTotalBytes(fileSize + totalRead);
                    WebSocketHandler.getBroadcastService().queueBroadcast(progress, "TRANSFER-DOWNLOAD-PROGRESS-" + id);
                }
            }

            if (checkAck(in, null) != 0) {
                return false;
            }

            // Send '\0' to end file transfer
            out.write(0);
            out.flush();
            WebSocketHandler.getBroadcastService().queueBroadcast(new TransferProgress("File download completed successfully.", 100, fileSize, fileSize).setFinished(true), "TRANSFER-DOWNLOAD-PROGRESS-" + id);

            return true;
        } catch (JSchException | IOException e) {
            logger.severe("File streaming failed: " + e.getMessage());
            WebSocketHandler.getBroadcastService().queueBroadcast(new TransferProgress("Error during file streaming: " + e.getMessage(), 0, 0, 0), "TRANSFER-DOWNLOAD-PROGRESS-" + id);
            return false;
        } finally {
            if (channel != null) {
                channel.disconnect();
            }
        }
    }

    public boolean downloadFile(String remoteFilePath, String localFilePath, Consumer<TransferProgress> progressConsumer) {
        if (session == null || !forceIsConnected()) {
            throw new IllegalStateException("SSH session is not connected.");
        }

        Channel channel = null;
        try {
            channel = session.openChannel("exec");
            ChannelExec execChannel = (ChannelExec) channel;

            // Execute SCP command to download file
            execChannel.setCommand(prefixWithSudoPassword("scp -f " + remoteFilePath));
            OutputStream out = execChannel.getOutputStream();
            InputStream in = execChannel.getInputStream();

            execChannel.connect();
            if (progressConsumer != null)
                progressConsumer.accept(new TransferProgress("Connected to remote server for file download.", 0, 0, 0));

            // Send '\0' to start file transfer
            out.write(0);
            out.flush();

            if (checkAck(in, progressConsumer) != 'C') {
                return false;
            }

            // Read file details
            in.read(new byte[5]);
            long fileSize = 0;
            while (true) {
                int c = in.read();
                if (c == ' ') break;
                fileSize = fileSize * 10 + (c - '0');
            }

            StringBuilder fileNameBuilder = new StringBuilder();
            for (int i = 0; i < 256; i++) {
                int c = in.read();
                if (c == 0x0A) break;
                fileNameBuilder.append((char) c);
            }
            String fileName = fileNameBuilder.toString();

            // Send '\0' to confirm
            out.write(0);
            out.flush();

            if (progressConsumer != null)
                progressConsumer.accept(new TransferProgress("Downloading file: " + fileName, 0, 0, fileSize));

            try (FileOutputStream fos = new FileOutputStream(localFilePath)) {
                byte[] buffer = new byte[1024];
                int length;
                long totalRead = 0;
                while (fileSize > 0 && (length = in.read(buffer, 0, (int) Math.min(buffer.length, fileSize))) != -1) {
                    fos.write(buffer, 0, length);
                    fileSize -= length;
                    totalRead += length;
                    if (progressConsumer != null) {
                        double percentage = ((double) totalRead / fileSize) * 100;
                        progressConsumer.accept(new TransferProgress("Downloading file: " + percentage + "%...", percentage, totalRead, fileSize));
                    }
                }
            }

            if (checkAck(in, progressConsumer) != 0) {
                return false;
            }

            // Send '\0' to end file transfer
            out.write(0);
            out.flush();

            if (progressConsumer != null)
                progressConsumer.accept(new TransferProgress("File download completed successfully.", 100, fileSize, fileSize));
            return true;
        } catch (JSchException | IOException e) {
            logger.severe("File download failed: " + e.getMessage());
            if (progressConsumer != null)
                progressConsumer.accept(new TransferProgress("Error during file download: " + e.getMessage(), 0, 0, 0));
            return false;
        } finally {
            if (channel != null) {
                channel.disconnect();
            }
        }
    }

    private String prefixWithSudoPassword(String command) {
        return String.format("echo \"%1$s\" | sudo -S %2$s", password, command);
    }

    private int checkAck(InputStream in, Consumer<TransferProgress> progressConsumer) throws IOException {
        int b = in.read();
        if (b == 0) return b;
        if (b == -1) return b;

        if (b == 1 || b == 2) {
            StringBuilder sb = new StringBuilder();
            int c;
            do {
                c = in.read();
                sb.append((char) c);
            } while (c != '\n');
            String errorMsg = sb.toString();
            logger.warning("Error message from server: " + errorMsg); // Log the full error message
            if (progressConsumer != null) progressConsumer.accept(new TransferProgress("Error: " + errorMsg, 0, 0, 0));
        }

        return b;
    }


}
