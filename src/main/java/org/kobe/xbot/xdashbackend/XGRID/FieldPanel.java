package org.kobe.xbot.xdashbackend.XGRID;

import edu.wpi.first.math.geometry.Pose2d;
import edu.wpi.first.math.geometry.Rotation2d;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionAdapter;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

public class FieldPanel extends JPanel {
    private static final int MAX_ROBOT_SIZE = 65;

    // Robot pose
    private Pose2d robotPose = new Pose2d(0, 0, new Rotation2d());
    private final Map<Pose2d, Double> enemyRobots = new HashMap<>();

    private Consumer<Pose2d> enemyClickCallback;
    private BufferedImage fieldImage;
    private BufferedImage robotImage;

    // Field dimensions in meters
    private final double fieldWidthMeters = 16.54;
    private final double fieldHeightMeters = 8.02;

    // Field image boundaries (from config.json)
    private final int fieldPixelX1 = 421;   // Left boundary
    private final int fieldPixelY1 = 1437;  // Bottom boundary (flipped from top-left)
    private final int fieldPixelX2 = 3352;  // Right boundary
    private final int fieldPixelY2 = 91;    // Top boundary (flipped from config)

    public FieldPanel() {
        fieldImage = loadImage("/2025field.png");
        robotImage = loadImage("/icon.png");

        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                Pose2d clickedPose = getClickedEnemyPose(e.getX(), e.getY());
                if (clickedPose != null && enemyClickCallback != null) {
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
                    setToolTipText(null);
                }
            }
        });
    }

    private BufferedImage loadImage(String path) {
        try (InputStream is = getClass().getResourceAsStream(path)) {
            return is != null ? ImageIO.read(is) : null;
        } catch (IOException ex) {
            return null;
        }
    }

    public void setRobotPose(Pose2d pose) {
        this.robotPose = pose;
        repaint();
    }

    public void setEnemyRobots(Map<Pose2d, Double> enemies) {
        this.enemyRobots.clear();
        this.enemyRobots.putAll(enemies);
        repaint();
    }

    public void setEnemyClickCallback(Consumer<Pose2d> callback) {
        this.enemyClickCallback = callback;
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;

        if (fieldImage != null) {
            int panelWidth = getWidth();
            int panelHeight = getHeight();

            // Compute valid field image size
            int fieldImageWidth = fieldPixelX2 - fieldPixelX1;
            int fieldImageHeight = fieldPixelY1 - fieldPixelY2;

            // Maintain aspect ratio when scaling
            double scaleX = (double) panelWidth / fieldImage.getWidth();
            double scaleY = (double) panelHeight / fieldImage.getHeight();
            double scaleFactor = Math.min(scaleX, scaleY);

            // Compute new field image size
            int newFieldWidth = (int) (fieldImage.getWidth() * scaleFactor);
            int newFieldHeight = (int) (fieldImage.getHeight() * scaleFactor);

            // Center the image
            int xOffset = (panelWidth - newFieldWidth) / 2;
            int yOffset = (panelHeight - newFieldHeight) / 2;


            // Draw scaled field image
            g2d.drawImage(fieldImage, xOffset, yOffset, newFieldWidth, newFieldHeight, null);
            // Compute scale factors for meters-to-pixels transformation

            double fieldScaleX = ((double) fieldImageWidth * scaleFactor) / fieldWidthMeters;

            double fieldScaleY = ((double) fieldImageHeight * scaleFactor) / fieldHeightMeters;


            int scaledRobotSize = (int) Math.max(10, Math.min(MAX_ROBOT_SIZE, fieldImageWidth * 0.05));

            drawRobot(g2d, robotPose, robotImage, fieldScaleX, fieldScaleY, scaledRobotSize, xOffset, yOffset, scaleFactor);

//            for (Map.Entry<Pose2d, Double> entry : enemyRobots.entrySet()) {
//                drawEnemyRobot(g2d, entry.getKey(), entry.getValue(), fieldScaleX, fieldScaleY, scaledRobotSize, xOffset, yOffset);
//            }
        }
    }


    private void drawRobot(Graphics2D g2d, Pose2d pose, BufferedImage image, double scaleX, double scaleY, int robotSize, int xOffset, int yOffset, double scaleFactor) {
        if (image == null) return;

        System.out.println(scaleX);
        System.out.println(scaleY);
        // Compute displayed boundaries of the field
        int leftBound   = xOffset + (int)(fieldPixelX1 * scaleFactor);
        int rightBound  = xOffset + (int)(fieldPixelX2 * scaleFactor);
        int topBound    = yOffset + (int)(fieldPixelY2 * scaleFactor);
        int bottomBound = yOffset + (int)(fieldPixelY1 * scaleFactor);

        double displayFieldWidth  = rightBound - leftBound;
        double displayFieldHeight = bottomBound - topBound;
        double pixelsPerMeterX = displayFieldWidth / fieldWidthMeters;
        double pixelsPerMeterY = displayFieldHeight / fieldHeightMeters;


        double computedX = leftBound + (pose.getX() * pixelsPerMeterX);
        double computedY = bottomBound - (pose.getY() * pixelsPerMeterY);

        double robotX = Math.max(leftBound, Math.min(rightBound, computedX));
        double robotY = Math.max(topBound,   Math.min(bottomBound, computedY));


        AffineTransform oldTransform = g2d.getTransform();
        g2d.translate(robotX, robotY);
        g2d.rotate(-pose.getRotation().getRadians());

        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.8f));
        g2d.drawImage(image, -robotSize / 2, -robotSize / 2, robotSize, robotSize, null);
        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1.0f));

        g2d.setColor(Color.RED);
        g2d.setStroke(new BasicStroke(4));
        g2d.drawRoundRect(-robotSize / 2, -robotSize / 2, robotSize, robotSize, 13, 13);

        g2d.setTransform(oldTransform);
    }

    private void drawEnemyRobot(Graphics2D g2d, Pose2d pose, double probability, double scaleX, double scaleY,
                                int enemySize, int xOffset, int yOffset) {
        double enemyX = xOffset + 100 + (pose.getX());
        double enemyY = yOffset + 100 + (pose.getY()); // CORRECTED Y FLIP

        System.out.println(pose.getX());
        System.out.println(pose.getY());

//        enemyX = xOffset + ((enemyX - fieldPixelX1) * ((double) getWidth() / (fieldPixelX2 - fieldPixelX1)));
//        enemyY = yOffset + ((enemyY - fieldPixelY2) * ((double) getHeight() / (fieldPixelY1 - fieldPixelY2)));

        AffineTransform oldTransform = g2d.getTransform();
        g2d.translate(enemyX, enemyY);
        g2d.rotate(-pose.getRotation().getRadians());

        // Draw red rounded rectangle (enemy indicator)
        g2d.setColor(Color.RED);
        g2d.setStroke(new BasicStroke(3));
        g2d.drawRoundRect(-enemySize / 2, -enemySize / 2, enemySize, enemySize, 20, 20);

        // Draw probability inside the box
        g2d.setColor(Color.WHITE);
        g2d.setFont(new Font("Arial", Font.BOLD, 14));
        String probabilityText = String.format("%.0f%%", probability * 100);
        FontMetrics fm = g2d.getFontMetrics();
        int textWidth = fm.stringWidth(probabilityText);
        int textHeight = fm.getAscent();
        g2d.drawString(probabilityText, -textWidth / 2, textHeight / 4);

        // Restore transformation
        g2d.setTransform(oldTransform);
    }

    private Pose2d getClickedEnemyPose(int clickX, int clickY) {
        // Compute scale factors for meters to pixels
        double fieldScaleX = (double) (fieldPixelX2 - fieldPixelX1) / fieldWidthMeters;
        double fieldScaleY = (double) (fieldPixelY1 - fieldPixelY2) / fieldHeightMeters;

        double fieldX = (clickX - fieldPixelX1) / fieldScaleX;
        double fieldY = (fieldPixelY1 - clickY) / fieldScaleY;
        for (Pose2d pose : enemyRobots.keySet()) {
            if (Math.abs(fieldX - pose.getX()) <= 0.3 && Math.abs(fieldY - pose.getY()) <= 0.3) {
                return pose;
            }
        }
        return null;
    }
}
