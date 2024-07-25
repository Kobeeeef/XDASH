package org.kobe.xbot.xdashbackend.Entities;

import java.util.List;

public class MainPageDataReturn {
    private final String devices;
    private final boolean xtablesConnectedStatus;
    private final List<String> logs;
    public MainPageDataReturn(String devices, boolean xtablesConnectedStatus, List<String> logs) {
        this.devices = devices;
        this.xtablesConnectedStatus = xtablesConnectedStatus;
        this.logs = logs;
    }

    public String getDevices() {
        return devices;
    }

    public List<String> getLogs() {
        return logs;
    }

    public boolean isXtablesConnectedStatus() {
        return xtablesConnectedStatus;
    }
}
