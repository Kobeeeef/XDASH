package org.kobe.xbot.xdashbackend.entities;

public class XCASTERSubnetScan {
    private String subnet;
    private int low;
    private int high;
    private int threads;
    private int port;

    public String getSubnet() {
        return subnet;
    }

    public int getLow() {
        return low;
    }

    public int getHigh() {
        return high;
    }

    public int getThreads() {
        return threads;
    }

    public int getPort() {
        return port;
    }
}
