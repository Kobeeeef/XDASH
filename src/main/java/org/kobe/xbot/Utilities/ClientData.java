package org.kobe.xbot.Utilities;

public class ClientData {
    private final String clientIP;
    private final String hostname;
    private final String identifier;
    private String stats;

    public ClientData(String clientIP, String hostname, String identifier) {
        this.clientIP = clientIP;
        this.hostname = hostname;
        this.identifier = identifier;
    }

    public String getIdentifier() {
        return identifier;
    }

    public ClientData setStats(String stats) {
        this.stats = stats;
        return this;
    }

    public String getClientIP() {
        return clientIP;
    }
}
