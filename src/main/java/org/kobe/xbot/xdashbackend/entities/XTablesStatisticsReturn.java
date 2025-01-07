package org.kobe.xbot.xdashbackend.entities;

import com.google.gson.Gson;
import org.kobe.xbot.Utilities.LatencyInfo;
import org.kobe.xbot.Utilities.SystemStatistics;

public class XTablesStatisticsReturn extends DataReturn {
    private static final Gson gson = new Gson();
    private final boolean connected;
    private final String info;
    private Double roundTripLatencyMS;

    public XTablesStatisticsReturn(boolean connected, SystemStatistics info) {
        this.connected = connected;
        this.info = info == null ? null : gson.toJson(info);

    }

    public Double getRoundTripLatencyMS() {
        return roundTripLatencyMS;
    }

    public XTablesStatisticsReturn setRoundTripLatencyMS(Double roundTripLatencyMS) {
        this.roundTripLatencyMS = roundTripLatencyMS;
        return this;
    }

    public boolean isConnected() {
        return connected;
    }

    public String getClients() {
        return info;
    }
}
