package org.kobe.xbot.xdashbackend.entities;

import com.jcraft.jsch.*;
import org.kobe.xbot.xdashbackend.SSHConnectionManager;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;

import java.io.*;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.function.Consumer;

public class SSHHostAddress {
    private static final XDashLogger logger = XDashLogger.getLogger();
    private final String server;
    private final String hostname;
    private final String address;
    private String status = "DISCONNECTED";
    private transient Session session = null;
    private transient ChannelShell channel = null;
    private transient OutputStream outputStream;

    public SSHHostAddress(String hostname, String address, String server) {
        this.hostname = hostname;
        this.address = address;
        this.server = server;
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
        return sendCommand(String.format("echo \"%1$s\" | sudo -S %2$s", SSHConnectionManager.getPassword(), command), lineConsumer);
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
        return sendExecCommand(String.format("echo \"%1$s\" | sudo -S %2$s", SSHConnectionManager.getPassword(), command));
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
            execChannel.setCommand("ls -lh " + remoteDir);
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
}
