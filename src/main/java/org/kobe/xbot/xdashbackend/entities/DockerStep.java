package org.kobe.xbot.xdashbackend.entities;

public enum DockerStep {
    STARTING,
    BUILDING,
    COMPLETED,
    SAVING,
    FINISHED,
    CLEANING,
    ERROR
}
