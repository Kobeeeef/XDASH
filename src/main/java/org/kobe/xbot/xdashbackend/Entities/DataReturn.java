package org.kobe.xbot.xdashbackend.Entities;

import com.google.gson.Gson;

public class DataReturn {
    public static Gson gson = new Gson();
    public String toJSON(){
        return gson.toJson(this);
    }
}
