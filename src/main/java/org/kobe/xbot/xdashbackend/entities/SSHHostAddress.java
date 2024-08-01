package org.kobe.xbot.xdashbackend.entities;

import com.jcraft.jsch.*;
import org.kobe.xbot.xdashbackend.SSHConnectionManager;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;

import java.io.*;
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
        return channel != null && channel.isConnected();
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

}