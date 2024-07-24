package org.kobe.xbot.xdashbackend.Entities;

import com.jcraft.jsch.Session;

public class SSHHostAddress {
    private final String hostname;
    private final String address;
    private String status = "DISCONNECTED";
    private Session session = null;

    public SSHHostAddress(String hostname, String address) {
        this.hostname = hostname;
        this.address = address;
    }

    public String getStatus() {
        return status;
    }

    public SSHHostAddress setStatus(String status) {
        this.status = status;
        return this;
    }

    public Session getSession() {
        return session;
    }

    public SSHHostAddress setSession(Session session) {
        this.session = session;
        return this;
    }

    public String getHostname() {
        return hostname;
    }

    public String getAddress() {

        return address;
    }
}
