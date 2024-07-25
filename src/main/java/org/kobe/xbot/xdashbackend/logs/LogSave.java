package org.kobe.xbot.xdashbackend.logs;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class LogSave {
    private final List<String> logList;
    private int maxLogs;

    // Private constructor to prevent instantiation
    private LogSave(int maxLogs) {
        this.logList = Collections.synchronizedList(new ArrayList<>());
        this.maxLogs = maxLogs;
    }

    // Singleton Holder for thread-safe lazy initialization
    private static class SingletonHolder {
        private static final LogSave INSTANCE = new LogSave(100);
    }

    public static LogSave getInstance() {
        return SingletonHolder.INSTANCE;
    }

    public synchronized void addLog(String log) {
        if (logList.size() >= maxLogs) {
            logList.remove(0); // Remove the oldest log
        }
        logList.add(log);
    }

    public synchronized List<String> getLogs() {
        return new ArrayList<>(logList);
    }

    public synchronized int getLogCount() {
        return logList.size();
    }

    public synchronized void setMaxLogs(int newMaxLogs) {
        this.maxLogs = newMaxLogs;
        while (logList.size() > maxLogs) {
            logList.remove(0); // Remove the oldest logs if the new max is lower than the current number of logs
        }
    }
}
