package org.kobe.xbot.Utilities;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;

/**
 * TempConnectionManager - A utility class for managing temporary connection information.
 * <p>
 * This class handles the reading and writing of a temporary file that stores an IP address
 * used for a network connection. The file is located in the system's temporary directory.
 * <p>
 * Author: Kobe Lei
 * Version: 1.0
 * Package: org.kobe.xbot.Utilities
 * <p>
 * This is part of the XTABLES project, providing utility functions for managing temporary
 * network connection data across application restarts.
 */
public class TempConnectionManager {
    /**
     * Retrieves the stored IP address from the temporary connection file.
     * <p>
     * If the temporary file exists and contains data, the IP address is read and returned.
     * Otherwise, null is returned.
     *
     * @return the stored IP address, or null if the file does not exist or cannot be read.
     */
    public static String get() {
        File tempFile = new File(System.getProperty("java.io.tmpdir"), "JAVA-XTABLES-TEMP-CONNECTION.tmp");
        if (tempFile.exists()) {
            try {
                return Files.readString(tempFile.toPath()).trim();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * Sets the provided IP address in the temporary connection file.
     * <p>
     * If the temporary file does not exist, it is created.
     * The IP address is then written to the file,
     * ensuring that the connection information persists across application restarts.
     *
     * @param ipAddress the IP address to store in the temporary file.
     */
    public static void set(String ipAddress) {
        try {
            File tempFile = new File(System.getProperty("java.io.tmpdir"), "JAVA-XTABLES-TEMP-CONNECTION.tmp");
            if (!tempFile.exists()) {
                tempFile.createNewFile();
            }
            Files.writeString(tempFile.toPath(), ipAddress, StandardOpenOption.CREATE, StandardOpenOption.WRITE);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
