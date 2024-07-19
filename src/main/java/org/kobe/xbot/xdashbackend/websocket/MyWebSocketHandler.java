package org.kobe.xbot.xdashbackend.websocket;

import com.google.gson.Gson;
import org.kobe.xbot.Client.XTablesClient;
import org.kobe.xbot.xdashbackend.Entities.Message;
import org.kobe.xbot.xdashbackend.Entities.XTablesStatisticsReturn;
import org.kobe.xbot.xdashbackend.Entities.XTablesStatusReturn;
import org.kobe.xbot.xdashbackend.XdashbackendApplication;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class MyWebSocketHandler extends TextWebSocketHandler {
    private static final Gson gson = new Gson();
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage msg) throws Exception {
        String payload = msg.getPayload();

        XTablesClient xTablesClient = XdashbackendApplication.clientRef.get();
        Message message = gson.fromJson(payload, Message.class);
        if(message.getType().equals("XTABLES-STATUS")){
            XTablesClient.LatencyInfo info = xTablesClient == null ? null : xTablesClient.ping_latency().complete();

           int totalClients = xTablesClient == null ? 0 : info.getSystemStatistics().getTotalClients();
            session.sendMessage(new TextMessage( new Message(new XTablesStatusReturn(xTablesClient != null && xTablesClient.getSocketClient().isConnected, totalClients), "XTABLES-STATUS").toJSON()));
        } else if(message.getType().equals("XTABLES-STATISTICS")){
            if(xTablesClient != null && xTablesClient.getSocketClient().isConnected) {
                XTablesClient.LatencyInfo info = xTablesClient.ping_latency().complete();
                session.sendMessage(new TextMessage(new Message(new XTablesStatisticsReturn(true, info), "XTABLES-STATISTICS").toJSON()));
            } else {
                session.sendMessage(new TextMessage(new Message(new XTablesStatisticsReturn(false, null), "XTABLES-STATISTICS").toJSON()));

            }
        }
    }
}

