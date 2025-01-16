package org.kobe.xbot.xdashbackend.utilities;

import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;

public class FrameReceiver {
    private final int udpPort;
    private final DatagramSocket udpSocket;
    private volatile boolean running;
    private JFrame frameWindow;
    private JLabel frameLabel;

    public FrameReceiver(int udpPort) throws Exception {
        this.udpPort = udpPort;
        this.udpSocket = new DatagramSocket(this.udpPort);
        setupDisplayWindow();
    }

    private void setupDisplayWindow() {
        frameWindow = new JFrame("Camera Calibration View");
        frameWindow.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frameLabel = new JLabel();
        frameWindow.getContentPane().add(frameLabel, BorderLayout.CENTER);
        frameWindow.setSize(640, 480);
        frameWindow.setVisible(true);
    }

    public void startReceiving() {
        running = true;
        Thread receiverThread = new Thread(() -> {
            byte[] buffer = new byte[65535];
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length);

            while (running) {
                try {
                    udpSocket.receive(packet);
                    byte[] data = packet.getData();
                    BufferedImage img = byteArrayToBufferedImage(data, packet.getLength());

                    if (img != null) {
                        updateDisplay(img);
                    }
                } catch (IOException e) {
                    if (running) {
                        e.printStackTrace();
                    }
                }
            }
        });
        receiverThread.start();
    }

    public void stopReceiving() {
        running = false;
        udpSocket.close();
        frameWindow.dispose();
    }

    private BufferedImage byteArrayToBufferedImage(byte[] data, int length) {
        try {
            ByteArrayInputStream bais = new ByteArrayInputStream(data, 0, length);
            return javax.imageio.ImageIO.read(bais);
        } catch (IOException e) {
            return null;
        }
    }

    private void updateDisplay(BufferedImage img) {
        ImageIcon imageIcon = new ImageIcon(img);
        frameLabel.setIcon(imageIcon);
        frameLabel.repaint();
    }

    public static void main(String[] args) {
        try {
            FrameReceiver receiver = new FrameReceiver(12345); // Default UDP port.
            receiver.startReceiving();

            System.out.println("Press Enter to stop...");
            System.in.read();

            receiver.stopReceiving();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
