package org.kobe.xbot.Client;

import com.google.gson.Gson;
import org.kobe.xbot.Utilities.Logger.XTablesLogger;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;
import java.util.function.Consumer;

/**
 * Handles asynchronous and synchronous request actions to a SocketClient.
 * This class encapsulates the logic for sending data over a network, handling responses,
 * and managing errors during communication. It supports both queued (asynchronous)
 * and complete (synchronous) operations.
 * <p>
 *
 * @author Kobe
 */
public class RequestAction<T> {
    private static long defaultCompleteTimeout = 5000;
    private static final XTablesLogger logger = XTablesLogger.getLogger();
    private final SocketClient client;
    private final String value;
    private final Type type;

    /**
     * Sets the default timeout for synchronous complete operations.
     *
     * @param defaultCompleteTimeout The timeout value in milliseconds.
     */
    public static void setDefaultCompleteTimeout(long defaultCompleteTimeout) {
        RequestAction.defaultCompleteTimeout = defaultCompleteTimeout;
    }

    /**
     * Constructs a RequestAction with a specified type.
     *
     * @param client The client used to send requests.
     * @param value  The data to be sent.
     * @param type   The expected return type of the response.
     */
    public RequestAction(SocketClient client, String value, Type type) {
        this.client = client;
        this.value = value;
        this.type = type;
    }

    /**
     * Constructs a RequestAction without a specified type.
     *
     * @param client The client used to send requests.
     * @param value  The data to be sent.
     */
    public RequestAction(SocketClient client, String value) {
        this.client = client;
        this.value = value;
        this.type = null;
    }

    /**
     * Queues a request to be sent asynchronously with success and failure handlers.
     *
     * @param onSuccess Consumer to handle the successful response.
     * @param onFailure Consumer to handle failures during the request execution.
     */
    public void queue(Consumer<T> onSuccess, Consumer<Throwable> onFailure) {
        long startTime = System.nanoTime();
        if (doNotRun()) return;
        beforeRun();
        try {
            CompletableFuture<String> future = client.sendAsync(value, defaultCompleteTimeout);
            future.thenAccept(result -> {
                        T parsed = parseResponse(startTime, result);
                        result = formatResult(result);
                        T res = null;
                        if (parsed == null) {
                            if (type == null) {
                                res = (T) result;
                            } else res = new Gson().fromJson(result, type);
                        }
                        boolean response = onResponse(parsed == null ? res : parsed);
                        if (response) onSuccess.accept(parsed == null ? res : parsed);
                    })
                    .exceptionally(ex -> {
                        onFailure.accept(ex);
                        return null;
                    });
        } catch (IOException e) {
            logger.severe(e.getMessage());
        }
    }

    /**
     * Queues a request to be sent asynchronously with a success handler.
     *
     * @param onSuccess Consumer to handle the successful response.
     */
    public void queue(Consumer<T> onSuccess) {
        long startTime = System.nanoTime();
        if (doNotRun()) return;
        beforeRun();
        try {
            CompletableFuture<String> future = client.sendAsync(value, defaultCompleteTimeout);
            future.thenAccept(result -> {
                T parsed = parseResponse(startTime, result);
                result = formatResult(result);
                T res = null;
                if (parsed == null) {
                    if (type == null) {
                        res = (T) result;
                    } else res = new Gson().fromJson(result, type);
                }
                boolean response = onResponse(parsed == null ? res : parsed);
                if (response) onSuccess.accept(parsed == null ? res : parsed);
            });
        } catch (IOException e) {
            logger.severe(e.getMessage());
        }
    }

    /**
     * Queues a request to be sent asynchronously without any additional handlers.
     */
    public void queue() {
        long startTime = System.nanoTime();
        if (doNotRun()) return;
        beforeRun();
        try {
            CompletableFuture<String> future = client.sendAsync(value, defaultCompleteTimeout);
            future.thenAccept(result -> {
                T parsed = parseResponse(startTime, result);
                result = formatResult(result);
                T res = null;
                if (parsed == null) {
                    if (type == null) {
                        res = (T) result;
                    } else res = new Gson().fromJson(result, type);
                }
                onResponse(parsed == null ? res : parsed);
            });
        } catch (IOException e) {
            logger.severe(e.getMessage());
        }
    }

    /**
     * Sends a request and waits for the completion synchronously.
     *
     * @param timeoutMS The timeout value in milliseconds for the synchronous operation.
     * @return The response received, parsed by {@code parseResponse}.
     */
    public T complete(long timeoutMS) {
        long startTime = System.nanoTime();
        if (doNotRun()) return returnValueIfNotRan();
        beforeRun();
        try {
            String result = client.sendComplete(value, timeoutMS);
            T parsed = parseResponse(startTime, result);
            result = formatResult(result);
            T res = null;
            if (parsed == null) {
                if (type == null) {
                    res = (T) result;
                } else {
                    res = new Gson().fromJson(result, type);
                }
            }
            boolean response = onResponse(parsed == null ? res : parsed);
            if (!response) return returnValueIfNotRan();
            return parsed == null ? res : parsed;
        } catch (ExecutionException | TimeoutException | IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }


    /**
     * Sends a request to the server and does not wait for a response.
     * Instructs the server to perform the action without responding.
     * This method defaults to sending the request synchronously.
     */
    public void execute() {
        try {
            client.sendExecute(value);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    /**
     * Sends a request and waits for the completion synchronously using the default timeout.
     *
     * @return The response received, parsed by {@code parseResponse}.
     */
    public T complete() {
        return complete(defaultCompleteTimeout);
    }

    // ----------------------------- OVERRIDE METHODS -----------------------------

    /**
     * Called to determine if the request should not be run.
     * Meant to be overridden in subclasses to provide specific conditions.
     * <p>
     * Order of execution: 1 (First method called in the sequence)
     *
     * @return true if the request should not be sent, false otherwise.
     */
    public boolean doNotRun() {
        return false;
    }

    /**
     * Called before sending the request.
     * Meant to be overridden in subclasses to perform any necessary setup or validation before running the request.
     * <p>
     * Order of execution: 2 (Called before the request is sent)
     */
    public void beforeRun() {
    }

    /**
     * Parses the response received from the server.
     * Meant to be overridden in subclasses to parse the response based on specific needs.
     * <p>
     * Order of execution: 3 (Called when a response is received)
     *
     * @param startTime The start time of the request, used for calculating latency.
     * @param result    The raw result from the server.
     * @return The parsed response as type T.
     */
    public T parseResponse(long startTime, String result) {
        return null;
    }

    /**
     * Formats the raw result string before parsing it.
     * Meant to be overridden in subclasses to provide specific formatting logic.
     * <p>
     * Order of execution: 4 (Called after receiving the raw response and before parsing)
     *
     * @param result The raw result string from the server.
     * @return The formatted result string.
     */
    public String formatResult(String result) {
        return result;
    }

    /**
     * Called when a response is received.
     * Meant to be overridden in subclasses to handle specific actions on response.
     * <p>
     * Order of execution: 5 (Called after parsing and formatting the response)
     *
     * @param result The result of the response.
     * @return true if the response was handled successfully, false otherwise.
     */
    public boolean onResponse(T result) {
        return true;
    }

    /**
     * Returns a value when {@code doNotRun} returns true and the action is not performed.
     * Meant to be overridden in subclasses to provide a default value.
     * <p>
     * Order of execution: 6 (Called if `doNotRun` returns true)
     *
     * @return The default value to return if the request is not run.
     */
    public T returnValueIfNotRan() {
        return null;
    }
}
