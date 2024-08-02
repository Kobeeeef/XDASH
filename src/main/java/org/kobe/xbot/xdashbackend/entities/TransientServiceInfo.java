package org.kobe.xbot.xdashbackend.entities;

public class TransientServiceInfo extends DataReturn{
    private String serviceName;
    private String type;
    private String hostname;
    private int port;
    private String server;
    private String address;
    private String application;
    public TransientServiceInfo(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getServer() {
        return server;
    }

    public TransientServiceInfo setServer(String server) {
        this.server = server;
        return this;
    }

    public String getApplication() {
        return application;
    }

    public TransientServiceInfo setApplication(String application) {
        this.application = application;
        return this;
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
