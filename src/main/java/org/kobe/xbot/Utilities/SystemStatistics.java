package org.kobe.xbot.Utilities;

import com.sun.management.OperatingSystemMXBean;
import oshi.SystemInfo;
import oshi.hardware.CentralProcessor;
import oshi.hardware.HardwareAbstractionLayer;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.ThreadMXBean;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

public class SystemStatistics {
    private final long freeMemoryMB;
    private final long usedMemoryMB;
    private final long maxMemoryMB;
    private final double processCpuLoadPercentage;
    private final int availableProcessors;
    private final long totalThreads;
    private final long nanoTime;
    private final String health;
    private final double powerUsageWatts;
    private final int totalClients;
    private XTableStatus status;
    private int totalMessages;
    private String ip;
    private List<ClientData> clientDataList;

    private static final MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
    private static final OperatingSystemMXBean osMXBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
    private static final ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();

    private static final SystemInfo systemInfo = new SystemInfo();
    private static final HardwareAbstractionLayer hal = systemInfo.getHardware();
    private static final CentralProcessor processor = hal.getProcessor();

    private static final AtomicReference<long[]> prevTicks = new AtomicReference<>();
    private static final AtomicLong lastUpdateTime = new AtomicLong();
    private static final AtomicReference<Double> lastPowerUsageWatts = new AtomicReference<>(0.0);


    public SystemStatistics(int totalClients) {
        this.nanoTime = System.nanoTime();
        this.totalClients = totalClients;
        this.maxMemoryMB = osMXBean.getTotalPhysicalMemorySize() / (1024 * 1024);
        this.freeMemoryMB = osMXBean.getFreePhysicalMemorySize() / (1024 * 1024);
        this.usedMemoryMB = maxMemoryMB - freeMemoryMB;
        this.processCpuLoadPercentage = osMXBean.getSystemCpuLoad() * 100;
        this.availableProcessors = osMXBean.getAvailableProcessors();
        this.powerUsageWatts = getEstimatedPowerConsumption();
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

    public double getEstimatedPowerConsumption() {
        long currentTime = System.currentTimeMillis();

        // If this is the first call, initialize prevTicks and lastUpdateTime
        if (prevTicks.get() == null) {
            prevTicks.set(processor.getSystemCpuLoadTicks());
            lastUpdateTime.set(currentTime);
            lastPowerUsageWatts.set(0.0); // Initial value since we don't have enough data yet
            return lastPowerUsageWatts.get();
        }

        // Check if at least 1 second has passed since the last update
        if (currentTime - lastUpdateTime.get() < 1000) {
            return lastPowerUsageWatts.get(); // Return the last known value
        }

        // Get CPU load between ticks for estimation
        long[] currentTicks = processor.getSystemCpuLoadTicks();
        double cpuLoadBetweenTicks = processor.getSystemCpuLoadBetweenTicks(prevTicks.get());

        // Update prevTicks and lastUpdateTime
        prevTicks.set(currentTicks);
        lastUpdateTime.set(currentTime);

        // Estimation of power consumption
        double maxFreqGHz = processor.getMaxFreq() / 1_000_000_000.0;
        int logicalProcessorCount = processor.getLogicalProcessorCount();

        double estimatedPower = cpuLoadBetweenTicks * maxFreqGHz * logicalProcessorCount * 10;
        lastPowerUsageWatts.set(estimatedPower);

        return estimatedPower;
    }
}
