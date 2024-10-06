package org.kobe.xbot.xdashbackend.entities;

public class JournalEntry extends DataReturn{
    private String _COMM;
    private String MESSAGE;
    private String _SYSTEMD_UNIT;
    private String __REALTIME_TIMESTAMP;
    private String _UID;
    private String system;
    private String _CMDLINE;
    private String SYSLOG_IDENTIFIER;
    private int PRIORITY;
    private String _HOSTNAME;
    private String server;

    public String getServer() {
        return server;
    }

    public JournalEntry setServer(String server) {
        this.server = server;
        return this;
    }

    public String get_HOSTNAME() {
        return _HOSTNAME;
    }

    public String get_COMM() {
        return _COMM;
    }

    public String getMESSAGE() {
        return MESSAGE;
    }

    public String get_SYSTEMD_UNIT() {
        return _SYSTEMD_UNIT;
    }

    public String get__REALTIME_TIMESTAMP() {
        return __REALTIME_TIMESTAMP;
    }

    public String get_UID() {
        return _UID;
    }

    public String getSystem() {
        return system;
    }

    public String get_CMDLINE() {
        return _CMDLINE;
    }

    public String getSYSLOG_IDENTIFIER() {
        return SYSLOG_IDENTIFIER;
    }

    public int getPRIORITY() {
        return PRIORITY;
    }
}
