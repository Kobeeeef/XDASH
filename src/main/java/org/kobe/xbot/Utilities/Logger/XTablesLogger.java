package org.kobe.xbot.Utilities.Logger;

import org.slf4j.LoggerFactory;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.function.BiConsumer;
import java.util.logging.ConsoleHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

public class XTablesLogger extends Logger {
    private static final String loggerName = "XTablesLogger";
    private static final org.slf4j.Logger log = LoggerFactory.getLogger(XTablesLogger.class);
    private static Level defaultLevel = Level.ALL;
    private static XTablesLogger instance = null;
    private static final String RESET = "\u001B[0m";
    private static final String RED = "\u001B[31m";
    private static final String YELLOW = "\u001B[33m";
    private static final String BLUE = "\u001B[34m";
    private static final String PURPLE = "\u001B[35m"; // For fatal level
    private static BiConsumer<Level, String> handler;
    // Define a custom FATAL logging level
    public static final Level FATAL = new Level("FATAL", Level.SEVERE.intValue() + 1) {
    };

    protected XTablesLogger(String name, String resourceBundleName) {
        super(name, resourceBundleName);
    }

    public static XTablesLogger getLogger() {
        return getLogger(loggerName);
    }
    public static XTablesLogger getLogger(Class<?> clazz) {
        return getLogger(clazz.getName());
    }
    public static XTablesLogger getLogger(String className) {
        if (instance == null) {
            XTablesLogger logger = new XTablesLogger(className, null);
            logger.setLevel(defaultLevel);
            ConsoleHandler consoleHandler = new ConsoleHandler();
            consoleHandler.setFormatter(new XTablesFormatter());
            logger.addHandler(consoleHandler);
            instance = logger;
            return logger;
        } else return instance;
    }

    // Method to log fatal messages
    public void fatal(String msg) {
        log(FATAL, msg);
    }

    /**
     * Log a message, with no arguments.
     * <p>
     * If the logger is currently enabled for the given message
     * level then the given message is forwarded to all the
     * registered output Handler objects.
     *
     * @param level One of the message level identifiers, e.g., SEVERE
     * @param msg   The string message (or a key in the message catalog)
     */
    @Override
    public void log(Level level, String msg) {
        super.log(level, msg);
        if (handler != null) handler.accept(level, msg);
    }

    // Custom formatter for XTablesLogger
    private static class XTablesFormatter extends java.util.logging.Formatter {

        @Override
        public String format(java.util.logging.LogRecord record) {
            StringBuilder builder = new StringBuilder();

            // Get current time and date
            ZonedDateTime dateTime = ZonedDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy hh:mm:ss a");
            String formattedDateTime = dateTime.format(formatter);

            // Get class and method names
            String classPath = record.getSourceClassName();
            String methodName = record.getSourceMethodName();
            String className = classPath.split("\\.")[classPath.split("\\.").length - 1];

            builder.append(getColorFromLevel(record.getLevel()))
                    .append("[")
                    .append(record.getLevel().getName())
                    .append("] ")
                    .append(formattedDateTime)
                    .append(" ")
                    .append(classPath)
                    .append(" ")
                    .append(RESET)
                    .append(methodName)
                    .append(": \n")
                    .append(getColorFromLevel(record.getLevel()))
                    .append("[")
                    .append(record.getLevel().getName())
                    .append("] ")
                    .append("[")
                    .append(className)
                    .append("] ")
                    .append(RESET)
                    .append(record.getMessage())
                    .append(System.lineSeparator());
            return builder.toString();
        }
    }

    private static String getColorFromLevel(Level level) {
        if (level == FATAL) {
            return PURPLE;
        } else if (level == Level.SEVERE) {
            return RED;
        } else if (level == Level.WARNING) {
            return YELLOW;
        } else if (level == Level.INFO) {
            return BLUE;
        }
        return "";
    }

    public static void setHandler(BiConsumer<Level, String> messageHandler) {
        handler = messageHandler;
    }

    public static void setLoggingLevel(Level level) {
        if (instance == null) defaultLevel = level;
        else instance.setLevel(level);
    }
}
