package org.kobe.xbot.xdashbackend.XGRID;

import com.formdev.flatlaf.themes.FlatMacDarkLaf;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class XDashViewer extends JFrame {
    private static final XDashLogger logger = XDashLogger.getLogger();
    private final JLabel imageLabel;
    private final JLabel timestampLabel;  // Label for timestamp
    private final JScrollPane scrollPane;
    private boolean isScrollLocked = true;

    public static final Map<String, XDashViewer> imageWindows = new ConcurrentHashMap<>();
    private final String key;

    public XDashViewer(String key) {
        this.key = key;
        setTitle("XDASH - DEBUG STREAM - " + key);
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

        // Create timestamp panel (Compact at the top)
        JPanel timestampPanel = new JPanel();
        timestampPanel.setLayout(new FlowLayout(FlowLayout.CENTER));
        timestampPanel.setBackground(Color.BLACK);
        timestampPanel.setPreferredSize(new Dimension(getWidth(), 30));  // Fixed small height

        timestampLabel = new JLabel("Image Time: -- | Display Time: -- | Offset: -- ms");
        timestampLabel.setFont(new Font("Arial", Font.BOLD, 12));
        timestampLabel.setForeground(Color.WHITE);
        timestampPanel.add(timestampLabel);

        // Image display
        imageLabel = new JLabel(new ImageIcon());
        scrollPane = new JScrollPane(imageLabel);
        scrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED);
        scrollPane.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);

        // Add components
        add(timestampPanel, BorderLayout.NORTH);  // Minimal top section
        add(scrollPane, BorderLayout.CENTER);     // Image takes remaining space

        setVisible(true);
    }

    public static void openImageWindow(String key) {
        SwingUtilities.invokeLater(() -> {
            imageWindows.computeIfAbsent(key, XDashViewer::new);
        });
    }

    public static void setFrameForKey(String key, byte[] bytes, double timestamp) {
        XDashViewer window = imageWindows.get(key);
        if (window != null) {
            SwingUtilities.invokeLater(() -> {
                window.setFrame(bytes, timestamp);
            });
        }
    }

    public static void setFrameForKeyOrOpenIfNotExists(String key, double timestamp, byte[] bytes) {
        XDashViewer window = imageWindows.get(key);
        if (window != null) {
            SwingUtilities.invokeLater(() -> {
                window.setFrame(bytes, timestamp);
            });
        } else {
            openImageWindow(key);
        }
    }

    public void setFrame(byte[] bytes, double timestamp) {
        try {
            ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
            BufferedImage image = ImageIO.read(bais);
            if (image != null) {
                imageLabel.setIcon(new ImageIcon(image));
                if (isScrollLocked) {
                    scrollPane.getVerticalScrollBar().setValue(scrollPane.getVerticalScrollBar().getMaximum());
                }

                // Get the current system time
                double currentTimestamp = System.currentTimeMillis() / 1000.0;
                double offsetMs = (currentTimestamp - timestamp) * 1000; // Offset in milliseconds

                // Format timestamps
                DecimalFormat df = new DecimalFormat("#0.000");
                String formattedTimestamp = df.format(timestamp);
                String formattedCurrentTime = df.format(currentTimestamp);
                String formattedOffset = df.format(offsetMs);

                // Update timestamp label
                timestampLabel.setText("Image Time: " + formattedTimestamp +
                        " | Display Time: " + formattedCurrentTime +
                        " | Offset: " + formattedOffset + " ms");
            }
        } catch (IOException e) {
            logger.severe("Failed to load image: " + e.getMessage());
        }
    }

    @Override
    public void dispose() {
        logger.info("Disposing XDashViewer");
        imageWindows.remove(this.key);
        super.dispose();
    }
}
