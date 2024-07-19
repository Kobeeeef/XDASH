package org.kobe.xbot.Utilities;

public class ScriptResponse {
    private final String response;
    private final ResponseStatus status;

    public ScriptResponse(String response, ResponseStatus status) {
        this.response = response;
        this.status = status;
    }

    public String getResponse() {
        return response;
    }

    public ResponseStatus getStatus() {
        return status;
    }
}
