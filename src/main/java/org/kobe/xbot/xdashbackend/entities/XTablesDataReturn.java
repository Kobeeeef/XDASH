package org.kobe.xbot.xdashbackend.entities;

public class XTablesDataReturn extends DataReturn {
    private final boolean connected;
    private final boolean isViewerOpen;
    private final String json;

    public XTablesDataReturn(boolean connected, boolean isViewerOpen, String json) {
        this.connected = connected;
        this.json = json;
        this.isViewerOpen = isViewerOpen;
    }

    public boolean isConnected() {
        return connected;
    }

    public String getClients() {
        return json;
    }
}


