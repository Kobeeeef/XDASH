package org.kobe.xbot.xdashbackend.Entities;

public class RebootReturn extends DataReturn{
    private final String response;
    private final String status;
    private final boolean success;

    public RebootReturn(String response, String status, boolean success) {
        this.response = response;
        this.status = status;
        this.success = success;
    }
}
