package org.kobe.xbot.xdashbackend.Entities;

import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import org.kobe.xbot.xdashbackend.SSHConnectionManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class SSHHostAddress {
    private static final Logger logger = LoggerFactory.getLogger(SSHHostAddress.class);

    private final String hostname;
    private final String address;
    private String status = "DISCONNECTED";
    private transient Session session = null;

    public SSHHostAddress(String hostname, String address) {
        this.hostname = hostname;
        this.address = address;
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
    public String sendCommand(String command) throws JSchException, java.io.IOException {
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
            logger.error("Failed to execute command: " + command, e);
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
}
