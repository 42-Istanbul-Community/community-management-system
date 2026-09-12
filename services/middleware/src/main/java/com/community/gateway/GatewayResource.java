package com.community.gateway;

import org.eclipse.microprofile.jwt.JsonWebToken;

import io.smallrye.jwt.auth.principal.JWTParser;
import jakarta.inject.Inject;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;

@Path("/verify")
public class GatewayResource {

    private static final String TOKEN_COOKIE = "cms-token";
    private static final String NORMAL_ROLE = "normal";
    private static final String SUPER_ADMIN_ROLE = "super_admin";

    @Inject
    JWTParser parser;

    @GET
    public Response verify(
            @CookieParam(TOKEN_COOKIE) String cookieToken,
            @HeaderParam(HttpHeaders.AUTHORIZATION) String authorization) {

        String token = tokenFrom(cookieToken, authorization);
        if (token == null) {
            return Response.ok().build();
        }

        AuthenticatedUser user = authenticatedUser(token);
        if (user == null) {
            return Response.ok()
                    .header(HttpHeaders.SET_COOKIE, expiredTokenCookie())
                    .build();
        }

        return authenticatedResponse(user);
    }

    @GET
    @Path("/super-admin")
    public Response verifySuperAdmin(
            @CookieParam(TOKEN_COOKIE) String cookieToken,
            @HeaderParam(HttpHeaders.AUTHORIZATION) String authorization) {

        String token = tokenFrom(cookieToken, authorization);
        if (token == null) {
            return unauthorized();
        }

        AuthenticatedUser user = authenticatedUser(token);
        if (user == null) {
            return unauthorized();
        }

        if (!SUPER_ADMIN_ROLE.equals(user.role())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        return authenticatedResponse(user);
    }

    private String tokenFrom(String cookieToken, String authorization) {
        if (cookieToken != null && !cookieToken.isBlank()) {
            return cookieToken;
        }

        if (authorization != null && authorization.startsWith("Bearer ")) {
            String bearerToken = authorization.substring(7).trim();
            return bearerToken.isEmpty() ? null : bearerToken;
        }

        return null;
    }

    private AuthenticatedUser authenticatedUser(String token) {
        try {
            JsonWebToken jwt = parser.verify(token, System.getenv("JWT_SECRET_KEY"));
            Object userId = jwt.getClaim("user_id");
            String role = jwt.getClaim("role");

            if (userId == null ||
                    (!NORMAL_ROLE.equals(role) && !SUPER_ADMIN_ROLE.equals(role))) {
                return null;
            }

            return new AuthenticatedUser(userId.toString(), role);
        } catch (Exception exception) {
            return null;
        }
    }

    private Response authenticatedResponse(AuthenticatedUser user) {
        return Response.ok()
                .header("X-User-ID", user.id())
                .header("X-User-Role", user.role())
                .build();
    }

    private Response unauthorized() {
        return Response.status(Response.Status.UNAUTHORIZED)
                .header(HttpHeaders.SET_COOKIE, expiredTokenCookie())
                .build();
    }

    private String expiredTokenCookie() {
        return TOKEN_COOKIE + "=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax";
    }

    private record AuthenticatedUser(String id, String role) {
    }
}
