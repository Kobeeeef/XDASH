package org.kobe.xbot.xdashbackend.utilities;

import java.io.File;
import java.io.IOException;
import java.net.*;
import java.text.DecimalFormat;
import java.util.Enumeration;

public class Utilities {
    public static InetAddress getLocalInetAddress() throws SocketException, UnknownHostException {

        InetAddress localHost = Inet4Address.getLocalHost();
        if (localHost.isLoopbackAddress()) {
            return findNonLoopbackAddress();
        }
        return localHost;


    }
    public static boolean createTar(String sourceDir, String outputTarFile) {
        try {
            ProcessBuilder pb = new ProcessBuilder("tar", "-czf", outputTarFile, "-C", sourceDir, ".");
            Process process = pb.start();
            int exitCode = process.waitFor();
            return exitCode == 0;
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return false;
        }
    }
    public static String formatNumber(double value, int decimals) {
        // Construct the pattern dynamically based on the number of decimals
        StringBuilder pattern = new StringBuilder("#.");
        for (int i = 0; i < decimals; i++) {
            pattern.append("0");
        }

        // Use the pattern to format the number
        DecimalFormat decimalFormat = new DecimalFormat(pattern.toString());
        return decimalFormat.format(value);
    }
    public static String formatDirectoryPath(String inputPath) {
        String normalizedPath = inputPath.replace("\\", "/");


        if (normalizedPath.endsWith("/")) {
            normalizedPath = normalizedPath.substring(0, normalizedPath.length() - 1);
        }


        normalizedPath = normalizedPath.trim();


        return normalizedPath;
    }
    public static boolean isValidDirectory(String path) {
        File directory = new File(path);
        return directory.exists() && directory.isDirectory() && directory.canRead();
    }
    /**
     * Estimates the memory size of a String in bytes using mathematical constants.
     *
     * @param str The string to estimate memory size for.
     * @return Estimated memory size in bytes.
     */
    public static int estimateStringSize(String str) {
        if (str == null) {
            return 0;
        }
        return 16 + str.length() * 2 + 4 + (8 - ((16 + str.length() * 2 + 4) % 8)) % 8;
    }

    private static InetAddress findNonLoopbackAddress() throws SocketException {
        Enumeration<NetworkInterface> networkInterfaces = NetworkInterface.getNetworkInterfaces();
        while (networkInterfaces.hasMoreElements()) {
            NetworkInterface networkInterface = networkInterfaces.nextElement();

            // Skip loopback and down interfaces
            if (networkInterface.isLoopback() || !networkInterface.isUp()) {
                continue;
            }

            Enumeration<InetAddress> inetAddresses = networkInterface.getInetAddresses();
            while (inetAddresses.hasMoreElements()) {
                InetAddress inetAddress = inetAddresses.nextElement();

                // Return the first non-loopback IPv4 address
                if (!inetAddress.isLoopbackAddress() && inetAddress.isSiteLocalAddress() && inetAddress.getHostAddress().contains(".")) {
                    return inetAddress;
                }
            }
        }
        throw new SocketException("No non-loopback IPv4 address found");
    }
}
