package org.kobe.xbot.xdashbackend.entities;
public  class TransferProgress {
    private final String message;
    private final double percentage;
    private final long currentBytes;
    private final long totalBytes;

    public TransferProgress(String message, double percentage, long currentBytes, long totalBytes) {
        this.message = message;
        this.percentage = percentage;
        this.currentBytes = currentBytes;
        this.totalBytes = totalBytes;
    }

    public String getMessage() {
        return message;
    }

    public double getPercentage() {
        return percentage;
    }

    public long getCurrentBytes() {
        return currentBytes;
    }

    public long getTotalBytes() {
        return totalBytes;
    }

    @Override
    public String toString() {
        return String.format("%s [%.2f%%] (%d/%d bytes)", message, percentage, currentBytes, totalBytes);
    }
}

