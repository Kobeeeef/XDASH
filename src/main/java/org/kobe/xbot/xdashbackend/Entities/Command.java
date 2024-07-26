package org.kobe.xbot.xdashbackend.Entities;

public class Command {
    private final String server;
    private final String command;

    public Command(String server, String command) {
        this.server = server;
        this.command = command;
    }

    public String getServer() {
        return server;
    }

    public String getCommand() {
        return command;
    }
}
