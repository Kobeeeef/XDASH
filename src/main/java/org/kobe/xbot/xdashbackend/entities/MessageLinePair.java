package org.kobe.xbot.xdashbackend.entities;

public class MessageLinePair {
    private String message;
    private int line;

    public MessageLinePair(String message, int line) {
        this.message = message;
        this.line = line;
    }

    public String getMessage() {
        return message;
    }

    public int getLine() {
        return line;
    }

    public MessageLinePair setMessage(String message) {
        this.message = message;
        return this;
    }

    public MessageLinePair setLine(int line) {
        this.line = line;
        return this;
    }
}
