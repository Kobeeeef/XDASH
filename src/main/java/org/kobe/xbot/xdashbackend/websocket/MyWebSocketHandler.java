package org.kobe.xbot.xdashbackend.websocket;

import com.google.gson.Gson;
import org.kobe.xbot.Client.XTablesClient;
import org.kobe.xbot.Utilities.ResponseStatus;
import org.kobe.xbot.xdashbackend.Entities.*;
import org.kobe.xbot.xdashbackend.XdashbackendApplication;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.List;

public class MyWebSocketHandler extends TextWebSocketHandler {
    private static final Gson gson = new Gson();

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage msg) throws Exception {
        String payload = msg.getPayload();

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
            List<DevicesData> dataList = XdashbackendApplication.getResolvedServices().values().stream().map(m -> new DevicesData(m.getHostname(), m.getAddress(), m.getSession() != null ? "CONNECTED" : m.getStatus())).toList();
            session.sendMessage(new TextMessage(new Message(new MainPageDataReturn(gson.toJson(dataList), xTablesClient != null && xTablesClient.getSocketClient().isConnected), "DEVICES-DATA").toJSON()));
        }
    }
}

