package org.kobe.xbot.Utilities.Entities;

import org.kobe.xbot.Server.XTablesData;

public class ScriptParameters {
    private XTablesData data;
    private String customData;

    public ScriptParameters(XTablesData data, String customData) {
        this.data = data;
        this.customData = customData;
    }

    public XTablesData getData() {
        return data;
    }

    public void setData(XTablesData data) {
        this.data = data;
    }

    public String getCustomData() {
        return customData;
    }

    public void setCustomData(String customData) {
        this.customData = customData;
    }

    @Override
    public String toString() {
        return "ScriptParameters{" +
                "data=" + data +
                ", customData='" + customData + '\'' +
                '}';
    }
}

