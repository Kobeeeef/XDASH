package org.kobe.xbot.xdashbackend.XGRID;

import edu.wpi.first.math.geometry.Pose2d;
import edu.wpi.first.math.geometry.Rotation2d;

import javax.imageio.ImageIO;
import javax.sound.sampled.*;
import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionAdapter;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

public class FieldPanel extends JPanel {
    private static final Map<String, byte[]> soundDataMap = new HashMap<>();

    // Current robot pose
    private Pose2d robotPose = new Pose2d(0, 0, new Rotation2d());

    // Enemy robots and their associated probabilities
    private final Map<Pose2d, Double> enemyRobots = new HashMap<>();

    // Callback function when an enemy robot is clicked
    private Consumer<Pose2d> enemyClickCallback;

    // Field and robot images
    private BufferedImage fieldImage;
    private BufferedImage robotImage;

    // Field dimensions in meters
    private final double fieldWidthMeters = 16.54;
    private final double fieldHeightMeters = 8.02;

    public FieldPanel() {
        preloadSounds();
        // Load images from resources
        fieldImage = loadImage("/2025field.png");
        robotImage = loadImage("/icon.png"); // Main robot image

        // Add mouse listener for clicking on enemy robots
        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                Pose2d clickedPose = getClickedEnemyPose(e.getX(), e.getY());
                if (clickedPose != null && enemyClickCallback != null) {
                    playDing();
                    enemyClickCallback.accept(clickedPose);
                }
            }
        });
        addMouseMotionListener(new MouseMotionAdapter() {
            @Override
            public void mouseMoved(MouseEvent e) {
                Pose2d hoveredPose = getClickedEnemyPose(e.getX(), e.getY());
                if (hoveredPose != null) {
                    double probability = enemyRobots.get(hoveredPose);
                    setToolTipText("Enemy Robot: " + (int) (probability * 100) + "%\nClick to go.");
                } else {
                    setToolTipText(null); // Remove tooltip when not hovering over any robot
                }
            }
        });
    }

    // Utility method to load images from resources
    private BufferedImage loadImage(String path) {
        try (InputStream is = getClass().getResourceAsStream(path)) {
            if (is != null) {
                return ImageIO.read(is);
            } else {
                System.err.println("Image not found: " + path);
                return null;
            }
        } catch (IOException ex) {
            System.err.println("Error loading image " + path + ": " + ex.getMessage());
            return null;
        }
    }

    // Update the main robot's pose
    public void setRobotPose(Pose2d pose) {
        this.robotPose = pose;
        repaint();
    }

    // Set enemy robots with associated probabilities
    public void setEnemyRobots(Map<Pose2d, Double> enemies) {
        this.enemyRobots.clear();
        this.enemyRobots.putAll(enemies);
        repaint();
    }

    // Set a callback function when an enemy robot is clicked
    public void setEnemyClickCallback(Consumer<Pose2d> callback) {
        this.enemyClickCallback = callback;
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;

        // Draw the field background
        if (fieldImage != null) {
            g2d.drawImage(fieldImage, 0, 0, getWidth(), getHeight(), null);
        } else {
            g2d.setColor(new Color(0, 128, 0));
            g2d.fillRect(0, 0, getWidth(), getHeight());
        }

        // Scaling factors: pixels per meter
        double scaleX = getWidth() / fieldWidthMeters;
        double scaleY = getHeight() / fieldHeightMeters;

        // Draw the main robot
        drawRobot(g2d, robotPose, robotImage, scaleX, scaleY);

        // Draw enemy robots
        for (Map.Entry<Pose2d, Double> entry : enemyRobots.entrySet()) {
            drawEnemyRobot(g2d, entry.getKey(), entry.getValue(), scaleX, scaleY);
        }
    }

    // Method to draw the main robot using an image
    private void drawRobot(Graphics2D g2d, Pose2d pose, BufferedImage image, double scaleX, double scaleY) {
        if (image == null) return;

        double robotX = pose.getX() * scaleX;
        double robotY = getHeight() - (pose.getY() * scaleY); // Invert Y-axis

        // Clamp values to prevent drawing outside the panel
        robotX = Math.max(0, Math.min(getWidth(), robotX));
        robotY = Math.max(0, Math.min(getHeight(), robotY));

        int robotSize = 40; // Adjust as needed

        AffineTransform oldTransform = g2d.getTransform();

        // Move to robot position
        g2d.translate(robotX, robotY);
        g2d.rotate(-pose.getRotation().getRadians());

        // Draw the robot image centered on its position
        g2d.drawImage(image, -robotSize / 2, -robotSize / 2, robotSize, robotSize, null);

        g2d.setTransform(oldTransform); // Restore transform
    }

    // Method to draw an enemy robot as a red outlined square with probability inside
    private void drawEnemyRobot(Graphics2D g2d, Pose2d pose, double probability, double scaleX, double scaleY) {
        double enemyX = pose.getX() * scaleX;
        double enemyY = getHeight() - (pose.getY() * scaleY); // Invert Y-axis

        // Clamp values to prevent drawing outside the panel
        enemyX = Math.max(0, Math.min(getWidth(), enemyX));
        enemyY = Math.max(0, Math.min(getHeight(), enemyY));

        int enemySize = 40; // Adjust size if needed

        AffineTransform oldTransform = g2d.getTransform();

        // Move to enemy position
        g2d.translate(enemyX, enemyY);
        g2d.rotate(-pose.getRotation().getRadians());

        // Draw a red outlined square (no fill)
        g2d.setColor(Color.RED);
        g2d.setStroke(new BasicStroke(3)); // Adjust thickness
        g2d.drawRect(-enemySize / 2, -enemySize / 2, enemySize, enemySize);

        // Draw probability inside the square
        g2d.setColor(Color.WHITE);
        g2d.setFont(new Font("Arial", Font.BOLD, 14));
        String probabilityText = String.format("%.0f%%", probability * 100);
        FontMetrics fm = g2d.getFontMetrics();
        int textWidth = fm.stringWidth(probabilityText);
        int textHeight = fm.getAscent();
        g2d.drawString(probabilityText, -textWidth / 2, textHeight / 4);

        g2d.setTransform(oldTransform); // Restore transform

        // Set tooltip for hovering

        setToolTipText("Enemy Robot: " + probabilityText);
    }

    // Detect if a click is near an enemy robot
    private Pose2d getClickedEnemyPose(int clickX, int clickY) {
        double scaleX = getWidth() / fieldWidthMeters;
        double scaleY = getHeight() / fieldHeightMeters;
        int enemySize = 40; // Same as in drawing

        for (Pose2d pose : enemyRobots.keySet()) {
            double enemyX = pose.getX() * scaleX;
            double enemyY = getHeight() - (pose.getY() * scaleY);
            if (Math.abs(clickX - enemyX) <= enemySize / 2 && Math.abs(clickY - enemyY) <= enemySize / 2) {
                return pose;
            }
        }
        return null;
    }

    // ✅ Preload sounds into memory as byte arrays
    public static void preloadSounds() {
        loadSound("ding", "/audio/ding.wav");
        loadSound("error", "/audio/error.wav");
        loadSound("fatal", "/audio/fatal.wav");
        loadSound("success", "/audio/success.wav");
    }

    // ✅ Load sounds as byte arrays (prevents stream closure issues)
    private static void loadSound(String key, String resourcePath) {
        try (InputStream inputStream = FieldPanel.class.getResourceAsStream(resourcePath)) {
            if (inputStream == null) {
                System.err.println("Sound file not found: " + resourcePath);
                return;
            }
            byte[] soundBytes = inputStream.readAllBytes(); // Read sound into memory
            soundDataMap.put(key, soundBytes);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    // ✅ Play a sound (fresh instance every time)
    private static void playSound(String key) {
        try {
            if (!soundDataMap.containsKey(key)) {
                System.err.println("Sound not preloaded: " + key);
                return;
            }

            // Convert byte array back into an AudioInputStream
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(soundDataMap.get(key));
            AudioInputStream audioStream = AudioSystem.getAudioInputStream(byteArrayInputStream);

            // Create and play a new Clip every time
            Clip clip = AudioSystem.getClip();
            clip.open(audioStream);
            clip.start();

            // Close the clip when done
            clip.addLineListener(event -> {
                if (event.getType() == LineEvent.Type.STOP) {
                    clip.close();
                }
            });

        } catch (IOException | LineUnavailableException | UnsupportedAudioFileException ex) {
            ex.printStackTrace();
        }
    }

    // ✅ Play methods for each preloaded sound
    public static void playDing() {
        playSound("ding");
    }

    public static void playError() {
        playSound("error");
    }

    public static void playFatal() {
        playSound("fatal");
    }

    public static void playSuccess() {
        playSound("success");
    }
}
