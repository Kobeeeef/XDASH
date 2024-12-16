package org.kobe.xbot.Utilities;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import org.kobe.xbot.Utilities.Logger.XTablesLogger;

import java.util.*;

public class XTablesData {
    private static final XTablesLogger logger = XTablesLogger.getLogger();
    private static final Gson gson = new GsonBuilder().create();
    private Map<String, XTablesData> data;
    private String value;

    public XTablesData() {
        // Initialize the data map lazily
    }

    public boolean put(String key, String value) {
        Utilities.validateKey(key, true);
        XTablesData current = this;
        int start = 0;
        int length = key.length();

        for (int i = 0; i < length; i++) {
            if (key.charAt(i) == '.') {
                if (i > start) {
                    String k = key.substring(start, i); // Extract the part of the key

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

        current.value = value;
        return true; // Operation successful

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

    public String get(String key) {
        XTablesData current = getLevelxTablesData(key);
        return (current != null) ? current.value : null;
    }

    public String get(String key, String defaultValue) {
        Utilities.validateKey(key, true);
        String result = get(key);
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
    public Map<String, String> getKeyValuePairs() {
        Map<String, String> keyValuePairs = new HashMap<>();
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
    private void collectKeyValuePairs(String prefix, XTablesData node, Map<String, String> result) {
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
        return gson.toJson(this.data);
    }
    public Map<String, XTablesData> getTablesMap() {
        return data;
    }
    public String getValue() {
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
}
