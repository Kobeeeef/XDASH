package org.kobe.xbot.xdashbackend;

public class StatusResponseCode {
    private final boolean success;
    private final String response;

    public StatusResponseCode(boolean success, String response) {
        this.success = success;
        this.response = response;
    }

}
