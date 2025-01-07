package org.kobe.xbot.xdashbackend.entities;

public class XTablesStatusReturn extends DataReturn {
    private final boolean pushConnected;
    private final boolean reqConnected;
    private final boolean subConnected;
    private final int clients;

    public XTablesStatusReturn(boolean pushConnected, boolean reqConnected, boolean subConnected, int clients) {
        this.pushConnected = pushConnected;
        this.reqConnected = reqConnected;
        this.subConnected = subConnected;
        this.clients = clients;
    }

    public int getClients() {
        return clients;
    }
}
