package org.kobe.xbot.xdashbackend.entities;

public class FormattedTimeResult {
    private final long value;
    private final String unit;
    private final boolean longFormat;

    public FormattedTimeResult(long value, String unit, boolean longFormat) {
        this.value = value;
        this.unit = unit;
        this.longFormat = longFormat;
    }

    public long getValue() {
        return value;
    }

    public String getUnit() {
        return unit;
    }

    @Override
    public String toString() {
        return value + (longFormat ? " " : "") + unit;
    }
}

