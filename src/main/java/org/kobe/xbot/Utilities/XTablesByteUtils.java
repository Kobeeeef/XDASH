package org.kobe.xbot.Utilities;

import com.google.gson.*;
import com.google.protobuf.ByteString;
import org.kobe.xbot.Utilities.Entities.XTableProto;
import org.kobe.xbot.Utilities.Exceptions.XTablesException;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * XTablesByteUtils - A utility class for converting between byte arrays, ByteString, and various data types.
 * <p>
 * This class provides static methods for converting byte arrays and ByteString objects into common Java types such as
 * int, long, double, String, and boolean. These conversions are useful for handling raw byte data in a protocol-agnostic manner.
 * <p>
 * Author: Kobe Lei
 * Version: 1.0
 * Package: org.kobe.xbot.Utilities
 * <p>
 * This class is a part of the XTABLES project and provides essential utility functions for byte conversion in data processing.
 */
public class XTablesByteUtils {
    private static final Gson gson = new GsonBuilder()
            .disableHtmlEscaping()
            .setLenient()
            .create();
    /**
     * Converts a byte array into an integer.
     * <p>
     * This method interprets the first four bytes of the byte array as an integer. It expects the byte array to have a length of 4.
     *
     * @param bytes The byte array to convert.
     * @return The integer value represented by the byte array.
     * @throws IllegalArgumentException If the byte array is null or does not have a length of 4.
     */
    public static int toInt(byte[] bytes) {
        if (bytes == null || bytes.length != Integer.BYTES) {
            throw new IllegalArgumentException("Invalid byte array for int conversion.");
        }
        return ByteBuffer.wrap(bytes).getInt();
    }

    /**
     * Converts a byte array into a long.
     * <p>
     * This method interprets the first eight bytes of the byte array as a long. It expects the byte array to have a length of 8.
     *
     * @param bytes The byte array to convert.
     * @return The long value represented by the byte array.
     * @throws IllegalArgumentException If the byte array is null or does not have a length of 8.
     */
    public static long toLong(byte[] bytes) {
        if (bytes == null || bytes.length != Long.BYTES) {
            throw new IllegalArgumentException("Invalid byte array for long conversion.");
        }
        return ByteBuffer.wrap(bytes).getLong();
    }

    /**
     * Converts a byte array into a double.
     * <p>
     * This method interprets the first eight bytes of the byte array as a double. It expects the byte array to have a length of 8.
     *
     * @param bytes The byte array to convert.
     * @return The double value represented by the byte array.
     * @throws IllegalArgumentException If the byte array is null or does not have a length of 8.
     */
    public static double toDouble(byte[] bytes) {
        if (bytes == null || bytes.length != Double.BYTES) {
            throw new IllegalArgumentException("Invalid byte array for double conversion.");
        }
        return ByteBuffer.wrap(bytes).getDouble();
    }

    /**
     * Converts a byte array into a string.
     * <p>
     * This method decodes the byte array into a string using UTF-8 encoding.
     *
     * @param bytes The byte array to convert.
     * @return The string represented by the byte array.
     * @throws IllegalArgumentException If the byte array is null.
     */
    public static String toString(byte[] bytes) {
        if (bytes == null) {
            throw new IllegalArgumentException("Byte array cannot be null.");
        }
        return new String(bytes, StandardCharsets.UTF_8);
    }

    /**
     * Converts a byte array into a boolean.
     * <p>
     * This method checks if the first byte of the byte array is equal to 0x01, which represents true in boolean form.
     *
     * @param bytes The byte array to convert.
     * @return The boolean value represented by the byte array.
     * @throws IllegalArgumentException If the byte array is null or does not have a length of 1.
     */
    public static boolean toBoolean(byte[] bytes) {
        if (bytes == null || bytes.length != 1) {
            throw new IllegalArgumentException("Invalid byte array for boolean conversion.");
        }
        return bytes[0] == (byte) 0x01;
    }

    /**
     * Converts a ByteString into an integer.
     * <p>
     * This method interprets the first four bytes of the ByteString as an integer. It expects the ByteString to have a size of 4.
     *
     * @param byteString The ByteString to convert.
     * @return The integer value represented by the ByteString.
     * @throws IllegalArgumentException If the ByteString is null or does not have a size of 4.
     */
    public static int toInt(ByteString byteString) {
        if (byteString == null || byteString.size() != Integer.BYTES) {
            throw new IllegalArgumentException("Invalid ByteString for int conversion.");
        }
        return ByteBuffer.wrap(byteString.toByteArray()).getInt();
    }

    /**
     * Converts a ByteString into a long.
     * <p>
     * This method interprets the first eight bytes of the ByteString as a long. It expects the ByteString to have a size of 8.
     *
     * @param byteString The ByteString to convert.
     * @return The long value represented by the ByteString.
     * @throws IllegalArgumentException If the ByteString is null or does not have a size of 8.
     */
    public static long toLong(ByteString byteString) {
        if (byteString == null || byteString.size() != Long.BYTES) {
            throw new IllegalArgumentException("Invalid ByteString for long conversion.");
        }
        return ByteBuffer.wrap(byteString.toByteArray()).getLong();
    }

    /**
     * Converts a ByteString into a double.
     * <p>
     * This method interprets the first eight bytes of the ByteString as a double. It expects the ByteString to have a size of 8.
     *
     * @param byteString The ByteString to convert.
     * @return The double value represented by the ByteString.
     * @throws IllegalArgumentException If the ByteString is null or does not have a size of 8.
     */
    public static double toDouble(ByteString byteString) {
        if (byteString == null || byteString.size() != Double.BYTES) {
            throw new IllegalArgumentException("Invalid ByteString for double conversion.");
        }
        return ByteBuffer.wrap(byteString.toByteArray()).getDouble();
    }

    /**
     * Converts a ByteString into a string.
     * <p>
     * This method decodes the ByteString into a string using UTF-8 encoding.
     *
     * @param byteString The ByteString to convert.
     * @return The string represented by the ByteString.
     * @throws IllegalArgumentException If the ByteString is null.
     */
    public static String toString(ByteString byteString) {
        if (byteString == null) {
            throw new IllegalArgumentException("ByteString cannot be null.");
        }
        return new String(byteString.toByteArray(), StandardCharsets.UTF_8);
    }

    /**
     * Converts a ByteString into a boolean.
     * <p>
     * This method checks if the first byte of the ByteString is equal to 0x01, which represents true in boolean form.
     *
     * @param byteString The ByteString to convert.
     * @return The boolean value represented by the ByteString.
     * @throws IllegalArgumentException If the ByteString is null or does not have a size of 1.
     */
    public static boolean toBoolean(ByteString byteString) {
        if (byteString == null || byteString.size() != 1) {
            throw new IllegalArgumentException("Invalid ByteString for boolean conversion.");
        }
        return byteString.byteAt(0) == (byte) 0x01;
    }


    /**
     * Converts an integer into a byte array.
     * <p>
     * This method converts the provided integer into a 4-byte array.
     *
     * @param i The integer to convert.
     * @return The byte array representing the integer.
     */
    public static byte[] fromInteger(int i) {
        return ByteBuffer.allocate(4).putInt(i).array();
    }

    /**
     * Converts a long into a byte array.
     * <p>
     * This method converts the provided long into an 8-byte array.
     *
     * @param i The long to convert.
     * @return The byte array representing the long.
     */
    public static byte[] fromLong(long i) {
        return ByteBuffer.allocate(8).putLong(i).array();
    }

    /**
     * Converts a double into a byte array.
     * <p>
     * This method converts the provided double into an 8-byte array.
     *
     * @param i The double to convert.
     * @return The byte array representing the double.
     */
    public static byte[] fromDouble(double i) {
        return ByteBuffer.allocate(8).putDouble(i).array();
    }

    /**
     * Converts a boolean into a byte array.
     * <p>
     * This method converts the provided boolean into a byte array.
     * True is represented by 0x01, and false by 0x00.
     *
     * @param i The boolean to convert.
     * @return The byte array representing the boolean.
     */
    public static byte[] fromBoolean(boolean i) {
        return i ? new byte[]{(byte) 0x01} : new byte[]{(byte) 0x00};
    }

    /**
     * Converts a list of objects into a byte array.
     * <p>
     * This method converts the provided list of objects into a byte array using the `Utilities.toByteArray()` method.
     *
     * @param i The list of objects to convert.
     * @return The byte array representing the list of objects.
     */
    public static <T> byte[] fromList(List<T> i) {
        return Utilities.toByteArray(i);
    }

    /**
     * Converts a string into a byte array.
     * <p>
     * This method converts the provided string into a byte array using UTF-8 encoding.
     *
     * @param i The string to convert.
     * @return The byte array representing the string.
     */
    public static byte[] fromString(String i) {
        return i.getBytes(StandardCharsets.UTF_8);
    }

    /**
     * Converts an object into a byte array.
     * <p>
     * This method serializes the provided object into a JSON string using Gson,
     * then converts the JSON string into a byte array using UTF-8 encoding.
     *
     * @param v The object to convert.
     * @return A byte array representing the object in JSON format.
     */
    public static byte[] fromObject(Object v) {
        return fromString(gson.toJson(v));
    }
    /**
     * Converts a byte array into an object of the specified type.
     *
     * @param bytes The byte array to convert.
     * @param type  The target type.
     * @param <T>   The type of the object.
     * @return The converted object of type T.
     * @throws XTablesException If the type is unknown or the conversion fails.
     */
    public static <T> T autoFromBytes(byte[] bytes, XTableProto.XTableMessage.Type type) throws XTablesException {
        try {
            if (bytes == null || type == null) return null;
            // Handle ENUM if specific conversion logic is needed
            return switch (type) {
                case STRING -> (T) toString(bytes);
                case DOUBLE -> (T) Double.valueOf(toDouble(bytes));
                case INT64 -> (T) Long.valueOf(toLong(bytes));
                case BOOL -> (T) Boolean.valueOf(toBoolean(bytes));
                case BYTES -> (T) bytes;
                case ENUM -> throw new XTablesException("ENUM type is not yet supported.");
                case MESSAGE -> (T) toObject(bytes, Object.class);
                case ARRAY -> (T) Utilities.fromByteArray(bytes, Object.class);
                case OBJECT -> (T) toObject(bytes, Object.class);
                default -> throw new XTablesException("Unknown type: " + type);
            };
        } catch (Exception e) {
            throw new XTablesException("Failed to convert bytes to " + type, e);
        }
    }
    /**
     * Converts a JSON string to a byte array based on the detected type.
     *
     * @param json The JSON string to convert.
     * @return A byte array representing the converted JSON value.
     * @throws XTablesException If the JSON string cannot be converted.
     */
    public static byte[] autoStringJsonToBytes(String json) throws XTablesException {
        try {
            if (json == null || json.equals("null")) {
                return XTablesByteUtils.fromString("null");
            }
            // Parse the JSON string into a JsonElement
            JsonElement element = gson.fromJson(json, JsonElement.class);

            // Check the type of the JSON element and convert accordingly
            if (element.isJsonPrimitive()) {
                JsonPrimitive primitive = element.getAsJsonPrimitive();
                if (primitive.isString()) {
                    return XTablesByteUtils.fromString(primitive.getAsString());
                } else if (primitive.isBoolean()) {
                    return XTablesByteUtils.fromBoolean(primitive.getAsBoolean());
                } else if (primitive.isNumber()) {
                    if (primitive.getAsLong() <= Integer.MAX_VALUE) {
                        return XTablesByteUtils.fromInteger(primitive.getAsInt());
                    } else {
                        return XTablesByteUtils.fromLong(primitive.getAsLong());
                    }
                } else {
                    return XTablesByteUtils.fromString("UNKNOWN");
                }
            } else if (element.isJsonArray()) {
                JsonArray jsonArray = element.getAsJsonArray();
                return XTablesByteUtils.fromList(gson.fromJson(jsonArray, List.class));
            } else if (element.isJsonObject()) {
                JsonObject jsonObject = element.getAsJsonObject();
                return XTablesByteUtils.fromObject(gson.fromJson(jsonObject, Object.class));
            } else {
                // For unknown types, return the UNKNOWN type
                JsonObject jsonObject = element.getAsJsonObject();
                return XTablesByteUtils.fromObject(gson.fromJson(jsonObject, Object.class));
            }
        } catch (Exception e) {
            throw new XTablesException("Failed to convert JSON string to bytes", e);
        }
    }
    /**
     * Converts a byte array into a JSON string based on the specified type.
     *
     * @param bytes The byte array to convert.
     * @param type  The type of the byte array content.
     * @return A JSON string representing the byte array's content in the specified type.
     * @throws XTablesException If there is an error during conversion.
     */
    public static String autoFromBytesToJsonString(byte[] bytes, XTableProto.XTableMessage.Type type) throws XTablesException {
        try {

            // Convert the byte array to the appropriate object based on the type
            Object convertedValue = autoFromBytes(bytes, type);
            if (convertedValue == null) return null;
            // Serialize the converted value into a JSON string
            return gson.toJson(convertedValue);
        } catch (Exception e) {
            throw new XTablesException("Failed to convert bytes to JSON for type " + type, e);
        }
    }
    /**
     * Converts a byte array back into an object of the specified class type.
     * <p>
     * This method deserializes the byte array into a JSON string, then uses Gson
     * to convert the JSON string into an object of the specified type.
     *
     * @param v     The byte array to convert.
     * @param clazz The class type of the object to return.
     * @param <T>   The type of the object.
     * @return The deserialized object of type T.
     * @throws XTablesException If there is an error during deserialization.
     */
    public static <T> T toObject(byte[] v, Class<T> clazz) {
        try {
            return gson.fromJson(toString(v), clazz);
        } catch (JsonSyntaxException e) {
            throw new XTablesException(e);
        }
    }

}
