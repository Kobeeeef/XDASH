package org.kobe.xbot.xdashbackend.entities;

import java.time.LocalDateTime;
import java.time.ZoneId;

public class ConfigProperties {
    private final Long LAST_UPDATED;
    private final Long LAST_RELOADED;
    private String SERVERS_PASSWORD;
    private String SERVERS_USERNAME;
    private String SERVERS_CONNECT_TIMEOUT;
    private String SERVERS_RETRY_TIMEOUT;
    private String SERVER_PASSWORD;
    private String ROBORIO_HOSTNAME;
    private String ROBORIO_USERNAME;
    private String ROBORIO_SERVER;
    private String ROBORIO_ADDRESS;
    private String[] SERVICES;

    public ConfigProperties(LocalDateTime LAST_UPDATED, LocalDateTime LAST_RELOADED) {
        this.LAST_UPDATED = LAST_UPDATED.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        this.LAST_RELOADED = LAST_RELOADED.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }

    public String getROBORIO_ADDRESS() {
        return ROBORIO_ADDRESS;
    }

    public ConfigProperties setROBORIO_ADDRESS(String ROBORIO_ADDRESS) {
        this.ROBORIO_ADDRESS = ROBORIO_ADDRESS;
        return this;
    }

    public long getLAST_UPDATED() {
        return LAST_UPDATED;
    }

    public long getLAST_RELOADED() {
        return LAST_RELOADED;
    }

    public ConfigProperties setSERVERS_PASSWORD(String SERVERS_PASSWORD) {
        this.SERVERS_PASSWORD = SERVERS_PASSWORD;
        return this;
    }

    public ConfigProperties setSERVERS_USERNAME(String SERVERS_USERNAME) {
        this.SERVERS_USERNAME = SERVERS_USERNAME;
        return this;
    }

    public ConfigProperties setSERVERS_CONNECT_TIMEOUT(String SERVERS_CONNECT_TIMEOUT) {
        this.SERVERS_CONNECT_TIMEOUT = SERVERS_CONNECT_TIMEOUT;
        return this;
    }

    public ConfigProperties setSERVERS_RETRY_TIMEOUT(String SERVERS_RETRY_TIMEOUT) {
        this.SERVERS_RETRY_TIMEOUT = SERVERS_RETRY_TIMEOUT;
        return this;
    }

    public ConfigProperties setSERVER_PASSWORD(String SERVER_PASSWORD) {
        this.SERVER_PASSWORD = SERVER_PASSWORD;
        return this;
    }

    public ConfigProperties setROBORIO_HOSTNAME(String ROBORIO_HOSTNAME) {
        this.ROBORIO_HOSTNAME = ROBORIO_HOSTNAME;
        return this;
    }

    public ConfigProperties setROBORIO_USERNAME(String ROBORIO_USERNAME) {
        this.ROBORIO_USERNAME = ROBORIO_USERNAME;
        return this;
    }

    public ConfigProperties setROBORIO_SERVER(String ROBORIO_SERVER) {
        this.ROBORIO_SERVER = ROBORIO_SERVER;
        return this;
    }


    public ConfigProperties setSERVICES(String[] SERVICES) {
        this.SERVICES = SERVICES;
        return this;
    }

    public String getSERVERS_PASSWORD() {
        return SERVERS_PASSWORD;
    }

    public String getSERVERS_USERNAME() {
        return SERVERS_USERNAME;
    }

    public String getSERVERS_CONNECT_TIMEOUT() {
        return SERVERS_CONNECT_TIMEOUT;
    }

    public String getSERVERS_RETRY_TIMEOUT() {
        return SERVERS_RETRY_TIMEOUT;
    }

    public String getSERVER_PASSWORD() {
        return SERVER_PASSWORD;
    }

    public String getROBORIO_HOSTNAME() {
        return ROBORIO_HOSTNAME;
    }

    public String getROBORIO_USERNAME() {
        return ROBORIO_USERNAME;
    }

    public String getROBORIO_SERVER() {
        return ROBORIO_SERVER;
    }


    public String[] getSERVICES() {
        return SERVICES;
    }
}
