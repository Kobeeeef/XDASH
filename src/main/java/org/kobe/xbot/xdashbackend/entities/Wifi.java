package org.kobe.xbot.xdashbackend.entities;

public class Wifi {
    private final String ssid;
    private final String bssid;
    private final Integer signalStrength;
    private final String securityType;
    private final Boolean connected;
    public Wifi(String ssid, String bssid, Integer signalStrength, String securityType) {
        this.ssid = ssid;
        this.bssid = bssid;
        this.signalStrength = signalStrength;
        this.securityType = securityType;
        this.connected = null;
    }
    public Wifi(String ssid, String bssid, Integer signalStrength, String securityType, Boolean connected) {
        this.ssid = ssid;
        this.bssid = bssid;
        this.signalStrength = signalStrength;
        this.securityType = securityType;
        this.connected = connected;
    }
    public String getSsid() {
        return ssid;
    }

    public String getBssid() {
        return bssid;
    }

    public Integer getSignalStrength() {
        return signalStrength;
    }

    public String getSecurityType() {
        return securityType;
    }

    @Override
    public String toString() {
        return "SSID: " + ssid + ", BSSID: " + bssid + ", Signal: " + signalStrength + ", Security: " + securityType;
    }
}