package org.kobe.xbot.xdashbackend.entities;

public class DevicesTransferFiles {
    private final String[] servers;
    private final String localDirectory;
    private final String remoteDirectory;

    public String[] getServers() {
        return servers;
    }

    public String getLocalDirectory() {
        return localDirectory;
    }

    public String getRemoteDirectory() {
        return remoteDirectory;
    }

    public DevicesTransferFiles(String[] servers, String localDirectory, String remoteDirectory) {
        this.servers = servers;
        this.localDirectory = localDirectory;
        this.remoteDirectory = remoteDirectory;
    }
}
