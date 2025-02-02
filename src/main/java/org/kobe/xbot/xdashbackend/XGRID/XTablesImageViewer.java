package org.kobe.xbot.xdashbackend.XGRID;

import com.formdev.flatlaf.themes.FlatMacDarkLaf;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class XTablesImageViewer extends JFrame {
    private static final XDashLogger logger = XDashLogger.getLogger();
    private final JLabel imageLabel;
    private final JScrollPane scrollPane;
    private final JPanel toolPanel;
    private final JButton closeButton, lockScrollButton;
    private boolean isScrollLocked = true;

    public static final Map<String, XTablesImageViewer> imageWindows = new ConcurrentHashMap<>();
    private final String key;

    public XTablesImageViewer(String key) {
        this.key = key;
        setTitle("XDASH - IMAGE VIEWER - " + key);
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
            Image icon = ImageIO.read(getClass().getResource("/icon.png"));
            setIconImage(icon);
        } catch (IOException | NullPointerException e) {
            System.err.println("Icon image not found.");
        }

        imageLabel = new JLabel(new ImageIcon());
        scrollPane = new JScrollPane(imageLabel);

        toolPanel = new JPanel();
        toolPanel.setLayout(new FlowLayout(FlowLayout.CENTER));

        closeButton = new JButton("Close");
        closeButton.addActionListener(e -> dispose());

        lockScrollButton = new JButton("Unlock Scroll");
        lockScrollButton.addActionListener(e -> toggleScrollLock());

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

    public static void openImageWindow(String key) {
        SwingUtilities.invokeLater(() -> {
            imageWindows.computeIfAbsent(key, XTablesImageViewer::new);
        });
    }

    public static void setFrameForKey(String key, byte[] bytes) {
        XTablesImageViewer window = imageWindows.get(key);
        if (window != null) {
            SwingUtilities.invokeLater(() -> {
                window.setFrame(bytes);
            });
        }
    }

    public void setFrame(byte[] bytes) {
        try {
            ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
            BufferedImage image = ImageIO.read(bais);
            if (image != null) {
                imageLabel.setIcon(new ImageIcon(image));
                if (isScrollLocked) {
                    scrollPane.getVerticalScrollBar().setValue(scrollPane.getVerticalScrollBar().getMaximum());
                }
            }
        } catch (IOException e) {
            logger.severe("Failed to load image: " + e.getMessage());
        }
    }

    @Override
    public void dispose() {
        logger.info("Disposing XTablesImageViewer");
        imageWindows.remove(this.key);
        super.dispose();
    }
}
