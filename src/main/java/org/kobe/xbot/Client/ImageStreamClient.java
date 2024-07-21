//package org.kobe.xbot.Client;
//
//import org.bytedeco.javacpp.BytePointer;
//import org.bytedeco.opencv.global.opencv_imgcodecs;
//import org.bytedeco.opencv.opencv_core.Mat;
//import org.kobe.xbot.Utilities.Logger.XTablesLogger;
//
//import java.io.BufferedInputStream;
//import java.io.IOException;
//import java.io.InputStream;
//import java.net.HttpURLConnection;
//import java.net.URL;
//import java.util.concurrent.ExecutorService;
//import java.util.concurrent.Executors;
//import java.util.concurrent.atomic.AtomicBoolean;
//import java.util.function.Consumer;
//
//public class ImageStreamClient {
//    private static final XTablesLogger logger = XTablesLogger.getLogger();
//    private final String serverUrl;
//    private final Consumer<Mat> consumer;
//    private final AtomicBoolean running = new AtomicBoolean(false);
//
//    public ImageStreamClient(String serverUrl, Consumer<Mat> onFrame) {
//        this.serverUrl = serverUrl;
//        this.consumer = onFrame;
//    }
//
//    public void start(ExecutorService service) {
//        running.set(true);
//        service.execute(() -> {
//            try {
//                while (running.get() && !Thread.currentThread().isInterrupted()) {
//                    HttpURLConnection connection = (HttpURLConnection) new URL(serverUrl).openConnection();
//                    connection.setRequestMethod("GET");
//
//                    try (InputStream inputStream = new BufferedInputStream(connection.getInputStream())) {
//                        byte[] byteArray = inputStream.readAllBytes();
//                        if (byteArray.length == 0) {
//                            logger.warning("Received empty byte array.");
//                            continue;
//                        }
//
//                        Mat frame = byteArrayToMat(byteArray);
//                        if (frame.empty()) {
//                            logger.severe("Failed to decode frame.");
//                            continue;
//                        }
//                        consumer.accept(frame);
//                    } catch (IOException e) {
//                        logger.severe("Error reading stream: " + e.getMessage());
//                        Thread.sleep(1000);
//                    } finally {
//                        connection.disconnect();
//                    }
//                }
//            } catch (IOException | InterruptedException e) {
//                logger.severe("Error connecting to server: " + e.getMessage());
//            }
//        });
//    }
//
//    public void stop() {
//        running.set(false);
//    }
//
//    private Mat byteArrayToMat(byte[] byteArray) {
//        Mat mat = new Mat(new BytePointer(byteArray));
//        return opencv_imgcodecs.imdecode(mat, opencv_imgcodecs.IMREAD_COLOR);
//    }
//}
