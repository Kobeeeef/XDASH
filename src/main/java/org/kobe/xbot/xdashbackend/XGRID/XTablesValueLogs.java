package org.kobe.xbot.xdashbackend.XGRID;

import com.formdev.flatlaf.themes.FlatMacDarkLaf;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.io.IOException;
import java.util.Timer;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class XTablesValueLogs extends JFrame {
    private static final XDashLogger logger = XDashLogger.getLogger();
    private final DefaultListModel<String> logModel;
    private final JList<String> logList;
    private final JScrollPane scrollPane;
    private final JPanel toolPanel;
    private final JButton clearButton, closeButton, lockScrollButton;
    private boolean isScrollLocked = true;
    public static final Map<String, XTablesValueLogs> logWindows = new ConcurrentHashMap<>();
    private final String key;

    public XTablesValueLogs(String key) {
        this.key = key;
        setTitle("XDASH - XTABLES LOGS - " + key);
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
        closeButton.addActionListener(e -> {
            dispose();
        });
        lockScrollButton = new JButton("Unlock Scroll");
        lockScrollButton.addActionListener(e -> toggleScrollLock());

        toolPanel.add(clearButton);
        toolPanel.add(lockScrollButton);
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
            logWindows.computeIfAbsent(key, XTablesValueLogs::new);
        });
    }

    public static void addLogToKey(String key, String log) {
        XTablesValueLogs window = logWindows.get(key);
        if (window != null) {
            SwingUtilities.invokeLater(() -> {
                window.addLog(log);
            });
        }
    }

    public void addLog(String log) {
        SwingUtilities.invokeLater(() -> {
            if (logModel.getSize() > 5000) {
                logModel.remove(0);
            }
            logModel.addElement(log);
            if (isScrollLocked) {
                logList.ensureIndexIsVisible(logModel.getSize() - 1);
            }
        });
    }
    @Override
    public void dispose() {
        logger.info("Disposing XTablesValueLogs");
        logWindows.remove(this.key);
        super.dispose();
    }

    public void clearLog() {
        SwingUtilities.invokeLater(logModel::clear);
    }

}
