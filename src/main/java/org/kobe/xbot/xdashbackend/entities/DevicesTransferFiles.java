package org.kobe.xbot.xdashbackend.entities;

public class DevicesTransferFiles {
    private final String[] servers;
    private final String localDirectory;
    private final String remoteDirectory;
    private final boolean useLocalSCP;

    public String[] getServers() {
        return servers;
    }

    public String getLocalDirectory() {
        return localDirectory;
    }

    public String getRemoteDirectory() {
        return remoteDirectory;
    }

    public boolean isUseLocalSCP() {
        return useLocalSCP;
    }

    public DevicesTransferFiles(String[] servers, String localDirectory, String remoteDirectory, boolean useLocalSCP) {
        this.servers = servers;
        this.localDirectory = localDirectory;
        this.remoteDirectory = remoteDirectory;
        this.useLocalSCP = useLocalSCP;
    }
}
