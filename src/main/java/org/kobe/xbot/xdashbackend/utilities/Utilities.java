package org.kobe.xbot.xdashbackend.utilities;

import java.net.*;
import java.util.Enumeration;

public class Utilities {
    public static InetAddress getLocalInetAddress() throws SocketException, UnknownHostException {

        InetAddress localHost = Inet4Address.getLocalHost();
        if (localHost.isLoopbackAddress()) {
            return findNonLoopbackAddress();
        }
        return localHost;


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
