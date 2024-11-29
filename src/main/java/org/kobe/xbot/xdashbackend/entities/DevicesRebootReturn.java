package org.kobe.xbot.xdashbackend.entities;

public class DevicesRebootReturn extends DataReturn{
    private final String response;
    private final String server;
    private final boolean success;
    private final boolean finished;
    private final int step;

    public DevicesRebootReturn(String response, String server, int step, boolean success, boolean finished) {
        this.response = response;
        this.success = success;
        this.finished = finished;
        this.step = step;
        this.server = server;
    }
}
