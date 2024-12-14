package org.kobe.xbot.xdashbackend.entities;

public class DeviceFileEditorRequest {
    String[] servers;
    String remoteFilePath;

    public String[] getServers() {
        return servers;
    }

    public String getRemoteFilePath() {
        return remoteFilePath;
    }
}
