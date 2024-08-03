package org.kobe.xbot.xdashbackend.entities;

public class SubnetScanData extends DataReturn {
    private final String message;
    private final boolean running;
    private final String address;
    private final String hostname;
    private final String subnet;
    private final String status;

    public SubnetScanData(String message, boolean running, String address, String hostname, String subnet, String status) {
        this.message = message;
        this.running = running;
        this.address = address;
        this.hostname = hostname;
        this.subnet = subnet;
        this.status = status;
    }

    public String getSubnet() {
        return subnet;
    }

    public String isFound() {
        return status;
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
