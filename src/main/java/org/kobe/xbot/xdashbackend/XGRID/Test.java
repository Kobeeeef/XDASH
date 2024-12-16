package org.kobe.xbot.xdashbackend.XGRID;


import com.formdev.flatlaf.fonts.inter.FlatInterFont;
import com.formdev.flatlaf.fonts.jetbrains_mono.FlatJetBrainsMonoFont;
import com.formdev.flatlaf.themes.FlatMacDarkLaf;
import com.formdev.flatlaf.themes.FlatMacLightLaf;
import org.kobe.xbot.Client.XTablesClient;
import org.kobe.xbot.Utilities.ResponseStatus;
import org.kobe.xbot.Utilities.XTablesData;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.io.IOException;
import java.util.Objects;

public class Test extends JFrame {
    private static final XDashLogger logger = XDashLogger.getLogger();
    public XTablesDropdownViewer dropdownViewer;
    public JPanel toolPanel;
    public String currentFileParentPath;
    public JMenuBar menuBar;
    public JMenu settingsMenu, themeItem;
    public JMenuItem darkThemeItem, lightThemeItem,
            exitItem;
    private final XTablesData cache;
    private final XTablesClient client;
    private Thread cacheThread;
    public Test(XTablesClient client) {
        this.client = client;
        this.cache = new XTablesData();
        setSize(900, 800);
        setTitle("XDASH - XTABLES VIEWER");
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
        setStatus("INITIALIZING");
        init();
        addComponent();
        cacheThread = new Thread(this::enableCache);
        cacheThread.setDaemon(true);
        cacheThread.start();
    }

    public void setStatus(String status) {
        setTitle(String.format("XDASH - XTABLES VIEWER - %1$s", status));
    }

    private void loadCache() {
        try {
            String rawJSON = client.getRawJSON().complete();
            cache.updateFromRawJSON(rawJSON);
            setStatus("LOADED");
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
    }

    private JPanel createControlPanel() {


        JButton reloadButton = new JButton("Reload Data");
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

        JPanel panel = new JPanel();
        panel.add(reloadButton);
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







    public static void main(String[] args) {
        XTablesClient client1 = new XTablesClient("localhost", 1735);
        FlatMacDarkLaf.setup();
        FlatJetBrainsMonoFont.install();
        FlatInterFont.install();
        UIManager.put("defaultFont", new Font(FlatInterFont.FAMILY, Font.PLAIN, 13));
        SwingUtilities.invokeLater(() -> {
            try {

                new Test(client1).showViewer();
            } catch (Exception e) {
                logger.severe("Failed to open xtables viewer: " + e.getMessage());
                JOptionPane.showMessageDialog(null, "Failed to open xtables viewer: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        });
    }
}

