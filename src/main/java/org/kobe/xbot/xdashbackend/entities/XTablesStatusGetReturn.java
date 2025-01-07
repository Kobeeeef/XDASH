package org.kobe.xbot.xdashbackend.entities;

public class XTablesStatusGetReturn extends DataReturn {
    private final boolean connected;
    private final String  raw;

    public XTablesStatusGetReturn(boolean connected, String raw) {
        this.connected = connected;
        this.raw = raw;
    }

    public boolean isConnected() {
        return connected;
    }

    public String getRaw() {
        return raw;
    }
}


