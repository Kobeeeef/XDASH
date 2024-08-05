package org.kobe.xbot.xdashbackend.entities;

public class SCPList extends DataReturn{
    private final String server;
    private final String directory;

    public SCPList(String server, String directory) {
        this.server = server;
        this.directory = directory;
    }

    public String getServer() {
        return server;
    }

    public String getDirectory() {
        return directory;
    }
}
