package org.kobe.xbot.xdashbackend.Entities;

import com.google.gson.Gson;

public class Message extends DataReturn {
    private static final Gson gson = new Gson();
    private final String message;
    private final String type;

    public Message(DataReturn message, String type) {
        this.message = message.toJSON();
        this.type = type;
    }
    public Message(Object o, String type) {
        this.message = gson.toJson(o);
        this.type = type;
    }
    public String getMessage() {
        return message;
    }

    public String getType() {
        return type;
    }
}
