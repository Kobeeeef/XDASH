package org.kobe.xbot.xdashbackend.entities;

public class StatusMessageCode {
    private final Boolean success;
    private final String message;
    private Boolean finished;
    public StatusMessageCode(Boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public Boolean getFinished() {
        return finished;
    }

    public StatusMessageCode setFinished(Boolean finished) {
        this.finished = finished;
        return this;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }
}
