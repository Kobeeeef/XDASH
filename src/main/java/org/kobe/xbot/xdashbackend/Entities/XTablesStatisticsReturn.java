package org.kobe.xbot.xdashbackend.Entities;

import com.google.gson.Gson;
import org.kobe.xbot.Client.XTablesClient;

public class XTablesStatisticsReturn extends DataReturn {
    private static final Gson gson = new Gson();
    private final boolean connected;
    private final String info;
    private final Double networkLatencyMS;
    private final Double roundTripLatencyMS;

    public XTablesStatisticsReturn(boolean connected, XTablesClient.LatencyInfo info) {
        this.connected = connected;
        this.info = info == null ? null : gson.toJson(info.getSystemStatistics());
        this.networkLatencyMS = info == null ? null : info.getNetworkLatencyMS();
        this.roundTripLatencyMS = info == null ? null : info.getRoundTripLatencyMS();

    }

    public boolean isConnected() {
        return connected;
    }

    public String getClients() {
        return info;
    }
}
