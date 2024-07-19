package org.kobe.xbot.Client;


import org.bytedeco.opencv.global.opencv_highgui;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_videoio.VideoCapture;
import org.kobe.xbot.Utilities.Utilities;

import java.io.IOException;

public class OverloadTest {
    private static final String SERVER_ADDRESS = "localhost"; // Server address
    private static final int SERVER_PORT = 1735; // Server port

    public static void main(String[] args) throws IOException, InterruptedException {
        // Initialize a new client with address and port
        XTablesClient client = new XTablesClient();

        while(true) {
          client.executePutString("http://" + SERVER_ADDRESS + ":" + SERVER_PORT, "Hello World");
        }

    }


}
