package org.kobe.xbot.xdashbackend.entities;

public class XTablesDataViewReturn extends DataReturn {
    private final boolean connected;
    private final boolean isViewerOpen;
    private final long size;

    public XTablesDataViewReturn(boolean connected, boolean isViewerOpen, long size) {
        this.connected = connected;
        this.size = size;
        this.isViewerOpen = isViewerOpen;
    }

    public boolean isConnected() {
        return connected;
    }

    public long getClients() {
        return size;
    }
}


