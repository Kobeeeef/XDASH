package org.kobe.xbot.Utilities;


//import org.bytedeco.javacpp.BytePointer;
//import org.bytedeco.opencv.global.opencv_imgcodecs;
//import org.bytedeco.opencv.opencv_core.Mat;

import java.net.*;
import java.util.Enumeration;
import java.util.concurrent.ConcurrentHashMap;

public class Utilities {

//    public static byte[] matToByteArray(Mat mat) {
//        BytePointer bytePointer = new BytePointer();
//        opencv_imgcodecs.imencode(".jpg", mat, bytePointer); // Encode the image
//        byte[] byteArray = new byte[(int) bytePointer.limit()];
//        bytePointer.get(byteArray);
//        return byteArray;
//    }


    public static String getLocalIPAddress() {
        try {
            InetAddress localHost = Inet4Address.getLocalHost();
            if (localHost.isLoopbackAddress()) {
                return findNonLoopbackAddress().getHostAddress();
            }
            return localHost.getHostAddress();
        } catch (UnknownHostException | SocketException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static InetAddress getLocalInetAddress() {
        try {
            InetAddress localHost = Inet4Address.getLocalHost();
            if (localHost.isLoopbackAddress()) {
                return findNonLoopbackAddress();
            }
            return localHost;
        } catch (UnknownHostException | SocketException ignored) {
        }
        return null;
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

    public static <E extends Enum<E>> boolean contains(Class<E> enumClass, String constant) {
        for (E e : enumClass.getEnumConstants()) {
            if (e.name().equals(constant)) {
                return true;
            }
        }
        return false;
    }

    public static boolean isValidValue(String jsonString) {
        try {
            // Attempt to parse the JSON string
            Json.read(jsonString);
            return true; // If parsing succeeds, JSON is valid
        } catch (Error | Exception e) {
            return false; // If parsing fails, JSON is invalid
        }
    }

    @SafeVarargs
    public static <K, V> ConcurrentHashMap<K, V> combineConcurrentHashMaps(ConcurrentHashMap<K, V>... maps) {
        ConcurrentHashMap<K, V> combinedMap = new ConcurrentHashMap<>();
        for (ConcurrentHashMap<K, V> map : maps) {
            combinedMap.putAll(map);
        }
        return combinedMap;
    }

    public static boolean validateKey(String key, boolean throwError) {
        // Check if the key is null or empty
        if (key == null) {
            if (throwError) throw new IllegalArgumentException("Key cannot be null.");
            else return false;
        }

        // Check if key contains spaces
        if (key.contains(" ")) {
            if (throwError) throw new IllegalArgumentException("Key cannot contain spaces.");
            else return false;
        }

        // Check if key starts or ends with '.'
        if (key.startsWith(".") || key.endsWith(".")) {
            if (throwError) throw new IllegalArgumentException("Key cannot start or end with '.'");
            else return false;
        }

        // Check if key contains multiple consecutive '.'
        if (key.contains("..")) {
            if (throwError) throw new IllegalArgumentException("Key cannot contain multiple consecutive '.'");
            else return false;
        }

        // Check if each part of the key separated by '.' is empty
        if (!key.isEmpty()) {
            int length = key.length();
            int start = 0;
            boolean partFound = false;

            for (int i = 0; i < length; i++) {
                if (key.charAt(i) == '.') {
                    if (i == start) {
                        // Empty part found
                        if (throwError) throw new IllegalArgumentException("Key contains empty part(s).");
                        else return false;
                    }
                    // Process the part if needed here
                    start = i + 1;
                    partFound = true;
                }
            }

            // Check the last part
            if (start < length) {
                partFound = true;
            } else {
                if (throwError) throw new IllegalArgumentException("Key contains empty part(s).");
                else return false;
            }

            return partFound;
        }

        return true;
    }

    public static boolean validateName(String name, boolean throwError) {
        // Check if the name is null or empty
        if (name == null) {
            if (throwError) throw new IllegalArgumentException("Name cannot be null.");
            else return false;
        }

        // Check if the name contains spaces
        if (name.contains(" ")) {
            if (throwError) throw new IllegalArgumentException("Name cannot contain spaces.");
            else return false;
        }

        // Check if the name contains '.'
        if (name.contains(".")) {
            if (throwError) throw new IllegalArgumentException("Name cannot contain '.'");
            else return false;
        }


        return true;
    }
}
