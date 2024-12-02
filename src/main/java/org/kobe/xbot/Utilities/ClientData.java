package org.kobe.xbot.Utilities;

public class ClientData {
    private final String clientIP;
    private final String hostname;
    private final int messages;
    private final String identifier;
    private String stats;
    private final int bufferSize;
    public ClientData(String clientIP, String hostname, int messages, String identifier, int bufferSize) {
        this.clientIP = clientIP;
        this.hostname = hostname;
        this.messages = messages;
        this.identifier = identifier;
        this.bufferSize = bufferSize;
    }

    public String getIdentifier() {
        return identifier;
    }

    public ClientData setStats(String stats) {
        this.stats = stats;
        return this;
    }

    public int getBufferSize() {
        return bufferSize;
    }



    public int getMessages() {
        return messages;
    }

    public String getClientIP() {
        return clientIP;
    }
}
