package org.kobe.xbot.xdashbackend.utilities;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import org.kobe.xbot.Utilities.Entities.XTableValues;
import org.kobe.xbot.xdashbackend.entities.FormattedByteResult;
import org.kobe.xbot.xdashbackend.entities.FormattedTimeResult;
import org.kobe.xbot.xdashbackend.entities.SSHHostAddress;
import org.kobe.xbot.xdashbackend.entities.TransferProgress;

import java.io.*;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.DecimalFormat;
import java.util.*;
import java.util.function.Consumer;

public class Utilities {
    public static void main(String[] ar) throws IOException {
        InputStream inputStream = SSHHostAddress.class.getResourceAsStream("/docker/xdash-docker-watchdog.sh");


        String dockerComposeContent = Files.readString(Path.of("D:\\stuff\\PyCharmProjects\\Alt\\docker-compose.yml"), StandardCharsets.UTF_8);
        String script = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

        script = script.replace("${DOCKER_COMPOSE}", dockerComposeContent).replace("${TIMEOUT}", "2");
        String command = "bash -c '" + script + "'";
        System.out.println(command);
    }


    public static double[][][] to3DArray(List<XTableValues.BezierCurve> curves) {
        double[][][] result = new double[curves.size()][][];

        for (int i = 0; i < curves.size(); i++) {
            XTableValues.BezierCurve curve = curves.get(i);
            result[i] = new double[curve.getControlPointsCount()][2];

            for (int j = 0; j < curve.getControlPointsCount(); j++) {
                XTableValues.ControlPoint cp = curve.getControlPoints(j);
                result[i][j][0] = cp.getX();
                result[i][j][1] = cp.getY();
            }
        }

        return result;
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

    public static FormattedTimeResult formatTime(long ms, boolean longFormat) {
        // Define time units and their relative factors
        String[] units = {"ms", "s", "min", "h", "d", "w", "mo", "y"};
        long[] relativeFactors = {
                1000,       // ms to seconds
                60,         // seconds to minutes
                60,         // minutes to hours
                24,         // hours to days
                7,          // days to weeks
                30,         // weeks to months (approximate)
                12          // months to years
        };

        int unitIndex = 0;

        // Loop to find the most appropriate unit
        while (unitIndex < relativeFactors.length && ms >= relativeFactors[unitIndex]) {
            ms /= relativeFactors[unitIndex];
            unitIndex++;
        }

        // Get the correct unit
        String unit = units[unitIndex];

        // Apply long format if requested
        if (longFormat) {
            switch (unit) {
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

        // Return the result
        return new FormattedTimeResult(ms, unit, longFormat);
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
            TransferProgress progress = new TransferProgress("Creating TAR file now...", 0, 0, 0);
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

    public static String getLocalIPAddress() throws SocketException {

        return findBestNetworkAddress().getHostAddress();

    }

    public static InetAddress getLocalInetAddress() throws SocketException {

        return findBestNetworkAddress();


    }


    private static InetAddress findBestNetworkAddress() throws SocketException {
        List<NetworkInterface> sortedInterfaces = getSortedNetworkInterfaces();

        for (NetworkInterface networkInterface : sortedInterfaces) {
            if (networkInterface.isLoopback() || networkInterface.isVirtual() || !networkInterface.isUp()) continue;
            Enumeration<InetAddress> inetAddresses = networkInterface.getInetAddresses();
            while (inetAddresses.hasMoreElements()) {
                InetAddress inetAddress = inetAddresses.nextElement();

                // Prioritize site-local IPv4 addresses, excluding Docker subnets
                if (!inetAddress.isLoopbackAddress() && inetAddress.isSiteLocalAddress() && inetAddress instanceof Inet4Address) {
                    String ip = inetAddress.getHostAddress();
                    if (!isDockerSubnet(ip)) {
                        return inetAddress;
                    }
                }
            }
        }
        throw new SocketException("No suitable non-loopback IPv4 address found");
    }

    private static List<NetworkInterface> getSortedNetworkInterfaces() throws SocketException {
        List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());

        // Sort interfaces: Ethernet first, then WiFi, then others
        interfaces.sort(Comparator.comparingInt(Utilities::getInterfacePriority));
        return interfaces;
    }

    private static int getInterfacePriority(NetworkInterface networkInterface) {
        String os = System.getProperty("os.name").toLowerCase();
        String name = os.contains("win") ? networkInterface.getDisplayName().toLowerCase() : networkInterface.getName().toLowerCase();
        if (name.startsWith("eth") || name.startsWith("enp") || name.startsWith("eno") || name.startsWith("ens") || name.contains("ethernet")) {
            return 0; // Ethernet (highest priority)
        } else if (name.startsWith("wlan") || name.startsWith("wifi") || name.startsWith("wlp") || name.startsWith("wlo") || name.contains("wi-fi")) {
            return 1; // WiFi
        } else if (name.contains("tailscale") || name.contains("docker") || name.contains("virtual") || name.contains("veth")) {
            return 99; // Tailscale, Docker, Virtual interfaces (lowest priority)
        }
        return 2; // Other interfaces
    }


    /**
     * Check if the IP belongs to Docker's typical private subnet ranges.
     *
     * @param ip The IP address as a string.
     * @return true if the IP is in Docker's subnet; false otherwise.
     */
    private static boolean isDockerSubnet(String ip) {
        return (ip.startsWith("172.") && isWithinRange(ip, 16, 31)) || ip.startsWith("169.254");
    }

    /**
     * Helper method to determine if an IP's second octet is within a specific range.
     *
     * @param ip    The IP address as a string.
     * @param start The start of the range (inclusive).
     * @param end   The end of the range (inclusive).
     * @return true if within range; false otherwise.
     */
    private static boolean isWithinRange(String ip, int start, int end) {
        try {
            String[] parts = ip.split("\\.");
            int secondOctet = Integer.parseInt(parts[1]);
            return secondOctet >= start && secondOctet <= end;
        } catch (Exception e) {
            return false;
        }
    }
}
