package org.kobe.xbot.xdashbackend.Entities;

public class DevicesData {
    private final String hostname;
    private final String address;
    private final String status;

    public DevicesData(String hostname, String address, String status) {
        this.hostname = hostname;
        this.address = address;
        this.status = status;
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
