package org.kobe.xbot.xdashbackend.entities;

public class DockerImportRequest {
    private String[] servers;
    private String containerName;
    private String imageName;
    private String architecture;
    private String flashType;
    private boolean useCompose;
    private boolean wasGZFile;
    private boolean syncOnly;

    public boolean isSyncOnly() {
        return syncOnly;
    }

    public String getFlashType() {
        return flashType;
    }

    public boolean isUseCompose() {
        return useCompose;
    }

    public boolean isWasGZFile() {
        return wasGZFile;
    }

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
