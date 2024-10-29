package org.kobe.xbot.Utilities.Exceptions;

/**
 * Exception thrown when Gson cannot parse a JSON string.
 * This exception is used to indicate an error when attempting to parse a JSON
 * string with Gson.
 * <p>
 * Author: Kobe
 */
public class JsonParseException extends RuntimeException {

    /**
     * Constructs a new exception with {@code null} as its detail message.
     * The cause is not initialized and may be subsequently initialized by a call to {@link #initCause}.
     */
    public JsonParseException() {
        super();
    }

    /**
     * Constructs a new exception with the specified detail message.
     * The cause is not initialized and may be subsequently initialized by a call to {@link #initCause}.
     *
     * @param message The detail message. The detail message is saved for later retrieval by the {@link #getMessage()} method.
     */
    public JsonParseException(String message) {
        super(message);
    }

    /**
     * Constructs a new exception with the specified detail message and cause.
     *
     * @param message The detail message. The detail message is saved for later retrieval by the {@link #getMessage()} method.
     * @param cause The cause (which is saved for later retrieval by the {@link #getCause()} method). A null value is permitted, and indicates that the cause is nonexistent or unknown.
     */
    public JsonParseException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructs a new exception with the specified cause and a detail message of {@code (cause == null ? null : cause.toString())} (which typically contains the class and detail message of {@code cause}).
     *
     * @param cause The cause (which is saved for later retrieval by the {@link #getCause()} method). A null value is permitted, and indicates that the cause is nonexistent or unknown.
     */
    public JsonParseException(Throwable cause) {
        super(cause);
    }
}

