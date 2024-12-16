package org.kobe.xbot.xdashbackend.XGRID;


import com.formdev.flatlaf.fonts.inter.FlatInterFont;
import com.formdev.flatlaf.fonts.jetbrains_mono.FlatJetBrainsMonoFont;
import com.formdev.flatlaf.themes.FlatMacDarkLaf;
import com.formdev.flatlaf.themes.FlatMacLightLaf;
import org.fife.ui.rsyntaxtextarea.RSyntaxTextArea;
import org.fife.ui.rsyntaxtextarea.SyntaxConstants;
import org.fife.ui.rsyntaxtextarea.Theme;
import org.fife.ui.rtextarea.RTextScrollPane;
import org.kobe.xbot.Client.XTablesClient;
import org.kobe.xbot.Utilities.ResponseStatus;
import org.kobe.xbot.Utilities.Utilities;
import org.kobe.xbot.Utilities.XTablesData;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;
import java.util.concurrent.*;

public class XTablesViewer extends JFrame {
    private static final XDashLogger logger = XDashLogger.getLogger();
    public XTablesDropdownViewer dropdownViewer;
    public JPanel toolPanel;
    public String currentFileParentPath;
    public JMenuBar menuBar;
    public JMenu settingsMenu, themeItem;
    public JMenuItem darkThemeItem, lightThemeItem,
            exitItem;
    private final XTablesData cache;
    private JButton reloadButton, addButton, rebootButton;
    private final XTablesClient client;
    private Thread cacheThread;
    private final Theme theme;
    public XTablesViewer(XTablesClient client) {
        this.client = client;
        this.cache = new XTablesData();
        InputStream nightStream = getClass().getResourceAsStream("/themes/monokai.xml");
        try {
            theme = Theme.load(nightStream);
        }  catch (IOException e) {
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
        setStatus(client.getSocketClient().isConnected ? "CONNECTED" : "DISCONNECTED");
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
            setStatus(client.getSocketClient().isConnected ? "CONNECTED" : "DISCONNECTED");
            if(client.getSocketClient().isConnected) {
                rebootButton.setEnabled(true);
                addButton.setEnabled(true);
                reloadButton.setEnabled(true);
            } else {
                rebootButton.setEnabled(false);
                addButton.setEnabled(false);
                reloadButton.setEnabled(false);
            }
        }, 0, 200, TimeUnit.MILLISECONDS);
        setVisible(false);
        try {

            UIManager.setLookAndFeel(new FlatMacDarkLaf());
            SwingUtilities.updateComponentTreeUI(this);
        } catch (UnsupportedLookAndFeelException ex) {
            throw new RuntimeException(ex);
        }
    }



    private void loadCache() {
        try {
            String rawJSON = client.getRawJSON().complete();
            cache.updateFromRawJSON(rawJSON);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Failed to Load Cache: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
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
        ResponseStatus responseStatus = client.subscribeUpdateEvent((updateEvent) -> {
            cache.put(updateEvent.getKey(), updateEvent.getValue());
            dropdownViewer.updateNode(updateEvent.getKey(), updateEvent.getValue());
        }).complete();
        if (responseStatus.equals(ResponseStatus.OK)) System.out.println("Cache is now subscribed for updates.");
        return responseStatus.equals(ResponseStatus.OK);
    }
    public void setStatus(String status) {
        setTitle(String.format("XDASH - XTABLES - %1$s", status));
    }
    public void init() {
        dropdownViewer = new XTablesDropdownViewer(this, client, cache);

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


         reloadButton = new JButton("Reload Data");
        reloadButton.addActionListener(e -> {
            reloadButton.setEnabled(false);
            client.getRawJSON().queue((value) -> {
                reloadButton.setEnabled(true);
                cache.updateFromRawJSON(value);
                dropdownViewer.populateTable();
            }, (ec) -> {
                reloadButton.setEnabled(true);
                JOptionPane.showMessageDialog(null, "Failed to reload Cache: " + ec.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            });


        });
         addButton = new JButton("Add Data");
        addButton.addActionListener(e -> {
            JPanel inputPanel = new JPanel(new BorderLayout(10, 10));

            // Key input field
            JPanel keyPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
            keyPanel.add(new JLabel("Key:"));
            JTextField keyField = new JTextField(20);
            keyPanel.add(keyField);
            inputPanel.add(keyPanel, BorderLayout.NORTH);

            // RSyntaxTextArea for JSON input
            RSyntaxTextArea valueArea = new RSyntaxTextArea(10, 40);
            valueArea.setSyntaxEditingStyle(SyntaxConstants.SYNTAX_STYLE_JSON);
            valueArea.setCodeFoldingEnabled(true); // Enable code folding for JSON
            valueArea.setLineWrap(true);
            theme.apply(valueArea);
            // Wrap RSyntaxTextArea in an RTextScrollPane
            RTextScrollPane scrollPane = new RTextScrollPane(valueArea);
            scrollPane.setFoldIndicatorEnabled(true);
            inputPanel.add(scrollPane, BorderLayout.CENTER);

            // Show the dialog
            int result = JOptionPane.showConfirmDialog(
                    this,
                    inputPanel,
                    "Enter Key and JSON Value",
                    JOptionPane.OK_CANCEL_OPTION,
                    JOptionPane.PLAIN_MESSAGE
            );

            // Handle the user's input
            if (result == JOptionPane.OK_OPTION) {
                String key = keyField.getText();
                String value = valueArea.getText().replace("\n", "");
                if (!key.isEmpty() && Utilities.validateKey(key, false)) {
                    try {
                        client.putRaw(key, value).queue((status1) -> {
                            if (status1 != ResponseStatus.OK) {
                                JOptionPane.showMessageDialog(null, "NON-OK Status returned: " + status1.name(), "Error", JOptionPane.ERROR_MESSAGE);
                            }
                        });


                    } catch (Exception ei) {
                        JOptionPane.showMessageDialog(null, "Exception while updating value: " + ei.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
                    }
                } else {
                    JOptionPane.showMessageDialog(null, "This key is invalid.", "Error", JOptionPane.ERROR_MESSAGE);

                }
            }



        });
         rebootButton = new JButton("Reboot");
        rebootButton.addActionListener(e -> {
            rebootButton.setEnabled(false);
            client.rebootServer().queue((value) -> {
                rebootButton.setEnabled(true);
                JOptionPane.showMessageDialog(null, "The server is now rebooting. Please wait.", "Server Rebooting!", JOptionPane.INFORMATION_MESSAGE);
            }, (ec) -> {
                rebootButton.setEnabled(true);
                JOptionPane.showMessageDialog(null, "Failed to reboot server: " + ec.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            });
        });
        JPanel panel = new JPanel();
        panel.add(reloadButton);
        panel.add(addButton);
        panel.add(rebootButton);
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
        this.add(dropdownViewer, BorderLayout.CENTER);
        setJMenuBar(menuBar);

        revalidate();
        repaint();

        setVisible(true);
    }








}

