package org.kobe.xbot.Utilities;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import org.kobe.xbot.Utilities.Entities.XTableProto;
import org.kobe.xbot.Utilities.Logger.XTablesLogger;

import java.lang.reflect.Type;
import java.util.*;

public class XTablesData {
    private static final XTablesLogger logger = XTablesLogger.getLogger();
    private static final Gson gson;
    static {
        // Register custom serializer for XTablesData class
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.registerTypeAdapter(XTablesData.class, new XTablesDataSerializer());
        gson = gsonBuilder.create();
    }
    private Map<String, XTablesData> data;
    private byte[] value;
    private XTableProto.XTableMessage.Type type;
    public XTablesData() {
        // Initialize the data map lazily
    }


    public boolean put(String key, byte[] value, XTableProto.XTableMessage.Type type) {
        Utilities.validateKey(key, true);
        XTablesData current = this;
        int start = 0;
        int length = key.length();
        for (int i = 0; i < length; i++) {
            if (key.charAt(i) == '.') {
                if (i > start) {
                    String k = key.substring(start, i);

                    if (current.data == null) {
                        current.data = new HashMap<>();
                    }
                    current.data.putIfAbsent(k, new XTablesData());
                    current = current.data.get(k);
                }
                start = i + 1;
            }
        }
        if (start < length) {
            String k = key.substring(start);

            if (current.data == null) {
                current.data = new HashMap<>();
            }
            current.data.putIfAbsent(k, new XTablesData());
            current = current.data.get(k);
        }
        current.type = type;
        current.value = value;
        return true;

    }

    public int size() {
        int count = (value != null) ? 1 : 0;
        if (data != null) {
            for (XTablesData child : data.values()) {
                count += child.size();
            }
        }
        return count;
    }
    /**
     * Retrieves the value and its type for the given key.
     *
     * @param key The key for which to retrieve the value and type.
     * @return A Map.Entry containing the value as a byte array and its type as XTableProto.XTableMessage.Type, or null if the key doesn't exist.
     */
    public Map.Entry<byte[], XTableProto.XTableMessage.Type> getWithType(String key) {
        XTablesData current = getLevelxTablesData(key);
        if (current != null && current.value != null && current.type != null) {
            return new AbstractMap.SimpleEntry<>(current.value, current.type);
        }
        return null;
    }

    public byte[] get(String key) {
        XTablesData current = getLevelxTablesData(key);
        return (current != null) ? current.value : null;
    }

    public byte[] get(String key, byte[] defaultValue) {
        Utilities.validateKey(key, true);
        byte[] result = get(key);
        return (result != null) ? result : defaultValue;
    }

    private XTablesData getLevelxTablesData(String key) {
        Utilities.validateKey(key, true);
        String[] keys = key.split("\\."); // Split the key by '.'
        XTablesData current = this;

        // Traverse through the nested structure
        for (String k : keys) {
            if (current.data == null || !current.data.containsKey(k)) {
                return null; // Key not found
            }
            current = current.data.get(k);
        }
        return current;
    }

    public boolean renameKey(String oldKey, String newKeyName) {
        Utilities.validateKey(oldKey, true);
        Utilities.validateName(newKeyName, true);

        if (oldKey == null || newKeyName == null || oldKey.isEmpty() || newKeyName.isEmpty()) {
            return false; // Invalid parameters
        }

        String[] oldKeys = oldKey.split("\\.");
        if (oldKeys.length == 0) {
            return false; // No key to rename
        }

        String parentKey = oldKeys.length > 1 ? String.join(".", Arrays.copyOf(oldKeys, oldKeys.length - 1)) : "";
        XTablesData parentNode = parentKey.isEmpty() ? this : getLevelxTablesData(parentKey);

        if (parentNode == null || !parentNode.data.containsKey(oldKeys[oldKeys.length - 1])) {
            return false; // Old key does not exist
        }

        XTablesData oldNode = parentNode.data.get(oldKeys[oldKeys.length - 1]);
        if (oldNode == null) {
            return false;
        }

        // Check if new key already exists in the same parent node
        if (parentNode.data.containsKey(newKeyName)) {
            return false; // New key already exists
        }

        // Rename by moving the node
        parentNode.data.put(newKeyName, oldNode);
        parentNode.data.remove(oldKeys[oldKeys.length - 1]);

        return true; // Successfully renamed
    }


    // Method to get all tables at a given level
    public Set<String> getTables(String key) {
        Utilities.validateKey(key, true);
        if (key.isEmpty()) {
            return (data != null) ? data.keySet() : null;
        }
        XTablesData current = getLevelxTablesData(key);
        return (current != null && current.data != null) ? current.data.keySet() : null;
    }

    // Method to delete a value at a given level
    public boolean delete(String key) {
        Utilities.validateKey(key, true);
        if (key.isEmpty()) {
            this.data = null;
            return true;
        }
        String[] keys = key.split("\\."); // Split the key by '.'
        XTablesData current = this;

        // Traverse through the nested structure until reaching the level to delete
        for (int i = 0; i < keys.length - 1; i++) {
            String k = keys[i];
            if (current.data == null || !current.data.containsKey(k)) {
                return false; // Key not found
            }
            current = current.data.get(k);
        }


        return current.data != null && current.data.remove(keys[keys.length - 1]) != null;
    }
    /**
     * Retrieves all key-value pairs in dot notation from the current data structure.
     *
     * @return A map containing all key-value pairs in dot notation.
     */
    public Map<String, byte[]> getKeyValuePairs() {
        Map<String, byte[]> keyValuePairs = new HashMap<>();
        collectKeyValuePairs("", this, keyValuePairs);
        return keyValuePairs;
    }

    /**
     * Helper method to recursively collect key-value pairs in dot notation.
     *
     * @param prefix The current key prefix in dot notation.
     * @param node   The current XTablesData node.
     * @param result The map to store key-value pairs.
     */
    private void collectKeyValuePairs(String prefix, XTablesData node, Map<String, byte[]> result) {
        if (node.value != null) {
            result.put(prefix, node.value);
        }
        if (node.data != null) {
            for (Map.Entry<String, XTablesData> entry : node.data.entrySet()) {
                String key = entry.getKey();
                XTablesData childNode = entry.getValue();
                String newPrefix = prefix.isEmpty() ? key : prefix + "." + key;
                collectKeyValuePairs(newPrefix, childNode, result);
            }
        }
    }
    public String toJSON() {
        if(this.data == null) return null;
        return gson.toJson(new HashMap<>(this.data));
    }

    public XTableProto.XTableMessage.Type getType() {
        return type;
    }

    public Map<String, XTablesData> getTablesMap() {
        return data;
    }
    public byte[] getValue() {
        return value;
    }
    public void updateFromRawJSON(String json) {

        Map<String, XTablesData> newData = gson.fromJson(json, new TypeToken<Map<String, XTablesData>>() {
        }.getType());


        if (newData == null) {
            newData = new HashMap<>();
        }

        this.data = newData; // Directly assign the new data
    }
    private static class XTablesDataSerializer implements JsonSerializer<XTablesData> {
        @Override
        public JsonElement serialize(XTablesData src, Type typeOfSrc, JsonSerializationContext context) {
            JsonObject jsonObject = new JsonObject();

            // Serialize the `value` field if it exists at the root level
            if (src.value != null) {
                jsonObject.add("value", serializeValue(src));
            }

            // Serialize the `data` map if it exists
            if (src.data != null && !src.data.isEmpty()) {
                JsonObject dataObject = new JsonObject();
                for (Map.Entry<String, XTablesData> entry : src.data.entrySet()) {
                    String key = entry.getKey();
                    XTablesData childNode = entry.getValue();

                    // Recursively serialize each child node
                    dataObject.add(key, serialize(childNode, typeOfSrc, context));
                }
                jsonObject.add("data", dataObject);
            }

            return jsonObject;
        }



        private JsonElement serializeValue(XTablesData node) {
            if (node.value != null && node.type != null) {
                return switch (node.type) {
                    case STRING -> new JsonPrimitive(new String(node.value));
                    case INT64 -> new JsonPrimitive(bytesToLong(node.value));
                    case BOOL -> new JsonPrimitive(node.value[0] == 0x01);
                    case DOUBLE -> new JsonPrimitive(bytesToDouble(node.value));

                    case BYTES, UNKNOWN -> {
                        JsonArray byteArray = new JsonArray();
                        for (byte b : node.value) {
                            byteArray.add(b);
                        }
                        yield byteArray;
                    }
                    default -> JsonNull.INSTANCE;
                };
            }
            return JsonNull.INSTANCE;
        }

        private long bytesToLong(byte[] bytes) {
            if (bytes.length > 8) {
                throw new IllegalArgumentException("Byte array is too large to fit in a long");
            }

            long result = 0;
            for (int i = 0; i < bytes.length; i++) {
                result |= (bytes[i] & 0xFFL) << ((bytes.length - 1 - i) * 8);
            }
            return result;
        }



        private double bytesToDouble(byte[] bytes) {
            if (bytes.length >= 8) {
                long longBits = ((long) bytes[0] << 56) |
                        ((long) (bytes[1] & 0xFF) << 48) |
                        ((long) (bytes[2] & 0xFF) << 40) |
                        ((long) (bytes[3] & 0xFF) << 32) |
                        ((long) (bytes[4] & 0xFF) << 24) |
                        ((long) (bytes[5] & 0xFF) << 16) |
                        ((long) (bytes[6] & 0xFF) << 8) |
                        ((long) (bytes[7] & 0xFF));
                return Double.longBitsToDouble(longBits);
            }
            return 0.0;
        }
    }



}
