package org.kobe.xbot.xdashbackend.entities;

public class DevicesScriptReturn extends DataReturn{
    private final String response;
    private final String server;
    private final Boolean success;
    private final boolean finished;
    private final int step;

    public DevicesScriptReturn(String response, String server, int step, Boolean success, boolean finished) {
        this.response = response;
        this.success = success;
        this.finished = finished;
        this.step = step;
        this.server = server;
    }
}
