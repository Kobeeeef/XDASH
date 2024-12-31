package org.kobe.xbot.xdashbackend.entities;

public class Notification {
    private String severity;
    private final String type;
    private String summary;
    private String detail;
    private String exceptionType;
    private String cause;
    private String[] stackTrace;

    public Notification(NotificationType type) {
        this.type = type.name();
    }

    public String getExceptionType() {
        return exceptionType;
    }

    public Notification setExceptionType(String exceptionType) {
        this.exceptionType = exceptionType;
        return this;
    }

    public String getCause() {
        return cause;
    }

    public Notification setCause(String cause) {
        this.cause = cause;
        return this;
    }

    public String[] getStackTrace() {
        return stackTrace;
    }

    public Notification setStackTrace(String[] stackTrace) {
        this.stackTrace = stackTrace;
        return this;
    }

    public Notification setSeverity(NotificationSeverity severity) {
        this.severity = severity.name();
        return this;
    }

    public NotificationType getType() {
        return NotificationType.valueOf(type);
    }

    public NotificationSeverity getSeverity() {
        return NotificationSeverity.valueOf(severity);
    }

    public String getSummary() {
        return summary;
    }

    public Notification setSummary(String summary) {
        this.summary = summary;
        return this;
    }

    public String getDetail() {
        return detail;
    }

    public Notification setDetail(String detail) {
        this.detail = detail;
        return this;
    }

    public enum NotificationType {
        fatal,
        normal
    }

    public enum NotificationSeverity {
        success,
        error,
        info,
        warn,
        contrast,
        secondary
    }
}

