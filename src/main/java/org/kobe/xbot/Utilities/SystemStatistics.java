package org.kobe.xbot.Utilities;

import com.sun.management.OperatingSystemMXBean;
import oshi.SystemInfo;
import oshi.hardware.CentralProcessor;
import oshi.hardware.HardwareAbstractionLayer;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.RuntimeMXBean;
import java.lang.management.ThreadMXBean;
import java.util.List;

public class SystemStatistics {
    private  long freeMemoryMB;
    private  long usedMemoryMB;
    private  long maxMemoryMB;
    private  double processCpuLoadPercentage;
    private  int availableProcessors;
    private  long totalThreads;
    private  long nanoTime;
    private  String health;
    private  double powerUsageWatts;
    private  int totalClients;
    private XTableStatus status;
    private int totalPullMessages;
    private int totalReplyMessages;
    private int totalPublishMessages;
    private double pullPs;
    private double replyPs;
    private double publishPs;
    private int maxIterationsPerSecond;
    private  String ip;
    private  String processId;
    private  String langVersion;
    private  String langVendor;
    private  String jvmName;
    private String hostname;
    private List<ClientData> clientDataList;
    private String version;
    private final String type = "JAVA";
    private  long nextClientRegistryUpdate;

    private static final MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
    private static final OperatingSystemMXBean osMXBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
    private static final ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();

    private static final SystemInfo systemInfo = new SystemInfo();
    private static final HardwareAbstractionLayer hal = systemInfo.getHardware();
    private static final CentralProcessor processor = hal.getProcessor();
    private static final RuntimeMXBean runtimeMXBean = ManagementFactory.getRuntimeMXBean();



    public int getMaxIterationsPerSecond() {
        return maxIterationsPerSecond;
    }

    public SystemStatistics setMaxIterationsPerSecond(int maxIterationsPerSecond) {
        this.maxIterationsPerSecond = maxIterationsPerSecond;
        return this;
    }

    public enum HealthStatus {
        GOOD, OKAY, STRESSED, OVERLOAD, CRITICAL, UNKNOWN
    }


    public SystemStatistics setHostname(String hostname) {
        this.hostname = hostname;
        return this;
    }

    public String getIp() {
        return ip;
    }

    public SystemStatistics setVersion(String version) {
        this.version = version;
        return this;
    }

    public int getTotalPublishMessages() {
        return totalPublishMessages;
    }

    public SystemStatistics setTotalPublishMessages(int totalPublishMessages) {
        this.totalPublishMessages = totalPublishMessages;
        return this;
    }

    public int getTotalReplyMessages() {
        return totalReplyMessages;
    }

    public SystemStatistics setTotalReplyMessages(int totalReplyMessages) {
        this.totalReplyMessages = totalReplyMessages;
        return this;
    }

    public int getTotalPullMessages() {
        return totalPullMessages;
    }

    public SystemStatistics setTotalPullMessages(int totalPullMessages) {
        this.totalPullMessages = totalPullMessages;
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
