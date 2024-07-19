package org.kobe.xbot.xdashbackend.Entities;

public class Message extends DataReturn {
    private final String message;
    private final String type;

    public Message(DataReturn message, String type) {
        this.message = message.toJSON();
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public String getType() {
        return type;
    }
}
