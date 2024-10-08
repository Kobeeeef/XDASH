package org.kobe.xbot.xdashbackend.entities;

import com.google.gson.Gson;
import com.jcraft.jsch.*;
import jakarta.servlet.http.HttpServletResponse;
import org.kobe.xbot.xdashbackend.SSHConnectionManager;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;
import org.kobe.xbot.xdashbackend.websocket.WebSocketHandler;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.function.Consumer;
import java.util.logging.Level;

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
    public SSHHostAddress(String hostname, String username, String password, String address, String server) {
        this.username = username;
        this.password = password;
        this.hostname = hostname;
        this.address = address;
        this.server = server;
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

    public String sendExecCommand(String command) {
        if (session == null || !forceIsConnected()) {
            throw new IllegalStateException("SSH session is not connected.");
        }

        StringBuilder response = new StringBuilder();
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

            execChannel.disconnect();
        } catch (JSchException | IOException e) {
            logger.severe("Failed to execute command: " + command + "\n" + e);
            return "Error: " + e.getMessage();
        }

        return response.toString();
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
        // "-rw-r--r-- 1 user group 1.2K Jan 01 12:00 filename.txt"
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
                    if (currentLine.length() > 0) {
                        String line = currentLine.reverse().toString().trim();
                        currentLine.setLength(0);  // Reset StringBuilder for next line

                        if (!line.isEmpty()) {
                            try {
                                JournalEntry entry = gson.fromJson(line, JournalEntry.class);
                                entry.setServer(server);
                                journalEntries.add(entry);
                            } catch (Exception ignored) {}
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


    public boolean startJournalCtlReader() {
        if (session == null || !forceIsConnected()) {
            throw new IllegalStateException("SSH session is not connected.");
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
            new Thread(() -> {
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
                            if(entry.getPRIORITY() < 5 && !entry.get_COMM().equals("update-notifier") ) {
                                WebSocketHandler.broadcast(entry, "DEVICE-ERROR-LOG");
                            }
                        } catch (Exception ignored) {}
                    }

                } catch (IOException e) {
                    logger.severe("Error writing logs to file: " + e.getMessage());
                } finally {
                    // Ensure the channel is closed properly
                    if (channel != null && channel.isConnected()) {
                        channel.disconnect();
                    }
                }
            }).start(); // Start the log streaming thread

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
    public boolean uploadFile(String localFilePath, String remoteFilePath, Consumer<TransferProgress> progressConsumer) {
        if (session == null || !forceIsConnected()) {
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
            if (progressConsumer != null) progressConsumer.accept(new TransferProgress("Connected to remote server for file upload.", 0, 0, 0));

            if (checkAck(in, progressConsumer) != 0) {
                return false;
            }

            File localFile = new File(localFilePath);
            long fileSize = localFile.length();
            String command = "C0644 " + fileSize + " " + localFile.getName() + "\n";
            out.write(command.getBytes());
            out.flush();
            if (progressConsumer != null) progressConsumer.accept(new TransferProgress("Sent file information for " + localFile.getName(), 0, 0, fileSize));

            if (checkAck(in, progressConsumer) != 0) {
                return false;
            }

            try (FileInputStream fis = new FileInputStream(localFile)) {
                byte[] buffer = new byte[1024];
                int length;
                long totalRead = 0;
                while ((length = fis.read(buffer)) > 0) {
                    out.write(buffer, 0, length);
                    totalRead += length;
                    if (progressConsumer != null) {
                        double percentage = ((double) totalRead / fileSize) * 100;
                        progressConsumer.accept(new TransferProgress("Uploading...", percentage, totalRead, fileSize));
                    }
                }
            }

            // Send '\0' to indicate end of file transfer
            out.write(0);
            out.flush();

            if (checkAck(in, progressConsumer) != 0) {
                return false;
            }

            if (progressConsumer != null) progressConsumer.accept(new TransferProgress("File upload completed successfully.", 100, fileSize, fileSize));
            return true;
        } catch (JSchException | IOException e) {
            logger.severe("File upload failed: " + e.getMessage());
            if (progressConsumer != null) progressConsumer.accept(new TransferProgress("Error during file upload: " + e.getMessage(), 0, 0, 0));
            return false;
        } finally {
            if (channel != null) {
                channel.disconnect();
            }
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
            if (progressConsumer != null) progressConsumer.accept(new TransferProgress("Connected to remote server for file upload.", 0, 0, 0));

            if (checkAck(in, progressConsumer) != 0) {
                logger.severe("Failed during SCP initialization acknowledgment.");
                return false;
            }

            long fileSize = multipartFile.getSize();
            String command = "C0644 " + fileSize + " " + multipartFile.getOriginalFilename() + "\n";
            out.write(command.getBytes());
            out.flush();
            logger.info("Sent file information for " + multipartFile.getOriginalFilename());
            if (progressConsumer != null) progressConsumer.accept(new TransferProgress("Sent file information for " + multipartFile.getOriginalFilename(), 0, 0, fileSize));

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
            if (progressConsumer != null) progressConsumer.accept(new TransferProgress("File upload completed successfully.", 100, fileSize, fileSize));
            return true;
        } catch (JSchException | IOException e) {
            e.printStackTrace();
            if (progressConsumer != null) progressConsumer.accept(new TransferProgress("Error during file upload: " + e.getMessage(), 0, 0, 0));
            return false;
        } finally {
            if (channel != null) {
                channel.disconnect();
            }
        }
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
                    WebSocketHandler.broadcast(progress, "TRANSFER-DOWNLOAD-PROGRESS-" + id);
                }
            }

            if (checkAck(in, null) != 0) {
                return false;
            }

            // Send '\0' to end file transfer
            out.write(0);
            out.flush();
            WebSocketHandler.broadcast(new TransferProgress("File download completed successfully.", 100, fileSize, fileSize).setFinished(true), "TRANSFER-DOWNLOAD-PROGRESS-" + id);

            return true;
        } catch (JSchException | IOException e) {
            logger.severe("File streaming failed: " + e.getMessage());
            WebSocketHandler.broadcast(new TransferProgress("Error during file streaming: " + e.getMessage(), 0, 0, 0), "TRANSFER-DOWNLOAD-PROGRESS-" + id);
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
            if (progressConsumer != null) progressConsumer.accept(new TransferProgress("Connected to remote server for file download.", 0, 0, 0));

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

            if (progressConsumer != null) progressConsumer.accept(new TransferProgress("Downloading file: " + fileName, 0, 0, fileSize));

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

            if (progressConsumer != null) progressConsumer.accept(new TransferProgress("File download completed successfully.", 100, fileSize, fileSize));
            return true;
        } catch (JSchException | IOException e) {
            logger.severe("File download failed: " + e.getMessage());
            if (progressConsumer != null) progressConsumer.accept(new TransferProgress("Error during file download: " + e.getMessage(), 0, 0, 0));
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
            logger.warning(errorMsg);
            if (progressConsumer != null) progressConsumer.accept(new TransferProgress("Error: " + errorMsg, 0, 0, 0));
        }

        return b;
    }

}
