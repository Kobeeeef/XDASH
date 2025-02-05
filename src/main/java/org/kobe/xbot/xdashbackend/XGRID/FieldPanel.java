package org.kobe.xbot.xdashbackend.XGRID;

import edu.wpi.first.math.geometry.Pose2d;
import edu.wpi.first.math.geometry.Rotation2d;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.List;
import java.util.function.Consumer;

public class FieldPanel extends JPanel {
    private static final int MAX_ROBOT_SIZE = 65;

    // Robot pose
    private Pose2d robotPose = new Pose2d(0, 0, new Rotation2d());
    private final Map<Pose2d, Double> enemyRobots = new HashMap<>();
    private final Map<Pose2d, Double> notes = new HashMap<>();

    private Consumer< Map.Entry<Pose2d, Double>> clickCallback;

    private BufferedImage fieldImage;
    private BufferedImage robotImage;

    // Field dimensions in meters
    private final double fieldWidthMeters = 17.55;
    private final double fieldHeightMeters = 8.05;
    private final List<Pose2d> waypoints = new ArrayList<>();
    // Field image boundaries (from config.json)
    private final int fieldPixelX1 = 421;   // Left boundary
    private final int fieldPixelY1 = 1437;  // Bottom boundary (flipped from top-left)
    private final int fieldPixelX2 = 3352;  // Right boundary
    private final int fieldPixelY2 = 91;    // Top boundary (flipped from config)

    public FieldPanel() {
        fieldImage = loadImage("/2025field.png");
        robotImage = loadImage("/icon.png");
        ToolTipManager.sharedInstance().setInitialDelay(0);





        addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent e) {
                Map.Entry<Pose2d, Double> clickedEnemy = getClickedEnemyPose(e.getX(), e.getY());
                Map.Entry<Pose2d, Double> clickedNote = getClickedNote(e.getX(), e.getY());

                if (clickedEnemy != null && clickCallback != null) {
                    clickCallback.accept(clickedEnemy);
                } else if (clickedNote != null && clickCallback != null) {
                    clickCallback.accept(clickedNote);
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
    public void setWaypoints(List<Pose2d> newWaypoints) {
        this.waypoints.clear();
        if (newWaypoints != null) {
            this.waypoints.addAll(newWaypoints);
        }
        repaint();
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

    public void setNotes(Map<Pose2d, Double> enemies) {
        this.notes.clear();
        this.notes.putAll(enemies);
        repaint();
    }

    public void setClickCallback(Consumer< Map.Entry<Pose2d, Double>> callback) {
        this.clickCallback = callback;
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

            for (Map.Entry<Pose2d, Double> entry : enemyRobots.entrySet()) {
                drawOtherRobot(g2d, entry.getKey(), entry.getValue(), fieldScaleX, fieldScaleY, scaledRobotSize, xOffset, yOffset, scaleFactor);
            }
            for (Map.Entry<Pose2d, Double> entry : notes.entrySet()) {
                drawNote(g2d, entry.getKey(), entry.getValue(), fieldScaleX, fieldScaleY, (int) (scaledRobotSize / 1.3), xOffset, yOffset, scaleFactor);
            }
            int scaledWaypointSize = (int) Math.max(8, Math.min(15, fieldImageWidth * 0.03));
            for (int i = 0; i < waypoints.size(); i++) {
                drawWaypoint(g2d, waypoints.get(i), i, fieldScaleX, fieldScaleY, scaledWaypointSize, xOffset, yOffset, scaleFactor);
            }
        }
    }
    private void drawWaypoint(Graphics2D g2d, Pose2d pose, int index, double scaleX, double scaleY, int waypointSize, int xOffset, int yOffset, double scaleFactor) {
        // Compute the displayed boundaries of the field
        int leftBound   = xOffset + (int)(fieldPixelX1 * scaleFactor);
        int rightBound  = xOffset + (int)(fieldPixelX2 * scaleFactor);
        int topBound    = yOffset + (int)(fieldPixelY2 * scaleFactor);
        int bottomBound = yOffset + (int)(fieldPixelY1 * scaleFactor);

        double displayFieldWidth  = rightBound - leftBound;
        double displayFieldHeight = bottomBound - topBound;
        double pixelsPerMeterX = displayFieldWidth / fieldWidthMeters;
        double pixelsPerMeterY = displayFieldHeight / fieldHeightMeters;

        // Convert field (meter) coordinates to pixel coordinates
        double computedX = leftBound + (pose.getX() * pixelsPerMeterX);
        double computedY = bottomBound - (pose.getY() * pixelsPerMeterY);

        // Clamp the waypoint position within the field
        double waypointX = Math.max(leftBound, Math.min(rightBound, computedX));
        double waypointY = Math.max(topBound,   Math.min(bottomBound, computedY));

        AffineTransform oldTransform = g2d.getTransform();
        g2d.translate(waypointX, waypointY);

        // Draw a filled circle (dot) for the waypoint
        g2d.setColor(Color.GREEN);
        g2d.setStroke(new BasicStroke(3));
        g2d.drawOval(-waypointSize / 2, (-waypointSize / 2) -1, waypointSize, waypointSize);

        // Draw the index number (starting at 1) over the dot
        g2d.setColor(Color.BLACK);
        g2d.setFont(new Font("Arial", Font.BOLD, 14));
        String label = String.valueOf(index + 1);
        FontMetrics fm = g2d.getFontMetrics();
        int textWidth = fm.stringWidth(label);
        int textHeight = fm.getAscent();
        g2d.drawString(label, -textWidth / 2, textHeight / 4);
        g2d.setTransform(oldTransform);
    }

    private void drawRobot(Graphics2D g2d, Pose2d pose, BufferedImage image, double scaleX, double scaleY, int robotSize, int xOffset, int yOffset, double scaleFactor) {
        if (image == null) return;

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
    private void drawOtherRobot(Graphics2D g2d, Pose2d pose, double probability, double scaleX, double scaleY, int robotSize, int xOffset, int yOffset, double scaleFactor) {
        if (probability <= 0) return;

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

//        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.8f));
//        g2d.drawImage(image, -robotSize / 2, -robotSize / 2, robotSize, robotSize, null);
//        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1.0f));

        g2d.setColor(Color.RED);
        g2d.setStroke(new BasicStroke(4));
        g2d.drawRoundRect(-robotSize / 2, -robotSize / 2, robotSize, robotSize, 20, 20);
        g2d.setColor(Color.WHITE);
        g2d.setFont(new Font("Arial", Font.BOLD, 14));
        String probabilityText = String.format("%.0f%%", probability * 100);
        FontMetrics fm = g2d.getFontMetrics();
        int textWidth = fm.stringWidth(probabilityText);
        int textHeight = fm.getAscent();
        g2d.drawString(probabilityText, -textWidth / 2, textHeight / 4);
        g2d.setTransform(oldTransform);
    }
    private void drawNote(Graphics2D g2d, Pose2d pose, double probability, double scaleX, double scaleY, int noteSize, int xOffset, int yOffset, double scaleFactor) {
        // Only draw the note if probability > 0
        if (probability <= 0) return;

        // Compute the displayed boundaries of the field as before
        int leftBound   = xOffset + (int)(fieldPixelX1 * scaleFactor);
        int rightBound  = xOffset + (int)(fieldPixelX2 * scaleFactor);
        int topBound    = yOffset + (int)(fieldPixelY2 * scaleFactor);
        int bottomBound = yOffset + (int)(fieldPixelY1 * scaleFactor);

        double displayFieldWidth  = rightBound - leftBound;
        double displayFieldHeight = bottomBound - topBound;
        double pixelsPerMeterX = displayFieldWidth / fieldWidthMeters;
        double pixelsPerMeterY = displayFieldHeight / fieldHeightMeters;

        // Convert field (meter) coordinates to pixel coordinates
        double computedX = leftBound + (pose.getX() * pixelsPerMeterX);
        double computedY = bottomBound - (pose.getY() * pixelsPerMeterY);

        // Clamp the note position so it stays within the field boundaries
        double noteX = Math.max(leftBound, Math.min(rightBound, computedX));
        double noteY = Math.max(topBound,   Math.min(bottomBound, computedY));

        // Save the original transform and translate to the note position.
        AffineTransform oldTransform = g2d.getTransform();
        g2d.translate(noteX, noteY);
        // No need to rotate a circle.

        // Draw the note: a filled orange circle.


        // Optionally, draw a thin outline around the note.
        g2d.setColor(Color.getHSBColor(30f / 360f, 1.0f, 1.0f));
        g2d.setStroke(new BasicStroke(6));
        g2d.drawOval(-noteSize / 2, -noteSize / 2, noteSize, noteSize);
        g2d.setColor(Color.WHITE);
        g2d.setFont(new Font("Arial", Font.BOLD, 12));
        String probabilityText = String.format("%.0f%%", probability * 100);
        FontMetrics fm = g2d.getFontMetrics();
        int textWidth = fm.stringWidth(probabilityText);
        int textHeight = fm.getAscent();
        g2d.drawString(probabilityText, -textWidth / 2, textHeight / 4);
        // Restore the original transform.
        g2d.setTransform(oldTransform);
    }


    private Map.Entry<Pose2d, Double> getClickedEnemyPose(int clickX, int clickY) {
        // Get panel dimensions and compute the same scaling and offsets as in paintComponent
        int panelWidth = getWidth();
        int panelHeight = getHeight();

        double scaleXFull = (double) panelWidth / fieldImage.getWidth();
        double scaleYFull = (double) panelHeight / fieldImage.getHeight();
        double scaleFactor = Math.min(scaleXFull, scaleYFull);

        int newFieldWidth = (int) (fieldImage.getWidth() * scaleFactor);
        int newFieldHeight = (int) (fieldImage.getHeight() * scaleFactor);
        int xOffset = (panelWidth - newFieldWidth) / 2;
        int yOffset = (panelHeight - newFieldHeight) / 2;

        // Compute the displayed boundaries of the actual field using config limits
        int leftBound   = xOffset + (int)(fieldPixelX1 * scaleFactor);
        int rightBound  = xOffset + (int)(fieldPixelX2 * scaleFactor);
        int topBound    = yOffset + (int)(fieldPixelY2 * scaleFactor);
        int bottomBound = yOffset + (int)(fieldPixelY1 * scaleFactor);

        // (Optional) If the click is outside the field area, skip checking enemy robots.
        if (clickX < leftBound || clickX > rightBound || clickY < topBound || clickY > bottomBound) {
            return null;
        }

        // Calculate the displayed field dimensions and pixel-to-meter scale
        double displayFieldWidth  = rightBound - leftBound;
        double displayFieldHeight = bottomBound - topBound;
        double pixelsPerMeterX = displayFieldWidth / fieldWidthMeters;
        double pixelsPerMeterY = displayFieldHeight / fieldHeightMeters;

        // Compute the robot size exactly as in paintComponent:
        int fieldImageWidth = fieldPixelX2 - fieldPixelX1;
        int scaledRobotSize = (int) Math.max(10, Math.min(MAX_ROBOT_SIZE, fieldImageWidth * 0.05));
        int halfRobotSize = scaledRobotSize / 2;

        // For each enemy robot, compute its drawn pixel coordinate and check if the click falls within its bounds.
        for (Map.Entry<Pose2d, Double> pose : enemyRobots.entrySet()) {
            // Convert the enemy robot's field (meter) coordinates to pixel coordinates.
            double robotX = leftBound + (pose.getKey().getX() * pixelsPerMeterX);
            double robotY = bottomBound - (pose.getKey().getY() * pixelsPerMeterY);

            // Check if the click is within the drawn square centered at (robotX, robotY)
            if (clickX >= robotX - halfRobotSize && clickX <= robotX + halfRobotSize &&
                    clickY >= robotY - halfRobotSize && clickY <= robotY + halfRobotSize) {
                return pose;
            }
        }

        return null;
    }
    private Map.Entry<Pose2d, Double> getClickedNote(int clickX, int clickY) {
        int panelWidth = getWidth();
        int panelHeight = getHeight();

        double scaleXFull = (double) panelWidth / fieldImage.getWidth();
        double scaleYFull = (double) panelHeight / fieldImage.getHeight();
        double scaleFactor = Math.min(scaleXFull, scaleYFull);

        int newFieldWidth = (int) (fieldImage.getWidth() * scaleFactor);
        int newFieldHeight = (int) (fieldImage.getHeight() * scaleFactor);
        int xOffset = (panelWidth - newFieldWidth) / 2;
        int yOffset = (panelHeight - newFieldHeight) / 2;

        int leftBound   = xOffset + (int)(fieldPixelX1 * scaleFactor);
        int rightBound  = xOffset + (int)(fieldPixelX2 * scaleFactor);
        int topBound    = yOffset + (int)(fieldPixelY2 * scaleFactor);
        int bottomBound = yOffset + (int)(fieldPixelY1 * scaleFactor);

        if (clickX < leftBound || clickX > rightBound || clickY < topBound || clickY > bottomBound) {
            return null;
        }

        double displayFieldWidth  = rightBound - leftBound;
        double displayFieldHeight = bottomBound - topBound;
        double pixelsPerMeterX = displayFieldWidth / fieldWidthMeters;
        double pixelsPerMeterY = displayFieldHeight / fieldHeightMeters;

        int fieldImageWidth = fieldPixelX2 - fieldPixelX1;
        int scaledNoteSize = (int) Math.max(10, Math.min(MAX_ROBOT_SIZE, fieldImageWidth * 0.05));
        int halfNoteSize = scaledNoteSize / 2;

        for (Map.Entry<Pose2d, Double> pose : notes.entrySet()) {
            double noteX = leftBound + (pose.getKey().getX() * pixelsPerMeterX);
            double noteY = bottomBound - (pose.getKey().getY() * pixelsPerMeterY);

            if (clickX >= noteX - halfNoteSize && clickX <= noteX + halfNoteSize &&
                    clickY >= noteY - halfNoteSize && clickY <= noteY + halfNoteSize) {
                return pose;
            }
        }

        return null;
    }

}
