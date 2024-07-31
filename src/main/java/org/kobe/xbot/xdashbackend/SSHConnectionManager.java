package org.kobe.xbot.xdashbackend;

import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import org.kobe.xbot.xdashbackend.entities.SSHHostAddress;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;

import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

public class SSHConnectionManager {
    private static final AtomicBoolean running = new AtomicBoolean(true);
    private static final ExecutorService executor = Executors.newSingleThreadExecutor();
    private static final XDashLogger logger = XDashLogger.getLogger();
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
                            logger.info(String.format("Connecting to %s with hostname %s...", sshHostAddress.getAddress(), sshHostAddress.getHostname()));
                            sshHostAddress.setStatus("CONNECTING");
                            Session session = connectToHost(sshHostAddress);
                            if (session != null && session.isConnected()) {
                                sshHostAddress.setSession(session);
                                sshHostAddress.setStatus("CONNECTED");
                                logger.info(String.format("Connected to %s with hostname %s", sshHostAddress.getAddress(), sshHostAddress.getHostname()));

                            }
                        }
                    }

                    // Sleep for a bit before checking again
                    Thread.sleep(5000);
                } catch (Exception e) {
                    logger.severe("Error in SSH Connection Manager:\n" + e);
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
            logger.severe(String.format("Failed to connect to server: %s with hostname: %s\nMessage: %s", sshHostAddress.getAddress(), sshHostAddress.getHostname(), e.getMessage()));
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
