package org.kobe.xbot.xdashbackend.websocket;

import com.google.gson.Gson;
import org.kobe.xbot.Client.XTablesClient;
import org.kobe.xbot.Utilities.LatencyInfo;
import org.kobe.xbot.Utilities.ResponseStatus;
import org.kobe.xbot.xdashbackend.FileEditor.App;
import org.kobe.xbot.xdashbackend.SSHConnectionManager;
import org.kobe.xbot.xdashbackend.XGRID.XTablesViewer;
import org.kobe.xbot.xdashbackend.XdashbackendApplication;
import org.kobe.xbot.xdashbackend.entities.*;
import org.kobe.xbot.xdashbackend.logs.LogSave;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;
import org.kobe.xbot.xdashbackend.utilities.*;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import javax.jmdns.ServiceInfo;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import static org.kobe.xbot.xdashbackend.entities.ServiceInfo.ServiceInfoParser.parseServiceInfo;


public class WebSocketHandler extends TextWebSocketHandler {
    private static final Gson gson = new Gson();
    private static final XDashLogger logger = XDashLogger.getLogger();
    private static final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session); // Add the new session
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session); // Remove the closed session
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage textMessage) throws Exception {
        String payload = textMessage.getPayload();

        XTablesClient xTablesClient = XdashbackendApplication.clientRef.get();
        Message message = gson.fromJson(payload, Message.class);
        if (message.getType().equals("XTABLES-STATUS")) {
            if (xTablesClient != null && xTablesClient.getSocketClient().isConnected) {
                LatencyInfo info = xTablesClient == null ? null : xTablesClient.ping_latency().complete();

                int totalClients = xTablesClient == null ? 0 : info == null ? 0 : info.getSystemStatistics().getTotalClients();
                session.sendMessage(new TextMessage(new Message(new XTablesStatusReturn(xTablesClient != null && xTablesClient.getSocketClient().isConnected, totalClients), "XTABLES-STATUS").toJSON()));
            } else {
                session.sendMessage(new TextMessage(new Message(new XTablesStatusReturn(false, 0), "XTABLES-STATUS").toJSON()));
            }
        } else if (message.getType().equals("XTABLES-STATISTICS")) {
            if (xTablesClient != null && xTablesClient.getSocketClient().isConnected) {
                LatencyInfo info = xTablesClient.ping_latency().complete();
                session.sendMessage(new TextMessage(new Message(new XTablesStatisticsReturn(true, info), "XTABLES-STATISTICS").toJSON()));
            } else {
                session.sendMessage(new TextMessage(new Message(new XTablesStatisticsReturn(false, null), "XTABLES-STATISTICS").toJSON()));

            }
        } else if (message.getType().equals("XTABLES-VIEWER-TOGGLE")) {
            XTablesViewer viewer = XdashbackendApplication.xTablesViewerRef.get();
            if (viewer != null) {
                if (viewer.isVisible()) {
                    viewer.setVisible(false);
                } else {
                    viewer.setVisible(true);
                    viewer.toFront();
                    viewer.setAlwaysOnTop(true);
                    viewer.setAlwaysOnTop(false);
                }
                session.sendMessage(new TextMessage(new Message(new StatusCode(true), "XTABLES-VIEWER-TOGGLE").toJSON()));
            } else {
                session.sendMessage(new TextMessage(new Message(new StatusCode(false), "XTABLES-VIEWER-TOGGLE").toJSON()));
            }
        } else if (message.getType().equals("XTABLES-DATA")) {
            if (xTablesClient != null && xTablesClient.getSocketClient().isConnected) {
                String json = xTablesClient.getRawJSON().complete();
                session.sendMessage(new TextMessage(new Message(new XTablesDataReturn(true, XdashbackendApplication.xTablesViewerRef.get() != null && XdashbackendApplication.xTablesViewerRef.get().isVisible(), json), "XTABLES-DATA").toJSON()));
            } else {
                session.sendMessage(new TextMessage(new Message(new XTablesDataReturn(false, XdashbackendApplication.xTablesViewerRef.get() != null && XdashbackendApplication.xTablesViewerRef.get().isVisible(), null), "XTABLES-DATA").toJSON()));

            }
        } else if (message.getType().equals("XTABLES-DATA-VIEW")) {
            if (xTablesClient != null && xTablesClient.getSocketClient().isConnected) {
                String json = xTablesClient.getRawJSON().complete();
                session.sendMessage(new TextMessage(new Message(new XTablesDataViewReturn(true, XdashbackendApplication.xTablesViewerRef.get() != null && XdashbackendApplication.xTablesViewerRef.get().isVisible(), json.equals("null") || json.equals("{}") ? 0 : Utilities.estimateStringSize(json)), "XTABLES-DATA-VIEW").toJSON()));
            } else {
                session.sendMessage(new TextMessage(new Message(new XTablesDataViewReturn(false, XdashbackendApplication.xTablesViewerRef.get() != null && XdashbackendApplication.xTablesViewerRef.get().isVisible(), 0), "XTABLES-DATA-VIEW").toJSON()));

            }
        } else if (message.getType().equals("XTABLES-DATA-PUT")) {
            if (xTablesClient != null && xTablesClient.getSocketClient().isConnected) {
                KeyValuePair keyValuePair = gson.fromJson(message.getMessage(), KeyValuePair.class);
                ResponseStatus status = xTablesClient.putRaw(keyValuePair.getKey(), keyValuePair.getValue()).complete();
                session.sendMessage(new TextMessage(new Message(new XTablesStatusCodeReturn(true, status.name()), "XTABLES-DATA-PUT").toJSON()));
            } else {
                session.sendMessage(new TextMessage(new Message(new XTablesStatusCodeReturn(false, "NOT CONNECTED"), "XTABLES-DATA-PUT").toJSON()));

            }
        } else if (message.getType().equals("XTABLES-DATA-GET")) {
            if (xTablesClient != null && xTablesClient.getSocketClient().isConnected) {
                String key = message.getMessage();
                String raw = xTablesClient.getRaw(key).complete();
                session.sendMessage(new TextMessage(new Message(new XTablesStatusCodeReturn(true, raw), "XTABLES-DATA-GET").toJSON()));
            } else {
                session.sendMessage(new TextMessage(new Message(new XTablesStatusCodeReturn(false, "NOT CONNECTED"), "XTABLES-DATA-GET").toJSON()));

            }
        } else if (message.getType().equals("XTABLES-DATA-DELETE")) {
            if (xTablesClient != null && xTablesClient.getSocketClient().isConnected) {
                String key = message.getMessage();
                ResponseStatus status = xTablesClient.delete(key).complete();
                session.sendMessage(new TextMessage(new Message(new XTablesStatusCodeReturn(true, status.name()), "XTABLES-DATA-DELETE").toJSON()));
            } else {
                session.sendMessage(new TextMessage(new Message(new XTablesStatusCodeReturn(false, "NOT CONNECTED"), "XTABLES-DATA-DELETE").toJSON()));

            }
        } else if (message.getType().equals("XTABLES-REBOOT")) {
            if (xTablesClient != null && xTablesClient.getSocketClient().isConnected) {
                ResponseStatus status = xTablesClient.rebootServer().complete();
                session.sendMessage(new TextMessage(new Message(new XTablesStatusCodeReturn(true, status.name()), "XTABLES-REBOOT").toJSON()));
            } else {
                session.sendMessage(new TextMessage(new Message(new XTablesStatusCodeReturn(false, "NOT CONNECTED"), "XTABLES-REBOOT").toJSON()));

            }
        } else if (message.getType().equals("CONFIG-RELOAD")) {
            try {
                XdashbackendApplication.getConfigLoader().reload();
                session.sendMessage(new TextMessage(new Message(new StatusMessageCode(true, "The config has been reloaded."), "CONFIG-RELOAD").toJSON()));
            } catch (Exception e) {
                session.sendMessage(new TextMessage(new Message(new StatusMessageCode(false, "Error occurred while reloading: " + e.getMessage()), "CONFIG-RELOAD").toJSON()));
            }
        } else if (message.getType().equals("CONFIG-GET")) {
            try {
                ConfigProperties properties = XdashbackendApplication.getConfigLoader().getConfigProperties();
                session.sendMessage(new TextMessage(new Message(properties, "CONFIG-GET").toJSON()));
            } catch (Exception e) {
                logger.severe("Error occurred while getting config: " + e.getMessage());
            }
        } else if (message.getType().equals("CONFIG-SAVE")) {
            try {
                XdashbackendApplication.getConfigLoader().save();
                session.sendMessage(new TextMessage(new Message(new StatusMessageCode(true, "The config has been saved."), "CONFIG-SAVE").toJSON()));
            } catch (Exception e) {
                session.sendMessage(new TextMessage(new Message(new StatusMessageCode(false, "Error occurred while saving: " + e.getMessage()), "CONFIG-SAVE").toJSON()));
            }
        } else if (message.getType().equals("CONFIG-SET")) {
            try {
                String msg = message.getMessage();
                ConfigProperties newProperties = gson.fromJson(msg, ConfigProperties.class);
                XdashbackendApplication.getConfigLoader().setConfigPropertiesAndSave(newProperties);
                session.sendMessage(new TextMessage(new Message(new StatusMessageCode(true, "The new config has been saved."), "CONFIG-SET").toJSON()));
            } catch (Exception e) {
                session.sendMessage(new TextMessage(new Message(new StatusMessageCode(false, "Error occurred while setting new config: " + e.getMessage()), "CONFIG-SET").toJSON()));
            }
        } else if (message.getType().equals("DEVICES-SEARCH")) {
            String msg = message.getMessage();
            Integer number;
            try {
                number = Integer.parseInt(msg);
            } catch (Exception e) {
                number = null;
            }
            if (number != null && number > 0) {
                Thread thread = getThread(session, number);
                thread.start();
            }

        } else if (message.getType().equals("NETWORK-SCAN")) {
            Collection<TransientServiceInfo> serviceInfoList = XdashbackendApplication.getServices().values();
            String json = gson.toJson(serviceInfoList);
            session.sendMessage(new TextMessage(new Message(json, message.getType()).toJSON()));
        } else if (message.getType().equals("NETWORK-STATS")) {
            List<NetworkInterfaceDetails> serviceInfoList = NetworkInterfaceDetails.getNetworkDetails().stream()
                    .sorted((o1, o2) -> {
                        // First compare based on isUp
                        int upComparison = Boolean.compare(o2.isUp(), o1.isUp());
                        if (upComparison != 0) {
                            return upComparison;
                        }
                        // If both are up, compare based on non-empty ipv4Addresses
                        int ipv4Comparison = Boolean.compare(!o2.getIpv4Addresses().isEmpty(), !o1.getIpv4Addresses().isEmpty());
                        if (ipv4Comparison != 0) {
                            return ipv4Comparison;
                        }
                        // If both have the same ipv4Addresses state, compare based on non-empty ipv6Addresses
                        return Boolean.compare(!o2.getIpv6Addresses().isEmpty(), !o1.getIpv6Addresses().isEmpty());
                    })
                    .collect(Collectors.toList());
            String json = gson.toJson(serviceInfoList);
            session.sendMessage(new TextMessage(new Message(json, message.getType()).toJSON()));
        } else if (message.getType().equals("NETWORK-START-SUBNET-SCAN")) {
            String subnet = NetworkDiscovery.getSubnetBase();
            if (subnet != null) {
                session.sendMessage(new TextMessage(new Message(new SubnetScanData("Starting subnet scanner.", NetworkDiscovery.isScanning(), null, null, subnet, "STARTING"), "NETWORK-SUBNET-SCAN").toJSON()));
                NetworkDiscovery.scanSubnet(subnet);
            } else {
                session.sendMessage(new TextMessage(new Message(new SubnetScanData("Failed to find subnet.", NetworkDiscovery.isScanning(), null, null, null, "FAILED"), "NETWORK-SUBNET-SCAN").toJSON()));
            }
        } else if (message.getType().equals("NETWORK-STOP-SUBNET-SCAN")) {
            session.sendMessage(new TextMessage(new Message(new SubnetScanData("Stopping subnet scanner.", NetworkDiscovery.isScanning(), null, null, null, "STOPPING"), "NETWORK-SUBNET-SCAN").toJSON()));
            NetworkDiscovery.stopScanSubnet();
        } else if (message.getType().equals("DEVICES-DATA")) {

            List<SSHHostAddress> dataList = XdashbackendApplication.getResolvedXCASTERServices().values().stream().toList();
            session.sendMessage(new TextMessage(new Message(new MainPageDataReturn(gson.toJson(dataList), xTablesClient != null && xTablesClient.getSocketClient().isConnected, LogSave.getInstance().getLogs()), "DEVICES-DATA").toJSON()));
        } else if (message.getType().equals("DEVICES-DATA-LIMITED")) {
            List<SSHHostAddress> dataList = XdashbackendApplication.getResolvedXCASTERServices().values().stream().toList();
            session.sendMessage(new TextMessage(new Message(new MainPageDataReturn(gson.toJson(dataList), xTablesClient != null && xTablesClient.getSocketClient().isConnected, null), "DEVICES-DATA-LIMITED").toJSON()));
        } else if (message.getType().equals("DOCKER-PAGE")) {
            List<SSHHostAddress> dataList = XdashbackendApplication.getResolvedXCASTERServices().values().stream().toList();
            boolean ready = true;
            String response = "The docker pipeline is ready.";
            if (XdashbackendApplication.getConfigLoader().getInternetWifiSSID() == null || XdashbackendApplication.getConfigLoader().getInternetWifiSSID().isEmpty()) {
                ready = false;
                response = "The internet WiFi SSID has not been configured.";
            }
            if (XdashbackendApplication.getConfigLoader().getRobotWifiSSID() == null || XdashbackendApplication.getConfigLoader().getRobotWifiSSID().isEmpty()) {
                ready = false;
                response = "The robot WiFi SSID has not been configured.";
            }
            if (XdashbackendApplication.getConfigLoader().getProjectDirectory() == null || XdashbackendApplication.getConfigLoader().getProjectDirectory().isEmpty()) {
                ready = false;
                response = "The project directory has not been configured.";
            }
            session.sendMessage(new TextMessage(new Message(new DockerPageReturn(gson.toJson(dataList), ready, response, XdashbackendApplication.getConfigLoader().getProjectDirectory()), message.getType()).toJSON()));
        } else if (message.getType().equals("DEVICE-DATA")) {
            String server = message.getMessage();
            SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(server);
            if (sshHostAddress != null) {
                session.sendMessage(new TextMessage(new Message(new DeviceDataReturn(true, sshHostAddress.getHostname(), sshHostAddress.getAddress(), sshHostAddress.getServer(), sshHostAddress.getStatus()), "DEVICE-DATA").toJSON()));
            } else {
                session.sendMessage(new TextMessage(new Message(new DeviceDataReturn(false, null, null, null, null), "DEVICE-DATA").toJSON()));
            }
        } else if (message.getType().equals("DEVICES-FILE-EDITOR")) {
            String msg = message.getMessage();
            try {
                DeviceFileEditorRequest deviceFileEditorRequest = gson.fromJson(msg, DeviceFileEditorRequest.class);
                String[] servers = deviceFileEditorRequest.getServers();
                if(servers == null) {
                    session.sendMessage(new TextMessage(new Message(new StatusMessageCode(false, "The server is not in arguments."), message.getType()).toJSON()));
                    return;
                }
                if(deviceFileEditorRequest.getRemoteFilePath() == null) {
                    session.sendMessage(new TextMessage(new Message(new StatusMessageCode(false, "The remote file path is not in arguments."), message.getType()).toJSON()));
                    return;
                }
                int failures = 0;
                for (String server : servers) {
                    try {
                        SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(server);
                        if (sshHostAddress != null) {
                            App.openRemoteFileEditor(sshHostAddress, deviceFileEditorRequest.getRemoteFilePath());
                            session.sendMessage(new TextMessage(new Message(new StatusMessageCode(true, "File editor started.").setFinished(false), message.getType()).toJSON()));
                        } else {
                            failures++;
                            session.sendMessage(new TextMessage(new Message(new StatusMessageCode(false, "The server does not exist.").setFinished(false), message.getType()).toJSON()));
                        }
                    } catch (Exception e) {
                        failures++;
                        session.sendMessage(new TextMessage(new Message(new StatusMessageCode(false, "Error occurred: " + e.getMessage()).setFinished(false), message.getType()).toJSON()));
                    }
                }
                session.sendMessage(new TextMessage(new Message(new StatusMessageCode(true, String.format("%1$s/%2$s machines opened successfully.", servers.length - failures, servers.length)).setFinished(true), message.getType()).toJSON()));
            } catch (Exception e) {
                session.sendMessage(new TextMessage(new Message(new StatusMessageCode(false, "Error occurred: " + e.getMessage()).setFinished(true), message.getType()).toJSON()));

            }
        } else if (message.getType().equals("DEVICE-LOGS")) {
            String msg = message.getMessage();
            if (msg != null) {
                DeviceLogRange deviceLogRange;
                try {
                    deviceLogRange = gson.fromJson(msg, DeviceLogRange.class);
                } catch (Exception e) {
                    session.sendMessage(new TextMessage(new Message(new DeviceLogRange(false), message.getType()).toJSON()));
                    return;
                }
                SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(deviceLogRange.getServer());
                if (sshHostAddress != null) {
                    List<JournalEntry> entries;
                    int start = deviceLogRange.getStart();
                    int end = deviceLogRange.getEnd();

                    if (start == 0 && end == 0) end = 100;
                    try {
                        entries = sshHostAddress.getLogs(start, end);
                    } catch (Exception ignored) {
                        entries = new ArrayList<>();
                    }
                    session.sendMessage(new TextMessage(new Message(entries, message.getType()).toJSON()));
                } else {
                    session.sendMessage(new TextMessage(new Message(new DeviceDataReturn(false, null, null, null, null), "DEVICE-DATA").toJSON()));
                }
            }
        } else if (message.getType().equals("DEVICE-SCP-LIST")) {
            String msg = message.getMessage();
            if (msg != null) {
                SCPList scpList = null;
                try {
                    scpList = gson.fromJson(msg, SCPList.class);
                } catch (Exception e) {
                    session.sendMessage(new TextMessage(new Message(new SCPListReturn(false, null, "The incoming data cannot be parsed."), message.getType()).toJSON()));
                    return;
                }
                if (scpList != null) {
                    SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(scpList.getServer());
                    if (sshHostAddress != null) {
                        if (sshHostAddress.forceIsConnected()) {
                            String directory = scpList.getDirectory();
                            if (directory != null) {
                                List<SSHHostAddress.FileInfo> fileInfos = sshHostAddress.listFilesAndDirectories(directory);
                                String json = gson.toJson(fileInfos);
                                session.sendMessage(new TextMessage(new Message(new SCPListReturn(true, json, "The data has been found."), message.getType()).toJSON()));
                            } else {
                                session.sendMessage(new TextMessage(new Message(new SCPListReturn(false, null, "The directory is null."), message.getType()).toJSON()));
                            }
                        } else {
                            session.sendMessage(new TextMessage(new Message(new SCPListReturn(false, null, "The machine is not connected."), message.getType()).toJSON()));
                        }
                    } else {
                        session.sendMessage(new TextMessage(new Message(new SCPListReturn(false, null, "The machine was not found."), message.getType()).toJSON()));
                    }
                } else {
                    session.sendMessage(new TextMessage(new Message(new SCPListReturn(false, null, "The incoming data cannot be found."), message.getType()).toJSON()));
                }
            } else {
                session.sendMessage(new TextMessage(new Message(new SCPListReturn(false, null, "No message found!"), message.getType()).toJSON()));
            }
        } else if (message.getType().equals("DEVICE-SERVICES-DATA")) {
            String server = message.getMessage();
            SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(server);

            if (sshHostAddress != null) {
                if (sshHostAddress.getStatus().equals("CONNECTED")) {
                    String data = sshHostAddress.sendExecCommand("systemctl list-units --type=service --no-page --no-legend | awk '{print $1}' | xargs -I{} systemctl show {} --property=Id,ExecMainPID,ActiveState,MemoryCurrent,CPUUsageNSec,ExecMainStartTimestamp");
                    List<org.kobe.xbot.xdashbackend.entities.ServiceInfo> serviceInfoList = parseServiceInfo(data);
                    String json = gson.toJson(serviceInfoList);
                    session.sendMessage(new TextMessage(new Message(new ServicesDataReturn(true, sshHostAddress.getStatus(), json), message.getType()).toJSON()));
                } else {
                    session.sendMessage(new TextMessage(new Message(new ServicesDataReturn(true, sshHostAddress.getStatus(), null), message.getType()).toJSON()));
                }
            } else {
                session.sendMessage(new TextMessage(new Message(new ServicesDataReturn(false, null, null), message.getType()).toJSON()));
            }
        } else if (message.getType().equals("DEVICE-SERVICE-RESTART")) {
            String msg = message.getMessage();
            if (msg != null) {
                ServiceData serviceData = null;
                try {
                    serviceData = gson.fromJson(msg, ServiceData.class);
                } catch (Exception e) {
                    session.sendMessage(new TextMessage(new Message(new ServiceRebootReturn(false, "Data cannot be parsed."), message.getType()).toJSON()));
                    return;
                }
                SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(serviceData.getServer());
                if (sshHostAddress != null) {
                    if (sshHostAddress.getStatus().equals("CONNECTED")) {
                        String response = sshHostAddress.sendExecCommandWithSudoPermissions(String.format("systemctl restart %1$s", serviceData.getServiceID().trim()));
                        session.sendMessage(new TextMessage(new Message(new ServiceRebootReturn(true, response), message.getType()).toJSON()));
                    } else {
                        session.sendMessage(new TextMessage(new Message(new ServiceRebootReturn(false, "Session is not connected."), message.getType()).toJSON()));
                    }
                } else {
                    session.sendMessage(new TextMessage(new Message(new ServiceRebootReturn(false, "Session does not exist."), message.getType()).toJSON()));
                }
            }
        } else if (message.getType().equals("DEVICE-REBOOT")) {
            String server = message.getMessage();
            SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(server);
            if (sshHostAddress != null) {
                if (sshHostAddress.forceIsConnected()) {
                    String response = sshHostAddress.sendCommandWithSudoPermissions("shutdown -r now", null);
                    session.sendMessage(new TextMessage(new Message(new CommandReturn(response, sshHostAddress.getStatus(), true, true), "DEVICE-REBOOT").toJSON()));
                } else {
                    session.sendMessage(new TextMessage(new Message(new CommandReturn(null, sshHostAddress.getStatus(), false, true), "DEVICE-REBOOT").toJSON()));
                }
            } else {
                session.sendMessage(new TextMessage(new Message(new CommandReturn(null, "DISCONNECTED", false, true), "DEVICE-REBOOT").toJSON()));
            }
        } else if (message.getType().equals("DOCKER-BUILD")) {
            String msg = message.getMessage();
            if (msg != null) {
                try {
                    DockerBuildReturn dockerBuildReturn = gson.fromJson(msg, DockerBuildReturn.class);
                    if (dockerBuildReturn.getARCHITECTURE() == null || dockerBuildReturn.getIMAGE_NAME() == null) {
                        session.sendMessage(new TextMessage(new Message(new DockerProgress("Missing arguments.", DockerStep.ERROR, 0).setFinished(true).setSuccess(false), message.getType()).toJSON()));
                        return;
                    }
                    if (XdashbackendApplication.getConfigLoader().getProjectDirectory() == null || XdashbackendApplication.getConfigLoader().getProjectDirectory().isEmpty()) {
                        session.sendMessage(new TextMessage(new Message(new DockerProgress("Missing project directory.", DockerStep.ERROR, 0).setFinished(true).setSuccess(false), message.getType()).toJSON()));
                        return;
                    }
                    if (XdashbackendApplication.getConfigLoader().getDockerImagesDirectory() == null || XdashbackendApplication.getConfigLoader().getDockerImagesDirectory().isEmpty()) {
                        session.sendMessage(new TextMessage(new Message(new DockerProgress("Missing docker images directory.", DockerStep.ERROR, 0).setFinished(true).setSuccess(false), message.getType()).toJSON()));
                        return;
                    }
                    Architecture architecture = Architecture.valueOfNull(dockerBuildReturn.getARCHITECTURE());
                    if (architecture == null) {
                        session.sendMessage(new TextMessage(new Message(new DockerProgress("Invalid architecture type or unsupported.", DockerStep.ERROR, 0).setFinished(true).setSuccess(false), message.getType()).toJSON()));
                        return;
                    }
                    File file = DockerManager.buildTARImage(XdashbackendApplication.getConfigLoader().getProjectDirectory(),
                            dockerBuildReturn.getIMAGE_NAME(),
                            XdashbackendApplication.getConfigLoader().getDockerImagesDirectory(),
                            (a) -> {
                                try {
                                    session.sendMessage(new TextMessage(new Message(a, message.getType()).toJSON()));
                                } catch (IOException ignored) {
                                }

                            }, architecture);
                    if (file == null) {
                        session.sendMessage(new TextMessage(new Message(new DockerProgress("Image TARBALL file could not be located.", DockerStep.ERROR, 0).setFinished(true).setSuccess(false), message.getType()).toJSON()));
                    } else {
                        session.sendMessage(new TextMessage(new Message(new DockerProgress("XDASH has finished building the docker image.", DockerStep.FINISHED, 100).setFinished(true).setSuccess(true), message.getType()).toJSON()));
                    }
                } catch (Exception e) {
                    session.sendMessage(new TextMessage(new Message(new DockerProgress("Failed while building: " + e.getMessage(), DockerStep.ERROR, 0).setFinished(true).setSuccess(false), message.getType()).toJSON()));
                }
            }
        } else if (message.getType().equals("WIFI-LIST")) {
            try {
                List<Wifi> wifis = NetworkManager.scanNetworks();
                String json = gson.toJson(wifis);
                session.sendMessage(new TextMessage(new Message(new StatusMessageCode(true, json), message.getType()).toJSON()));

            } catch (Exception e) {
                session.sendMessage(new TextMessage(new Message(new StatusMessageCode(false, e.getMessage()), message.getType()).toJSON()));

            }
        } else if (message.getType().equals("WIFI-CONNECT")) {
            try {
                String type = message.getMessage();
                if (type == null || type.isEmpty() || type.isBlank()) {
                    session.sendMessage(new TextMessage(new Message(new StatusMessageCode(false, "There was no type in payload.").setFinished(true), message.getType()).toJSON()));
                    return;
                }
                if (type.equals("ROBOT") || type.equals("INTERNET")) {
                    if (XdashbackendApplication.getConfigLoader().getRobotWifiSSID() == null || XdashbackendApplication.getConfigLoader().getRobotWifiSSID().isEmpty() || XdashbackendApplication.getConfigLoader().getRobotWifiSSID().isBlank()) {
                        session.sendMessage(new TextMessage(new Message(new StatusMessageCode(false, "The robot WiFi SSID is not configured.").setFinished(true), message.getType()).toJSON()));
                        return;
                    }
                    if (XdashbackendApplication.getConfigLoader().getInternetWifiSSID() == null || XdashbackendApplication.getConfigLoader().getInternetWifiSSID().isEmpty() || XdashbackendApplication.getConfigLoader().getInternetWifiSSID().isBlank()) {
                        session.sendMessage(new TextMessage(new Message(new StatusMessageCode(false, "The internet WiFi SSID is not configured.").setFinished(true), message.getType()).toJSON()));
                        return;
                    }
                    String ssid = type.equals("ROBOT") ? XdashbackendApplication.getConfigLoader().getRobotWifiSSID() : XdashbackendApplication.getConfigLoader().getInternetWifiSSID();
                    NetworkManager.connectWifi(ssid, (a) -> {
                        try {
                            session.sendMessage(new TextMessage(new Message(a, message.getType()).toJSON()));
                        } catch (IOException ignored) {
                        }
                    });

                } else {
                    session.sendMessage(new TextMessage(new Message(new StatusMessageCode(false, "The type is not valid.").setFinished(true), message.getType()).toJSON()));
                }
            } catch (Exception e) {
                session.sendMessage(new TextMessage(new Message(new StatusMessageCode(false, e.getMessage()).setFinished(true), message.getType()).toJSON()));

            }
        } else if (message.getType().equals("DEVICE-ADD")) {
            String msg = message.getMessage();
            try {
                DeviceAddData deviceAddData = gson.fromJson(msg, DeviceAddData.class);
                String server = deviceAddData.getHostname() + ".local";
                if (XdashbackendApplication.getResolvedXCASTERServices().values().stream().anyMatch(m -> m.getAddress().equals(deviceAddData.getAddress()))) {
                    session.sendMessage(new TextMessage(new Message(new StatusMessageCode(false, "Another machine with the same address already exists!"), "DEVICE-ADD").toJSON()));
                    return;
                }
                SSHHostAddress sshHostAddress = new SSHHostAddress(deviceAddData.getHostname(), deviceAddData.getUsername(), deviceAddData.getPassword(), deviceAddData.getAddress(), server);
                SSHHostAddress previous = XdashbackendApplication.getResolvedXCASTERServices().put(server, sshHostAddress);
                if (previous != null)
                    session.sendMessage(new TextMessage(new Message(new StatusMessageCode(true, "Machine registered at: " + server), "DEVICE-ADD").toJSON()));
                else
                    session.sendMessage(new TextMessage(new Message(new StatusMessageCode(true, "Updated value at: " + server), "DEVICE-ADD").toJSON()));

            } catch (Exception e) {
                session.sendMessage(new TextMessage(new Message(new StatusMessageCode(false, "Failed to run: " + e.getMessage()), "DEVICE-ADD").toJSON()));
            }
        } else if (message.getType().equals("DEVICES-REBOOT")) {
            String serversMsg = message.getMessage();
            try {
                String[] servers = gson.fromJson(serversMsg, String[].class);
                int failures = 0;
                for (int i = 0; i < servers.length; i++) {
                    String server = servers[i];
                    SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(server);
                    if (sshHostAddress != null) {
                        if (sshHostAddress.forceIsConnected()) {
                            String response = sshHostAddress.sendExecCommandWithSudoPermissions("reboot");
                            session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(response, server, i, true, false), "DEVICES-REBOOT").toJSON()));
                        } else {
                            failures++;
                            session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn("The machine server is not connected.", server, i, false, false), "DEVICES-REBOOT").toJSON()));
                        }
                    } else {
                        failures++;
                        session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn("The machine server was not found.", server, i, false, false), "DEVICES-REBOOT").toJSON()));
                    }
                }
                session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(String.format("%1$s/%2$s machines were rebooted successfully.", servers.length - failures, servers.length), null, servers.length, failures == 0, true), "DEVICES-REBOOT").toJSON()));
            } catch (Exception e) {
                session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(e.getMessage(), null, 0, false, true), "DEVICES-REBOOT").toJSON()));
            }
        } else if (message.getType().equals("DEVICES-RECONNECT")) {
            String serversMsg = message.getMessage();
            try {
                SSHHostAddress[] sshHostAddresses = gson.fromJson(serversMsg, SSHHostAddress[].class);

                SSHConnectionManager.reconnectToAll(sshHostAddresses, (a) -> {
                    try {
                        session.sendMessage(new TextMessage(new Message(a, message.getType()).toJSON()));
                    } catch (IOException ignored) {

                    }

                });

                session.sendMessage(new TextMessage(new Message(new DevicesReconnectReturn("All machines have been reconnected.", null, true, true), message.getType()).toJSON()));

            } catch (Exception e) {
                session.sendMessage(new TextMessage(new Message(new DevicesReconnectReturn("Error while reconnecting devices: " + e.getMessage(), null, false, true), message.getType()).toJSON()));
            }
        } else if (message.getType().equals("DEVICES-CUSTOM-COMMAND")) {
            String msg = message.getMessage();
            try {
                CustomCommandReturn customCommandReturn = gson.fromJson(msg, CustomCommandReturn.class);
                String[] servers = customCommandReturn.getServers();
                int failures = 0;
                for (int i = 0; i < servers.length; i++) {
                    String server = servers[i];
                    SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(server);
                    if (sshHostAddress != null) {
                        if (sshHostAddress.forceIsConnected()) {
                            int finalI = i;
                            sshHostAddress.sendExecCommandWithSudoPermissions(customCommandReturn.getCommand(), 1, (a) -> {
                                try {
                                    session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(a.getMessage(), server, finalI, null, false), message.getType()).toJSON()));
                                } catch (Exception ignored) {
                                }
                            });
                        } else {
                            failures++;
                            session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn("The machine server is not connected.", server, i, false, false), message.getType()).toJSON()));
                        }
                    } else {
                        failures++;
                        session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn("The machine server was not found.", server, i, false, false), message.getType()).toJSON()));
                    }
                }
                session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(String.format("%1$s/%2$s commands were executed successfully.", servers.length - failures, servers.length), null, servers.length, failures == 0, true), message.getType()).toJSON()));
            } catch (Exception e) {
                session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(e.getMessage(), null, 0, false, true), message.getType()).toJSON()));
            }
        } else if (message.getType().equals("DEVICES-REDEPLOY")) {
            List<String> services = XdashbackendApplication.getConfigLoader().getServices();
            if (services == null || services.isEmpty()) {
                session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn("Please add services into the config file.", null, 0, false, true), "DEVICES-REDEPLOY").toJSON()));
                return;
            }
            String serversMsg = message.getMessage();

            try {
                String[] servers = gson.fromJson(serversMsg, String[].class);
                int failures = 0;
                for (int i = 0; i < servers.length; i++) {
                    String server = servers[i];
                    SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(server);
                    if (sshHostAddress != null) {
                        if (sshHostAddress.forceIsConnected()) {
                            int finalI = i;

                            session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn("Reloading system daemons...", server, finalI, null, false), "DEVICES-REDEPLOY").toJSON()));
                            sshHostAddress.sendExecCommandWithSudoPermissions("systemctl daemon-reload", 1, (a) -> {
                                try {
                                    session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(a.getMessage(), server, finalI, null, false), "DEVICES-REDEPLOY").toJSON()));
                                } catch (Exception ignored) {
                                }
                            });
                            session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn("Restarting services daemons...", server, finalI, null, false), "DEVICES-REDEPLOY").toJSON()));
                            sshHostAddress.sendExecCommandWithSudoPermissions("systemctl restart " + String.join(" ", services), 1, (a) -> {
                                try {
                                    session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(a.getMessage(), server, finalI, true, false), "DEVICES-REDEPLOY").toJSON()));
                                } catch (Exception ignored) {
                                }
                            });
                        } else {
                            failures++;
                            session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn("The machine server is not connected.", server, i, false, false), "DEVICES-REDEPLOY").toJSON()));
                        }
                    } else {
                        failures++;
                        session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn("The machine server was not found.", server, i, false, false), "DEVICES-REDEPLOY").toJSON()));
                    }
                }
                session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(String.format("%1$s/%2$s machines were redeployed successfully.", servers.length - failures, servers.length), null, servers.length, failures == 0, true), "DEVICES-REDEPLOY").toJSON()));
            } catch (Exception e) {
                session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(e.getMessage(), null, 0, false, true), "DEVICES-REDEPLOY").toJSON()));
            }
        } else if (message.getType().equals("DEVICES-DOCKER-IMPORT")) {
            String msg = message.getMessage();
            try {
                DockerImportRequest devicesTransferFiles = gson.fromJson(msg, DockerImportRequest.class);


                String[] servers = devicesTransferFiles.getServers();
                if (servers == null) {
                    session.sendMessage(new TextMessage(new Message(new DockerImportReturn("No servers in argument.", null, false, true), message.getType()).toJSON()));
                    return;
                }
                String archString = devicesTransferFiles.getArchitecture();
                if (archString == null) {
                    session.sendMessage(new TextMessage(new Message(new DockerImportReturn("No architecture in argument.", null, false, true), message.getType()).toJSON()));
                    return;
                }
                Architecture architecture = Architecture.valueOfNull(archString);
                if (architecture == null) {
                    session.sendMessage(new TextMessage(new Message(new DockerImportReturn("No valid architecture in argument.", null, false, true), message.getType()).toJSON()));
                    return;
                }
                String flashTypeString = devicesTransferFiles.getFlashType();
                if (flashTypeString == null) {
                    session.sendMessage(new TextMessage(new Message(new DockerImportReturn("No flashType in argument.", null, false, true), message.getType()).toJSON()));
                    return;
                }
                DockerFlashType flashType = DockerFlashType.valueOfNull(flashTypeString);
                if (flashType == null) {
                    session.sendMessage(new TextMessage(new Message(new DockerImportReturn("No valid flash type in argument.", null, false, true), message.getType()).toJSON()));
                    return;
                }
                String imageName = devicesTransferFiles.getImageName();
                if (imageName == null) {
                    session.sendMessage(new TextMessage(new Message(new DockerImportReturn("No image name in argument.", null, false, true), message.getType()).toJSON()));
                    return;
                }
                String containerName = devicesTransferFiles.getContainerName();
                if (containerName == null) {
                    session.sendMessage(new TextMessage(new Message(new DockerImportReturn("No container name in argument.", null, false, true), message.getType()).toJSON()));
                    return;
                }

                String imagePath = XdashbackendApplication.getConfigLoader().getDockerImagesDirectory() + "/" + imageName + ".tar";
                File imageFile = new File(imagePath);
                if (imageFile == null || !imageFile.exists() || !imageFile.isFile()) {
                    session.sendMessage(new TextMessage(new Message(new DockerImportReturn("No valid image found.", null, false, true), message.getType()).toJSON()));
                    return;
                }
                int failures = 0;
                for (String server : servers) {
                    SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(server);
                    if (sshHostAddress != null) {
                        if (sshHostAddress.forceIsConnected()) {
                            sshHostAddress.uploadDockerImage(imageFile, containerName, flashType, (v) -> {
                                try {
                                    session.sendMessage(new TextMessage(new Message(v, message.getType()).toJSON()));
                                } catch (Exception ignored) {
                                }
                            });
                            session.sendMessage(new TextMessage(new Message(new DockerImportReturn(String.format("Docker pipeline finished for host: %s (%s)", sshHostAddress.getHostname(), sshHostAddress.getAddress()), server, true, false), message.getType()).toJSON()));
                        } else {
                            failures++;
                            session.sendMessage(new TextMessage(new Message(new DockerImportReturn(String.format("The machine server is not connected: %s (%s)", sshHostAddress.getHostname(), sshHostAddress.getAddress()), server, false, false), message.getType()).toJSON()));
                        }
                    } else {
                        failures++;
                        session.sendMessage(new TextMessage(new Message(new DockerImportReturn(String.format("The machine server was not found: %s", server), server, true, false), message.getType()).toJSON()));
                    }
                }
                session.sendMessage(new TextMessage(new Message(new DockerImportReturn(String.format("%1$s/%2$s machines were flashed successfully.", servers.length - failures, servers.length), null, true, true), message.getType()).toJSON()));
            } catch (Exception e) {
                session.sendMessage(new TextMessage(new Message(new DockerImportReturn(e.getMessage(), null, false, true), message.getType()).toJSON()));
            }
        } else if (message.getType().equals("DEVICES-TRANSFER-FILES")) {
            String msg = message.getMessage();
            try {
                DevicesTransferFiles devicesTransferFiles = gson.fromJson(msg, DevicesTransferFiles.class);
                if (!Utilities.isValidPath(devicesTransferFiles.getLocalDirectory())) {
                    session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn("The local directory does not exist.", null, 0, false, true), "DEVICES-TRANSFER-FILES").toJSON()));
                    return;
                }

                int failures = 0;
                session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn("Creating TAR file now...", null, 0, null, false), "DEVICES-TRANSFER-FILES").toJSON()));
                String tarFilePath = Utilities.formatDirectoryPath(devicesTransferFiles.getLocalDirectory()) + "xdash.tar.gz";

                if (!Utilities.createTar(devicesTransferFiles.getLocalDirectory(), tarFilePath, (a) -> {
                    try {
                        session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(a.getMessage(), null, 0, null, false), "DEVICES-TRANSFER-FILES").toJSON()));
                    } catch (IOException ignored) {
                    }
                })) {
                    session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn("Failed to create TAR file.", null, 0, false, true), "DEVICES-TRANSFER-FILES").toJSON()));
                    return;
                }
                session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn("TAR file successfully created at: " + tarFilePath, null, 0, true, false), "DEVICES-TRANSFER-FILES").toJSON()));
                logger.info(String.format("TAR File created at: '%1$s'", tarFilePath));
                String[] servers = devicesTransferFiles.getServers();
                for (int i = 0; i < servers.length; i++) {
                    String server = servers[i];
                    SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(server);
                    if (sshHostAddress != null) {
                        if (sshHostAddress.forceIsConnected()) {
                            int finalI = i;
                            boolean response = sshHostAddress.transferAndExtract(tarFilePath, devicesTransferFiles.getRemoteDirectory(), devicesTransferFiles.isUseLocalSCP(), (a) -> {
                                try {
                                    session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(String.format("%1$s | %2$s | %3$s/%4$s bytes", a.getMessage(), Utilities.formatNumber(a.getPercentage(), 3), a.getCurrentBytes(), a.getTotalBytes()), server, finalI + 1, null, false), "DEVICES-TRANSFER-FILES").toJSON()));
                                } catch (Exception ignored) {
                                }
                            });
                            if (response)
                                session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn("All files were sent successfully.", server, i + 1, true, false), "DEVICES-TRANSFER-FILES").toJSON()));
                            else {
                                session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(null, server, finalI + 1, false, false), "DEVICES-TRANSFER-FILES").toJSON()));
                                failures++;
                            }

                        } else {
                            failures++;
                            session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn("The machine server is not connected.", server, i + 1, false, false), "DEVICES-TRANSFER-FILES").toJSON()));
                        }
                    } else {
                        failures++;
                        session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn("The machine server was not found.", server, i + 1, false, false), "DEVICES-TRANSFER-FILES").toJSON()));
                    }
                }
                try {
                    session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(String.format("Deleting TAR file at: '%1$s'...", tarFilePath), null, servers.length + 1, false, false), "DEVICES-TRANSFER-FILES").toJSON()));
                    boolean success = new File(tarFilePath).delete();
                    if (success) {
                        session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(String.format("Deleted TAR file at: '%1$s'...", tarFilePath), null, servers.length + 1, true, false), "DEVICES-TRANSFER-FILES").toJSON()));
                        logger.info(String.format("Deleted file at: '%1$s'", tarFilePath));
                    } else {
                        session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(String.format("Failed to deleted TAR file at: '%1$s'...", tarFilePath), null, servers.length + 1, false, false), "DEVICES-TRANSFER-FILES").toJSON()));
                        logger.info(String.format("Failed to delete file at: '%1$s'", tarFilePath));
                    }

                } catch (Exception e) {
                    logger.severe("Failed to delete tar file '" + tarFilePath + "': " + e.getMessage());
                }
                session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(String.format("%1$s/%2$s machines were updated successfully.", servers.length - failures, servers.length), null, servers.length + 2, failures == 0, true), "DEVICES-TRANSFER-FILES").toJSON()));
            } catch (Exception e) {
                session.sendMessage(new TextMessage(new Message(new DevicesScriptReturn(e.getMessage(), null, 0, false, true), "DEVICES-TRANSFER-FILES").toJSON()));
            }
        } else if (message.getType().startsWith("DEVICE-COMMAND-NEW-SESSION")) {
            String msg = message.getMessage();
            if (msg != null) {
                SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(msg);
                if (sshHostAddress != null) {
                    if (sshHostAddress.forceIsConnected()) {
                        boolean status = sshHostAddress.createNewChannel((string) -> {
                            try {
                                session.sendMessage(new TextMessage(new Message(new CommandReturn(string, sshHostAddress.getStatus(), true, false), "DEVICE-SHELL").toJSON()));
                            } catch (Exception ignored) {
                            }
                        });
                        session.sendMessage(new TextMessage(new Message(new CommandReturn("\u001B[33mXDASH: Channel Creation Finished. Success?: " + status, sshHostAddress.getStatus(), true, true), "DEVICE-SHELL").toJSON()));
                        session.sendMessage(new TextMessage(new Message(new CommandReturn("Channel creation finished.", sshHostAddress.getStatus(), status, true), "DEVICE-COMMAND-NEW-SESSION").toJSON()));

                    } else {
                        session.sendMessage(new TextMessage(new Message(new CommandReturn("Machine not connected.", sshHostAddress.getStatus(), false, true), "DEVICE-SHELL").toJSON()));
                    }
                } else {
                    session.sendMessage(new TextMessage(new Message(new CommandReturn("Machine not found.", "DISCONNECTED", false, true), "DEVICE-SHELL").toJSON()));
                }

            } else {
                session.sendMessage(new TextMessage(new Message(new CommandReturn("No Message Found!", "DISCONNECTED", false, true), "DEVICE-SHELL").toJSON()));
            }

        } else if (message.getType().startsWith("DEVICE-COMMAND")) {
            String msg = message.getMessage();
            if (msg != null) {
                Command command = null;
                try {
                    command = gson.fromJson(msg, Command.class);
                } catch (Exception e) {
                    session.sendMessage(new TextMessage(new Message(new CommandReturn("Command cannot be parsed.", "DISCONNECTED", false, true), "DEVICE-SHELL").toJSON()));
                    return;
                }
                if (command != null) {
                    SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(command.getServer());
                    if (sshHostAddress != null) {
                        if (sshHostAddress.forceIsConnected()) {
                            if (sshHostAddress.isChannelActive()) {
                                Consumer<String> listener = (string) -> {
                                    try {
                                        session.sendMessage(new TextMessage(new Message(new CommandReturn(string.replaceAll("\\e\\[[\\d;]*[^\\d;]", ""), sshHostAddress.getStatus(), true, false), "DEVICE-SHELL").toJSON()));
                                    } catch (Exception ignored) {
                                    }
                                };
                                String response;
                                if (message.getType().equals("DEVICE-COMMAND-SUDO")) {
                                    response = sshHostAddress.sendCommandWithSudoPermissions(command.getCommand(), listener);
                                } else if (message.getType().equals("DEVICE-COMMAND-CONTROL")) {
                                    ControlCharacter controlCharacter;
                                    try {
                                        controlCharacter = ControlCharacter.valueOf(command.getCommand());
                                    } catch (Exception ignored) {
                                        controlCharacter = null;
                                    }
                                    if (controlCharacter != null) {
                                        response = sshHostAddress.sendControlCharacter(controlCharacter, listener);
                                    } else response = "This control command does not exist.";

                                } else {
                                    response = sshHostAddress.sendCommand(command.getCommand(), listener);
                                }

                                session.sendMessage(new TextMessage(new Message(new CommandReturn("\u001B[33mXDASH: Command Finished: " + response, sshHostAddress.getStatus(), true, true), "DEVICE-SHELL").toJSON()));
                            } else {
                                session.sendMessage(new TextMessage(new Message(new CommandReturn("\u001B[33mXDASH: No channel is currently active.", sshHostAddress.getStatus(), false, true), "DEVICE-SHELL").toJSON()));
                            }
                        } else {
                            session.sendMessage(new TextMessage(new Message(new CommandReturn("\u001B[33mXDASH: Machine not connected.", sshHostAddress.getStatus(), false, true), "DEVICE-SHELL").toJSON()));
                        }
                    } else {
                        session.sendMessage(new TextMessage(new Message(new CommandReturn("\u001B[33mXDASH: Machine not found.", "DISCONNECTED", false, true), "DEVICE-SHELL").toJSON()));
                    }
                } else {
                    session.sendMessage(new TextMessage(new Message(new CommandReturn("Command not found.", "DISCONNECTED", false, true), "DEVICE-SHELL").toJSON()));
                }
            } else {
                session.sendMessage(new TextMessage(new Message(new CommandReturn("No Message Found!", "DISCONNECTED", false, true), "DEVICE-SHELL").toJSON()));
            }
        } else {
            session.sendMessage(new TextMessage(new Message("Unknown Message", "UNKNOWN").toJSON()));
        }
    }

    private static Thread getThread(WebSocketSession session, int number) {
        Thread thread = new Thread(() -> {
            try {
                String name = "XCASTER - Service Broadcaster" + (number > 1 ? String.format(" (%1$s)", number) : "");
                XdashbackendApplication.getxJmDNS().getJmDNS().requestServiceInfo("_xcaster._tcp.local.", name, true, 3000);
                ServiceInfo serviceInfo = XdashbackendApplication.getxJmDNS().getJmDNS().getServiceInfo("_xcaster._tcp.local.", name, true, 500);
                if (serviceInfo != null) {
                    String server = serviceInfo.getServer();
                    String serviceAddress = serviceInfo.getInet4Addresses()[0].getHostAddress();
                    String hostname = new String(serviceInfo.getPropertyBytes("hostname"));
                    String username = new String(serviceInfo.getPropertyBytes("username"));
                    String password = new String(serviceInfo.getPropertyBytes("password"));
                    if (server == null || serviceAddress == null || hostname == null) {
                        session.sendMessage(new TextMessage(new Message(new DeviceDataReturn(false, hostname, serviceAddress, server, "DISCONNECTED"), "DEVICES-SEARCH").toJSON()));
                    } else {
                        if (!XdashbackendApplication.getResolvedXCASTERServices().containsKey(server) || (!XdashbackendApplication.getResolvedXCASTERServices().get(server).getHostname().equals(hostname) && !XdashbackendApplication.getResolvedXCASTERServices().get(server).getAddress().equals(serviceAddress))) {
                            SSHHostAddress sshHostAddress = new SSHHostAddress(hostname, username, password, serviceAddress, server);
                            XdashbackendApplication.getResolvedXCASTERServices().put(server, sshHostAddress);
                            session.sendMessage(new TextMessage(new Message(new DeviceDataReturn(true, hostname, serviceAddress, server, sshHostAddress.getStatus()), "DEVICES-SEARCH").toJSON()));
                        } else {
                            SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(server);
                            session.sendMessage(new TextMessage(new Message(new DeviceDataReturn(true, hostname, serviceAddress, server, sshHostAddress.getStatus()), "DEVICES-SEARCH").toJSON()));
                        }
                    }
                } else {
                    session.sendMessage(new TextMessage(new Message(new DeviceDataReturn(false, null, null, null, null), "DEVICES-SEARCH").toJSON()));

                }
            } catch (Exception ignored) {

            }
        });
        thread.setDaemon(true);
        return thread;
    }


    public static void broadcast(DataReturn data, String type) {
        synchronized (sessions) {
            for (WebSocketSession session : sessions) {
                try {
                    session.sendMessage(new TextMessage(new Message(data, type).toJSON()));
                } catch (Exception ignored) {
                }
            }
        }
    }
}

