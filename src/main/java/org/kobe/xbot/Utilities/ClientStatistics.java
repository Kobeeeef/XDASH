package org.kobe.xbot.Utilities;

import com.sun.management.OperatingSystemMXBean;
import org.kobe.xbot.Utilities.Entities.XTableClientStatistics;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.RuntimeMXBean;
import java.lang.management.ThreadMXBean;
import java.net.InetAddress;
import java.net.UnknownHostException;

public class ClientStatistics {
    private long freeMemoryMB;
    private long usedMemoryMB;
    private long maxMemoryMB;
    private double processCpuLoadPercentage;
    private int availableProcessors;
    private long totalThreads;
    private long nanoTime;
    private String health;
    private String ip;
    private String hostname;
    private String processId;
    private String langVersion;
    private String langVendor;
    private String jvmName;
    private String version;
    private String type;
    private String UUID;
    private int bufferSize;
    private int maxBufferSize;

    private static final MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
    private static final OperatingSystemMXBean osMXBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
    private static final ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
    private static final RuntimeMXBean runtimeMXBean = ManagementFactory.getRuntimeMXBean();

    public ClientStatistics() {
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
        this.langVersion = System.getProperty("java.version");
        this.langVendor = System.getProperty("java.vendor");
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

    public XTableClientStatistics.ClientStatistics toProtobuf() {
        XTableClientStatistics.ClientStatistics.Builder builder = XTableClientStatistics.ClientStatistics.newBuilder();
        builder.setNanoTime(this.nanoTime)
                .setMaxMemoryMb(this.maxMemoryMB)
                .setFreeMemoryMb(this.freeMemoryMB)
                .setUsedMemoryMb(this.usedMemoryMB)
                .setProcessCpuLoadPercentage(this.processCpuLoadPercentage)
                .setAvailableProcessors(this.availableProcessors)
                .setTotalThreads(this.totalThreads)
                .setIp(this.ip)
                .setUuid(this.UUID)
                .setHostname(this.hostname)
                .setProcessId(this.processId)
                .setLangVersion(this.langVersion)
                .setLangVendor(this.langVendor)
                .setJvmName(this.jvmName)
                .setHealth(XTableClientStatistics.HealthStatus.valueOf(this.health));

        // Optional fields
        if (this.version != null) {
            builder.setVersion(this.version);
        }
        builder.setType(this.type);
        if (this.UUID != null) {
            builder.setUuid(this.UUID);
        }
        builder.setBufferSize(this.bufferSize);
        builder.setMaxBufferSize(this.maxBufferSize);

        return builder.build();
    }

    public static ClientStatistics fromProtobuf(XTableClientStatistics.ClientStatistics protobuf) {
        ClientStatistics stats = new ClientStatistics();
        stats.nanoTime = protobuf.getNanoTime();
        stats.maxMemoryMB = protobuf.getMaxMemoryMb();
        stats.freeMemoryMB = protobuf.getFreeMemoryMb();
        stats.usedMemoryMB = protobuf.getUsedMemoryMb();
        stats.processCpuLoadPercentage = protobuf.getProcessCpuLoadPercentage();
        stats.availableProcessors = protobuf.getAvailableProcessors();
        stats.totalThreads = protobuf.getTotalThreads();
        stats.ip = protobuf.getIp();
        stats.hostname = protobuf.getHostname();
        stats.processId = protobuf.getProcessId();
        stats.langVersion = protobuf.getLangVersion();
        stats.langVendor = protobuf.getLangVendor();
        stats.jvmName = protobuf.getJvmName();
        stats.health = protobuf.getHealth().name();

        // Optional fields
        if (protobuf.hasVersion()) {
            stats.version = protobuf.getVersion();
        }
        stats.type = protobuf.getType();
        if (protobuf.hasUuid()) {
            stats.UUID = protobuf.getUuid();
        }
        stats.bufferSize = protobuf.getBufferSize();
        stats.maxBufferSize = protobuf.getMaxBufferSize();

        return stats;
    }

    public ClientStatistics setVersion(String version) {
        this.version = version;
        return this;
    }

    public ClientStatistics setUUID(String UUID) {
        this.UUID = UUID;
        return this;
    }

    public ClientStatistics setBufferSize(int bufferSize) {
        this.bufferSize = bufferSize;
        return this;
    }

    public ClientStatistics setMaxBufferSize(int maxBufferSize) {
        this.maxBufferSize = maxBufferSize;
        return this;
    }

    public enum HealthStatus {
        GOOD, OKAY, STRESSED, OVERLOAD, CRITICAL, UNKNOWN
    }

    // Getters (same as your original code)
    public String getIp() { return ip; }
    public String getHostname() { return hostname; }
    public long getNanoTime() { return nanoTime; }
    public long getFreeMemoryMB() { return freeMemoryMB; }
    public long getMaxMemoryMB() { return maxMemoryMB; }
    public double getProcessCpuLoadPercentage() { return processCpuLoadPercentage; }
    public int getAvailableProcessors() { return availableProcessors; }
    public long getTotalThreads() { return totalThreads; }
    public String getHealth() { return health; }
    public String getProcessId() { return processId; }
    public String getLangVersion() { return langVersion; }
    public String getLangVendor() { return langVendor; }
    public String getJvmName() { return jvmName; }

    public String getUUID() {
        return UUID;
    }
}
