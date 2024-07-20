package org.kobe.xbot.Utilities;

import com.sun.management.OperatingSystemMXBean;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.ThreadMXBean;
import java.util.List;

public class SystemStatistics {
    private final long freeMemoryMB;
    private final long usedMemoryMB;
    private final long maxMemoryMB;
    private final double processCpuLoadPercentage;
    private final int availableProcessors;
    private final long totalThreads;
    private final long nanoTime;
    private final String health;
    private final int totalClients;
    private XTableStatus status;
    private int totalMessages;
    private String ip;
    private List<ClientData> clientDataList;
    private static final MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
    private static final OperatingSystemMXBean osMXBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
    private static final ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();

    public SystemStatistics(int totalClients) {
        this.nanoTime = System.nanoTime();
        this.totalClients = totalClients;
        this.maxMemoryMB = osMXBean.getTotalPhysicalMemorySize() / (1024 * 1024);
        this.freeMemoryMB = osMXBean.getFreePhysicalMemorySize() / (1024 * 1024);
        this.usedMemoryMB = maxMemoryMB - freeMemoryMB;
        this.processCpuLoadPercentage = osMXBean.getSystemCpuLoad() * 100;
        this.availableProcessors = osMXBean.getAvailableProcessors();
        this.totalThreads = threadMXBean.getThreadCount();
        this.ip = Utilities.getLocalIPAddress();
        if (usedMemoryMB > maxMemoryMB * 0.8 && processCpuLoadPercentage < 50 && totalThreads < availableProcessors * 20) {
            this.health = HealthStatus.GOOD.name();
        } else if (usedMemoryMB > maxMemoryMB * 0.5 && processCpuLoadPercentage < 70 && totalThreads < availableProcessors * 50) {
            this.health = HealthStatus.OK.name();
        } else if (usedMemoryMB > maxMemoryMB * 0.2 && processCpuLoadPercentage < 90 && totalThreads < availableProcessors * 70) {
            this.health = HealthStatus.BAD.name();
        } else {
            this.health = HealthStatus.OVERLOAD.name();
        }

    }

    public enum HealthStatus {
        GOOD, OK, BAD, OVERLOAD, CRITICAL, UNKNOWN
    }

    public String getIp() {
        return ip;
    }

    public int getTotalMessages() {
        return totalMessages;
    }

    public SystemStatistics setTotalMessages(int totalMessages) {
        this.totalMessages = totalMessages;
        return this;
    }

    public XTableStatus getStatus() {
        return status;
    }

    public SystemStatistics setStatus(XTableStatus status) {
        this.status = status;
        return this;
    }

    public List<ClientData> getClientDataList() {
        return clientDataList;
    }

    public SystemStatistics setClientDataList(List<ClientData> clientDataList) {
        this.clientDataList = clientDataList;
        return this;
    }

    public int getTotalClients() {
        return totalClients;
    }

    public long getNanoTime() {
        return nanoTime;
    }

    public long getFreeMemoryMB() {
        return freeMemoryMB;
    }

    public long getMaxMemoryMB() {
        return maxMemoryMB;
    }

    public double getProcessCpuLoadPercentage() {
        return processCpuLoadPercentage;
    }

    public int getAvailableProcessors() {
        return availableProcessors;
    }

    public long getTotalThreads() {
        return totalThreads;
    }


}
