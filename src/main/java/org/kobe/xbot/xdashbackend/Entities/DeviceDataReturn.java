package org.kobe.xbot.xdashbackend.Entities;

public class DeviceDataReturn extends DataReturn{
    private final String server;
    private final String hostname;
    private final String address;
    private final String status;
    private final boolean exists;
    public DeviceDataReturn(boolean exists, String hostname, String address, String server, String status) {
        this.exists = exists;
        this.hostname = hostname;
        this.address = address;
        this.server = server;
        this.status = status;
    }

    public String getServer() {
        return server;
    }

    public String getHostname() {
        return hostname;
    }

    public String getAddress() {
        return address;
    }

    public String getStatus() {
        return status;
    }
}
