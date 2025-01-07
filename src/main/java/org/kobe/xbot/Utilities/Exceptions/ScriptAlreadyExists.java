package org.kobe.xbot.Utilities.Exceptions;

/**
 * Exception thrown when a script already exists in the system.
 * This exception is used to indicate that an attempt to create or register a script
 * has failed because a script with the same identifier or name already exists.
 * <p>
 * Author: Kobe
 */
public class ScriptAlreadyExists extends RuntimeException {

    /**
     * Constructs a new exception with {@code null} as its detail message.
     * The cause is not initialized and may be subsequently initialized by a call to {@link #initCause}.
     */
    public ScriptAlreadyExists() {
        super();
    }

    /**
     * Constructs a new exception with the specified detail message.
     * The cause is not initialized and may be subsequently initialized by a call to {@link #initCause}.
     *
     * @param message The detail message. The detail message is saved for later retrieval by the {@link #getMessage()} method.
     */
    public ScriptAlreadyExists(String message) {
        super(message);
    }

    /**
     * Constructs a new exception with the specified detail message and cause.
     *
     * @param message The detail message. The detail message is saved for later retrieval by the {@link #getMessage()} method.
     * @param cause The cause (which is saved for later retrieval by the {@link #getCause()} method). A null value is permitted, and indicates that the cause is nonexistent or unknown.
     */
    public ScriptAlreadyExists(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructs a new exception with the specified cause and a detail message of {@code (cause == null ? null : cause.toString())} (which typically contains the class and detail message of {@code cause}).
     *
     * @param cause The cause (which is saved for later retrieval by the {@link #getCause()} method). A null value is permitted, and indicates that the cause is nonexistent or unknown.
     */
    public ScriptAlreadyExists(Throwable cause) {
        super(cause);
    }
}
