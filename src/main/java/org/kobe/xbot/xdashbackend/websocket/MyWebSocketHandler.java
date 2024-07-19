package org.kobe.xbot.xdashbackend.websocket;

import com.google.gson.Gson;
import org.kobe.xbot.Client.XTablesClient;
import org.kobe.xbot.xdashbackend.Entities.Message;
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
           int totalClients = xTablesClient == null ? 0 : xTablesClient.ping_latency().complete().getSystemStatistics().getTotalClients();
            session.sendMessage(new TextMessage( new Message(new XTablesStatusReturn(xTablesClient != null && xTablesClient.getSocketClient().isConnected, totalClients), "XTABLES-STATUS").toJSON()));
        }
    }
}

