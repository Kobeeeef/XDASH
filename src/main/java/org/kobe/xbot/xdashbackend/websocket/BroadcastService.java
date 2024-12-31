package org.kobe.xbot.xdashbackend.websocket;

import java.util.Set;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import org.kobe.xbot.xdashbackend.entities.DataReturn;
import org.kobe.xbot.xdashbackend.entities.Message;
import org.kobe.xbot.xdashbackend.entities.Notification;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;

public class BroadcastService {

    private final Set<WebSocketSession> sessions;
    private final BlockingQueue<MessageTask> messageQueue = new LinkedBlockingQueue<>();
    private final Thread broadcastThread;

    public BroadcastService(Set<WebSocketSession> sessions) {
        this.sessions = sessions;
        this.broadcastThread = new Thread(() -> {
            while (true) {
                try {
                    MessageTask task = messageQueue.take(); // Block until a task is available
                    broadcastMessage(task);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        });
        this.broadcastThread.setDaemon(true); // Run as a daemon thread
        this.broadcastThread.start();
    }

    public void queueBroadcast(DataReturn data, String type) {
        messageQueue.offer(new MessageTask(new Message(data, type), null));
    }

    public void queueBroadcastNotification(Notification notification) {
        messageQueue.offer(new MessageTask(new Message(notification, "NOTIFICATION"), null));
    }

    private void broadcastMessage(MessageTask task) {
        synchronized (sessions) {
            for (WebSocketSession session : sessions) {
                try {
                    session.sendMessage(new TextMessage(task.getMessage().toJSON()));
                } catch (Exception ignored) {
                }
            }
        }
    }

    private static class MessageTask {
        private final Message message;
        private final WebSocketSession session;

        public MessageTask(Message message, WebSocketSession session) {
            this.message = message;
            this.session = session;
        }

        public Message getMessage() {
            return message;
        }
    }
}

