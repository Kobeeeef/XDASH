package org.kobe.xbot.xdashbackend.entities;

public class DockerBuildReturn {
    private String CONTAINER_NAME;
    private String IMAGE_NAME;
    private String ARCHITECTURE;
    private int COMPRESSION;


    public int getCOMPRESSION() {
        return COMPRESSION;
    }

    public String getCONTAINER_NAME() {
        return CONTAINER_NAME;
    }

    public String getIMAGE_NAME() {
        return IMAGE_NAME;
    }

    public String getARCHITECTURE() {
        return ARCHITECTURE;
    }
}
