package org.kobe.xbot.Utilities;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class JsonParser {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static String toJson(Object obj) throws IOException {
        return objectMapper.writeValueAsString(obj);
    }

    public static <T> T fromJson(String json, Class<T> clazz) throws IOException {
        return objectMapper.readValue(json, clazz);
    }
}

