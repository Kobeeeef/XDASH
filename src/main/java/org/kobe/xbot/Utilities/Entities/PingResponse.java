package org.kobe.xbot.Utilities.Entities;

import java.text.NumberFormat;

/**
 * PingResponse - A class that encapsulates the result of a ping operation.
 * <p>
 * This class contains information about the success or failure of a ping,
 * as well as the round-trip time in nanoseconds. It also provides a method
 * to convert the round-trip time to milliseconds.
 * <p>
 * Author: Kobe Lei
 * Version: 1.1
 */
public class PingResponse {
    // Indicates whether the ping was successful or not
    private final boolean success;

    // Round-trip time in nanoseconds
    private final long roundTripNanoSeconds;

    /**
     * Constructor for initializing the PingResponse.
     *
     * @param success              Whether the ping was successful or not
     * @param roundTripNanoSeconds The round-trip time in nanoseconds
     */
    public PingResponse(boolean success, long roundTripNanoSeconds) {
        this.success = success;
        this.roundTripNanoSeconds = roundTripNanoSeconds;
    }

    /**
     * Gets the success status of the ping.
     *
     * @return true if the ping was successful, false otherwise
     */
    public boolean isSuccess() {
        return success;
    }

    /**
     * Gets the round-trip time in nanoseconds.
     *
     * @return The round-trip time in nanoseconds
     */
    public long getRoundTripNanoSeconds() {
        return roundTripNanoSeconds;
    }

    /**
     * Gets the round trip time in milliseconds.
     *
     * @return The round-trip time in milliseconds
     */
    public double getRoundTripMilliseconds() {
        return (double) roundTripNanoSeconds / 1_000_000;
    }

    /**
     * Provides a formatted string representation of the PingResponse object.
     * <p>
     * If the round trip time is under one million nanoseconds, it is displayed in nanoseconds,
     * otherwise in milliseconds.
     *
     * @return A string representing the success and round trip time
     */
    @Override
    public String toString() {
        NumberFormat numberFormat = NumberFormat.getInstance();
        numberFormat.setGroupingUsed(true);
        if (roundTripNanoSeconds < 1_000_000) {
            return String.format("PingResponse{success=%b, roundTripTime=%s ns}",
                    success, numberFormat.format(roundTripNanoSeconds));
        } else {
            return String.format("PingResponse{success=%b, roundTripTime=%s ms}",
                    success, numberFormat.format(getRoundTripMilliseconds()));
        }
    }
}
