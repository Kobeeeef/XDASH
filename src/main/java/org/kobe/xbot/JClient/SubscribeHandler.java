package org.kobe.xbot.JClient;

import com.google.protobuf.ByteString;
import org.kobe.xbot.Utilities.CircularBuffer;
import org.kobe.xbot.Utilities.ClientStatistics;
import org.kobe.xbot.Utilities.Entities.XTableProto;
import org.kobe.xbot.Utilities.Exceptions.XTablesException;
import org.zeromq.ZMQ;

import java.util.List;
import java.util.function.Consumer;

/**
 * SubscribeHandler - A handler for processing incoming subscription messages using JeroMQ.
 * <p>
 * This class handles the reception of messages on a ZeroMQ socket, processes them, and stores the updates in a circular buffer.
 * It also manages a separate consumer thread that handles the subscription consumers and invokes their functions for each new update.
 * The handler supports both UPDATE and PUBLISH message categories.
 * <p>
 * Author: Kobe Lei
 * Version: 1.0
 * Package: org.kobe.xbot.JClient
 * <p>
 * This is part of the XTABLES project and facilitates subscribing and handling incoming messages from the server.
 */
public class SubscribeHandler extends BaseHandler {
    private final XTablesClient instance;
    private final CircularBuffer<XTableProto.XTableMessage.XTableUpdate> buffer;
    private final Thread consumerHandlingThread;
    private final static int BUFFER_SIZE = 250;

    /**
     * Constructor that initializes the handler with the provided socket and server instance.
     *
     * @param socket   The ZeroMQ socket to receive messages on
     * @param instance The XTablesClient instance
     */
    public SubscribeHandler(ZMQ.Socket socket, XTablesClient instance) {
        super("XTABLES-SUBSCRIBE-HANDLER-DAEMON", true, socket);
        this.instance = instance;
        this.buffer = new CircularBuffer<>(BUFFER_SIZE, (latest, current) -> {
            return current.getKey().equals(latest.getKey());
        });
        this.consumerHandlingThread = new ConsumerHandlingThread();
        this.consumerHandlingThread.start();
    }


    /**
     * The main method for handling incoming messages.
     * <p>
     * It continuously receives messages from the JeroMQ socket,
     * processes them by parsing the message into a protocol buffer,
     * and stores the updates in the buffer.
     * It also increments the count of subscription messages received.
     */
    @Override
    public void run() {
        try {
            while (!Thread.currentThread().isInterrupted()) {
                byte[] bytes = socket.recv();
                instance.subscribeMessagesCount.incrementAndGet();
                try {
                    XTableProto.XTableMessage.XTableUpdate message = XTableProto.XTableMessage.XTableUpdate.parseFrom(bytes);
                    if (message.getCategory().equals(XTableProto.XTableMessage.XTableUpdate.Category.INFORMATION) || message.getCategory().equals(XTableProto.XTableMessage.XTableUpdate.Category.REGISTRY)) {
                        byte[] info = new ClientStatistics()
                                .setBufferSize(buffer.size)
                                .setUUID(XTablesClient.UUID)
                                .setVersion(instance.getVersion())
                                .setMaxBufferSize(BUFFER_SIZE)
                                        .toProtobuf()
                                                .toByteArray();

                        instance.getPushSocket().send(XTableProto.XTableMessage.newBuilder()
                                .setId(message.getValue())
                                .setValue(ByteString.copyFrom(info))
                                .setCommand(message.getCategory().equals(XTableProto.XTableMessage.XTableUpdate.Category.INFORMATION) ? XTableProto.XTableMessage.Command.INFORMATION : XTableProto.XTableMessage.Command.REGISTRY)
                                .build().toByteArray(), ZMQ.DONTWAIT);
                    } else this.buffer.write(message);
                } catch (Exception e) {
                    handleException(e);
                }
            }
        } catch (Exception e) {
            handleException(e);
        }
    }

    /**
     * Logs exceptions and handles cleanup when the thread is interrupted.
     * <p>
     * This method interrupts the consumer handling thread and calls the parent class's interrupt method to clean up.
     */
    @Override
    public void interrupt() {
        this.consumerHandlingThread.interrupt();
        super.interrupt();
    }

    /**
     * ConsumerHandlingThread - A thread for handling subscription consumers for each received update.
     * <p>
     * This inner thread continuously reads the latest update from the buffer and invokes the consumers
     * that are subscribed to the specific update category or key.
     * It handles both general and registry updates.
     */
    private class ConsumerHandlingThread extends Thread {
        public ConsumerHandlingThread() {
            setName("XTABLES-CONSUMER-HANDLER-DAEMON");
            setDaemon(true);
        }

        /**
         * The run method processes each update by invoking the appropriate consumers.
         * <p>
         * It checks if the update is of type UPDATE, PUBLISH, or REGISTRY. For UPDATE and PUBLISH, it invokes all consumers
         * associated with the update key. For REGISTRY, it sends the registry command to the push socket.
         */
        @Override
        public void run() {
            try {
                while (!Thread.currentThread().isInterrupted()) {
                    XTableProto.XTableMessage.XTableUpdate update = buffer.readLatestAndClearOnFunction();
                    if (update.getCategory().equals(XTableProto.XTableMessage.XTableUpdate.Category.UPDATE) || update.getCategory().equals(XTableProto.XTableMessage.XTableUpdate.Category.PUBLISH)) {
                        if (instance.subscriptionConsumers.containsKey(update.getKey())) {
                            List<Consumer<XTableProto.XTableMessage.XTableUpdate>> consumers = instance.subscriptionConsumers.get(update.getKey());

                            for (Consumer<XTableProto.XTableMessage.XTableUpdate> consumer : consumers) {
                                consumer.accept(update);
                            }
                        }
                        if (instance.subscriptionConsumers.containsKey("")) {
                            List<Consumer<XTableProto.XTableMessage.XTableUpdate>> consumers = instance.subscriptionConsumers.get("");
                            for (Consumer<XTableProto.XTableMessage.XTableUpdate> consumer : consumers) {
                                consumer.accept(update);
                            }
                        }
                    } else if (update.getCategory().equals(XTableProto.XTableMessage.XTableUpdate.Category.LOG)) {
                        for (Consumer<XTableProto.XTableMessage.XTableLog> consumer : instance.logConsumers) {
                            consumer.accept(XTableProto.XTableMessage.XTableLog.parseFrom(update.getValue()));
                        }
                    }
                }
            } catch (Exception e) {
                handleException(new XTablesException(e));
            }
        }
    }
}
