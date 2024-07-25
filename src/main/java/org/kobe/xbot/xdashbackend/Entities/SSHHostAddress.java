package org.kobe.xbot.xdashbackend.Entities;

import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import org.kobe.xbot.Utilities.Utilities;
import org.kobe.xbot.xdashbackend.SSHConnectionManager;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class SSHHostAddress {
    private static final XDashLogger logger = XDashLogger.getLogger();
    private final String server;
    private final String hostname;
    private final String address;
    private String status = "DISCONNECTED";
    private transient Session session = null;

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

    public void closeSession() {
        if (session != null && forceIsConnected()) {
            session.disconnect();
            setStatus("DISCONNECTED");
        }
    }

    public String sendCommandWithSudoPermissions(String command) {
        return sendCommand(String.format("echo \"%1$s\" | sudo -S %2$s", SSHConnectionManager.getPassword(), command));
    }

    public String sendCommand(String command) {
        if (session == null || !forceIsConnected()) {
            throw new IllegalStateException("SSH session is not connected.");
        }

        ChannelExec channel = null;
        try {
            channel = (ChannelExec) session.openChannel("exec");
            channel.setCommand(command);
            channel.setInputStream(null);
            channel.setErrStream(System.err);

            InputStream input = channel.getInputStream();
            channel.connect();
            setStatus("CONNECTED");
            return readStream(input);
        } catch (JSchException | IOException e) {
            setStatus("DISCONNECTED");
            logger.severe("Failed to execute command: " + command + "\n" + e);
            return null;
        } finally {
            if (channel != null && channel.isConnected()) {
                channel.disconnect();
            }
        }
    }

    private String readStream(InputStream input) throws java.io.IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(input));
        StringBuilder result = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            result.append(line).append("\n");
            setStatus("CONNECTED");
        }
        return result.toString();
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

    public Double getPingLatency() {
        String inet4Address = Utilities.getLocalIPAddress();
        if (inet4Address != null) {
            // Send a single ping (-c 1) to the target address
            String command = String.format("ping -c 1 %s", inet4Address);
            String result = sendCommand(command);
            if (result != null) {
                try {
                    String[] lines = result.split("\n");
                    for (String line : lines) {
                        if (line.contains("time=")) {
                            // Extracting the round-trip time from the ping output
                            String timePart = line.split("time=")[1];
                            String timeString = timePart.split(" ")[0];
                            return Double.parseDouble(timeString); // round-trip time in ms
                        }
                    }
                } catch (Exception e) {
                    logger.severe("Failed to parse ping output.\n" + e);
                }
            }
        }
        return null;
    }


}
