package org.kobe.xbot.Utilities;

public class ClientData {
    private final String clientIP;
    private final int messages;
    private final String identifier;

    public ClientData(String clientIP, int messages, String identifier) {
        this.clientIP = clientIP;
        this.messages = messages;
        this.identifier = identifier;
    }

    public String getIdentifier() {
        return identifier;
    }

    public int getMessages() {
        return messages;
    }

    public String getClientIP() {
        return clientIP;
    }
}
