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
