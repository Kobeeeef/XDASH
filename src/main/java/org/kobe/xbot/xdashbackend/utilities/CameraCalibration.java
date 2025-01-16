package org.kobe.xbot.xdashbackend.utilities;

import org.bytedeco.javacpp.BytePointer;
import org.bytedeco.javacpp.FloatPointer;
import org.bytedeco.opencv.global.opencv_calib3d;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_videoio.VideoCapture;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

public class CameraCalibration {
    private static final AtomicBoolean isCalibrating = new AtomicBoolean(false); // Ensures only one calibration globally.
    private final List<String> calibrationData;
    private VideoCapture cap;
    private final DatagramSocket udpSocket;
    private final int udpPort;

    private Size checkerboardSize; // Checkerboard dimensions (number of inner corners per row and column).
    private float squareSize; // Size of a square on the checkerboard in the chosen unit (e.g., inches).

    public CameraCalibration(int udpPort, Size checkerboardSize, float squareSize) throws Exception {
        this.udpPort = udpPort;
        this.calibrationData = new ArrayList<>();
        this.udpSocket = new DatagramSocket(new InetSocketAddress(udpPort));
        this.checkerboardSize = checkerboardSize;
        this.squareSize = squareSize;
    }

    public synchronized void startCalibration(int cameraIndex) throws IllegalStateException {
        if (isCalibrating.get()) {
            throw new IllegalStateException("Calibration is already running.");
        }

        // Reset state
        isCalibrating.set(true);
        calibrationData.clear();
        cap = new VideoCapture(cameraIndex);
        if (!cap.isOpened()) {
            isCalibrating.set(false);
            throw new IllegalStateException("Error: Could not open camera with index " + cameraIndex);
        }

        Thread calibrationThread = new Thread(() -> {
            try {
                performCalibration();
            } finally {
                isCalibrating.set(false);
                if (cap != null && cap.isOpened()) {
                    cap.release();
                }
            }
        });
        calibrationThread.start();
    }

    public synchronized void stopCalibration() {
        isCalibrating.set(false);
        if (cap != null && cap.isOpened()) {
            cap.release();
        }
    }

    private void performCalibration() {
        Mat frame = new Mat();
        Mat gray = new Mat();
        List<Mat> objectPoints = new ArrayList<>();
        List<Mat> imagePoints = new ArrayList<>();
        Mat objp = new Mat();
        Mat corners = new Mat();

        // Prepare object points (3D points in the real world).
        for (int i = 0; i < checkerboardSize.height(); i++) {
            for (int j = 0; j < checkerboardSize.width(); j++) {
                objp.push_back(new Mat(new FloatPointer(j * squareSize, i * squareSize, 0.0f)));
            }
        }

        long startTime = System.currentTimeMillis();
        int waitTime = 3000;
        while (isCalibrating.get() && cap.read(frame)) {
            opencv_imgproc.cvtColor(frame, gray, opencv_imgproc.COLOR_BGR2GRAY);

            boolean found = opencv_calib3d.findChessboardCorners(gray, checkerboardSize, corners);
            if (found && (System.currentTimeMillis() - startTime) > waitTime) {
                startTime = System.currentTimeMillis();
                objectPoints.add(objp);
                Mat refinedCorners = new Mat();
                opencv_imgproc.cornerSubPix(gray, corners, new Size(11, 11), new Size(-1, -1),
                        new TermCriteria(TermCriteria.EPS + TermCriteria.MAX_ITER, 30, 0.001));
                imagePoints.add(corners);
                opencv_calib3d.drawChessboardCorners(frame, checkerboardSize, corners, found);
            }

            // Send frame via UDP
            sendFrameOverUDP(frame);
        }

        if (!objectPoints.isEmpty() && !imagePoints.isEmpty()) {
            Point3fVectorVector objectPointsVec = new Point3fVectorVector();
            for (Mat obj : objectPoints) {
                objectPointsVec.put(new Point3fVector(obj));
            }

            Point2fVectorVector imagePointsVec = new Point2fVectorVector();
            for (Mat img : imagePoints) {
                imagePointsVec.put(new Point2fVector(img));
            }
            Mat cameraMatrix = new Mat();
            Mat distCoeffs = new Mat();
            MatVector rvecs = new MatVector();
            MatVector tvecs = new MatVector();

            opencv_calib3d.calibrateCamera(objectPointsVec, imagePointsVec, gray.size(), cameraMatrix, distCoeffs, rvecs, tvecs);

            saveCalibration(cameraMatrix, distCoeffs);
        }
    }

    private void sendFrameOverUDP(Mat frame) {
        BytePointer buffer = new BytePointer(); // Use BytePointer for storing encoded image
        boolean success = opencv_imgcodecs.imencode(".jpg", frame, buffer);

        if (success) {
            byte[] data = new byte[(int) buffer.limit()]; // Allocate array with the size of encoded data
            buffer.get(data); // Copy the encoded data into the byte array
            InetSocketAddress targetAddress = new InetSocketAddress("192.168.1.255", udpPort); // Replace with actual target
            DatagramPacket packet = new DatagramPacket(data, data.length, targetAddress);

            try {
                udpSocket.send(packet); // Send the packet via UDP
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        buffer.deallocate(); // Free the memory used by BytePointer
    }

    private void saveCalibration(Mat cameraMatrix, Mat distCoeffs) {
        try {
            StringBuilder cameraMatrixBuilder = new StringBuilder();
            StringBuilder distCoeffsBuilder = new StringBuilder();

            // Serialize cameraMatrix
            for (int row = 0; row < cameraMatrix.rows(); row++) {
                for (int col = 0; col < cameraMatrix.cols(); col++) {
                    cameraMatrixBuilder.append(cameraMatrix.ptr(row, col).getDouble()).append(" ");
                }
            }

            // Serialize distCoeffs
            for (int i = 0; i < distCoeffs.rows(); i++) {
                distCoeffsBuilder.append(distCoeffs.ptr(i).getDouble()).append(" ");
            }

            // Create JSON string
            String json = String.format("{\"CameraMatrix\": \"%s\", \"DistortionCoeff\": \"%s\"}",
                    cameraMatrixBuilder.toString().trim(), distCoeffsBuilder.toString().trim());

            // Add to calibration data
            calibrationData.add(json);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public List<String> getCalibrationData() {
        return new ArrayList<>(calibrationData);
    }

    public static boolean isRunning() {
        return isCalibrating.get();
    }

    public void setCheckerboardSize(Size checkerboardSize) {
        this.checkerboardSize = checkerboardSize; // Set new checkerboard dimensions.
    }

    public void setSquareSize(float squareSize) {
        this.squareSize = squareSize; // Set new square size (in the chosen unit, e.g., inches).
    }

    public static void main(String[] args) {
        try {
            CameraCalibration calibration = new CameraCalibration(12345, new Size(7, 10), 2.0f); // Default checkerboard size and square size.
            calibration.startCalibration(0);

            // Demonstrate updating checkerboard parameters.
            Thread.sleep(5000); // Let it run for 5 seconds.
            calibration.setCheckerboardSize(new Size(9, 6));
            calibration.setSquareSize(1.5f); // Update square size to 1.5 inches.

            Thread.sleep(15000); // Let it run for 15 more seconds.
            calibration.stopCalibration();

            System.out.println("Calibration Data:");
            calibration.getCalibrationData().forEach(System.out::println);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
