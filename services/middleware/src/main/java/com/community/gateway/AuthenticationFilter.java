package com.community.gateway;

import org.eclipse.microprofile.jwt.JsonWebToken;

import io.smallrye.jwt.auth.principal.JWTParser;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotAuthorizedException;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.ext.Provider;

@Provider
public class AuthenticationFilter implements ContainerRequestFilter {

    @Inject
    JWTParser parser;

    @Override
    public void filter(ContainerRequestContext request) {
        try {
            String auth = request.getHeaderString(HttpHeaders.AUTHORIZATION);

            if (auth == null || !auth.startsWith("Bearer ")) {
                throw new Exception();
            }

            JsonWebToken jwt = parser.parse(auth.substring(7));

            String userId = jwt.getClaim("user_id");
            String role = jwt.getClaim("role");

            if (userId == null ||
                (!"normal".equals(role) && !"superadmin".equals(role))) {
                throw new Exception();
            }

            request.getHeaders().putSingle("X-User-Id", userId);
            request.getHeaders().putSingle("X-User-Role", role);

        } catch (Exception e) {
            throw new NotAuthorizedException("Bearer");
        }
    }
}