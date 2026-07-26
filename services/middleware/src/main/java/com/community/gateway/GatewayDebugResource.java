package com.community.gateway;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/debug-auth")
public class GatewayDebugResource {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String debug(
            @HeaderParam("X-User-Id") String userId,
            @HeaderParam("X-User-Role") String role) {

        return """
                userId=%s
                role=%s
                """.formatted(userId, role);
    }
}