package org.kobe.xbot.xdashbackend.utilities;

import org.bytedeco.javacpp.indexer.FloatIndexer;
import org.bytedeco.opencv.global.opencv_calib3d;
import org.bytedeco.opencv.global.opencv_highgui;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_videoio.VideoCapture;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

public class CameraCalibration {
    private final AtomicBoolean running = new AtomicBoolean(false);
    private final int CHESSBOARD_WIDTH;
    private final int CHESSBOARD_HEIGHT;
    private final Size CHESSBOARD_SIZE;
    private int currentInterval;
    private final int interval;
    private Thread thread;
    private final List<Point3fVector> objectPoints = new ArrayList<>();
    private final List<Point2fVector> imagePoints = new ArrayList<>();
    private final Mat intrinsic = new Mat();
    private final Mat distCoeffs = new Mat();

    public CameraCalibration(int chessboardWidth, int chessboardHeight, int interval) {
        this.CHESSBOARD_WIDTH = chessboardWidth;
        this.CHESSBOARD_HEIGHT = chessboardHeight;
        this.CHESSBOARD_SIZE = new Size(chessboardWidth, chessboardHeight);
        this.interval = interval;
    }

    public void startCalibration() {
        running.set(true);
        thread = new Thread(() -> {
            try (VideoCapture cap = new VideoCapture(1)) {
                if (!cap.isOpened()) {
                    System.out.println("Camera could not be opened.");
                    return;
                }

                Mat frame = new Mat();

                while (running.get() && !thread.isInterrupted()) {
                    cap.read(frame);
                    if (frame.empty()) {
                        System.out.println("No frame captured.");
                        break;
                    }
                    if (currentInterval >= interval) {
                        perform(frame);
                        currentInterval = 0;
                    } else {
                        currentInterval++;
                    }

                    opencv_highgui.imshow("Calibration Frame", frame);
                    opencv_highgui.waitKey(1);
                }

                cap.release();
            }
        });
        thread.start();
    }

    public void stopCalibration() {
        running.set(false);
        try {
            if (thread != null && thread.isAlive()) {
                thread.interrupt();
                thread.join(1000);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }

    public static void main(String[] args) throws InterruptedException {
        CameraCalibration calibration = new CameraCalibration(13, 9, 0); // 30-frame interval
        calibration.startCalibration();

        // Allow calibration to run for 20 seconds, collecting frames
        Thread.sleep(10000);
        calibration.stopCalibration();
    }

    private void perform(Mat frame) {
        Mat gray = new Mat();
        opencv_imgproc.cvtColor(frame, gray, opencv_imgproc.COLOR_BGR2GRAY);

        Mat corners = new Mat();
        boolean found = opencv_calib3d.findChessboardCorners(gray, CHESSBOARD_SIZE, corners);

        if (found) {
            // Add object points
            // Refine corner locations for sub-pixel accuracy
            opencv_imgproc.cornerSubPix(
                    gray,
                    corners,
                    new Size(11, 11),
                    new Size(-1, -1),
                    new TermCriteria(TermCriteria.EPS + TermCriteria.COUNT, 30, 0.1)
            );

            opencv_calib3d.drawChessboardCorners(frame, CHESSBOARD_SIZE, corners, true);

            System.out.println("Chessboard detected and points saved.");
        } else {
            System.out.println("Chessboard not detected in this frame.");
        }
    }

    private Point3fVector createObjectPoints() {
        Point3fVector obj = new Point3fVector((long) CHESSBOARD_WIDTH * CHESSBOARD_HEIGHT);
        for (int i = 0; i < CHESSBOARD_HEIGHT; i++) {
            for (int j = 0; j < CHESSBOARD_WIDTH; j++) {
                obj.put((long) i * CHESSBOARD_WIDTH + j, new Point3f(j, i, 0));
            }
        }
        return obj;
    }

}
