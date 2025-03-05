package org.kobe.xbot.xdashbackend.entities;

public class RioStatus extends DataReturn {
    private String status;
    private String[] logFiles;

    public RioStatus(String status, String[] logFiles) {
        this.status = status;
        this.logFiles = logFiles;
    }
}
