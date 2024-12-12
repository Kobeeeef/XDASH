package org.kobe.xbot.xdashbackend;

import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import org.kobe.xbot.xdashbackend.entities.DevicesReconnectReturn;
import org.kobe.xbot.xdashbackend.entities.SSHHostAddress;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;

public class SSHConnectionManager {
    private static final AtomicBoolean running = new AtomicBoolean(true);
    private static final ExecutorService executor = Executors.newSingleThreadExecutor();
    private static final XDashLogger logger = XDashLogger.getLogger();
    private static final Logger log = LoggerFactory.getLogger(SSHConnectionManager.class);

    public static void startConnectionManager(ConfigLoader config) {
        String user = config.getServersUser();
        String password = config.getServersPassword();
        long retryTimeout = config.getRetryTimeout();
        int connectTimeout = config.getConnectTimeout();
        try {
            String rioHostname = config.getProperty("roboRIO.hostname");
            String rioUsername = config.getProperty("roboRIO.username");
            String rioServer = config.getProperty("roboRIO.server");
            String rioAddress = config.getProperty("roboRIO.address");
            if (rioServer == null || rioHostname == null || rioUsername == null || rioAddress == null) {
                logger.severe("The RIO is not defined inside of the config. Please update it.");
            } else {
                SSHHostAddress SSHHostAddress = new SSHHostAddress(rioHostname, rioUsername, null, rioAddress, rioServer);
                XdashbackendApplication.getResolvedXCASTERServices().put(rioServer, SSHHostAddress);
            }
        } catch (Exception e) {
            logger.fatal("There was an error while adding RIO to SSH manager: " + e.getMessage());
        }
        executor.submit(() -> {
            while (running.get()) {
                try {
                    for (Map.Entry<String, SSHHostAddress> entry : XdashbackendApplication.getResolvedXCASTERServices().entrySet()) {
                        String server = entry.getKey();
                        SSHHostAddress sshHostAddress = entry.getValue();
                        // Check if already connected
                        if (sshHostAddress.getSession() == null || !sshHostAddress.getSession().isConnected()) {
                            logger.info(String.format("Connecting to %s with hostname %s...", sshHostAddress.getAddress(), sshHostAddress.getHostname()));
                            sshHostAddress.setStatus("CONNECTING");
                            Session session = connectToHost(sshHostAddress, connectTimeout, user, password);
                            if (session != null && session.isConnected()) {
                                sshHostAddress.setSession(session);
                                sshHostAddress.setStatus("CONNECTED");
                                logger.info(String.format("Connected to %s with hostname %s", sshHostAddress.getAddress(), sshHostAddress.getHostname()));
                                if (!sshHostAddress.startJournalCtlReader()) {
                                    logger.severe("Failed to start journalctl log reader for host: " + sshHostAddress.getHostname());
                                }
                            }
                        }
                    }
                    Thread.sleep(retryTimeout);
                } catch (Exception e) {
                    logger.severe("Error in SSH Connection Manager:\n" + e);
                }
            }
        });
    }

    public static void reconnectToAll(SSHHostAddress[] sshHostAddresses, Consumer<DevicesReconnectReturn> updates) {
        for (SSHHostAddress sshHostAddress : sshHostAddresses) {
            try {
                updates.accept(new DevicesReconnectReturn(String.format("Checking connection status for host: %s (%s)...",
                        sshHostAddress.getHostname(), sshHostAddress.getAddress()),
                        sshHostAddress.toString(), null, false));

                // Check if the session is disconnected or null
                Session session = XdashbackendApplication.getResolvedXCASTERServices().getOrDefault(sshHostAddress.getServer(), sshHostAddress).getSession();

                if (session == null || !session.isConnected() || !sshHostAddress.forceIsConnected()) {
                    updates.accept(new DevicesReconnectReturn(String.format("Host %s (%s) is disconnected. Attempting to reconnect...",
                            sshHostAddress.getHostname(), sshHostAddress.getAddress()),
                            sshHostAddress.toString(), null, false));

                    // Reconnect to the host
                    session = connectToHost(sshHostAddress, XdashbackendApplication.getConfigLoader().getConnectTimeout(),
                            sshHostAddress.getUsername(), sshHostAddress.getPassword());

                    if (session != null && session.isConnected()) {
                        updates.accept(new DevicesReconnectReturn(String.format("Successfully reconnected to host: %s (%s)",
                                sshHostAddress.getHostname(), sshHostAddress.getAddress()),
                                sshHostAddress.toString(), null, false));

                        // Directly update the existing SSHHostAddress in the map
                        Map<String, SSHHostAddress> resolvedServices = XdashbackendApplication.getResolvedXCASTERServices();
                        SSHHostAddress updatedSSHHostAddress = resolvedServices.get(sshHostAddress.getServer());
                        if (updatedSSHHostAddress != null) {
                            updatedSSHHostAddress.setSession(session);  // Update the session
                            updatedSSHHostAddress.setStatus("CONNECTED");

                            // Optionally restart journalctl reader if necessary
                            if (!updatedSSHHostAddress.startJournalCtlReader()) {
                                updates.accept(new DevicesReconnectReturn(String.format("Failed to start journalctl reader for host: %s (%s)",
                                        sshHostAddress.getHostname(), sshHostAddress.getAddress()),
                                        sshHostAddress.toString(), null, false));
                            }
                        }

                    } else {
                        updates.accept(new DevicesReconnectReturn(String.format("Failed to reconnect to host: %s (%s)",
                                sshHostAddress.getHostname(), sshHostAddress.getAddress()),
                                sshHostAddress.toString(), null, false));
                    }
                } else {
                    updates.accept(new DevicesReconnectReturn(String.format("Host %s (%s) is already connected.",
                            sshHostAddress.getHostname(), sshHostAddress.getAddress()),
                            sshHostAddress.toString(), null, false));
                }
            } catch (Exception e) {
                updates.accept(new DevicesReconnectReturn(String.format("An error occurred while reconnecting to host: %s (%s): %s",
                        sshHostAddress.getHostname(), sshHostAddress.getAddress(), e.getMessage()),
                        sshHostAddress.toString(), null, false));
            }
        }
    }

    private static Session connectToHost(SSHHostAddress sshHostAddress, int timeout, String username, String password) {
        try {
            JSch jsch = new JSch();
            if (sshHostAddress.getUsername() != null) username = sshHostAddress.getUsername();
            if (sshHostAddress.getPassword() != null) password = sshHostAddress.getPassword();
            logger.info(String.format("Connecting to %s with username '%s' and password '%s'", sshHostAddress.getAddress(), username, password));
            Session session = jsch.getSession(username, sshHostAddress.getAddress(), 22);

            session.setPassword(password);

            // Avoid asking for key confirmation
            session.setConfig("StrictHostKeyChecking", "no");
            session.connect(timeout);
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
        XdashbackendApplication.getResolvedXCASTERServices().values().forEach(sshHostAddress -> {
            Session session = sshHostAddress.getSession();
            if (session != null) {
                session.disconnect();
                sshHostAddress.setSession(null);
            }
        });
    }

}
