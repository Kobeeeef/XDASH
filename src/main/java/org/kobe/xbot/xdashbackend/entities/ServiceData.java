package org.kobe.xbot.xdashbackend.entities;

public class ServiceData extends DataReturn {
    private final String serviceID;
    private final String server;

    public ServiceData(String serviceID, String server) {
        this.serviceID = serviceID;
        this.server = server;
    }

    public String getServiceID() {
        return serviceID;
    }

    public String getServer() {
        return server;
    }
}
