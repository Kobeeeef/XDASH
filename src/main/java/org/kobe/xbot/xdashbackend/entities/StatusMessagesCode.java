package org.kobe.xbot.xdashbackend.entities;

public class StatusMessagesCode {
    private final Boolean success;
    private final String[] messages;
    private Boolean finished;
    public StatusMessagesCode(Boolean success, String[] messages) {
        this.success = success;
        this.messages = messages;
    }

    public Boolean getFinished() {
        return finished;
    }

    public StatusMessagesCode setFinished(Boolean finished) {
        this.finished = finished;
        return this;
    }

    public boolean isSuccess() {
        return success;
    }

    public Boolean getSuccess() {
        return success;
    }

    public String[] getMessages() {
        return messages;
    }
}
