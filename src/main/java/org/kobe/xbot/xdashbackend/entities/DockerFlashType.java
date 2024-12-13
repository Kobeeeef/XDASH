package org.kobe.xbot.xdashbackend.entities;

public enum DockerFlashType {
    HARD,
    LIGHT;
    public static DockerFlashType valueOfNull(String name) {
        try {
            return DockerFlashType.valueOf(name);
        } catch (Exception ignored) {
            return null;
        }
    }
}
