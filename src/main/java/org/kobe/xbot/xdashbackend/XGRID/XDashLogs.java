package org.kobe.xbot.xdashbackend.XGRID;

import com.formdev.flatlaf.themes.FlatMacDarkLaf;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

public class XDashLogs extends JFrame {
    private static final XDashLogger logger = XDashLogger.getLogger();
    private final DefaultListModel<String> logModel;
    private final JList<String> logList;
    private final JScrollPane scrollPane;
    private final JPanel toolPanel;
    private final JButton clearButton, closeButton, lockScrollButton, saveButton;
    private boolean isScrollLocked = true;
    public static final Map<String, XDashLogs> logWindows = new ConcurrentHashMap<>();
    private final String key;
    private static final SimpleDateFormat TIMESTAMP_FORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    public XDashLogs(String key) {
        this.key = key;
        setTitle("XDASH - DEBUG LOGS - " + key);
        setSize(900, 800);
        setExtendedState(JFrame.MAXIMIZED_BOTH);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLayout(new BorderLayout());
        setLocationRelativeTo(null);

        try {
            UIManager.setLookAndFeel(new FlatMacDarkLaf());
            SwingUtilities.updateComponentTreeUI(this);
        } catch (UnsupportedLookAndFeelException e) {
            e.printStackTrace();
        }

        try {
            Image icon = ImageIO.read(Objects.requireNonNull(getClass().getResource("/icon.png")));
            setIconImage(icon);
        } catch (IOException e) {
            System.err.println("Icon image not found.");
        }

        logModel = new DefaultListModel<>();
        logList = new JList<>(logModel);
        logList.setVisibleRowCount(100);
        logList.setPrototypeCellValue("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
        scrollPane = new JScrollPane(logList);

        toolPanel = new JPanel();
        toolPanel.setLayout(new FlowLayout(FlowLayout.CENTER));

        clearButton = new JButton("Clear Logs");
        clearButton.addActionListener(e -> clearLog());

        closeButton = new JButton("Close");
        closeButton.addActionListener(e -> dispose());

        lockScrollButton = new JButton("Unlock Scroll");
        lockScrollButton.addActionListener(e -> toggleScrollLock());

        saveButton = new JButton("Save As File");
        saveButton.addActionListener(e -> saveLogsToFile());

        toolPanel.add(clearButton);
        toolPanel.add(lockScrollButton);
        toolPanel.add(saveButton);
        toolPanel.add(closeButton);

        add(toolPanel, BorderLayout.NORTH);
        add(scrollPane, BorderLayout.CENTER);

        setVisible(true);
    }

    private void toggleScrollLock() {
        isScrollLocked = !isScrollLocked;
        lockScrollButton.setText(isScrollLocked ? "Unlock Scroll" : "Lock Scroll");
    }

    public static void openLogWindow(String key) {
        SwingUtilities.invokeLater(() -> {
            logWindows.computeIfAbsent(key, XDashLogs::new);
        });
    }

    public static void addLogForKeyOrOpenIfNotExists(String key, double timestamp, String msg) {
        XDashLogs window = logWindows.get(key);
        if (window != null) {
            SwingUtilities.invokeLater(() -> {
                window.addLog(msg, timestamp);
            });
        } else {
            openLogWindow(key);
        }
    }

    public static void addLogToKey(String key, String log, double timestamp) {
        XDashLogs window = logWindows.get(key);
        if (window != null) {
            SwingUtilities.invokeLater(() -> {
                window.addLog(log, timestamp);
            });
        }
    }

    public void addLog(String msg, double timestamp) {
        SwingUtilities.invokeLater(() -> {
            if (logModel.getSize() > 5000) {
                logModel.remove(0);
            }

            // Convert timestamp to readable format
            String formattedTimestamp = formatTimestamp(timestamp);

            // Format log message with timestamp
            String formattedLog = "[" + formattedTimestamp + "] " + msg;
            logModel.addElement(formattedLog);

            if (isScrollLocked) {
                logList.ensureIndexIsVisible(logModel.getSize() - 1);
            }
        });
    }

    private String formatTimestamp(double timestamp) {
        Date date = new Date((long) (timestamp * 1000));  // Convert Unix timestamp to milliseconds
        return TIMESTAMP_FORMAT.format(date);
    }

    /**
     * Saves the log entries to a text file with a progress bar.
     */
    private void saveLogsToFile() {
        SwingUtilities.invokeLater(() -> {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
            String filename = key + "-" + dateFormat.format(new Date()) + ".txt";

            JFileChooser fileChooser = new JFileChooser();
            fileChooser.setDialogTitle("Save Log File");
            fileChooser.setSelectedFile(new File(filename));

            int userSelection = fileChooser.showSaveDialog(this);
            if (userSelection == JFileChooser.APPROVE_OPTION) {
                File file = fileChooser.getSelectedFile();
                int totalLogs = logModel.getSize();

                // Create a progress dialog
                JDialog progressDialog = new JDialog(this, "Saving Logs", true);
                progressDialog.setSize(300, 100);
                progressDialog.setLayout(new BorderLayout());
                JProgressBar progressBar = new JProgressBar(0, totalLogs);
                progressBar.setStringPainted(true);
                progressDialog.add(progressBar, BorderLayout.CENTER);
                progressDialog.setLocationRelativeTo(this);

                // SwingWorker to handle file writing
                SwingWorker<Void, Integer> worker = new SwingWorker<>() {
                    @Override
                    protected Void doInBackground() {
                        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
                            for (int i = 0; i < totalLogs; i++) {
                                if (isCancelled()) break;
                                writer.write(logModel.getElementAt(i));
                                writer.newLine();
                                publish(i + 1); // Update progress
                            }
                        } catch (IOException e) {
                            SwingUtilities.invokeLater(() -> JOptionPane.showMessageDialog(
                                    XDashLogs.this,
                                    "Error saving logs!",
                                    "Error",
                                    JOptionPane.ERROR_MESSAGE
                            ));
                        }
                        return null;
                    }

                    @Override
                    protected void process(List<Integer> chunks) {
                        progressBar.setValue(chunks.get(chunks.size() - 1));
                    }

                    @Override
                    protected void done() {
                        progressDialog.dispose();
                        if (!isCancelled()) {
                            JOptionPane.showMessageDialog(
                                    XDashLogs.this,
                                    "Logs saved successfully!",
                                    "Success",
                                    JOptionPane.INFORMATION_MESSAGE
                            );
                        }
                    }
                };

                worker.execute();
                progressDialog.setVisible(true);
                worker.cancel(true);
            }
        });
    }

    @Override
    public void dispose() {
        logger.info("Disposing XDashLogs");
        logWindows.remove(this.key);
        super.dispose();
    }

    public void clearLog() {
        SwingUtilities.invokeLater(logModel::clear);
    }
}
