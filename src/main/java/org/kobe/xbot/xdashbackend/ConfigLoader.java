package org.kobe.xbot.xdashbackend;

import org.kobe.xbot.Utilities.Logger.XTablesLogger;

import java.io.*;
import java.util.Properties;

public class ConfigLoader {
    private final Properties properties = new Properties();
    private final String fileName = "xdash.properties";
    private final XTablesLogger logger = XTablesLogger.getLogger(); // Your custom logger

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
        properties.setProperty("server.password", "I<3Robotics!");
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

    public static void main(String[] args) {
        ConfigLoader config = new ConfigLoader();
        String port = config.getProperty("server.port");
        System.out.println("Server Port: " + port);
    }
}
