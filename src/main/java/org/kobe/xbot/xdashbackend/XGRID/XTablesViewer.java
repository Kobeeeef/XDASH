package org.kobe.xbot.xdashbackend.XGRID;


import com.formdev.flatlaf.themes.FlatMacDarkLaf;
import com.formdev.flatlaf.themes.FlatMacLightLaf;
import edu.wpi.first.math.geometry.Pose2d;
import edu.wpi.first.math.geometry.Rotation2d;
import org.fife.ui.rsyntaxtextarea.Theme;
import org.kobe.xbot.JClient.XTableContext;
import org.kobe.xbot.Utilities.Entities.XTableProto;
import org.kobe.xbot.Utilities.XTablesByteUtils;
import org.kobe.xbot.Utilities.XTablesData;
import org.kobe.xbot.xdashbackend.XdashbackendApplication;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;
import org.kobe.xbot.xdashbackend.utilities.AudioUtil;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;

public class XTablesViewer extends JFrame {
    private static final String ROBOT_POSE_TABLE = "PoseSubsystem.RobotPose";

    private static final XDashLogger logger = XDashLogger.getLogger();
    public XTablesDropdownViewer dropdownViewer;
    public FieldPanel fieldPanel;
    public JPanel toolPanel;
    public String currentFileParentPath;
    public JMenuBar menuBar;
    public JMenu settingsMenu, themeItem;
    public JMenuItem darkThemeItem, lightThemeItem,
            exitItem;
    private final XTablesData cache;
    private JButton reloadButton, addButton, rebootButton, expandButton, addValueLogButton, closeButton;
    private final XTableContext client;
    private Thread cacheThread;
    private final Theme theme;

    public XTablesViewer(XTableContext client) {
        this.client = client;
        this.cache = new XTablesData();
        InputStream nightStream = getClass().getResourceAsStream("/themes/monokai.xml");
        try {
            theme = Theme.load(nightStream);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        setSize(900, 800);
        setTitle("XDASH - XTABLES");
        setExtendedState(JFrame.MAXIMIZED_BOTH);
        setDefaultCloseOperation(JFrame.HIDE_ON_CLOSE);
        setLayout(new BorderLayout());
        setLocationRelativeTo(null);
        try {
            Image icon = ImageIO.read(Objects.requireNonNull(getClass().getResource("/icon.png")));
            setIconImage(icon);
        } catch (IOException e) {
            logger.severe("Icon image not found in file editor.");
        }
        init();
        addComponent();
        setStatus(client.getxTablesClient().getSocketMonitor().getSimplifiedMessage());
        cacheThread = new Thread(this::enableCache);
        cacheThread.setDaemon(true);
        cacheThread.start();
        ThreadFactory daemonThreadFactory = runnable -> {
            Thread thread = new Thread(runnable);
            thread.setDaemon(true); // Set thread as daemon
            return thread;
        };
        ScheduledExecutorService daemonScheduler = Executors.newScheduledThreadPool(1, daemonThreadFactory);
        daemonScheduler.scheduleAtFixedRate(() -> {
            setStatus(client.getxTablesClient().getSocketMonitor().getSimplifiedMessage());
            if (client.getxTablesClient().getSocketMonitor().isConnected("REQUEST-VIEWER")) {
                rebootButton.setEnabled(true);
                addButton.setEnabled(true);
                reloadButton.setEnabled(true);
                expandButton.setEnabled(true);
            } else {
                rebootButton.setEnabled(false);
                addButton.setEnabled(false);
                reloadButton.setEnabled(false);
                expandButton.setEnabled(false);
            }
        }, 0, 100, TimeUnit.MILLISECONDS);
        try {
            UIManager.setLookAndFeel(new FlatMacDarkLaf());
            SwingUtilities.updateComponentTreeUI(this);
        } catch (UnsupportedLookAndFeelException ex) {
            logger.severe("Look and feel not supported: " + ex.getMessage());
        } catch (Exception e) {
            logger.severe("Unknown error on look and feel: " + e.getMessage());
        }
    }


    private void loadCache() {
        try {
            XTableProto.XTableMessage.XTablesData dataProto = client._getXTablesDataProto();
            if (dataProto == null) {
                throw new Exception("XTABLES Server returned null proto. Maybe not connected yet?");
            }
            cache.fromProto(dataProto);
            byte[] robotPose = cache.get(ROBOT_POSE_TABLE);
            if(robotPose != null) {
                try {
                    fieldPanel.setRobotPose(XTablesByteUtils.unpackPose2d(robotPose));
                } catch (Exception ignored) {
                }
            }
            dropdownViewer.populateTable();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void enableCache() {
        try {
            loadCache();
            if (subscribeToCacheUpdates()) {
                System.out.println("Cache is now setup and ready to use.");
            } else {
                System.out.println("Failed to subscribe to ANY update, NON OK status returned from server.");
            }
        } catch (Exception e) {
            System.out.println("Failed to initialize cache or subscribe to updates. Error:\n" + e.getMessage());
        }
    }

    private boolean subscribeToCacheUpdates() {
        boolean responseStatus = client.getxTablesClient().subscribe((updateEvent) -> {
            cache.put(updateEvent.getKey(), updateEvent.getValue().toByteArray(), updateEvent.getType());
            SwingUtilities.invokeLater(() -> {
                dropdownViewer.updateNode(updateEvent.getKey(),
                        XTablesByteUtils.convertXTableUpdateToJsonString(updateEvent));
                if(updateEvent.getKey().equals(ROBOT_POSE_TABLE)) {
                    try {
                        fieldPanel.setRobotPose(XTablesByteUtils.unpackPose2d(updateEvent.getValue().toByteArray()));
                    } catch (Exception ignored) {
                    }
                }
                if (XTablesValueLogs.logWindows.containsKey(updateEvent.getKey())) {
                    XTablesValueLogs.addLogToKey(updateEvent.getKey(), updateEvent);
                }
                if (XTablesImageViewer.imageWindows.containsKey(updateEvent.getKey())) {
                    XTablesImageViewer.setFrameForKey(updateEvent.getKey(), updateEvent.getValue().toByteArray());
                }
            });
        });
        if (responseStatus) System.out.println("Cache is now subscribed for updates.");
        return responseStatus;
    }

    public void setStatus(String status) {
        setTitle(String.format("XDASH - XTABLES - %1$s", status));
    }

    public void init() {
        fieldPanel = new FieldPanel();
        dropdownViewer = new XTablesDropdownViewer(client, cache);

        toolPanel = new JPanel();
        toolPanel.setLayout(new FlowLayout(FlowLayout.CENTER));

        menuBar = new JMenuBar();
        settingsMenu = new JMenu("Settings", true);

        themeItem = new JMenu("Theme");
        darkThemeItem = new JMenuItem("Dark");
        lightThemeItem = new JMenuItem("Light");
        toolPanel.add(createControlPanel());


        darkThemeItem.addActionListener(e -> {
            try {

                UIManager.setLookAndFeel(new FlatMacDarkLaf());
                SwingUtilities.updateComponentTreeUI(this);
            } catch (UnsupportedLookAndFeelException ex) {
                throw new RuntimeException(ex);
            }
        });

        lightThemeItem.addActionListener(e -> {
            try {
                UIManager.setLookAndFeel(new FlatMacLightLaf());
                SwingUtilities.updateComponentTreeUI(this);
            } catch (UnsupportedLookAndFeelException ex) {
                throw new RuntimeException(ex);
            }
        });


        exitItem = new JMenuItem("Close Viewer");
        exitItem.addActionListener(e -> {
            hide();
        });
    }

    private void close() {
        try {
            dispose();
        } catch (Exception ec) {
            logger.severe("Failed to close viewer: " + ec.getMessage());
            JOptionPane.showMessageDialog(null, "Failed to close viewer: " + ec.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    public void hideViewer() {
        this.setVisible(false);
    }

    public void showViewer() {
        this.setVisible(true);
        toFront();
        setAlwaysOnTop(true);
        setAlwaysOnTop(false);
        this.dropdownViewer.populateTable();
    }

    private JPanel createControlPanel() {

        expandButton = new JButton("Expand");
        expandButton.addActionListener(e -> {
            expandButton.setEnabled(false);
            try {
                if (expandButton.getText().equals("Expand")) {
                    this.dropdownViewer.expandAllRows();
                    expandButton.setText("Collapse");
                } else {
                    this.dropdownViewer.collapseAllRows();
                    expandButton.setText("Expand");
                }
                expandButton.setEnabled(true);
            } catch (Exception ec) {
                ec.printStackTrace();
                expandButton.setEnabled(true);
                JOptionPane.showMessageDialog(null, "Failed to expand: " + ec.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        });
        reloadButton = new JButton("Reload");
        reloadButton.addActionListener(e -> {
            reloadButton.setEnabled(false);
            try {
                fieldPanel.setClickCallback((a) -> {
                    System.out.println(XTablesByteUtils.pose2dToString(a.getKey()));
                });
                Map<Pose2d, Double> enemies = new HashMap<>();
                enemies.put(new Pose2d(4.63, 6.99, new Rotation2d(23)), 0.75); // 75% probability
                enemies.put(new Pose2d(8.27, 4, new Rotation2d(Math.PI)), 0.45); // 45% probability
                fieldPanel.setNotes(enemies);
                List<Pose2d> waypoints = new ArrayList<>();
                waypoints.add(new Pose2d(8,2, Rotation2d.fromDegrees(Math.PI)));
                waypoints.add(new Pose2d(7,4, Rotation2d.fromDegrees(Math.PI)));
                waypoints.add(new Pose2d(7,5, Rotation2d.fromDegrees(Math.PI)));
                fieldPanel.setWaypoints(waypoints);
                XTableProto.XTableMessage.XTablesData dataProto = client._getXTablesDataProto();
                if (dataProto == null) {
                    throw new Exception("XTABLES Server returned null proto. Maybe not connected yet?");
                }
                cache.fromProto(dataProto);
                byte[] robotPose = cache.get(ROBOT_POSE_TABLE);
                if(robotPose != null) {
                    try {
                        fieldPanel.setRobotPose(XTablesByteUtils.unpackPose2d(robotPose));
                    } catch (Exception ignored) {
                    }
                }
                dropdownViewer.populateTable();
                showNotification("Reloaded all data from server successfully.", 1500);
                reloadButton.setEnabled(true);
            } catch (Exception ec) {
                ec.printStackTrace();
                AudioUtil.playErrorSound();
                reloadButton.setEnabled(true);
                JOptionPane.showMessageDialog(null, "Failed to reload Cache: " + ec.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }


        });
        addButton = new JButton("Add Data");
        addButton.addActionListener(e -> {
            Set<String> history = new HashSet<>(XdashbackendApplication.getConfigLoader().getPropertyList("XTABLE-VALUE-LOGS-HISTORY"));
            JComboBox<String> keyDropdown = new JComboBox<>(history.toArray(new String[0]));
            keyDropdown.setEditable(true);

            DynamicInputPanel inputPanel = new DynamicInputPanel();
            JPanel panel = new JPanel(new BorderLayout());
            panel.add(keyDropdown, BorderLayout.NORTH);
            panel.add(inputPanel, BorderLayout.CENTER);

            int result = JOptionPane.showConfirmDialog(
                    null,
                    panel,
                    "Enter Key and Value",
                    JOptionPane.OK_CANCEL_OPTION,
                    JOptionPane.PLAIN_MESSAGE
            );

            if (result == JOptionPane.OK_OPTION) {
                Object item = keyDropdown.getSelectedItem();
                if (item instanceof String) {
                    String key = keyDropdown.getSelectedItem().toString().trim();
                    String selectedType = inputPanel.getSelectedType();
                    Object value = inputPanel.getEnteredValue();

                    if (key.isEmpty()) {
                        JOptionPane.showMessageDialog(null, "Key cannot be empty!", "Error", JOptionPane.ERROR_MESSAGE);
                        return;
                    }

                    try {
                        if (!history.contains(key)) {
                            history.add(key);
                            XdashbackendApplication.getConfigLoader().setPropertyList("XTABLE-VALUE-LOGS-HISTORY", new ArrayList<>(history));
                            XdashbackendApplication.getConfigLoader().save();
                        }

                        boolean success = sendToClient(selectedType, key, value);
                        if (!success) {
                            JOptionPane.showMessageDialog(null, "Failed to store value", "Error", JOptionPane.ERROR_MESSAGE);
                        }
                    } catch (Exception err) {
                        JOptionPane.showMessageDialog(null, "Error: " + err.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
                    }
                } else {
                    JOptionPane.showMessageDialog(null, "Invalid Key", "Error", JOptionPane.ERROR_MESSAGE);
                }
            }

        });

        rebootButton = new JButton("Reboot");
        rebootButton.addActionListener(e -> {
            rebootButton.setEnabled(false);
            try {
                client.reboot();
                AudioUtil.playSuccessSound();
                rebootButton.setEnabled(true);
                JOptionPane.showMessageDialog(null, "The server is now rebooting. Please wait.", "Server Rebooting!", JOptionPane.INFORMATION_MESSAGE);
            } catch (Exception ec) {
                rebootButton.setEnabled(true);
                JOptionPane.showMessageDialog(null, "Failed to reboot server: " + ec.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        });
        addValueLogButton = new JButton("Add Value Log");
        addValueLogButton.addActionListener(e -> {
            Set<String> history = new HashSet<>(XdashbackendApplication.getConfigLoader().getPropertyList("XTABLE-VALUE-LOGS-HISTORY"));
            JComboBox<String> keyDropdown = new JComboBox<>(history.toArray(new String[0]));
            JComboBox<String> typeDropdown = new JComboBox<>(new String[] { "JSON", "Coordinates", "Pose2d", "Pose3d", "Image"});
            JPanel panel = new JPanel(new BorderLayout());
            keyDropdown.setEditable(true);
            panel.add(keyDropdown, BorderLayout.NORTH);
            panel.add(typeDropdown, BorderLayout.CENTER);
            int result = JOptionPane.showConfirmDialog(
                    null,
                    panel,
                    "Enter Key:",
                    JOptionPane.OK_CANCEL_OPTION,
                    JOptionPane.PLAIN_MESSAGE
            );

            if (result == JOptionPane.OK_OPTION) {
                Object item = keyDropdown.getSelectedItem();
                if (item instanceof String) {
                    String key = keyDropdown.getSelectedItem().toString().trim();
                    if (!key.isEmpty()) {
                        try {
                            if (!history.contains(key)) {
                                history.add(key);
                                XdashbackendApplication.getConfigLoader().setPropertyList("XTABLE-VALUE-LOGS-HISTORY", new ArrayList<>(history));
                                XdashbackendApplication.getConfigLoader().save();
                            }
                        } catch (Exception err) {
                            JOptionPane.showMessageDialog(null, "Failed to store value: " + err.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
                        }
                        if(typeDropdown.getSelectedItem().toString().equals("JSON")) {
                            XTablesValueLogs.openLogWindow(key, "JSON");
                        } else if(typeDropdown.getSelectedItem().toString().equals("Coordinates")) {
                            XTablesValueLogs.openLogWindow(key, "Coordinates");
                        } else if(typeDropdown.getSelectedItem().toString().equals("Pose2d")) {
                            XTablesValueLogs.openLogWindow(key, "POSE2D");
                        } else if(typeDropdown.getSelectedItem().toString().equals("Pose3d")) {
                            XTablesValueLogs.openLogWindow(key, "POSE3D");
                        }  else if (typeDropdown.getSelectedItem().toString().equals("Image")) {
                            XTablesImageViewer.openImageWindow(key);
                        }
                    }
                } else {
                    JOptionPane.showMessageDialog(null, "Invalid Key", "Error", JOptionPane.ERROR_MESSAGE);
                }
            }
        });

        closeButton = new JButton("Close");
        closeButton.addActionListener(e -> {
            closeButton.setEnabled(false);
            try {
                setVisible(false);
                closeButton.setEnabled(true);
            } catch (Exception ec) {
                closeButton.setEnabled(true);
                JOptionPane.showMessageDialog(null, "Failed to close panel: " + ec.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        });
        JPanel panel = new JPanel();
        panel.add(expandButton);
        panel.add(reloadButton);
        panel.add(addButton);
        panel.add(rebootButton);
        panel.add(addValueLogButton);
        panel.add(closeButton);
        return panel;
    }

    public void addComponent() {
        menuBar.add(settingsMenu);
        settingsMenu.add(themeItem);
        settingsMenu.addSeparator();

        themeItem.add(darkThemeItem);
        themeItem.add(lightThemeItem);


        settingsMenu.add(exitItem);
        this.add(toolPanel, BorderLayout.NORTH);
        JSplitPane splitPane = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, dropdownViewer, fieldPanel);
        splitPane.setContinuousLayout(false);
        splitPane.setOneTouchExpandable(true);
        splitPane.setDividerLocation(0);
        this.add(splitPane, BorderLayout.CENTER);


        setJMenuBar(menuBar);

        revalidate();
        repaint();

        setVisible(true);
    }


    private boolean sendToClient(String type, String key, Object value) throws Exception {
        switch (type) {
            case "String":
                return client.putString(key, value.toString());
            case "Double":
                return client.putDouble(key, Double.parseDouble(value.toString()));
            case "Integer":
                return client.putInteger(key, Integer.parseInt(value.toString()));
            case "Float":
                return client.putDouble(key, Double.parseDouble(value.toString())); // Using putDouble for float
            case "Boolean":
                return client.putBoolean(key, (Boolean) value);
            case "Long":
                return client.putLong(key, Long.parseLong(value.toString()));
            case "DoubleList":
                return client.putDoubleList(key, parseDoubleList((java.util.List<String>) value));
            case "StringList":
                return client.putStringList(key, (java.util.List<String>) value);
            case "IntegerList":
                return client.putIntegerList(key, parseIntegerList((java.util.List<String>) value));
            case "LongList":
                return client.putLongList(key, parseLongList((java.util.List<String>) value));
            case "FloatList":
                return client.putFloatList(key, parseFloatList((java.util.List<String>) value));
            case "BooleanList":
                return client.putBooleanList(key, parseBooleanList((java.util.List<String>) value));
            default:
                throw new IllegalArgumentException("Unknown type: " + type);
        }
    }

    private java.util.List<Double> parseDoubleList(java.util.List<String> value) {
        return value.stream().map(Double::parseDouble).toList();
    }

    private java.util.List<Integer> parseIntegerList(java.util.List<String> value) {
        return value.stream().map(Integer::parseInt).toList();
    }

    private java.util.List<Long> parseLongList(java.util.List<String> value) {
        return value.stream().map(Long::parseLong).toList();
    }

    private static java.util.List<Float> parseFloatList(java.util.List<String> value) {
        return value.stream().map(Float::parseFloat).toList();
    }

    private static java.util.List<Boolean> parseBooleanList(java.util.List<String> value) {
        return value.stream().map(Boolean::parseBoolean).toList();
    }
    public void showNotification(String msg, int ti) {
        SwingNotification.showNotification(this, msg, ti);
    }

}

