package org.kobe.xbot.xdashbackend.entities;

public class XTablesStatusCodeReturn extends DataReturn {
    private final boolean connected;
    private final String code;

    public XTablesStatusCodeReturn(boolean connected, String code) {
        this.connected = connected;
        this.code = code;
    }

    public boolean isConnected() {
        return connected;
    }

    public String getCode() {
        return code;
    }
}


