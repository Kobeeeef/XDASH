package org.kobe.xbot.Utilities;

public class LatencyInfo {
    private double networkLatencyMS;
    private double roundTripLatencyMS;
    private SystemStatistics systemStatistics;

    public LatencyInfo(double networkLatencyMS, double roundTripLatencyMS, SystemStatistics systemStatistics) {
        this.networkLatencyMS = networkLatencyMS;
        this.roundTripLatencyMS = roundTripLatencyMS;
        this.systemStatistics = systemStatistics;
    }

    public double getNetworkLatencyMS() {
        return networkLatencyMS;
    }

    public void setNetworkLatencyMS(double networkLatencyMS) {
        this.networkLatencyMS = networkLatencyMS;
    }

    public double getRoundTripLatencyMS() {
        return roundTripLatencyMS;
    }

    public void setRoundTripLatencyMS(double roundTripLatencyMS) {
        this.roundTripLatencyMS = roundTripLatencyMS;
    }

    public SystemStatistics getSystemStatistics() {
        return systemStatistics;
    }

    public void setSystemStatistics(SystemStatistics systemStatistics) {
        this.systemStatistics = systemStatistics;
    }
}
