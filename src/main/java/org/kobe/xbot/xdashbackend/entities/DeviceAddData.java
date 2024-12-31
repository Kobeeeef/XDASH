package org.kobe.xbot.xdashbackend.entities;

public class DeviceAddData {
    private final String hostname;
    private final String address;
    private final String username;
    private final String password;

    public DeviceAddData(String hostname, String address, String username, String password) {
        this.hostname = hostname;
        this.address = address;
        this.username = username;
        this.password = password;
    }

    public String getHostname() {
        return hostname;
    }

    public String getAddress() {
        return address;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

}
