package org.kobe.xbot.xdashbackend.entities;

import java.time.LocalDateTime;
import java.time.ZoneId;

public class ConfigProperties {
    private final Long LAST_UPDATED;
    private final Long LAST_RELOADED;
    private String SERVERS_PASSWORD;
    private String SERVERS_USERNAME;
    private String SERVERS_CONNECT_TIMEOUT;
    private String DOCKER_ALT_IMPORT_TIMEOUT;
    private String SERVERS_RETRY_TIMEOUT;
    private String SERVER_PASSWORD;
    private String ROBORIO_HOSTNAME;
    private String ROBORIO_USERNAME;
    private String ROBORIO_SERVER;
    private String ROBORIO_ADDRESS;
    private String WIFI_SSID;
    private String PROJECT_DIRECTORY;
    private String ALT_BASE_IMAGE_URL;
    private String DOCKER_IMAGES_DIRECTORY;
    private String DOCKER_COMPOSE_FILE_DIRECTORY;

    public String getDOCKER_COMPOSE_FILE_DIRECTORY() {
        return DOCKER_COMPOSE_FILE_DIRECTORY;
    }

    public ConfigProperties setDOCKER_COMPOSE_FILE_DIRECTORY(String DOCKER_COMPOSE_FILE_DIRECTORY) {
        this.DOCKER_COMPOSE_FILE_DIRECTORY = DOCKER_COMPOSE_FILE_DIRECTORY;
        return this;
    }

    private String ROBOT_WIFI_SSID;
    private String[] SERVICES;

    public ConfigProperties(LocalDateTime LAST_UPDATED, LocalDateTime LAST_RELOADED) {
        this.LAST_UPDATED = LAST_UPDATED.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        this.LAST_RELOADED = LAST_RELOADED.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }

    public String getDOCKER_ALT_IMPORT_TIMEOUT() {
        return DOCKER_ALT_IMPORT_TIMEOUT;
    }

    public ConfigProperties setDOCKER_ALT_IMPORT_TIMEOUT(String DOCKER_ALT_IMPORT_TIMEOUT) {
        this.DOCKER_ALT_IMPORT_TIMEOUT = DOCKER_ALT_IMPORT_TIMEOUT;
        return this;
    }

    public String getALT_BASE_IMAGE_URL() {
        return ALT_BASE_IMAGE_URL;
    }

    public ConfigProperties setALT_BASE_IMAGE_URL(String ALT_BASE_IMAGE_URL) {
        this.ALT_BASE_IMAGE_URL = ALT_BASE_IMAGE_URL;
        return this;
    }

    public String getPROJECT_DIRECTORY() {
        return PROJECT_DIRECTORY;
    }

    public String getDOCKER_IMAGES_DIRECTORY() {
        return DOCKER_IMAGES_DIRECTORY;
    }

    public ConfigProperties setDOCKER_IMAGES_DIRECTORY(String DOCKER_IMAGES_DIRECTORY) {
        this.DOCKER_IMAGES_DIRECTORY = DOCKER_IMAGES_DIRECTORY;
        return this;
    }

    public ConfigProperties setPROJECT_DIRECTORY(String PROJECT_DIRECTORY) {
        this.PROJECT_DIRECTORY = PROJECT_DIRECTORY;
        return this;
    }

    public String getROBORIO_ADDRESS() {
        return ROBORIO_ADDRESS;
    }

    public String getWIFI_SSID() {
        return WIFI_SSID;
    }

    public ConfigProperties setWIFI_SSID(String WIFI_SSID) {
        this.WIFI_SSID = WIFI_SSID;
        return this;
    }

    public String getROBOT_WIFI_SSID() {
        return ROBOT_WIFI_SSID;
    }

    public ConfigProperties setROBOT_WIFI_SSID(String ROBOT_WIFI_SSID) {
        this.ROBOT_WIFI_SSID = ROBOT_WIFI_SSID;
        return this;
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
