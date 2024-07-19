package org.kobe.xbot.xdashbackend.config;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRepository;


import java.util.UUID;

public class CustomCsrfTokenRepository implements CsrfTokenRepository {

    private static final String CSRF_TOKEN_ATTRIBUTE_NAME = "CSRF_TOKEN";

    @Override
    public CsrfToken generateToken(HttpServletRequest request) {
        String token = UUID.randomUUID().toString();
        return new CustomCsrfToken(token);
    }

    @Override
    public void saveToken(CsrfToken token, HttpServletRequest request, HttpServletResponse response) {
        if (token == null) {
            request.getSession().removeAttribute(CSRF_TOKEN_ATTRIBUTE_NAME);
        } else {
            request.getSession().setAttribute(CSRF_TOKEN_ATTRIBUTE_NAME, token);
        }
    }

    @Override
    public CsrfToken loadToken(HttpServletRequest request) {
        return (CsrfToken) request.getSession().getAttribute(CSRF_TOKEN_ATTRIBUTE_NAME);
    }

    private static class CustomCsrfToken implements CsrfToken {

        private final String token;

        CustomCsrfToken(String token) {
            this.token = token;
        }

        @Override
        public String getToken() {
            return token;
        }

        @Override
        public String getParameterName() {
            return "_csrf";
        }

        @Override
        public String getHeaderName() {
            return "X-CSRF-TOKEN";
        }
    }
}
