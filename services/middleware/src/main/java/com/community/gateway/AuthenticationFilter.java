package com.community.gateway;

import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.ext.Provider;

@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter {

    private static final String USER_ID_HEADER = "X-User-Id";
    private static final String USER_ROLE_HEADER = "X-User-Role";

    @Override
    public void filter(ContainerRequestContext request) {

        // Kullanıcının kendisinin gönderdiği header'ları sil.
        request.getHeaders().remove(USER_ID_HEADER);
        request.getHeaders().remove(USER_ROLE_HEADER);

        // Şimdilik JWT yerine sahte kullanıcı bilgisi.
        request.getHeaders().putSingle(USER_ID_HEADER, "user-123");
        request.getHeaders().putSingle(USER_ROLE_HEADER, "normal");
    }
}
