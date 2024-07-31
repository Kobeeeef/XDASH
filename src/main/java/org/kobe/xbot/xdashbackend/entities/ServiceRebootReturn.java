package org.kobe.xbot.xdashbackend.entities;

public class ServiceRebootReturn extends DataReturn{
    private final boolean success;
    private final String response;

    public ServiceRebootReturn(boolean success, String response) {
        this.success = success;
        this.response = response;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getResponse() {
        return response;
    }
}
