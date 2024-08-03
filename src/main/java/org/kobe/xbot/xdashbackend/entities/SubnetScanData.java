package org.kobe.xbot.xdashbackend.entities;

public class SubnetScanData extends DataReturn{
    private final String message;
    private final boolean running;
    private final String address;
    private final String hostname;
    private final String subnet;

    public SubnetScanData(String message, boolean running, String address, String hostname, String subnet) {
        this.message = message;
        this.running = running;
        this.address = address;
        this.hostname = hostname;
        this.subnet = subnet;
    }

    public String getHostname() {
        return hostname;
    }

    public String getAddress() {
        return address;
    }

    public String getMessage() {
        return message;
    }

    public boolean isRunning() {
        return running;
    }
}
