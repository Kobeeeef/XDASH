package org.kobe.xbot.xdashbackend.entities;

import oshi.SystemInfo;
import oshi.hardware.HardwareAbstractionLayer;
import oshi.hardware.NetworkIF;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class NetworkInterfaceDetails {

    private final String name;
    private final String displayName;
    private final String macAddress;
    private final List<String> ipv4Addresses;
    private final List<String> ipv6Addresses;
    private final long bytesSent;
    private final long bytesReceived;
    private final long packetsSent;
    private final long packetsReceived;
    private final long speedBits;
    private final boolean isUp;
    private final long maximumTransmissionUnit;
    private static final SystemInfo systemInfo = new SystemInfo();
    private static final HardwareAbstractionLayer hal = systemInfo.getHardware();
    public NetworkInterfaceDetails(String name, String displayName, String macAddress, List<String> ipv4Addresses,
                                   List<String> ipv6Addresses, long bytesSent, long bytesReceived, long packetsSent,
                                   long packetsReceived, long speedBits, boolean isUp, long mtu) {
        this.name = name;
        this.displayName = displayName;
        this.macAddress = macAddress;
        this.ipv4Addresses = ipv4Addresses;
        this.ipv6Addresses = ipv6Addresses;
        this.bytesSent = bytesSent;
        this.bytesReceived = bytesReceived;
        this.packetsSent = packetsSent;
        this.packetsReceived = packetsReceived;
        this.speedBits = speedBits;
        this.isUp = isUp;
        this.maximumTransmissionUnit = mtu;
    }

    // Getters for each attribute
    public String getName() {
        return name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getMacAddress() {
        return macAddress;
    }

    public List<String> getIpv4Addresses() {
        return ipv4Addresses;
    }

    public List<String> getIpv6Addresses() {
        return ipv6Addresses;
    }

    public long getBytesSent() {
        return bytesSent;
    }

    public long getBytesReceived() {
        return bytesReceived;
    }

    public long getPacketsSent() {
        return packetsSent;
    }

    public long getPacketsReceived() {
        return packetsReceived;
    }

    public long getSpeedBits() {
        return speedBits;
    }

    public boolean isUp() {
        return isUp;
    }

    public long getMaximumTransmissionUnit() {
        return maximumTransmissionUnit;
    }

    // Method to retrieve network details
    public static List<NetworkInterfaceDetails> getNetworkDetails() {
        List<NetworkInterfaceDetails> networkDetailsList = new ArrayList<>();


        List<NetworkIF> networkIFs = hal.getNetworkIFs();

        for (NetworkIF net : networkIFs) {
            net.updateAttributes(); // Refreshes the interface statistics
            NetworkInterfaceDetails details = new NetworkInterfaceDetails(
                    net.getName(),
                    net.getDisplayName(),
                    net.getMacaddr(),
                    Arrays.asList(net.getIPv4addr()),
                    Arrays.asList(net.getIPv6addr()),
                    net.getBytesSent(),
                    net.getBytesRecv(),
                    net.getPacketsSent(),
                    net.getPacketsRecv(),
                    net.getSpeed(),
                    net.isConnectorPresent(),
                    net.getMTU()
            );
            networkDetailsList.add(details);
        }

        return networkDetailsList;
    }
}
