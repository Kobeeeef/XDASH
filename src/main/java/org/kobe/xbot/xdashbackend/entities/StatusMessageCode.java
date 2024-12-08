package org.kobe.xbot.xdashbackend.entities;

public class StatusMessageCode {
    private final boolean success;
    private final String message;

    public StatusMessageCode(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }
}
