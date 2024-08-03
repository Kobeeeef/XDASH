package org.kobe.xbot.xdashbackend.websocket;

import com.google.gson.Gson;
import org.kobe.xbot.Client.XTablesClient;
import org.kobe.xbot.Utilities.ResponseStatus;
import org.kobe.xbot.xdashbackend.XdashbackendApplication;
import org.kobe.xbot.xdashbackend.entities.*;
import org.kobe.xbot.xdashbackend.logs.LogSave;
import org.kobe.xbot.xdashbackend.logs.XDashLogger;
import org.kobe.xbot.xdashbackend.utilities.NetworkDiscovery;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import javax.jmdns.ServiceInfo;
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
                XTablesClient.LatencyInfo info = xTablesClient == null ? null : xTablesClient.ping_latency().complete();

                int totalClients = xTablesClient == null ? 0 : info == null ? 0 : info.getSystemStatistics().getTotalClients();
                session.sendMessage(new TextMessage(new Message(new XTablesStatusReturn(xTablesClient != null && xTablesClient.getSocketClient().isConnected, totalClients), "XTABLES-STATUS").toJSON()));
            } else {
                session.sendMessage(new TextMessage(new Message(new XTablesStatusReturn(false, 0), "XTABLES-STATUS").toJSON()));
            }
        } else if (message.getType().equals("XTABLES-STATISTICS")) {
            if (xTablesClient != null && xTablesClient.getSocketClient().isConnected) {
                XTablesClient.LatencyInfo info = xTablesClient.ping_latency().complete();
                session.sendMessage(new TextMessage(new Message(new XTablesStatisticsReturn(true, info), "XTABLES-STATISTICS").toJSON()));
            } else {
                session.sendMessage(new TextMessage(new Message(new XTablesStatisticsReturn(false, null), "XTABLES-STATISTICS").toJSON()));

            }
        } else if (message.getType().equals("XTABLES-DATA")) {
            if (xTablesClient != null && xTablesClient.getSocketClient().isConnected) {
                String json = xTablesClient.getRawJSON().complete();
                session.sendMessage(new TextMessage(new Message(new XTablesDataReturn(true, json), "XTABLES-DATA").toJSON()));
            } else {
                session.sendMessage(new TextMessage(new Message(new XTablesDataReturn(false, null), "XTABLES-DATA").toJSON()));

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
        }
        else if (message.getType().equals("NETWORK-STOP-SUBNET-SCAN")) {
            session.sendMessage(new TextMessage(new Message(new SubnetScanData("Stopping subnet scanner.", NetworkDiscovery.isScanning(), null, null, null, "STOPPING"), "NETWORK-SUBNET-SCAN").toJSON()));
            NetworkDiscovery.stopScanSubnet();
        } else if (message.getType().equals("DEVICES-DATA")) {
            List<SSHHostAddress> dataList = XdashbackendApplication.getResolvedXCASTERServices().values().stream().toList();
            session.sendMessage(new TextMessage(new Message(new MainPageDataReturn(gson.toJson(dataList), xTablesClient != null && xTablesClient.getSocketClient().isConnected, LogSave.getInstance().getLogs()), "DEVICES-DATA").toJSON()));
        } else if (message.getType().equals("DEVICE-DATA")) {
            String server = message.getMessage();
            SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedXCASTERServices().get(server);
            if (sshHostAddress != null) {
                session.sendMessage(new TextMessage(new Message(new DeviceDataReturn(true, sshHostAddress.getHostname(), sshHostAddress.getAddress(), sshHostAddress.getServer(), sshHostAddress.getStatus()), "DEVICE-DATA").toJSON()));
            } else {
                session.sendMessage(new TextMessage(new Message(new DeviceDataReturn(false, null, null, null, null), "DEVICE-DATA").toJSON()));
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
                    if (server == null || serviceAddress == null || hostname == null) {
                        session.sendMessage(new TextMessage(new Message(new DeviceDataReturn(false, hostname, serviceAddress, server, "DISCONNECTED"), "DEVICES-SEARCH").toJSON()));
                    } else {
                        if (!XdashbackendApplication.getResolvedXCASTERServices().containsKey(server) || (!XdashbackendApplication.getResolvedXCASTERServices().get(server).getHostname().equals(hostname) && !XdashbackendApplication.getResolvedXCASTERServices().get(server).getAddress().equals(serviceAddress))) {
                            SSHHostAddress sshHostAddress = new SSHHostAddress(hostname, serviceAddress, server);
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

