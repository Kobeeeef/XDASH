package org.kobe.xbot.xdashbackend.entities;

public class ServicesDataReturn extends DataReturn{
    private final boolean exists;
    private final String status;
    private final String services;

    public ServicesDataReturn(boolean exists, String status, String services) {
        this.exists = exists;
        this.status = status;
        this.services = services;
    }

    public String getStatus() {
        return status;
    }

    public boolean isExists() {
        return exists;
    }

    public String getServices() {
        return services;
    }
}
