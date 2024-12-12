package org.kobe.xbot.xdashbackend.entities;

public class DevicesReconnectReturn extends DataReturn{
    private final String response;
    private final String sshHostAddress;
    private final Boolean success;
    private final boolean finished;

    public DevicesReconnectReturn(String response, String sshHostAddress, Boolean success, boolean finished) {
        this.response = response;
        this.sshHostAddress = sshHostAddress;
        this.success = success;
        this.finished = finished;
    }
}
