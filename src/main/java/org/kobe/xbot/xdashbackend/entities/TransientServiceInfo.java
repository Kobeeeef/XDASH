package org.kobe.xbot.xdashbackend.entities;

public class TransientServiceInfo extends DataReturn{
    private String serviceName;
    private String type;
    private String hostname;
    private int port;
    private String address;
    public TransientServiceInfo(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getServiceName() {
        return serviceName;
    }

    public TransientServiceInfo setServiceName(String serviceName) {
        this.serviceName = serviceName;
        return this;
    }

    public String getType() {
        return type;
    }

    public TransientServiceInfo setType(String type) {
        this.type = type;
        return this;
    }

    public String getHostname() {
        return hostname;
    }

    public TransientServiceInfo setHostname(String hostname) {
        this.hostname = hostname;
        return this;
    }

    public int getPort() {
        return port;
    }

    public TransientServiceInfo setPort(int port) {
        this.port = port;
        return this;
    }

    public String getAddress() {
        return address;
    }

    public TransientServiceInfo setAddress(String address) {
        this.address = address;
        return this;
    }
}
