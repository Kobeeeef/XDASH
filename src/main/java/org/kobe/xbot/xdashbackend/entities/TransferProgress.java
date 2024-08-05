package org.kobe.xbot.xdashbackend.entities;

public class TransferProgress extends DataReturn {
    private String message;
    private double percentage;
    private long currentBytes;
    private long totalBytes;
    private boolean finished = false;

    public TransferProgress(String message, double percentage, long currentBytes, long totalBytes) {
        this.message = message;
        this.percentage = percentage;
        this.currentBytes = currentBytes;
        this.totalBytes = totalBytes;
    }

    public boolean isFinished() {
        return finished;
    }

    public TransferProgress setFinished(boolean finished) {
        this.finished = finished;
        return this;
    }

    public TransferProgress setMessage(String message) {
        this.message = message;
        return this;
    }

    public TransferProgress setPercentage(double percentage) {
        this.percentage = percentage;
        return this;
    }

    public TransferProgress setCurrentBytes(long currentBytes) {
        this.currentBytes = currentBytes;
        return this;
    }

    public TransferProgress setTotalBytes(long totalBytes) {
        this.totalBytes = totalBytes;
        return this;
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

