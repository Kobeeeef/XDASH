package org.kobe.xbot.xdashbackend.entities;

public class DockerProgress extends DataReturn {
    private String message;
    private double percentage;
    private boolean finished = false;
    private String step;
    public DockerProgress(String message, DockerStep step, double percentage) {
        this.message = message;
        this.percentage = percentage;
        this.step = step.name();
    }


    public DockerProgress setStep(DockerStep step) {
        this.step = step.name();
        return this;
    }

    public boolean isFinished() {
        return finished;
    }

    public DockerProgress setFinished(boolean finished) {
        this.finished = finished;
        return this;
    }

    public DockerProgress setMessage(String message) {
        this.message = message;
        return this;
    }

    public DockerProgress setPercentage(double percentage) {
        this.percentage = percentage;
        return this;
    }




    @Override
    public String toString() {
        return String.format("%s [%.2f%%]", message, percentage);
    }
}

