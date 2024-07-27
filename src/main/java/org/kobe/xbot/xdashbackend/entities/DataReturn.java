package org.kobe.xbot.xdashbackend.entities;

import com.google.gson.Gson;

public class DataReturn {
    private static final Gson gson = new Gson();
    public String toJSON(){
        return gson.toJson(this);
    }
}
