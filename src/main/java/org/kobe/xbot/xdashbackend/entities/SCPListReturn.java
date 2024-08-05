package org.kobe.xbot.xdashbackend.entities;

public class SCPListReturn extends DataReturn{
    private final String response;
    private final String files;
    private final boolean success;

    public SCPListReturn(boolean success, String files, String response) {
        this.success = success;
        this.files = files;
        this.response = response;
    }

    public String getResponse() {
        return response;
    }

    public String getFiles() {
        return files;
    }

    public boolean isSuccess() {
        return success;
    }
}
