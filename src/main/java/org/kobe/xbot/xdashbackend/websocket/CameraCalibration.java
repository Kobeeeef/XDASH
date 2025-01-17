package org.kobe.xbot.xdashbackend.websocket;

import org.bytedeco.javacpp.indexer.FloatIndexer;
import org.bytedeco.opencv.global.opencv_calib3d;
import org.bytedeco.opencv.global.opencv_highgui;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_videoio.VideoCapture;

public class CameraCalibration {

    public static void startCalibration() {
        int chessBoardRows = 7;
        int chessBoardCols = 10;
        Size chessBoardSize = new Size(chessBoardCols, chessBoardRows);

        // Prepare object points
        Point3fVector objp = new Point3fVector(chessBoardRows * chessBoardCols);
        for (int i = 0; i < chessBoardRows; i++) {
            for (int j = 0; j < chessBoardCols; j++) {
                objp.put(i * chessBoardCols + j, new Point3f(j * 2.0f, i * 2.0f, 0.0f));
            }
        }

        // Arrays to store object points and image points
        Point3fVectorVector objpoints = new Point3fVectorVector();
        Point2fVectorVector imgpoints = new Point2fVectorVector();

        // Open camera
        VideoCapture cap = new VideoCapture(0);
        if (!cap.isOpened()) {
            System.err.println("Error: Cannot open camera");
            return;
        }

        Mat frame = new Mat();
        Mat gray = new Mat();

        System.out.println("Press 'q' to stop the calibration process.");

        while (cap.read(frame)) {
            // Convert frame to grayscale
            opencv_imgproc.cvtColor(frame, gray, opencv_imgproc.COLOR_BGR2GRAY);

            // Find chessboard corners
            Mat cornersMat = new Mat();
            boolean found = opencv_calib3d.findChessboardCorners(gray, chessBoardSize, cornersMat);

            if (found) {
                objpoints.push_back(objp);

                // Convert cornersMat to Point2fVector for imgpoints
                Point2fVector corners = new Point2fVector(cornersMat);
                imgpoints.push_back(corners);

                // Draw and display the corners
                opencv_calib3d.drawChessboardCorners(frame, chessBoardSize, cornersMat, true);
                System.out.println("Chessboard corners found and added.");
            }

            // Display the frame
            opencv_highgui.imshow("Calibration View", frame);

            // Break on 'q'
            if (opencv_highgui.waitKey(1) == 'q') {
                break;
            }
        }

        cap.release();
        opencv_highgui.destroyAllWindows();

        // Perform camera calibration
        if (imgpoints.size() > 0) {
            Mat cameraMatrix = new Mat();
            Mat distCoeffs = new Mat();
            MatVector rvecs = new MatVector();
            MatVector tvecs = new MatVector();

            double rmsError = opencv_calib3d.calibrateCamera(
                    objpoints,
                    imgpoints,
                    gray.size(),
                    cameraMatrix,
                    distCoeffs,
                    rvecs,
                    tvecs
            );

            // Log calibration data
            System.out.println("Calibration completed. RMS Error: " + rmsError);
            System.out.println("Camera Matrix:\n" + matToString(cameraMatrix));
            System.out.println("Distortion Coefficients:\n" + matToString(distCoeffs));
        } else {
            System.out.println("No corners were found. Calibration failed.");
        }
    }

    // Utility method to get matrix data as a string
    private static String matToString(Mat mat) {
        FloatIndexer indexer = mat.createIndexer();
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < mat.rows(); i++) {
            for (int j = 0; j < mat.cols(); j++) {
                builder.append(indexer.get(i, j)).append(" ");
            }
            builder.append("\n");
        }
        return builder.toString();
    }

    public static void main(String[] args) {
        startCalibration();
    }
}
