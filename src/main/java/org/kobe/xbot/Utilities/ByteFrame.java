package org.kobe.xbot.Utilities;

public class ByteFrame {
    private long timestamp = System.nanoTime();
    private final byte[] frame;

    public ByteFrame(final byte[] frame) {
        this.frame = frame;
    }

    public byte[] getFrame() {
        return frame;
    }

    public ByteFrame setTimestamp(long timestamp) {
        this.timestamp = timestamp;
        return this;
    }

    public long getTimestamp() {
        return timestamp;
    }
}
