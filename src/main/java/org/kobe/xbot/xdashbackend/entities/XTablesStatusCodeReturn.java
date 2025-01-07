package org.kobe.xbot.xdashbackend.entities;

public class XTablesStatusCodeReturn extends DataReturn {
    private final boolean connected;
    private final boolean success;

    public XTablesStatusCodeReturn(boolean connected, boolean success) {
        this.connected = connected;
        this.success = success;
    }

    public boolean isConnected() {
        return connected;
    }

    public boolean isSuccess() {
        return success;
    }
}


