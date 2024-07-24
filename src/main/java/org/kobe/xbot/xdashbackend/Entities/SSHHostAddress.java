package org.kobe.xbot.xdashbackend.Entities;

import com.jcraft.jsch.Session;

public class SSHHostAddress {
    private final String hostname;
    private final String address;
    private Session session = null;

    public SSHHostAddress(String hostname, String address) {
        this.hostname = hostname;
        this.address = address;
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
