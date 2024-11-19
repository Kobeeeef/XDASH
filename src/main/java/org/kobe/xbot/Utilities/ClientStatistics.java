package org.kobe.xbot.Utilities;

import com.sun.management.OperatingSystemMXBean;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.RuntimeMXBean;
import java.lang.management.ThreadMXBean;
import java.net.InetAddress;
import java.net.UnknownHostException;

public class ClientStatistics {
    private final long freeMemoryMB;
    private final long usedMemoryMB;
    private final long maxMemoryMB;
    private final double processCpuLoadPercentage;
    private final int availableProcessors;
    private final long totalThreads;
    private final long nanoTime;
    private final String health;
    private final String ip;
    private final String hostname;
    private final String processId;
    private final String javaVersion;
    private final String javaVendor;
    private final String jvmName;
    private String pythonVersion;
    private String pythonVendor;
    private String pythonCompiler;
    private String version;
    private final String type;

    private static final MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
    private static final OperatingSystemMXBean osMXBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
    private static final ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
    private static final RuntimeMXBean runtimeMXBean = ManagementFactory.getRuntimeMXBean();

    public ClientStatistics(String type) {
        this.type = "JAVA";
        this.nanoTime = System.nanoTime();
        this.maxMemoryMB = osMXBean.getTotalPhysicalMemorySize() / (1024 * 1024);
        this.freeMemoryMB = osMXBean.getFreePhysicalMemorySize() / (1024 * 1024);
        this.usedMemoryMB = maxMemoryMB - freeMemoryMB;
        this.processCpuLoadPercentage = osMXBean.getSystemCpuLoad() * 100;
        this.availableProcessors = osMXBean.getAvailableProcessors();
        this.totalThreads = threadMXBean.getThreadCount();
        this.ip = Utilities.getLocalIPAddress();

        // Retrieve hostname
        String localHostname;
        try {
            localHostname = InetAddress.getLocalHost().getHostName();
        } catch (UnknownHostException e) {
            localHostname = "Unknown Host";
        }
        this.hostname = localHostname;

        // Process and Java environment information

        this.processId = runtimeMXBean.getName().split("@")[0];
        this.javaVersion = System.getProperty("java.version");
        this.javaVendor = System.getProperty("java.vendor");
        this.jvmName = System.getProperty("java.vm.name");

        if (usedMemoryMB <= maxMemoryMB * 0.5 && processCpuLoadPercentage < 50) {
            this.health = HealthStatus.GOOD.name();
        } else if (usedMemoryMB <= maxMemoryMB * 0.6 && processCpuLoadPercentage < 70) {
            this.health = HealthStatus.OKAY.name();
        } else if (usedMemoryMB <= maxMemoryMB * 0.7 && processCpuLoadPercentage < 85) {
            this.health = HealthStatus.STRESSED.name();
        } else if (usedMemoryMB <= maxMemoryMB * 0.85 && processCpuLoadPercentage < 95) {
            this.health = HealthStatus.OVERLOAD.name();
        } else {
            this.health = HealthStatus.CRITICAL.name();
        }
    }

    public enum HealthStatus {
        GOOD, OKAY, STRESSED, OVERLOAD, CRITICAL, UNKNOWN
    }

    public String getIp() {
        return ip;
    }

    public String getHostname() {
        return hostname;
    }

    public ClientStatistics setVersion(String version) {
        this.version = version;
        return this;
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

    public String getHealth() {
        return health;
    }

    public String getProcessId() {
        return processId;
    }

    public String getJavaVersion() {
        return javaVersion;
    }

    public String getJavaVendor() {
        return javaVendor;
    }

    public String getJvmName() {
        return jvmName;
    }
}
