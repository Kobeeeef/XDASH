package org.kobe.xbot.xdashbackend.Entities;

public class DevicesData {
    private final String hostname;
    private final String address;
    private final boolean connected;

    public DevicesData(String hostname, String address, boolean connected) {
        this.hostname = hostname;
        this.address = address;
        this.connected = connected;
    }

    public boolean isConnected() {
        return connected;
    }

    public String getHostname() {
        return hostname;
    }

    public String getAddress() {
        return address;
    }
}
