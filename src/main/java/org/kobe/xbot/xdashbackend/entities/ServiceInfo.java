package org.kobe.xbot.xdashbackend.entities;
import java.util.ArrayList;
import java.util.List;

public class ServiceInfo {
    private final String id;
    private final int execMainPID;
    private final String activeState;
    private final long memoryCurrent;
    private final long cpuUsageNSec;
    private final String execMainStartTimestamp;

    // Constructor
    public ServiceInfo(String id, int execMainPID, String activeState, long memoryCurrent, long cpuUsageNSec, String execMainStartTimestamp) {
        this.id = id;
        this.execMainPID = execMainPID;
        this.activeState = activeState;
        this.memoryCurrent = memoryCurrent;
        this.cpuUsageNSec = cpuUsageNSec;
        this.execMainStartTimestamp = execMainStartTimestamp;
    }

    // Getters
    public String getId() {
        return id;
    }

    public int getExecMainPID() {
        return execMainPID;
    }

    public String getActiveState() {
        return activeState;
    }

    public long getMemoryCurrent() {
        return memoryCurrent;
    }
    public double getMemoryCurrentMB() {
        return memoryCurrent / 1048576.0; // convert bytes to megabytes
    }
    public long getCpuUsageNSec() {
        return cpuUsageNSec;
    }

    public String getExecMainStartTimestamp() {
        return execMainStartTimestamp;
    }

    @Override
    public String toString() {
        return "ServiceInfo{" +
                "id='" + id + '\'' +
                ", execMainPID=" + execMainPID +
                ", activeState='" + activeState + '\'' +
                ", memoryCurrent=" + memoryCurrent +
                ", cpuUsageNSec=" + cpuUsageNSec +
                ", execMainStartTimestamp='" + execMainStartTimestamp + '\'' +
                '}';
    }
    public class ServiceInfoParser {

        public static List<ServiceInfo> parseServiceInfo(String data) {
            List<ServiceInfo> serviceInfoList = new ArrayList<>();
            String[] entries = data.split("ExecMainStartTimestamp=");

            for (String entry : entries) {
                if (entry.trim().isEmpty()) continue;

                String[] lines = entry.split("\n");
                String execMainStartTimestamp = "ExecMainStartTimestamp=" + lines[0].trim();
                String id = null;
                int execMainPID = 0;
                String activeState = null;
                long memoryCurrent = 0;
                long cpuUsageNSec = 0;

                for (String line : lines) {
                    if (line.startsWith("ExecMainStartTimestamp")) {
                        execMainStartTimestamp = line.split("=", 2)[1].trim();
                    } else if (line.startsWith("ExecMainPID")) {
                        try {
                            execMainPID = Integer.parseInt(line.split("=", 2)[1].trim());
                        } catch (NumberFormatException ignored) {}
                    } else if (line.startsWith("MemoryCurrent")) {
                        try {
                            memoryCurrent = Long.parseLong(line.split("=", 2)[1].trim());
                        } catch (Exception ignored){}
                    } else if (line.startsWith("CPUUsageNSec")) {
                        try {
                            cpuUsageNSec = Long.parseLong(line.split("=", 2)[1].trim());
                        } catch(Exception ignored) {}
                    } else if (line.startsWith("Id")) {
                        id = line.split("=", 2)[1].trim();
                    } else if (line.startsWith("ActiveState")) {
                        activeState = line.split("=", 2)[1].trim();
                    }
                }

                if (id != null && activeState != null && execMainStartTimestamp != null) {
                    ServiceInfo serviceInfo = new ServiceInfo(id, execMainPID, activeState, memoryCurrent, cpuUsageNSec, execMainStartTimestamp);
                    serviceInfoList.add(serviceInfo);
                }
            }
            return serviceInfoList;
        }
    }
}



