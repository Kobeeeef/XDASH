package org.kobe.xbot.xdashbackend.entities;

public class FilePathWIthTimestamp extends DataReturn{
    String path;
    long timestamp;

    public FilePathWIthTimestamp(String path, long timestamp) {
        this.path = path;
        this.timestamp = timestamp;
    }
}
