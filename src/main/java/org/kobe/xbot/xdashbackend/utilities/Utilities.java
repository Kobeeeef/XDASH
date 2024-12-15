package org.kobe.xbot.xdashbackend.utilities;

import org.kobe.xbot.xdashbackend.entities.TransferProgress;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.*;
import java.text.DecimalFormat;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.function.Consumer;

public class Utilities {
    public static InetAddress getLocalInetAddress() throws SocketException, UnknownHostException {
        InetAddress localHost = Inet4Address.getLocalHost();
        if (localHost.isLoopbackAddress()) {
            return findNonLoopbackAddress();
        }
        return localHost;
    }
    public static InetAddress getLocalInetAddressOrNull() {
        try {
            return getLocalInetAddress();
        } catch (Exception e) {
            return null;
        }
    }
    public static String getFileExtension(String filePath) {
        int dotIndex = filePath.lastIndexOf('.');
        if (dotIndex > 0) {
            return filePath.substring(dotIndex + 1);
        }
        return "";  // No extension
    }
    public static boolean createTar(String sourcePath, String outputTarFile, Consumer<TransferProgress> consumer) {
        try {
            ProcessBuilder pb;
            File sourceFile = new File(sourcePath);

            if (sourceFile.isDirectory()) {
                pb = new ProcessBuilder("tar", "-czvf", outputTarFile, "-C", sourcePath, ".");
            } else {
                String parentDir = sourceFile.getParent();
                String fileName = sourceFile.getName();
                pb = new ProcessBuilder("tar", "-czvf", outputTarFile, "-C", parentDir, fileName);
            }

            pb.redirectErrorStream(true);
            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            int fileCount = 0;
            TransferProgress progress = new TransferProgress("Creating TAR file now..." , 0, 0, 0);
            consumer.accept(progress);
            while ((line = reader.readLine()) != null) {
                fileCount++;

                if (fileCount % 4 == 0) {
                    progress.setMessage(line + " | " + fileCount + " files processed...");
                    consumer.accept(progress);
                }
            }

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

        int lastSlashIndex = normalizedPath.lastIndexOf('/');
        int lastDotIndex = normalizedPath.lastIndexOf('.');

        if (lastDotIndex > lastSlashIndex) {
            normalizedPath = normalizedPath.substring(0, lastDotIndex);
        }

        normalizedPath = normalizedPath.trim();

        return normalizedPath;
    }

    public static boolean isValidPath(String path) {
        File directory = new File(path);
        return directory.exists() && directory.canRead();
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
