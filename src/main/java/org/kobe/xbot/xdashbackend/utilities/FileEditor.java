package org.kobe.xbot.xdashbackend.utilities;

import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.Session;
import org.kobe.xbot.xdashbackend.entities.SSHHostAddress;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.io.*;
import java.util.Objects;

public class FileEditor {
    private static final XDashLogger logger = XDashLogger.getLogger();
    private JTextArea textArea;
    private final ChannelSftp channelSftp;
    private final String remoteFilePath;
    private final String hostname;
    private final String password;

    public FileEditor(ChannelSftp channelSftp, String remoteFilePath, String hostname, String password) {
        this.channelSftp = channelSftp;
        this.remoteFilePath = remoteFilePath;
        this.hostname = hostname;
        this.password = password;
        createAndShowGUI();
    }

    private void createAndShowGUI() {
        JFrame frame = new JFrame(hostname + ":" + remoteFilePath);
        frame.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
        frame.setSize(800, 600);
        try {
            Image icon = ImageIO.read(Objects.requireNonNull(getClass().getResource("/icon.png")));
            frame.setIconImage(icon);
        } catch (IOException e) {
            System.err.println("Icon image not found.");
        }
        textArea = new JTextArea();
        textArea.setLineWrap(true);
        textArea.setWrapStyleWord(true);

        JScrollPane scrollPane = new JScrollPane(textArea);
        frame.add(scrollPane, BorderLayout.CENTER);

        JButton saveButton = new JButton("Save");
        saveButton.addActionListener(e -> saveFileWithSudo());

        JButton closeButton = new JButton("Close");
        closeButton.addActionListener(e -> closeEditor(frame));

        JPanel buttonPanel = new JPanel();
        buttonPanel.add(saveButton);
        buttonPanel.add(closeButton);
        frame.add(buttonPanel, BorderLayout.SOUTH);
        frame.addWindowListener(new java.awt.event.WindowAdapter() {
            @Override
            public void windowClosing(java.awt.event.WindowEvent e) {
                closeEditor(frame);
            }
        });
        loadRemoteFile();
        frame.setVisible(true);
        frame.toFront();
        frame.setAlwaysOnTop(true);
        frame.setAlwaysOnTop(false);
    }

    private void loadRemoteFile() {
        try {
            InputStream inputStream = channelSftp.get(remoteFilePath);
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            StringBuilder content = new StringBuilder();

            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
            textArea.setText(content.toString());
            inputStream.close();
        } catch (Exception e) {
            logger.info("Exception in file editor: " + e.getMessage());
        }
    }

    private void saveFileWithSudo() {
        try {
            // Save edited content to a temporary file
            File tempFile = File.createTempFile("edited_file", ".tmp");
            try (FileWriter writer = new FileWriter(tempFile)) {
                writer.write(textArea.getText());
            }

            // Upload the temporary file to the remote system's /tmp directory
            String tempRemotePath = "/tmp/" + tempFile.getName();
            try (InputStream inputStream = new FileInputStream(tempFile)) {
                channelSftp.put(inputStream, tempRemotePath);
            }

            // Use sudo to move the file to the desired location
            ChannelExec channelExec = (ChannelExec) channelSftp.getSession().openChannel("exec");
            channelExec.setCommand("echo \"" + password + "\" | sudo -S mv " + tempRemotePath + " " + remoteFilePath);
            channelExec.setInputStream(null);
            channelExec.setErrStream(System.err);

            InputStream execInput = channelExec.getInputStream();
            channelExec.connect();

            BufferedReader reader = new BufferedReader(new InputStreamReader(execInput));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            channelExec.disconnect();

            if (channelExec.getExitStatus() != 0) {
                JOptionPane.showMessageDialog(null, "Failed to save remote file with sudo. Error: " + output, "Error", JOptionPane.ERROR_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(null, "File saved successfully.", "Success", JOptionPane.INFORMATION_MESSAGE);
            }

            // Delete the temporary local file
            tempFile.delete();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Failed to save remote file: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void closeEditor(JFrame frame) {
        try {
            if (channelSftp != null && channelSftp.isConnected()) {
                channelSftp.disconnect();
            }
            frame.dispose();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Failed to close connection: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    public static void openRemoteFileEditor(SSHHostAddress sshHostAddress, String remoteFilePath) {
        Session session = sshHostAddress.getSession();

        SwingUtilities.invokeLater(() -> {
            try {
                if (session == null || !session.isConnected()) {
                    JOptionPane.showMessageDialog(null, "This session is not connected.", "Session is not connected!", JOptionPane.ERROR_MESSAGE);
                    return;
                }
                ChannelSftp channelSftp = (ChannelSftp) session.openChannel("sftp");
                channelSftp.connect();
                new FileEditor(channelSftp, remoteFilePath, sshHostAddress.getHostname(), sshHostAddress.getPassword());
            } catch (Exception e) {
                JOptionPane.showMessageDialog(null, "Failed to open remote file editor: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        });
    }
}
