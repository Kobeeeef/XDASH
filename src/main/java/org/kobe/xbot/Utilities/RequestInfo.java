package org.kobe.xbot.Utilities;

public class RequestInfo {
    private final String id;
    private final MethodType method;
    private final String[] tokens;

    public RequestInfo(String raw) {
        // Avoid using regex when not needed
        String raw1 = raw.replace("\n", "");
        this.tokens = tokenize(raw1, ' ');

        String[] requestTokens = tokenize(this.tokens[0], ':');
        this.id = requestTokens[0];

        MethodType parsedMethod;
        try {
            parsedMethod = MethodType.valueOf(requestTokens[1]);
        } catch (Exception e) {
            parsedMethod = MethodType.UNKNOWN;
        }
        this.method = parsedMethod;
    }

    public String getID() {
        return this.id;
    }

    public MethodType getMethod() {
        return this.method;
    }

    public String[] getTokens() {
        return this.tokens;
    }

    // Custom method to tokenize string without using regex
    private String[] tokenize(String input, char delimiter) {
        int count = 1;
        int length = input.length();
        for (int i = 0; i < length; i++) {
            if (input.charAt(i) == delimiter) {
                count++;
            }
        }

        // Allocate array for results
        String[] result = new String[count];
        int index = 0;
        int tokenStart = 0;

        // Second pass: Extract tokens
        for (int i = 0; i < length; i++) {
            if (input.charAt(i) == delimiter) {
                result[index++] = input.substring(tokenStart, i);
                tokenStart = i + 1;
            }
        }

        // Add last token
        result[index] = input.substring(tokenStart);

        return result;
    }

}
