package org.kobe.xbot.xdashbackend.Entities;

public class MainPageDataReturn {
    private final String devices;
    private final boolean xtablesConnectedStatus;

    public MainPageDataReturn(String devices, boolean xtablesConnectedStatus) {
        this.devices = devices;
        this.xtablesConnectedStatus = xtablesConnectedStatus;
    }

    public String getDevices() {
        return devices;
    }

    public boolean isXtablesConnectedStatus() {
        return xtablesConnectedStatus;
    }
}
