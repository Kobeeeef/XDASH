package org.kobe.xbot.xdashbackend.utilities;

import org.kobe.xbot.xdashbackend.XdashbackendApplication;
import org.kobe.xbot.xdashbackend.entities.FormattedByteResult;
import org.kobe.xbot.xdashbackend.entities.FormattedTimeResult;
import org.kobe.xbot.xdashbackend.entities.TransferProgress;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.management.ManagementFactory;
import java.net.*;
import java.text.DecimalFormat;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.List;
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
    public static double roundToDecimalPlaces(double value, int decimalPlaces) {
        double scale = Math.pow(10, decimalPlaces);
        return Math.round(value * scale) / scale;
    }

    public static String getFileExtension(String filePath) {
        int dotIndex = filePath.lastIndexOf('.');
        if (dotIndex > 0) {
            return filePath.substring(dotIndex + 1);
        }
        return "";  // No extension
    }
    public static FormattedByteResult formatBytes(int bytes, boolean longFormat) {
        // Define byte size units
        String[] units = {"Bytes", "KB", "MB", "GB", "TB", "PB"};

        // Find the index of the unit based on byte size
        int unitIndex = 0;
        double value = bytes;
        while (value >= 1024 && unitIndex < units.length - 1) {
            value /= 1024;
            unitIndex++;
        }

        // Round the value to the nearest integer
        int roundedValue = (int) Math.round(value);

        // Get the unit
        String unit = units[unitIndex];

        // If long format is requested, return full unit name
        if (longFormat) {
            switch (unit) {
                case "KB":
                    unit = "Kilobytes";
                    break;
                case "MB":
                    unit = "Megabytes";
                    break;
                case "GB":
                    unit = "Gigabytes";
                    break;
                case "TB":
                    unit = "Terabytes";
                    break;
                case "PB":
                    unit = "Petabytes";
                    break;
                default:
                    break;
            }
        }

        // Return an instance of FormattedByteResult
        return new FormattedByteResult(roundedValue, unit);
    }
    public static FormattedTimeResult formatTime(long ns, boolean longFormat) {
        // Define time units
        String[] units = {"ns", "μs", "ms", "s", "min", "h", "d", "w", "mo", "y"};
        long[] unitFactors = {
                1,                          // ns
                1000,                       // μs
                1000000,                    // ms
                1000000000,                 // s
                60000000000L,               // min
                3600000000000L,             // h
                86400000000000L,            // d (1 day = 24 hours * 60 min * 60 sec * 10^9 ns)
                604800000000000L,           // w (1 week = 7 days)
                2592000000000000L,          // mo (1 month = 30 days)
                31536000000000000L          // y (1 year = 365 days)
        };

        int unitIndex = 0;
        long value = ns;

        // Convert ns to the most appropriate unit
        while (value >= unitFactors[unitIndex] && unitIndex < units.length - 1) {
            value /= unitFactors[unitIndex + 1]; // Divide by the factor for the next unit
            unitIndex++;
        }

        // If long format is requested, return full unit name
        String unit = units[unitIndex];
        if (longFormat) {
            switch (unit) {
                case "μs":
                    unit = "Microseconds";
                    break;
                case "ms":
                    unit = "Milliseconds";
                    break;
                case "s":
                    unit = "Seconds";
                    break;
                case "min":
                    unit = "Minutes";
                    break;
                case "h":
                    unit = "Hours";
                    break;
                case "d":
                    unit = "Days";
                    break;
                case "w":
                    unit = "Weeks";
                    break;
                case "mo":
                    unit = "Months";
                    break;
                case "y":
                    unit = "Years";
                    break;
                default:
                    break;
            }
        }

        // Return the formatted result
        return new FormattedTimeResult(value, unit, longFormat);
    }

    public static String formatError(Throwable throwable) {
        StringBuilder sb = new StringBuilder();
        sb.append("Error: ").append(throwable.getMessage()).append("\n");

        if (throwable.getCause() != null) {
            sb.append("Cause: ").append(throwable.getCause()).append("\n");
        }

        sb.append("Stack Trace:\n");
        for (StackTraceElement element : throwable.getStackTrace()) {
            sb.append("\tat ").append(element.toString()).append("\n");
        }

        sb.append("Exception Type: ").append(throwable.getClass().getName()).append("\n");

        return sb.toString();
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
