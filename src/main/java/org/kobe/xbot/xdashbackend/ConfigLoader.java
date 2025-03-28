package org.kobe.xbot.xdashbackend;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;
import org.kobe.xbot.xdashbackend.entities.ConfigProperties;
import org.kobe.xbot.xdashbackend.entities.DeviceAddData;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;

import java.io.*;
import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

public class ConfigLoader {
    private final Properties properties = new Properties();
    private final String fileName = "xdash.properties";
    private final XDashLogger logger = XDashLogger.getLogger(ConfigLoader.class);
    private static final Gson gson = new Gson();
    //------------- DEFAULT VALUES -------------
    public static final int DEFAULT_CONNECT_TIMEOUT = 3000;
    public static final long DEFAULT_RETRY_TIMEOUT = 4000;
    public static final String DEFAULT_SERVERS_PASSWORD = "I<3Robots!";
    public static final String DEFAULT_SERVERS_USER = "xbot";
    private static final String DEFAULT_DOCKER_IMAGES_DIRECTORY = "xdash-docker-images";
    private static final String DEFAULT_DOCKER_IMAGE_ALT_BASE_URL = "https://github.com/Kobeeeef/XDASH/releases/download/v1-docker-images/alt-arm64-base-image.tar";
    public static final String DEFAULT_SERVER_PASSWORD = "I<3Robotics!";
    public static final String DEFAULT_ROBORIO_HOSTNAME = "roboRIO-488-FRC";
    public static final String DEFAULT_ROBORIO_USERNAME = "admin";
    public static final String DEFAULT_ROBORIO_SERVER = "roboRIO-488-FRC.local";
    public static final String DEFAULT_ROBORIO_LOG_DIRECTORY = "XDASH-RIO-LOGS";

    public static final String DEFAULT_ROBORIO_ADDRESS = "10.4.88.2";
    public static final String DEFAULT_SERVICES = "";

    public final List<String> PHOTONVISION_COPROCESSOR_HOSTNAMES = new ArrayList<>();
    private LocalDateTime lastReloaded;
    private LocalDateTime lastUpdated;

    public ConfigLoader() {
        this.PHOTONVISION_COPROCESSOR_HOSTNAMES.add("10.4.88.8");
        this.PHOTONVISION_COPROCESSOR_HOSTNAMES.add("10.4.88.9");
        this.PHOTONVISION_COPROCESSOR_HOSTNAMES.add("10.4.88.10");

        loadProperties();
        this.lastReloaded = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }

    private void loadProperties() {
        File configFile = new File(fileName);

        if (configFile.exists()) {
            logger.info("Configuration file found: " + configFile.getAbsolutePath());
            try (FileInputStream input = new FileInputStream(configFile)) {
                properties.load(input);
                logger.info("Properties loaded successfully from " + configFile.getAbsolutePath());
            } catch (IOException e) {
                logger.severe("Error loading properties file: " + e.getMessage());
            }
        } else {
            logger.warning("Configuration file not found: " + configFile.getAbsolutePath());
            logger.info("Attempting to load configuration from classpath.");
            try (InputStream input = getClass().getClassLoader().getResourceAsStream(fileName)) {
                if (input != null) {
                    properties.load(input);
                    logger.info("Properties loaded successfully from classpath.");
                } else {
                    logger.severe("Failed to load properties file from classpath. Input stream is null.");
                    logger.info("Creating default configuration file.");
                    // Create a new properties file with default settings
                    setDefaultProperties();
                    saveProperties(configFile);
                }
            } catch (IOException e) {
                logger.severe("Error loading properties file from classpath: " + e.getMessage());
            }
        }
        this.lastReloaded = LocalDateTime.now();
    }

    public void save() {
        saveProperties(new File(fileName));
        this.lastUpdated = LocalDateTime.now();
    }

    public List<String> getPropertyList(String key) {
        String value = properties.getProperty(key);
        if (value == null || value.isEmpty()) return Collections.emptyList();

        try {
            // Deserialize JSON array to List
            Type listType = new TypeToken<List<String>>() {
            }.getType();
            return gson.fromJson(value, listType);
        } catch (Exception e) {
            logger.fatal("Error parsing property list for key: " + key + ": " + e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<String> getPropertyList(String key, List<String> defaultValue) {
        String value = properties.getProperty(key);
        if (value == null || value.isEmpty()) return defaultValue;

        try {
            // Deserialize JSON array to List
            Type listType = new TypeToken<List<String>>() {
            }.getType();
            return gson.fromJson(value, listType);
        } catch (Exception e) {
            logger.fatal("Error parsing property list for key: " + key + ": " + e.getMessage());
            return defaultValue;
        }
    }

    public void setPropertyList(String key, List<String> list) {
        if (list == null || list.isEmpty()) {
            properties.remove(key);
        } else {
            try {
                // Serialize List as JSON array
                String value = gson.toJson(list);
                properties.setProperty(key, value);
            } catch (Exception e) {
                logger.fatal("Error serializing property list for key: " + key + ": " + e.getMessage());
            }
        }
    }

    private void setDefaultProperties() {
        setPropertyList("servers.photonvision.hostnames", PHOTONVISION_COPROCESSOR_HOSTNAMES);
        properties.setProperty("servers.password", DEFAULT_SERVERS_PASSWORD);
        properties.setProperty("servers.user", DEFAULT_SERVERS_USER);
        properties.setProperty("servers.connectTimeout", String.valueOf(DEFAULT_CONNECT_TIMEOUT));
        properties.setProperty("servers.retryTimeout", String.valueOf(DEFAULT_RETRY_TIMEOUT));
        properties.setProperty("server.password", DEFAULT_SERVER_PASSWORD);
        properties.setProperty("roboRIO.hostname", DEFAULT_ROBORIO_HOSTNAME);
        properties.setProperty("roboRIO.username", DEFAULT_ROBORIO_USERNAME);
        properties.setProperty("roboRIO.server", DEFAULT_ROBORIO_SERVER);
        properties.setProperty("roboRIO.logDirectory", DEFAULT_ROBORIO_LOG_DIRECTORY);
        properties.setProperty("roboRIO.address", DEFAULT_ROBORIO_ADDRESS);
        properties.setProperty("services", DEFAULT_SERVICES);
        properties.setProperty("docker.altBaseImageImportTimeout", String.valueOf(DEFAULT_CONNECT_TIMEOUT));
        properties.setProperty("docker.altBaseImageURL", DEFAULT_DOCKER_IMAGE_ALT_BASE_URL);
        properties.setProperty("docker.imagesDirectory", DEFAULT_DOCKER_IMAGES_DIRECTORY);
        logger.info("Default properties set.");
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public LocalDateTime getLastReloaded() {
        return lastReloaded;
    }

    private void saveProperties(File configFile) {
        try (FileOutputStream output = new FileOutputStream(configFile)) {
            properties.store(output, "Default XDASH Configuration");
            logger.info("Default configuration file created at " + configFile.getAbsolutePath());
        } catch (IOException e) {
            logger.severe("Error saving properties file: " + e.getMessage());
        }
    }

    public void reload() {
        logger.info("Reloading configuration from file.");
        loadProperties();
        this.lastReloaded = LocalDateTime.now();
    }

    public String getProperty(String key) {
        return properties.getProperty(key);
    }

    public String getProperty(String key, String defaultValue) {
        return properties.getProperty(key, defaultValue);
    }

    public Long getPropertyLong(String key, Long defaultValue) {
        String value = this.getProperty(key);
        if (value == null) return defaultValue;
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    public Integer getPropertyInteger(String key, Integer defaultValue) {
        String value = this.getProperty(key);
        if (value == null) return defaultValue;
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    public String getServersPassword() {
        return getProperty("servers.password", DEFAULT_SERVERS_PASSWORD);
    }

    public String getServersUser() {
        return getProperty("servers.user", DEFAULT_SERVERS_USER);
    }

    public int getServersConnectTimeout() {
        return getPropertyInteger("servers.connectTimeout", DEFAULT_CONNECT_TIMEOUT);
    }

    public long getServersRetryTimeout() {
        return getPropertyLong("servers.retryTimeout", DEFAULT_RETRY_TIMEOUT);
    }

    public String getServerPassword() {
        return getProperty("server.password", DEFAULT_SERVER_PASSWORD);
    }

    public String getRoboRIOHostname() {
        return getProperty("roboRIO.hostname", DEFAULT_ROBORIO_HOSTNAME);
    }

    public String getRoboRIOUsername() {
        return getProperty("roboRIO.username", DEFAULT_ROBORIO_USERNAME);
    }

    public String getRoboRIOServer() {
        return getProperty("roboRIO.server", DEFAULT_ROBORIO_SERVER);
    }

    public String getRoboRIOAddress() {
        return getProperty("roboRIO.address", DEFAULT_ROBORIO_ADDRESS);
    }
    public String getRoborioLogDirectory() {
        return getProperty("roboRIO.logDirectory", DEFAULT_ROBORIO_LOG_DIRECTORY);
    }

    public String getRobotWifiSSID() {
        return getProperty("wifi.robot");
    }

    public String getInternetWifiSSID() {
        return getProperty("wifi.internet");
    }

    public String getProjectDirectory() {
        return getProperty("project.directory");
    }

    public String getSyncDirectory() {
        return getProperty("sync.directory");
    }

    public String getSyncTargetDirectory() {
        return getProperty("sync.target.directory");
    }

    public String getDockerComposeFileDirectory() {
        return getProperty("docker.compose.file.directory");
    }

    public String getDockerImagesDirectory() {
        return getProperty("docker.imagesDirectory", DEFAULT_DOCKER_IMAGES_DIRECTORY);
    }

    public String getDockerAltBaseImageURL() {
        return getProperty("docker.altBaseImageURL", DEFAULT_DOCKER_IMAGE_ALT_BASE_URL);
    }

    public Integer getDockerAltBaseImageImportTimeout() {
        return getPropertyInteger("docker.altBaseImageImportTimeout", DEFAULT_CONNECT_TIMEOUT);
    }

    public ConfigProperties getConfigProperties() {
        return new ConfigProperties(lastUpdated, lastReloaded)
                .setSERVERS_PASSWORD(getServersPassword())
                .setSERVERS_USERNAME(getServersUser())
                .setSERVERS_CONNECT_TIMEOUT(String.valueOf(getServersConnectTimeout()))
                .setSERVERS_RETRY_TIMEOUT(String.valueOf(getServersRetryTimeout()))
                .setSERVER_PASSWORD(getServerPassword())
                .setROBORIO_HOSTNAME(getRoboRIOHostname())
                .setROBORIO_USERNAME(getRoboRIOUsername())
                .setROBORIO_LOG_DIRECTORY(getRoborioLogDirectory())
                .setDOCKER_ALT_IMPORT_TIMEOUT(String.valueOf(getDockerAltBaseImageImportTimeout()))
                .setALT_BASE_IMAGE_URL(getDockerAltBaseImageURL())
                .setSYNC_DIRECTORY(getSyncDirectory())
                .setSYNC_TARGET_DIRECTORY(getSyncTargetDirectory())
                .setPROJECT_DIRECTORY(getProjectDirectory())
                .setROBORIO_SERVER(getRoboRIOServer())
                .setDOCKER_COMPOSE_FILE_DIRECTORY(getDockerComposeFileDirectory())
                .setDOCKER_IMAGES_DIRECTORY(getDockerImagesDirectory())
                .setWIFI_SSID(getInternetWifiSSID())
                .setROBOT_WIFI_SSID(getRobotWifiSSID())
                .setROBORIO_ADDRESS(getRoboRIOAddress())
                .setPHOTONVISION_COPROCESSOR_HOSTNAMES(getPHOTONVISION_COPROCESSOR_HOSTNAMES().toArray(new String[0]))
                .setSERVICES(getServices().toArray(new String[0]));
    }

    public void setConfigPropertiesAndSave(ConfigProperties configProperties) {
        if (configProperties.getSERVERS_PASSWORD() != null) {
            properties.setProperty("servers.password", configProperties.getSERVERS_PASSWORD());
        }
        if (configProperties.getSERVERS_USERNAME() != null) {
            properties.setProperty("servers.user", configProperties.getSERVERS_USERNAME());
        }
        if (configProperties.getPROJECT_DIRECTORY() != null && !configProperties.getPROJECT_DIRECTORY().isEmpty()) {
            properties.setProperty("project.directory", configProperties.getPROJECT_DIRECTORY());
        } else {
            properties.remove("project.directory");
        }
        if (configProperties.getROBORIO_LOG_DIRECTORY() != null && !configProperties.getROBORIO_LOG_DIRECTORY().isEmpty()) {
            properties.setProperty("roboRIO.logDirectory", configProperties.getROBORIO_LOG_DIRECTORY());
        } else {
            properties.setProperty("roboRIO.logDirectory", DEFAULT_ROBORIO_LOG_DIRECTORY);
        }
        if (configProperties.getSYNC_DIRECTORY() != null && !configProperties.getSYNC_DIRECTORY().isEmpty()) {
            properties.setProperty("sync.directory", configProperties.getSYNC_DIRECTORY());
        } else {
            properties.remove("sync.directory");
        }
        if (configProperties.getSYNC_TARGET_DIRECTORY() != null && !configProperties.getSYNC_TARGET_DIRECTORY().isEmpty()) {
            properties.setProperty("sync.target.directory", configProperties.getSYNC_TARGET_DIRECTORY());
        } else {
            properties.remove("sync.target.directory");
        }
        if (configProperties.getDOCKER_COMPOSE_FILE_DIRECTORY() != null && !configProperties.getDOCKER_COMPOSE_FILE_DIRECTORY().isEmpty()) {
            properties.setProperty("docker.compose.file.directory", configProperties.getDOCKER_COMPOSE_FILE_DIRECTORY());
        } else {
            properties.remove("docker.compose.file.directory");
        }
        if (configProperties.getALT_BASE_IMAGE_URL() != null && !configProperties.getALT_BASE_IMAGE_URL().isEmpty()) {
            properties.setProperty("docker.altBaseImageURL", configProperties.getALT_BASE_IMAGE_URL());
        } else {
            properties.setProperty("docker.altBaseImageURL", DEFAULT_DOCKER_IMAGE_ALT_BASE_URL);
        }
        if (configProperties.getDOCKER_IMAGES_DIRECTORY() != null && !configProperties.getDOCKER_IMAGES_DIRECTORY().isEmpty()) {
            properties.setProperty("docker.imagesDirectory", configProperties.getDOCKER_IMAGES_DIRECTORY());
        } else {
            properties.setProperty("docker.imagesDirectory", DEFAULT_DOCKER_IMAGES_DIRECTORY);
        }
        if (configProperties.getROBOT_WIFI_SSID() != null && !configProperties.getROBOT_WIFI_SSID().isEmpty()) {
            properties.setProperty("wifi.robot", configProperties.getROBOT_WIFI_SSID());
        } else {
            properties.remove("wifi.robot");
        }
        if (configProperties.getWIFI_SSID() != null && !configProperties.getWIFI_SSID().isEmpty()) {
            properties.setProperty("wifi.internet", configProperties.getWIFI_SSID());
        } else {
            properties.remove("wifi.internet");
        }
        if (configProperties.getSERVERS_CONNECT_TIMEOUT() != null) {
            properties.setProperty("servers.connectTimeout", configProperties.getSERVERS_CONNECT_TIMEOUT());
        }
        if (configProperties.getSERVERS_RETRY_TIMEOUT() != null) {
            properties.setProperty("servers.retryTimeout", configProperties.getSERVERS_RETRY_TIMEOUT());
        }
        if (configProperties.getDOCKER_ALT_IMPORT_TIMEOUT() != null) {
            properties.setProperty("docker.altBaseImageImportTimeout", configProperties.getDOCKER_ALT_IMPORT_TIMEOUT());
        }
        if (configProperties.getSERVER_PASSWORD() != null) {
            properties.setProperty("server.password", configProperties.getSERVER_PASSWORD());
        }
        if (configProperties.getROBORIO_HOSTNAME() != null) {
            properties.setProperty("roboRIO.hostname", configProperties.getROBORIO_HOSTNAME());
        }
        if (configProperties.getROBORIO_ADDRESS() != null) {
            properties.setProperty("roboRIO.address", configProperties.getROBORIO_ADDRESS());
        }
        if (configProperties.getROBORIO_USERNAME() != null) {
            properties.setProperty("roboRIO.username", configProperties.getROBORIO_USERNAME());
        }
        if (configProperties.getROBORIO_SERVER() != null) {
            properties.setProperty("roboRIO.server", configProperties.getROBORIO_SERVER());
        }
        if (configProperties.getSERVICES() != null) {
            setPropertyList("services", Arrays.stream(configProperties.getSERVICES()).toList());
        }
        if (configProperties.getPHOTONVISION_COPROCESSOR_HOSTNAMES() != null) {
            setPropertyList("servers.photonvision.hostnames", Arrays.stream(configProperties.getPHOTONVISION_COPROCESSOR_HOSTNAMES()).toList());
        }

        save(); // Save updated properties to the file
        logger.info("Configuration updated and saved successfully.");
    }

    public int getConnectTimeout() {
        return getPropertyInteger("servers.connectTimeout", DEFAULT_CONNECT_TIMEOUT);
    }

    public long getRetryTimeout() {
        return getPropertyLong("servers.retryTimeout", DEFAULT_RETRY_TIMEOUT);
    }

    public List<DeviceAddData> getServersConstant() {
        List<String> value = getPropertyList("servers.constant");

        if (value == null) return Collections.emptyList();

        return value.stream().map(m -> {
            try {
                return gson.fromJson(m, DeviceAddData.class);
            } catch (JsonSyntaxException e) {
                logger.warning("Failed to parse from servers.constant, Invalid data: " + e.getMessage());
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());


    }

    public List<String> getServices() {
        return getPropertyList("services");
    }

    public List<String> getPHOTONVISION_COPROCESSOR_HOSTNAMES() {
        return getPropertyList("servers.photonvision.hostnames", PHOTONVISION_COPROCESSOR_HOSTNAMES);
    }
}
