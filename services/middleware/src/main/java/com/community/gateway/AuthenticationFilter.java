package com.community.gateway;

import org.eclipse.microprofile.jwt.JsonWebToken;

import io.smallrye.jwt.auth.principal.JWTParser;
import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.ext.Provider;

@Provider
public class AuthenticationFilter implements ContainerRequestFilter, ContainerResponseFilter {

    private static final String INVALID_TOKEN = "invalidToken";

    @Inject
    JWTParser parser;

    @Override
    public void filter(ContainerRequestContext request) {
        request.getHeaders().remove("X-User-ID");
        request.getHeaders().remove("X-User-Role");

        try {
            String auth = request.getHeaderString(HttpHeaders.AUTHORIZATION);

            if (auth == null || !auth.startsWith("Bearer ")) {
                throw new Exception();
            }

            JsonWebToken jwt = parser.verify(
                    auth.substring(7),
                    System.getenv("JWT_SECRET_KEY")
            );

            Object userId = jwt.getClaim("user_id");
            String role = jwt.getClaim("role");

            if (userId == null ||
                (!"normal".equals(role) && !"superadmin".equals(role))) {
                throw new Exception();
            }

            request.getHeaders().putSingle("X-User-ID", userId.toString());
            request.getHeaders().putSingle("X-User-Role", role);

        } catch (Exception e) {
            request.setProperty(INVALID_TOKEN, true);
        }
    }

    @Override
    public void filter(
            ContainerRequestContext request,
            ContainerResponseContext response) {
        if (request.getProperty(INVALID_TOKEN) != null) {
            response.getHeaders().add(
                    HttpHeaders.SET_COOKIE,
                    "cmstoken=; Path=/; Max-Age=0; HttpOnly"
            );
        }
    }
}
