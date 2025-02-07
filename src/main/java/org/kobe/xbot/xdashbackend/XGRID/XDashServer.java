package org.kobe.xbot.xdashbackend.XGRID;

import org.kobe.xbot.Utilities.Entities.XDashDebugger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.DatagramPacket;
import java.net.DatagramSocket;

public class XDashServer extends Thread {
    private static final int PORT = 57341;  // Match the Python sender's port
    private static final int BUFFER_SIZE = 9999999;  // Same as sender's socket buffer
    private static final Logger log = LoggerFactory.getLogger(XDashServer.class);
    private boolean running = true;
    private DatagramSocket socket;

    public XDashServer() {
        setDaemon(true);
        setName("XDash Server");
    }

    /**
     * If this thread was constructed using a separate
     * {@code Runnable} run object, then that
     * {@code Runnable} object's {@code run} method is called;
     * otherwise, this method does nothing and returns.
     * <p>
     * Subclasses of {@code Thread} should override this method.
     *
     * @see #start()
     */
    @Override
    public void run() {
        try {
            socket = new DatagramSocket(PORT);
            System.out.println("XDashServer is listening on UDP port " + PORT);

            byte[] buffer = new byte[BUFFER_SIZE];

            while (running) {
                try {
                    DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
                    socket.receive(packet);

                    byte[] requestBytes = new byte[packet.getLength()];
                    System.arraycopy(packet.getData(), 0, requestBytes, 0, packet.getLength());

                    XDashDebugger.Message message = XDashDebugger.Message.parseFrom(requestBytes);
                    if(message.getTy() == XDashDebugger.Message.Type.IMAGE) {
                        XDashViewer.setFrameForKeyOrOpenIfNotExists(message.getK(), message.getT(), message.getV().toByteArray());
                    } else {
                        XDashLogs.addLogForKeyOrOpenIfNotExists(message.getK(), message.getT(), message.getV().toStringUtf8());

                    }

                } catch (Exception e) {
                    System.out.println("XDashServer Receiver got an exception: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            System.out.println("XDashServer Socket got an exception: " + e.getMessage());
        }
    }

    @Override
    public void interrupt() {
        this.running = false;
        this.socket.close();
        super.interrupt();
    }
}

