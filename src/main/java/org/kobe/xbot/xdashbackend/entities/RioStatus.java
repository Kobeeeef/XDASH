package org.kobe.xbot.xdashbackend.entities;

public class RioStatus extends DataReturn {
    private String status;
    private FilePathWIthTimestamp[] logFiles;

    public RioStatus(String status, FilePathWIthTimestamp[] logFiles) {
        this.status = status;
        this.logFiles = logFiles;
    }
}
