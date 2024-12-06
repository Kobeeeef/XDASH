package org.kobe.xbot.xdashbackend;

import org.kobe.xbot.Utilities.Logger.XTablesLogger;
import org.kobe.xbot.xdashbackend.entities.SSHHostAddress;

import java.io.*;
import java.util.Properties;

public class ConfigLoader {
    private final Properties properties = new Properties();
    private final String fileName = "xdash.properties";
    private final XTablesLogger logger = XTablesLogger.getLogger(); // Your custom logger
    public static final int DEFAULT_CONNECT_TIMEOUT = 3000;
    public static final long DEFAULT_RETRY_TIMEOUT = 4000;
    public ConfigLoader() {
        loadProperties();
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
    }


    private void setDefaultProperties() {
        properties.setProperty("servers.password", "I<3Robots!");
        properties.setProperty("servers.user", "xbot");
        properties.setProperty("servers.connectTimeout", String.valueOf(DEFAULT_CONNECT_TIMEOUT));
        properties.setProperty("servers.retryTimeout", String.valueOf(DEFAULT_RETRY_TIMEOUT));
        properties.setProperty("server.password", "I<3Robotics!");
        properties.setProperty("roboRIO.hostname", "roboRIO-488-FRC");
        properties.setProperty("roboRIO.username", "admin");
        properties.setProperty("roboRIO.server", "roboRIO-488-FRC.local");
        properties.setProperty("roboRIO.address", "10.4.88.2");
        logger.info("Default properties set.");
    }

    private void saveProperties(File configFile) {
        try (FileOutputStream output = new FileOutputStream(configFile)) {
            properties.store(output, "Default XDASH Configuration");
            logger.info("Default configuration file created at " + configFile.getAbsolutePath());
        } catch (IOException e) {
            logger.severe("Error saving properties file: " + e.getMessage());
        }
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
    public int getConnectTimeout() {
        return getPropertyInteger("servers.connectTimeout", DEFAULT_CONNECT_TIMEOUT);
    }

    public long getRetryTimeout() {
        return getPropertyLong("servers.retryTimeout", DEFAULT_RETRY_TIMEOUT);
    }
    public static void main(String[] args) {
        ConfigLoader config = new ConfigLoader();
        String port = config.getProperty("server.port");
        System.out.println("Server Port: " + port);
    }
}
