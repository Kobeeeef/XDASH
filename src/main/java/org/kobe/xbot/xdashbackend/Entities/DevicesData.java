package org.kobe.xbot.xdashbackend.Entities;

public class DevicesData {
    private final String hostname;
    private final String address;
    private final boolean connected;
    private final String status;

    public DevicesData(String hostname, String address, boolean connected, String status) {
        this.hostname = hostname;
        this.address = address;
        this.connected = connected;
        this.status = status;
    }

    public boolean isConnected() {
        return connected;
    }

    public String getStatus() {
        return status;
    }

    public String getHostname() {
        return hostname;
    }

    public String getAddress() {
        return address;
    }
}
