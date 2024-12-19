package org.kobe.xbot.xdashbackend.entities;

public class ProgressMessageSuccessReturn extends DataReturn{
    private String message;
    private double percentage;
    private Boolean success;
    private boolean finished;

    public ProgressMessageSuccessReturn(String message, double percentage, boolean finished) {
        this.message = message;
        this.percentage = percentage;
        this.finished = finished;
    }

    public String getMessage() {
        return message;
    }

    public ProgressMessageSuccessReturn setMessage(String message) {
        this.message = message;
        return this;
    }

    public double getPercentage() {
        return percentage;
    }

    public ProgressMessageSuccessReturn setPercentage(double percentage) {
        this.percentage = percentage;
        return this;
    }

    public Boolean getSuccess() {
        return success;
    }

    public ProgressMessageSuccessReturn setSuccess(Boolean success) {
        this.success = success;
        return this;
    }

    public boolean isFinished() {
        return finished;
    }

    public ProgressMessageSuccessReturn setFinished(boolean finished) {
        this.finished = finished;
        return this;
    }
}
