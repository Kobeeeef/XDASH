package org.kobe.xbot.JClient;

import org.kobe.xbot.Utilities.Logger.XTablesLogger;
import org.zeromq.ZMQ;

/**
 * BaseThread - A general base class for threads with common setup and cleanup functionality.
 * <p>
 * This class provides a standardized way to handle thread initialization, resource cleanup,
 * and logging for threads used in the XTABLES project.
 * <p>
 * Author: Kobe Lei
 * Version: 1.0
 */
public abstract class BaseHandler extends Thread {
    protected static final XTablesLogger logger = XTablesLogger.getLogger();
    protected final ZMQ.Socket socket;

    /**
     * Constructor to initialize the thread with a custom name, daemon status, and socket.
     *
     * @param threadName The name of the thread
     * @param isDaemon   Whether the thread should run as a daemon
     * @param socket     The ZMQ.Socket instance to manage
     */
    public BaseHandler(String threadName, boolean isDaemon, ZMQ.Socket socket) {
        setName(threadName);
        setDaemon(isDaemon);
        this.socket = socket;
    }

    /**
     * Performs cleanup by closing the ZMQ.Socket.
     */
    protected void cleanUp() {
        if (socket != null) {
            socket.close();
            logger.info("Socket closed successfully");
        }
    }

    /**
     * Logs exceptions and handles cleanup when the thread is interrupted.
     */
    @Override
    public void interrupt() {
        try {
            cleanUp();
        } catch (Exception e) {
            logger.warning("Exception during cleanup: " + e.getMessage());
        }
        super.interrupt();
    }

    /**
     * Logs exceptions that occur during thread execution.
     */
    protected void handleException(Exception exception) {
        exception.printStackTrace();
        logger.severe("Exception in thread " + getName() + ": " + exception.getMessage());
    }
}

