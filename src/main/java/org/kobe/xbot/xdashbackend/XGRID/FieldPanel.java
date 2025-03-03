package org.kobe.xbot.xdashbackend.XGRID;

import edu.wpi.first.math.geometry.Pose2d;
import edu.wpi.first.math.geometry.Rotation2d;
import edu.wpi.first.math.util.Units;
import org.apache.logging.log4j.util.TriConsumer;
import org.kobe.xbot.Utilities.Entities.XTableValues;
import org.kobe.xbot.xdashbackend.utilities.Landmarks;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.geom.AffineTransform;
import java.awt.geom.Path2D;
import java.awt.geom.Point2D;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FieldPanel extends JPanel {
    private static final int MAX_ROBOT_SIZE = 60;

    private static final double NOTE_METERS = 0.3556;
    private static final double ROBOT_METERS = 0.889;

    private double[][][] bezierCurves;
    private double finalRotation;

    // Robot pose
    private Pose2d robotPose = new Pose2d(0, 0, new Rotation2d());
    private final Map<Pose2d, Double> enemyRobots = new HashMap<>();
    private final Map<Pose2d, Double> notes = new HashMap<>();

    private TriConsumer<Pose2d, Double, MouseEvent> clickCallback = (pose2dDoubleEntry, prob, event) -> {
        System.out.println(pose2dDoubleEntry);
    };
    private List<Point> pathPoints = new ArrayList<>();
    private BufferedImage fieldImage;
    private BufferedImage robotImage;

    // Field dimensions in meters
    private final double fieldWidthMeters = 17.55;
    private final double fieldHeightMeters = 8.05;
    private final List<XTableValues.Coordinate> waypoints = new ArrayList<>();
    // Field image boundaries (from config.json)
    private final int fieldPixelX1 = 421;   // Left boundary
    private final int fieldPixelY1 = 1437;  // Bottom boundary (flipped from top-left)
    private final int fieldPixelX2 = 3352;  // Right boundary
    private final int fieldPixelY2 = 91;    // Top boundary (flipped from config)
    private final CustomTooltip tooltip;
    private final Timer hideTimer;
    private final XTablesViewer root;

    public FieldPanel(XTablesViewer viewer) {
        this.root = viewer;
        fieldImage = loadImage("/2025field.png");
        robotImage = loadImage("/icon.png");
        ToolTipManager.sharedInstance().setEnabled(false);

        // Create a custom tooltip label
        tooltip = new CustomTooltip();
        tooltip.setVisible(false);
        add(tooltip);

        // Timer to hide tooltip after a delay
        hideTimer = new Timer(2000, e -> tooltip.setVisible(false));
        hideTimer.setRepeats(false);

        addMouseMotionListener(new MouseAdapter() {
            @Override
            public void mouseMoved(MouseEvent e) {
                // Compute scaling and offsets (same as in paintComponent)
                int panelWidth = getWidth();
                int panelHeight = getHeight();
                double scaleXFull = (double) panelWidth / fieldImage.getWidth();
                double scaleYFull = (double) panelHeight / fieldImage.getHeight();
                double scaleFactor = Math.min(scaleXFull, scaleYFull);
                int newFieldWidth = (int) (fieldImage.getWidth() * scaleFactor);
                int newFieldHeight = (int) (fieldImage.getHeight() * scaleFactor);
                int xOffset = (panelWidth - newFieldWidth) / 2;
                int yOffset = (panelHeight - newFieldHeight) / 2;

                // Calculate the displayed field boundaries
                int leftBound = xOffset + (int) (fieldPixelX1 * scaleFactor);
                int rightBound = xOffset + (int) (fieldPixelX2 * scaleFactor);
                int topBound = yOffset + (int) (fieldPixelY2 * scaleFactor);
                int bottomBound = yOffset + (int) (fieldPixelY1 * scaleFactor);
                int relativeX = (int) ((e.getX() - xOffset) / scaleFactor);
                int relativeY = (int) ((e.getY() - yOffset) / scaleFactor);
//                System.out.println(relativeX + " " + relativeY);
                // Check if the mouse is outside the field bounds
                if (e.getX() < leftBound || e.getX() > rightBound || e.getY() < topBound || e.getY() > bottomBound) {
                    tooltip.setVisible(false);
                } else {
                    // Your existing logic for showing tooltips, etc.
                    Map.Entry<Pose2d, Double> clickedEnemy = getClickedEnemyPose(leftBound, rightBound, topBound, bottomBound, e.getX(), e.getY());
                    Map.Entry<Pose2d, Double> clickedNote = getClickedNote(leftBound, rightBound, topBound, bottomBound, e.getX(), e.getY());
//                    System.out.println(Landmarks.getBranchPose(Landmarks.ReefFace.CLOSE, Landmarks.Branch.A));
                    if (clickedEnemy != null && clickCallback != null) {
                        showTooltip(e, "Click to go to robot.");
                    } else if ((relativeY >= 766 && relativeY <= 811) && (relativeX >= 2407 && relativeX <= 2523)) {
                        showTooltip(e, "Click to go to CLOSE red branch A."); // bottom blue left
                    } else if ((relativeY >= 766 && relativeY <= 826) && (relativeX >= 975 && relativeX <= 1087)) {
                        showTooltip(e, "Click to go to CLOSE blue branch B.");
                    } else if ((relativeY >= 706 && relativeY <= 766) && (relativeX >= 975 && relativeX <= 1087)) {
                        showTooltip(e, "Click to go to CLOSE blue branch A.");
                    } else if ((relativeY >= 706 && relativeY <= 766) && (relativeX >= 1251 && relativeX <= 1369)) {
                        showTooltip(e, "Click to go to FAR blue branch B.");
                    } else if ((relativeY >= 766 && relativeY <= 826) && (relativeX >= 1251 && relativeX <= 1369)) {
                        showTooltip(e, "Click to go to FAR blue branch A.");
                    } else if (clickedNote != null && clickCallback != null) {
                        showTooltip(e, "Click to go to note.");
                    } else if (relativeX < 700 && relativeY < 340) {
                        showTooltip(e, "Click to go to coral station."); // top blue left
                    } else if (relativeX < 700 && relativeY > 1225) {
                        showTooltip(e, "Click to go to coral station."); // bottom blue left
                    } else {
                        showTooltip(e, "Click to go.");
                    }
                }
            }
        });
        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseExited(MouseEvent e) {
                tooltip.setVisible(false);
            }

            @Override
            public void mousePressed(MouseEvent e) {
                int panelWidth = getWidth();
                int panelHeight = getHeight();
                double scaleXFull = (double) panelWidth / fieldImage.getWidth();
                double scaleYFull = (double) panelHeight / fieldImage.getHeight();
                double scaleFactor = Math.min(scaleXFull, scaleYFull);

                int newFieldWidth = (int) (fieldImage.getWidth() * scaleFactor);
                int newFieldHeight = (int) (fieldImage.getHeight() * scaleFactor);
                int xOffset = (panelWidth - newFieldWidth) / 2;
                int yOffset = (panelHeight - newFieldHeight) / 2;

                int leftBound = xOffset + (int) (fieldPixelX1 * scaleFactor);
                int rightBound = xOffset + (int) (fieldPixelX2 * scaleFactor);
                int topBound = yOffset + (int) (fieldPixelY2 * scaleFactor);
                int bottomBound = yOffset + (int) (fieldPixelY1 * scaleFactor);
                int relativeX = (int) ((e.getX() - xOffset) / scaleFactor);
                int relativeY = (int) ((e.getY() - yOffset) / scaleFactor);
                Map.Entry<Pose2d, Double> clickedEnemy = getClickedEnemyPose(leftBound, rightBound, topBound, bottomBound, e.getX(), e.getY());
                Map.Entry<Pose2d, Double> clickedNote = getClickedNote(leftBound, rightBound, topBound, bottomBound, e.getX(), e.getY());
                if (clickCallback != null) {
                    if (clickedEnemy != null) {
                        clickCallback.accept(clickedEnemy.getKey(), clickedEnemy.getValue(), e);
                    } else if (clickedNote != null) {
                        clickCallback.accept(clickedNote.getKey(), clickedEnemy.getValue(), e);
                    } else if (relativeX < 700 && relativeY < 340) {
                        clickCallback.accept(Landmarks.getCoralStationSectionPose(Landmarks.CoralStation.LEFT, Landmarks.CoralStationSection.MID), 100.0, e);
                    } else if (relativeX < 700 && relativeY > 1225) {
                        clickCallback.accept(Landmarks.getCoralStationSectionPose(Landmarks.CoralStation.RIGHT, Landmarks.CoralStationSection.MID), 100.0, e);
                    } else if ((relativeY >= 766 && relativeY <= 826) && (relativeX >= 975 && relativeX <= 1087)) {
                        clickCallback.accept(Landmarks.getBranchPose(Landmarks.ReefFace.CLOSE, Landmarks.Branch.B), 100.0, e);
                    } else if ((relativeY >= 706 && relativeY <= 766) && (relativeX >= 975 && relativeX <= 1087)) {
                        clickCallback.accept(Landmarks.getBranchPose(Landmarks.ReefFace.CLOSE, Landmarks.Branch.A), 100.0, e);
                    } else if ((relativeY >= 706 && relativeY <= 766) && (relativeX >= 1251 && relativeX <= 1369)) {
                        clickCallback.accept(Landmarks.getBranchPose(Landmarks.ReefFace.FAR, Landmarks.Branch.B), 100.0, e);
                    } else if ((relativeY >= 766 && relativeY <= 826) && (relativeX >= 1251 && relativeX <= 1369)) {
                        clickCallback.accept(Landmarks.getBranchPose(Landmarks.ReefFace.FAR, Landmarks.Branch.A), 100.0, e);
                    } else {
                        if (e.getX() < leftBound || e.getX() > rightBound || e.getY() < topBound || e.getY() > bottomBound) {
                            return;
                        }
                        double displayFieldWidth = rightBound - leftBound;
                        double displayFieldHeight = bottomBound - topBound;
                        double pixelsPerMeterX = displayFieldWidth / fieldWidthMeters;
                        double pixelsPerMeterY = displayFieldHeight / fieldHeightMeters;
                        double fieldX = (e.getX() - leftBound) / pixelsPerMeterX;
                        double fieldY = (bottomBound - e.getY()) / pixelsPerMeterY;
                        Pose2d clickedPose = new Pose2d(fieldX, fieldY, Rotation2d.fromDegrees(root.FINAL_ROTATION_DEFAULT));
                        clickCallback.accept(clickedPose, 100.0, e);
                    }
                }
            }
        });


    }


    private void showTooltip(MouseEvent e, String text) {
        tooltip.setText(text);
        tooltip.setSize(tooltip.getPreferredSize());
        tooltip.setLocation(e.getX() + 15, e.getY() + 15);
        tooltip.setVisible(true);
        hideTimer.restart();
    }

    private BufferedImage loadImage(String path) {
        try (InputStream is = getClass().getResourceAsStream(path)) {
            return is != null ? ImageIO.read(is) : null;
        } catch (IOException ex) {
            return null;
        }
    }

    public void setWaypoints(List<XTableValues.Coordinate> newWaypoints) {
        this.waypoints.clear();
        if (newWaypoints != null) {
            this.waypoints.addAll(newWaypoints);
        }
        repaint();
    }

    public void setBezierCurves(double[][][] curves, double finalRotation) {
        this.bezierCurves = curves;
        this.finalRotation = finalRotation;
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

    public void setClickCallback(TriConsumer<Pose2d, Double, MouseEvent> callback) {
        this.clickCallback = callback;
    }

    private Point2D evaluateBezier(double[][] controlPoints, double t) {
        int n = controlPoints.length;
        // Create temporary arrays for the coordinates
        double[] tempX = new double[n];
        double[] tempY = new double[n];
        for (int i = 0; i < n; i++) {
            tempX[i] = controlPoints[i][0];
            tempY[i] = controlPoints[i][1];
        }
        // Apply de Casteljau's algorithm
        for (int r = 1; r < n; r++) {
            for (int i = 0; i < n - r; i++) {
                tempX[i] = (1 - t) * tempX[i] + t * tempX[i + 1];
                tempY[i] = (1 - t) * tempY[i] + t * tempY[i + 1];
            }
        }
        return new Point2D.Double(tempX[0], tempY[0]);
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


            int leftBound = xOffset + (int) (fieldPixelX1 * scaleFactor);
            int rightBound = xOffset + (int) (fieldPixelX2 * scaleFactor);
            int topBound = yOffset + (int) (fieldPixelY2 * scaleFactor);
            int bottomBound = yOffset + (int) (fieldPixelY1 * scaleFactor);

            double displayFieldWidth = rightBound - leftBound;
            double displayFieldHeight = bottomBound - topBound;
            double pixelsPerMeterX = displayFieldWidth / fieldWidthMeters;
            double pixelsPerMeterY = displayFieldHeight / fieldHeightMeters;
            double fieldScaleX = ((double) fieldImageWidth * scaleFactor) / fieldWidthMeters;

            double fieldScaleY = ((double) fieldImageHeight * scaleFactor) / fieldHeightMeters;


            int robotPixelSize = (int) (ROBOT_METERS * pixelsPerMeterX);
            int notePixelSize = (int) (NOTE_METERS * pixelsPerMeterX);
            if (bezierCurves != null) {
                g2d.setColor(Color.BLUE);
                g2d.setStroke(new BasicStroke(4));

                for (double[][] curve : bezierCurves) {
                    if (curve.length < 2) continue; // Need at least 2 points

                    Path2D.Double path = new Path2D.Double();

                    // Convert first point to pixels and move to start position
                    double[] firstPoint = curve[0];
                    double startX = leftBound + (firstPoint[0] * pixelsPerMeterX);
                    double startY = bottomBound - (firstPoint[1] * pixelsPerMeterY);
                    path.moveTo(startX, startY);

                    if (curve.length == 3) {
                        // Quadratic Bézier Curve (1 control point, 1 end point)
                        double[] cp = curve[1];
                        double[] endPoint = curve[2];
                        double cpX = leftBound + (cp[0] * pixelsPerMeterX);
                        double cpY = bottomBound - (cp[1] * pixelsPerMeterY);
                        double endX = leftBound + (endPoint[0] * pixelsPerMeterX);
                        double endY = bottomBound - (endPoint[1] * pixelsPerMeterY);
                        path.quadTo(cpX, cpY, endX, endY);

                    } else if (curve.length == 4) {
                        // Cubic Bézier Curve (2 control points, 1 end point)
                        double[] cp1 = curve[1];
                        double[] cp2 = curve[2];
                        double[] endPoint = curve[3];
                        double cp1X = leftBound + (cp1[0] * pixelsPerMeterX);
                        double cp1Y = bottomBound - (cp1[1] * pixelsPerMeterY);
                        double cp2X = leftBound + (cp2[0] * pixelsPerMeterX);
                        double cp2Y = bottomBound - (cp2[1] * pixelsPerMeterY);
                        double endX = leftBound + (endPoint[0] * pixelsPerMeterX);
                        double endY = bottomBound - (endPoint[1] * pixelsPerMeterY);
                        path.curveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);

                    } else {
                        // Multiple Segments (Handling >4 points correctly)
                        int samples = 100;  // Increase for a smoother curve
                        for (int i = 0; i <= samples; i++) {
                            double t = (double) i / samples;
                            Point2D pt = evaluateBezier(curve, t);
                            double x = leftBound + (pt.getX() * pixelsPerMeterX);
                            double y = bottomBound - (pt.getY() * pixelsPerMeterY);
                            if (i == 0) {
                                path.moveTo(x, y);
                            } else {
                                path.lineTo(x, y);
                            }
                        }
                    }
                    g2d.draw(path);
                }
                double[][] lastSegment = bezierCurves[bezierCurves.length - 1];
                double[] lastPoints = lastSegment[lastSegment.length - 1];
                double lastX = lastPoints[0];
                double lastY = lastPoints[1];
                drawRobot(g2d, new Pose2d(lastX, lastY, Rotation2d.fromDegrees(this.finalRotation)), robotImage, fieldScaleX, fieldScaleY, robotPixelSize, xOffset, yOffset, scaleFactor, true, Color.WHITE);

            }


            drawRobot(g2d, robotPose, robotImage, fieldScaleX, fieldScaleY, robotPixelSize, xOffset, yOffset, scaleFactor, false, Color.RED);

            for (Map.Entry<Pose2d, Double> entry : enemyRobots.entrySet()) {
                drawOtherRobot(g2d, entry.getKey(), entry.getValue(), fieldScaleX, fieldScaleY, robotPixelSize, xOffset, yOffset, scaleFactor);
            }
            for (Map.Entry<Pose2d, Double> entry : notes.entrySet()) {
                drawNote(g2d, entry.getKey(), entry.getValue(), fieldScaleX, fieldScaleY, notePixelSize, xOffset, yOffset, scaleFactor);
            }
            int scaledWaypointSize = (int) Math.max(8, Math.min(15, fieldImageWidth * scaleFactor * 0.05));
            for (int i = 0; i < waypoints.size(); i++) {
                drawWaypoint(g2d, waypoints.get(i), i, fieldScaleX, fieldScaleY, scaledWaypointSize, xOffset, yOffset, scaleFactor);
            }
        }
    }

    private void drawWaypoint(Graphics2D g2d, XTableValues.Coordinate pose, int index, double scaleX, double scaleY, int waypointSize, int xOffset, int yOffset, double scaleFactor) {
        // Compute the displayed boundaries of the field
        int leftBound = xOffset + (int) (fieldPixelX1 * scaleFactor);
        int rightBound = xOffset + (int) (fieldPixelX2 * scaleFactor);
        int topBound = yOffset + (int) (fieldPixelY2 * scaleFactor);
        int bottomBound = yOffset + (int) (fieldPixelY1 * scaleFactor);

        double displayFieldWidth = rightBound - leftBound;
        double displayFieldHeight = bottomBound - topBound;
        double pixelsPerMeterX = displayFieldWidth / fieldWidthMeters;
        double pixelsPerMeterY = displayFieldHeight / fieldHeightMeters;

        // Convert field (meter) coordinates to pixel coordinates
        double computedX = leftBound + (pose.getX() * pixelsPerMeterX);
        double computedY = bottomBound - (pose.getY() * pixelsPerMeterY);

        // Clamp the waypoint position within the field
        double waypointX = Math.max(leftBound, Math.min(rightBound, computedX));
        double waypointY = Math.max(topBound, Math.min(bottomBound, computedY));

        AffineTransform oldTransform = g2d.getTransform();
        g2d.translate(waypointX, waypointY);

        // Draw a filled circle (dot) for the waypoint
        //        g2d.setColor(Color.GREEN);
        //        g2d.setStroke(new BasicStroke(3));
        //        g2d.drawOval(-waypointSize / 2, (-waypointSize / 2) -1, waypointSize, waypointSize);

        // Draw the index number (starting at 1) over the dot
        g2d.setColor(Color.GREEN);
        g2d.setFont(new Font("Arial", Font.BOLD, waypointSize));
        String label = String.valueOf(index + 1);
        FontMetrics fm = g2d.getFontMetrics();
        int textWidth = fm.stringWidth(label);
        int textHeight = fm.getAscent();
        g2d.drawString(label, -textWidth / 2, textHeight / 4);
        g2d.setTransform(oldTransform);
    }

    private void drawRobot(Graphics2D g2d, Pose2d pose, BufferedImage image, double scaleX, double scaleY, int robotSize, int xOffset, int yOffset, double scaleFactor, Boolean ghost, Color borderColor) {
        if (image == null) return;

        // Compute displayed boundaries of the field
        int leftBound = xOffset + (int) (fieldPixelX1 * scaleFactor);
        int rightBound = xOffset + (int) (fieldPixelX2 * scaleFactor);
        int topBound = yOffset + (int) (fieldPixelY2 * scaleFactor);
        int bottomBound = yOffset + (int) (fieldPixelY1 * scaleFactor);

        double displayFieldWidth = rightBound - leftBound;
        double displayFieldHeight = bottomBound - topBound;
        double pixelsPerMeterX = displayFieldWidth / fieldWidthMeters;
        double pixelsPerMeterY = displayFieldHeight / fieldHeightMeters;


        double computedX = leftBound + (pose.getX() * pixelsPerMeterX);
        double computedY = bottomBound - (pose.getY() * pixelsPerMeterY);

        double robotX = Math.max(leftBound, Math.min(rightBound, computedX));
        double robotY = Math.max(topBound, Math.min(bottomBound, computedY));


        AffineTransform oldTransform = g2d.getTransform();

        g2d.translate(robotX, robotY);
        g2d.rotate(-pose.getRotation().getRadians() + Units.degreesToRadians(90));

        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.8f));


        if (!ghost) g2d.drawImage(image, -robotSize / 2, -robotSize / 2, robotSize, robotSize, null);
        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1.0f));

        g2d.setColor(Color.RED);
        g2d.setStroke(new BasicStroke(4));
        g2d.drawRoundRect(-robotSize / 2, -robotSize / 2, robotSize, robotSize, 13, 13);

        int totalArrowLength = (int) (robotSize / 1.5);
        int arrowHalfLength = totalArrowLength / 2;
        int arrowHeadSize = Math.max(totalArrowLength / 4, 1);

        BasicStroke roundedStroke = new BasicStroke(
                4,
                BasicStroke.CAP_ROUND,
                BasicStroke.JOIN_ROUND
        );
        g2d.setColor(Color.BLACK);
        g2d.setStroke(roundedStroke);
        g2d.drawLine(0, arrowHalfLength, 0, -arrowHalfLength);
        g2d.drawLine(0, -arrowHalfLength, -arrowHeadSize, -arrowHalfLength + arrowHeadSize);
        g2d.drawLine(0, -arrowHalfLength, arrowHeadSize, -arrowHalfLength + arrowHeadSize);


        g2d.setTransform(oldTransform);
    }

    private void drawOtherRobot(Graphics2D g2d, Pose2d pose, double probability, double scaleX, double scaleY, int robotSize, int xOffset, int yOffset, double scaleFactor) {
        if (probability <= 0) return;

        // Compute displayed boundaries of the field
        int leftBound = xOffset + (int) (fieldPixelX1 * scaleFactor);
        int rightBound = xOffset + (int) (fieldPixelX2 * scaleFactor);
        int topBound = yOffset + (int) (fieldPixelY2 * scaleFactor);
        int bottomBound = yOffset + (int) (fieldPixelY1 * scaleFactor);

        double displayFieldWidth = rightBound - leftBound;
        double displayFieldHeight = bottomBound - topBound;
        double pixelsPerMeterX = displayFieldWidth / fieldWidthMeters;
        double pixelsPerMeterY = displayFieldHeight / fieldHeightMeters;


        double computedX = leftBound + (pose.getX() * pixelsPerMeterX);
        double computedY = bottomBound - (pose.getY() * pixelsPerMeterY);

        double robotX = Math.max(leftBound, Math.min(rightBound, computedX));
        double robotY = Math.max(topBound, Math.min(bottomBound, computedY));


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
        int leftBound = xOffset + (int) (fieldPixelX1 * scaleFactor);
        int rightBound = xOffset + (int) (fieldPixelX2 * scaleFactor);
        int topBound = yOffset + (int) (fieldPixelY2 * scaleFactor);
        int bottomBound = yOffset + (int) (fieldPixelY1 * scaleFactor);

        double displayFieldWidth = rightBound - leftBound;
        double displayFieldHeight = bottomBound - topBound;
        double pixelsPerMeterX = displayFieldWidth / fieldWidthMeters;
        double pixelsPerMeterY = displayFieldHeight / fieldHeightMeters;

        // Convert field (meter) coordinates to pixel coordinates
        double computedX = leftBound + (pose.getX() * pixelsPerMeterX);
        double computedY = bottomBound - (pose.getY() * pixelsPerMeterY);

        // Clamp the note position so it stays within the field boundaries
        double noteX = Math.max(leftBound, Math.min(rightBound, computedX));
        double noteY = Math.max(topBound, Math.min(bottomBound, computedY));

        // Save the original transform and translate to the note position.
        AffineTransform oldTransform = g2d.getTransform();
        g2d.translate(noteX, noteY);
        // No need to rotate a circle.

        // Draw the note: a filled orange circle.


        // Optionally, draw a thin outline around the note.
        g2d.setColor(Color.getHSBColor(30f / 360f, 1.0f, 1.0f));
        g2d.setStroke(new BasicStroke(5));
        g2d.drawOval(-noteSize / 2, -noteSize / 2, noteSize, noteSize);
        g2d.setColor(Color.WHITE);
        g2d.setFont(new Font("Arial", Font.BOLD, (int) (noteSize / 2.7)));
        String probabilityText = String.format("%.0f%%", probability * 100);
        FontMetrics fm = g2d.getFontMetrics();
        int textWidth = fm.stringWidth(probabilityText);
        int textHeight = fm.getHeight();
        g2d.drawString(probabilityText, -textWidth / 2, textHeight / 4);
        // Restore the original transform.
        g2d.setTransform(oldTransform);
    }


    private Map.Entry<Pose2d, Double> getClickedEnemyPose(int leftBound, int rightBound, int topBound, int bottomBound, int clickX, int clickY) {


        // (Optional) If the click is outside the field area, skip checking enemy robots.
        if (clickX < leftBound || clickX > rightBound || clickY < topBound || clickY > bottomBound) {
            return null;
        }


        double displayFieldWidth = rightBound - leftBound;
        double displayFieldHeight = bottomBound - topBound;
        double pixelsPerMeterX = displayFieldWidth / fieldWidthMeters;
        double pixelsPerMeterY = displayFieldHeight / fieldHeightMeters;

        int robotPixelSize = (int) (ROBOT_METERS * pixelsPerMeterX);
        int halfRobotSize = (int) (robotPixelSize / 1.5);

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

    private Map.Entry<Pose2d, Double> getClickedNote(int leftBound, int rightBound, int topBound, int bottomBound, int clickX, int clickY) {

        if (clickX < leftBound || clickX > rightBound || clickY < topBound || clickY > bottomBound) {
            return null;
        }


        double displayFieldWidth = rightBound - leftBound;
        double displayFieldHeight = bottomBound - topBound;
        double pixelsPerMeterX = displayFieldWidth / fieldWidthMeters;
        double pixelsPerMeterY = displayFieldHeight / fieldHeightMeters;

        int notePixelSize = (int) (NOTE_METERS * pixelsPerMeterX);
        int halfNoteSize = (int) (notePixelSize / 1.5);
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

    /**
     * Custom tooltip with rounded corners, shadow, and modern styling.
     */
    private static class CustomTooltip extends JPanel {
        private String text = "";

        public CustomTooltip() {
            setOpaque(false);
        }

        public void setText(String text) {
            this.text = text;
            repaint();
        }

        @Override
        public Dimension getPreferredSize() {
            FontMetrics fm = getFontMetrics(getFont());
            int width = fm.stringWidth(text) + 100;
            int height = fm.getHeight() + 10;
            return new Dimension(width, height);
        }

        @Override
        protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            Font font = new Font("Arial", Font.BOLD, 14);
            g2.setFont(font);
            FontMetrics fm = g2.getFontMetrics();

            int textWidth = fm.stringWidth(text);
            int textHeight = fm.getHeight();

            int paddingX = 16; // Space around text
            int paddingY = 10;

            int width = textWidth + paddingX;
            int height = textHeight + paddingY;

            int arc = 15; // Rounded corner radius
            int shadowOffset = 4;

            // Shadow effect
            g2.setColor(new Color(0, 0, 0, 80));
            g2.fillRoundRect(shadowOffset, shadowOffset, width, height, arc, arc);

            // Main tooltip background
            g2.setColor(Color.BLACK);
            g2.fillRoundRect(0, 0, (width - shadowOffset), height - shadowOffset, arc, arc);

            // Draw text centered
            g2.setColor(Color.WHITE);
            int textX = paddingX / 2;
            int textY = (height - fm.getHeight()) / 2 + fm.getAscent();
            g2.drawString(text, textX, textY);
        }
    }

    public Pose2d getRobotPose() {
        return robotPose;
    }
}
