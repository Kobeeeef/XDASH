package org.kobe.xbot.xdashbackend.entities;

public class CommandReturn extends DataReturn{
    private final String response;
    private final String status;
    private final boolean success;
    private final boolean finished;

    public CommandReturn(String response, String status, boolean success, boolean finished) {
        this.response = response;
        this.status = status;
        this.success = success;
        this.finished = finished;
    }
}
