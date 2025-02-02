package org.kobe.xbot.xdashbackend.XGRID;

import com.formdev.flatlaf.themes.FlatMacDarkLaf;
import org.kobe.xbot.Utilities.Entities.XTableProto;
import org.kobe.xbot.Utilities.Entities.XTableValues;
import org.kobe.xbot.Utilities.XTablesByteUtils;
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
    private final String type;

    public XTablesValueLogs(String key, String type) {
        this.key = key;
        this.type = type;
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
    public static void openLogWindow(String key, String type) {
        SwingUtilities.invokeLater(() -> {
            logWindows.computeIfAbsent(key, (k) -> (new XTablesValueLogs(k,type)));
        });
    }

    public static void addLogToKey(String key, XTableProto.XTableMessage.XTableUpdate log) {
        XTablesValueLogs window = logWindows.get(key);
        if (window != null) {
            SwingUtilities.invokeLater(() -> {
                window.addLog(log);
            });
        }
    }

    public void addLog(XTableProto.XTableMessage.XTableUpdate updateEvent) {
        SwingUtilities.invokeLater(() -> {
            if (logModel.getSize() > 5000) {
                logModel.remove(0);
            }
            if (this.type.equals("JSON")) {
                logModel.addElement(XTablesByteUtils.convertXTableUpdateToJsonString(updateEvent));
            } else if (this.type.equals("Coordinates")) {
                try {
                    logModel.addElement(Arrays.toString(XTableValues.CoordinateList.parseFrom(updateEvent.getValue()).getCoordinatesList().stream().map(m -> String.format("X: %1$s Y: %2$s", m.getX(), m.getY())).toArray()));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
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
