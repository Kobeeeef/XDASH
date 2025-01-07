package org.kobe.xbot.JClient;

import org.kobe.xbot.Utilities.Logger.XTablesLogger;
import org.zeromq.ZContext;
import org.zeromq.ZMQ;
import org.zeromq.ZMQ.Poller;

import java.util.HashMap;
import java.util.Map;

/**
 * XTablesSocketMonitor - A class for monitoring the state of ZeroMQ sockets.
 * <p>
 * This class provides functionality for monitoring multiple ZeroMQ sockets by using the ZeroMQ socket monitor API.
 * It listens for various socket events such as connections, disconnections, and retries, and processes these events in real-time.
 * The monitor provides feedback on socket status, including the connection state, and reports it through various events.
 * <p>
 * The class also includes methods for adding and removing sockets, as well as retrieving their status.
 * It handles these socket events asynchronously, making it suitable for real-time monitoring in applications that rely on ZeroMQ for messaging.
 * <p>
 * Author: Kobe Lei
 * Version: 1.0
 * Package: org.kobe.xbot.JClient
 * <p>
 * This is part of the XTABLES project and provides socket monitoring functionality within a ZeroMQ-based communication system.
 */
public class XTablesSocketMonitor extends Thread {
    /**
     * Enum representing the status of a socket during monitoring.
     * The statuses include various connection events such as connection, disconnection, and retries.
     */
    public enum SocketStatus {
        CONNECTED,
        CONNECT_DELAYED,
        CONNECT_RETRIED,
        DISCONNECTED,
        MONITOR_STOPPED,
        UNKNOWN
    }

    private static final XTablesLogger logger = XTablesLogger.getLogger(XTablesSocketMonitor.class);
    private final ZContext context;
    private final Map<ZMQ.Socket, String> monitorSocketNames = new HashMap<>();
    private final Map<String, SocketStatus> socketStatuses = new HashMap<>();
    private final Poller poller;
    private volatile boolean running = true;

    /**
     * Constructor for XTablesSocketMonitor.
     * Initializes the monitor with the given ZeroMQ context and sets up the polling mechanism.
     * <p>
     *
     * @param context The ZeroMQ context used for creating and managing sockets.
     */
    public XTablesSocketMonitor(ZContext context) {
        this.context = context;
        this.poller = context.createPoller(0);
        setDaemon(true);
    }

    /**
     * Adds a socket to the monitor for monitoring its connection events.
     * <p>
     * Registers the socket to monitor various connection events such as connection, delay, retry, disconnection, and monitor stop.
     * Also sets up the socket for polling events.
     * <p>
     *
     * @param socketName The name of the socket for identification.
     * @param socket     The ZeroMQ socket to monitor.
     * @return The XTablesSocketMonitor instance for method chaining.
     */
    public XTablesSocketMonitor addSocket(String socketName, ZMQ.Socket socket) {
        String monitorAddress = "inproc://monitor-" + socket.hashCode();
        socket.monitor(monitorAddress,
                ZMQ.EVENT_CONNECTED |
                        ZMQ.EVENT_CONNECT_DELAYED |
                        ZMQ.EVENT_CONNECT_RETRIED |
                        ZMQ.EVENT_DISCONNECTED |
                        ZMQ.EVENT_MONITOR_STOPPED);
        ZMQ.Socket monitorSocket = context.createSocket(ZMQ.PAIR);
        monitorSocket.connect(monitorAddress);

        monitorSocketNames.put(monitorSocket, socketName);
        socketStatuses.put(socketName, SocketStatus.UNKNOWN);
        poller.register(monitorSocket, Poller.POLLIN);
        return this;
    }

    /**
     * Removes a socket from the monitor based on its socket name.
     * <p>
     * Unregisters the socket from monitoring and removes it from the internal maps.
     * <p>
     *
     * @param socketName The name of the socket to remove.
     * @return The XTablesSocketMonitor instance for method chaining.
     */
    public XTablesSocketMonitor removeSocket(String socketName) {
        monitorSocketNames.entrySet().removeIf(entry -> {
            if (entry.getValue().equals(socketName)) {
                ZMQ.Socket monitorSocket = entry.getKey();
                poller.unregister(monitorSocket);
                monitorSocket.close();
                return true;
            }
            return false;
        });
        socketStatuses.remove(socketName);
        return this;
    }

    /**
     * Removes a socket from the monitor based on the socket instance.
     * <p>
     * Unregisters the socket from monitoring and removes it from the internal maps.
     * <p>
     *
     * @param socket The ZeroMQ socket to remove.
     * @return The XTablesSocketMonitor instance for method chaining.
     */
    public XTablesSocketMonitor removeSocket(ZMQ.Socket socket) {
        String socketName = monitorSocketNames.remove(socket);
        if (socketName != null) {
            poller.unregister(socket);
            socket.close();
            socketStatuses.remove(socketName);
        }
        return this;
    }

    /**
     * Retrieves the current status of a monitored socket based on its name.
     * <p>
     *
     * @param socketName The name of the socket whose status is to be retrieved.
     * @return The current status of the socket.
     */
    public SocketStatus getStatus(String socketName) {
        return socketStatuses.getOrDefault(socketName, SocketStatus.UNKNOWN);
    }
    public String getSimplifiedMessage() {
        // Count the occurrences of each status
        int connectedCount = 0;
        int delayedCount = 0;
        int offCount = 0;
        int unknownCount = 0;

        for (SocketStatus status : socketStatuses.values()) {
            switch (status) {
                case CONNECTED -> connectedCount++;
                case CONNECT_DELAYED -> delayedCount++;
                case DISCONNECTED -> offCount++;
                default -> unknownCount++;
            }
        }

        // Build the simplified message string
        StringBuilder simplifiedMessage = new StringBuilder();
        if (connectedCount > 0) {
            simplifiedMessage.append(connectedCount).append("C");
        }
        if (delayedCount > 0) {
            simplifiedMessage.append(delayedCount).append("D");
        }
        if (offCount > 0) {
            simplifiedMessage.append(offCount).append("O");
        }
        if (unknownCount > 0) {
            simplifiedMessage.append(unknownCount).append("U");
        }

        // Return the simplified message as a string
        return simplifiedMessage.toString();
    }

    public boolean isConnected(String socketName) {
        return getStatus(socketName).equals(SocketStatus.CONNECTED);
    }

    /**
     * The main event loop for monitoring socket events.
     * <p>
     * This method continuously polls for socket events and processes them accordingly, logging and updating statuses.
     */
    @Override
    public void run() {
        try {
            while (running) {
                int events = poller.poll(1000); // Poll with a timeout to avoid blocking indefinitely
                if (events > 0) {
                    for (int i = 0; i < poller.getSize(); i++) {
                        if (poller.pollin(i)) {
                            ZMQ.Socket monitorSocket = poller.getSocket(i);
                            String socketName = monitorSocketNames.get(monitorSocket);
                            ZMQ.Event event = ZMQ.Event.recv(monitorSocket);

                            if (event != null) {
                                handleEvent(socketName, event);
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.severe("Error in ZeroMQ event loop: " + e.getMessage());
        } finally {
            cleanup();
        }
    }

    /**
     * Handles a socket event and updates the socket status accordingly.
     * <p>
     * Logs the event and updates the status of the monitored socket.
     * <p>
     *
     * @param socketName The name of the socket that triggered the event.
     * @param event      The event triggered on the socket.
     */
    private void handleEvent(String socketName, ZMQ.Event event) {
        switch (event.getEvent()) {
            case ZMQ.EVENT_CONNECTED -> {
                logger.info("Client socket connected: " + socketName + " to " + event.getAddress());
                socketStatuses.put(socketName, SocketStatus.CONNECTED);
            }
            case ZMQ.EVENT_CONNECT_DELAYED -> {
                logger.warning("Connection delayed for socket: " + socketName);
                socketStatuses.put(socketName, SocketStatus.CONNECT_DELAYED);
            }
            case ZMQ.EVENT_CONNECT_RETRIED -> {
                logger.info("Connection retried for socket: " + socketName);
                socketStatuses.put(socketName, SocketStatus.CONNECT_RETRIED);
            }
            case ZMQ.EVENT_DISCONNECTED -> {
                logger.severe("Client socket disconnected: " + socketName + " from " + event.getAddress());
                socketStatuses.put(socketName, SocketStatus.DISCONNECTED);
            }
            case ZMQ.EVENT_MONITOR_STOPPED -> {
                logger.fatal("Monitor stopped for socket: " + socketName);
                socketStatuses.put(socketName, SocketStatus.MONITOR_STOPPED);
            }
            default -> {
                logger.severe("Unhandled event: " + event.getEvent() + " on socket: " + socketName);
                socketStatuses.put(socketName, SocketStatus.UNKNOWN);
            }
        }
    }

    /**
     * Interrupts the monitoring thread and performs cleanup.
     * <p>
     * Sets the running flag to false, terminates the thread, and cleans up any resources.
     */
    @Override
    public void interrupt() {
        running = false;
        super.interrupt();
        cleanup();
    }

    /**
     * Cleans up the resources by unregistering and closing all monitored sockets.
     * <p>
     * This method is called when the monitoring thread is interrupted or finished.
     */
    private void cleanup() {
        for (ZMQ.Socket monitorSocket : monitorSocketNames.keySet()) {
            poller.unregister(monitorSocket);
            monitorSocket.close();
        }
        monitorSocketNames.clear();
        socketStatuses.clear();
    }

}
