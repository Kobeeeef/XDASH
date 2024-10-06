package org.kobe.xbot.xdashbackend.entities;

public class DeviceLogRange {
    private boolean success;
    private int start;
    private int end;
    private String server;

    public DeviceLogRange(boolean success) {
        this.success = success;
    }

    public boolean isSuccess() {
        return success;
    }

    public DeviceLogRange setSuccess(boolean success) {
        this.success = success;
        return this;
    }

    public String getServer() {
        return server;
    }

    public DeviceLogRange setServer(String server) {
        this.server = server;
        return this;
    }

    public int getStart() {
        return start;
    }

    public DeviceLogRange setStart(int start) {
        this.start = start;
        return this;
    }

    public int getEnd() {
        return end;
    }

    public DeviceLogRange setEnd(int end) {
        this.end = end;
        return this;
    }
}
