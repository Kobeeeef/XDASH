package org.kobe.xbot.xdashbackend.entities;

public class XTablesDataReturn extends DataReturn {
    private final boolean connected;
    private final String json;

    public XTablesDataReturn(boolean connected, String json) {
        this.connected = connected;
        this.json = json;
    }

    public boolean isConnected() {
        return connected;
    }

    public String getClients() {
        return json;
    }
}


