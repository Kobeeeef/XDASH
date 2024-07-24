package org.kobe.xbot.xdashbackend;

import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import org.kobe.xbot.xdashbackend.Entities.SSHHostAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

public class SSHConnectionManager {
    private static final AtomicBoolean running = new AtomicBoolean(true);
    private static final ExecutorService executor = Executors.newSingleThreadExecutor();
    private static final Logger logger = LoggerFactory.getLogger(SSHConnectionManager.class);
    private static final String password = "kobe2609";
    public static String getPassword() {
        return password;
    }
    public static void startConnectionManager() {
        executor.submit(() -> {
            while (running.get()) {
                try {
                    for (Map.Entry<String, SSHHostAddress> entry : XdashbackendApplication.getResolvedServices().entrySet()) {
                        String server = entry.getKey();
                        SSHHostAddress sshHostAddress = entry.getValue();
                        // Check if already connected
                        if (sshHostAddress.getSession() == null || !sshHostAddress.getSession().isConnected()) {
                            logger.info("Connecting to {} with hostname {}...", sshHostAddress.getAddress(), sshHostAddress.getHostname());
                            sshHostAddress.setStatus("CONNECTING");
                            Session session = connectToHost(sshHostAddress);
                            if (session != null && session.isConnected()) {
                                sshHostAddress.setSession(session);
                                sshHostAddress.setStatus("CONNECTED");
                                logger.info("Connected to {} with hostname {}", sshHostAddress.getAddress(), sshHostAddress.getHostname());
                            }
                        }
                    }

                    // Sleep for a bit before checking again
                    Thread.sleep(4000);
                } catch (Exception e) {
                    logger.error("Error in SSH Connection Manager", e);
                }
            }
        });
    }
    private static Session connectToHost(SSHHostAddress sshHostAddress) {
        try {
            JSch jsch = new JSch();
            Session session = jsch.getSession("kobe", sshHostAddress.getAddress(), 22);
            session.setPassword("kobe2609");

            // Avoid asking for key confirmation
            session.setConfig("StrictHostKeyChecking", "no");
            session.connect();
            return session;
        } catch (JSchException e) {
            sshHostAddress.setStatus("DISCONNECTED");
            logger.error("Failed to connect to server: {} with hostname: {}\nMessage: {}", sshHostAddress.getAddress(), sshHostAddress.getHostname(), e.getMessage());
            return null;
        }
    }

    public static void stopConnectionManager() {
        running.set(false);
        executor.shutdownNow();
        XdashbackendApplication.getResolvedServices().values().forEach(sshHostAddress -> {
            Session session = sshHostAddress.getSession();
            if (session != null) {
                session.disconnect();
                sshHostAddress.setSession(null);
            }
        });
    }

}
