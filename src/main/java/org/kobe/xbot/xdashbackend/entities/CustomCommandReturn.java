package org.kobe.xbot.xdashbackend.entities;

public class CustomCommandReturn {
    private final String[] servers;
    private final String command;

    public CustomCommandReturn(String[] servers, String type) {
        this.servers = servers;
        this.command = type;
    }

    public String getCommand() {
        return command;
    }

    public String[] getServers() {
        return servers;
    }
}
