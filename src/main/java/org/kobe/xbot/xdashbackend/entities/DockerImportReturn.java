package org.kobe.xbot.xdashbackend.entities;

public class DockerImportReturn extends DataReturn{
    private final String response;
    private final String server;
    private final Boolean success;
    private final boolean finished;

    public DockerImportReturn(String response, String server, Boolean success, boolean finished) {
        this.response = response;
        this.server = server;
        this.success = success;
        this.finished = finished;
    }
}
