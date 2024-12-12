package org.kobe.xbot.xdashbackend.entities;

public class DockerImportRequest {
    private String[] servers;
    private String containerName;
    private String imageName;
    private String architecture;

    public String[] getServers() {
        return servers;
    }

    public String getArchitecture() {
        return architecture;
    }

    public String getContainerName() {
        return containerName;
    }

    public String getImageName() {
        return imageName;
    }
}
