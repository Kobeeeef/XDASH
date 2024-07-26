package org.kobe.xbot.xdashbackend.websocket;

import com.google.gson.Gson;
import org.kobe.xbot.Client.XTablesClient;
import org.kobe.xbot.Utilities.ResponseStatus;
import org.kobe.xbot.xdashbackend.Entities.*;
import org.kobe.xbot.xdashbackend.XdashbackendApplication;
import org.kobe.xbot.xdashbackend.logs.LogSave;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.List;

public class MyWebSocketHandler extends TextWebSocketHandler {
    private static final Gson gson = new Gson();

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
        } else if (message.getType().equals("DEVICES-DATA")) {
            List<SSHHostAddress> dataList = XdashbackendApplication.getResolvedServices().values().stream().toList();
            session.sendMessage(new TextMessage(new Message(new MainPageDataReturn(gson.toJson(dataList), xTablesClient != null && xTablesClient.getSocketClient().isConnected, LogSave.getInstance().getLogs()), "DEVICES-DATA").toJSON()));
        } else if (message.getType().equals("DEVICE-DATA")) {
            String server = message.getMessage();
            SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedServices().get(server);
            if (sshHostAddress != null) {
                session.sendMessage(new TextMessage(new Message(new DeviceDataReturn(true, sshHostAddress.getHostname(), sshHostAddress.getAddress(), sshHostAddress.getServer(), sshHostAddress.getStatus()), "DEVICE-DATA").toJSON()));
            } else {
                session.sendMessage(new TextMessage(new Message(new DeviceDataReturn(false, null, null, null, null), "DEVICE-DATA").toJSON()));
            }
          } else if (message.getType().equals("DEVICE-REBOOT")) {
            String server = message.getMessage();
            SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedServices().get(server);
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
        }else if (message.getType().startsWith("DEVICE-COMMAND-NEW-SESSION")) {
                String msg = message.getMessage();
                if (msg != null) {
                        SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedServices().get(msg);
                        if (sshHostAddress != null) {
                            if (sshHostAddress.forceIsConnected()) {
                                boolean status = sshHostAddress.createNewChannel((string) -> {
                                    try {
                                        session.sendMessage(new TextMessage(new Message(new CommandReturn(string, sshHostAddress.getStatus(), true, false), "DEVICE-SHELL").toJSON()));
                                    } catch (Exception ignored) {
                                    }
                                });
                                session.sendMessage(new TextMessage(new Message(new CommandReturn("\u001B[33mXDASH: Channel Creation Finished. Success?: " + status, sshHostAddress.getStatus(), true, true), "DEVICE-SHELL").toJSON()));
                            } else {
                                session.sendMessage(new TextMessage(new Message(new CommandReturn("Machine not connected.", sshHostAddress.getStatus(), false, true), "DEVICE-SHELL").toJSON()));
                            }
                        } else {
                            session.sendMessage(new TextMessage(new Message(new CommandReturn("Machine not found.", "DISCONNECTED", false, true), "DEVICE-SHELL").toJSON()));
                        }

                } else {
                    session.sendMessage(new TextMessage(new Message(new CommandReturn("No Message Found!", "DISCONNECTED", false, true), "DEVICE-SHELL").toJSON()));
                }

        }else if (message.getType().startsWith("DEVICE-COMMAND")) {
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
                    SSHHostAddress sshHostAddress = XdashbackendApplication.getResolvedServices().get(command.getServer());
                    if (sshHostAddress != null) {
                        if (sshHostAddress.forceIsConnected()) {
                            if(sshHostAddress.isChannelActive()) {
                                String response = sshHostAddress.sendCommand(command.getCommand(), (string) -> {
                                    try {
                                        session.sendMessage(new TextMessage(new Message(new CommandReturn(string.replaceAll("\\e\\[[\\d;]*[^\\d;]", ""), sshHostAddress.getStatus(), true, false), "DEVICE-SHELL").toJSON()));
                                    } catch (Exception ignored) {
                                    }
                                });
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
}
