package org.kobe.xbot.xdashbackend.Entities;

public class XTablesStatusReturn extends DataReturn {
    private final boolean connected;
    private final int clients;

    public XTablesStatusReturn(boolean connected, int clients) {
        this.connected = connected;
        this.clients = clients;
    }

    public boolean isConnected() {
        return connected;
    }

    public int getClients() {
        return clients;
    }
}
