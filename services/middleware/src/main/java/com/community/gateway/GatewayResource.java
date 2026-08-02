package com.community.gateway;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

@Path("/{service:auth|community|content|membership|id|log|notification|orchestration}/{path:.*}")
public class GatewayResource {

    private final HttpClient client = HttpClient.newHttpClient();

    @GET
    public Response get(
            @PathParam("service") String service,
            @Context UriInfo uri,
            @Context HttpHeaders headers) {
        return forward("GET", service, uri, headers, null);
    }

    @POST
    public Response post(
            @PathParam("service") String service,
            @Context UriInfo uri,
            @Context HttpHeaders headers,
            byte[] body) {
        return forward("POST", service, uri, headers, body);
    }

    @PUT
    public Response put(
            @PathParam("service") String service,
            @Context UriInfo uri,
            @Context HttpHeaders headers,
            byte[] body) {
        return forward("PUT", service, uri, headers, body);
    }

    @PATCH
    public Response patch(
            @PathParam("service") String service,
            @Context UriInfo uri,
            @Context HttpHeaders headers,
            byte[] body) {
        return forward("PATCH", service, uri, headers, body);
    }

    @DELETE
    public Response delete(
            @PathParam("service") String service,
            @Context UriInfo uri,
            @Context HttpHeaders headers) {
        return forward("DELETE", service, uri, headers, null);
    }

    private Response forward(
            String method,
            String service,
            UriInfo uri,
            HttpHeaders headers,
            byte[] body) {

        try {
            int port = "id".equals(service) ? 3000 : 8000;

            String path = uri.getRequestUri().getRawPath()
                    .substring(service.length() + 1);

            String query = uri.getRequestUri().getRawQuery();

            URI target = URI.create(
                    "http://" + service + ":" + port + path
                            + (query == null ? "" : "?" + query)
            );

            HttpRequest.Builder request = HttpRequest.newBuilder(target)
                    .method(
                            method,
                            body == null
                                    ? HttpRequest.BodyPublishers.noBody()
                                    : HttpRequest.BodyPublishers.ofByteArray(body)
                    );

            copyHeader(headers, request, "Content-Type");
            copyHeader(headers, request, "X-User-ID");
            copyHeader(headers, request, "X-User-Role");

            HttpResponse<byte[]> response = client.send(
                    request.build(),
                    HttpResponse.BodyHandlers.ofByteArray()
            );

            Response.ResponseBuilder result = Response
                    .status(response.statusCode())
                    .entity(response.body());

            response.headers()
                    .firstValue("Content-Type")
                    .ifPresent(result::type);

            return result.build();

        } catch (Exception e) {
            return Response.status(502)
                    .entity("Service unavailable")
                    .build();
        }
    }

    private void copyHeader(
            HttpHeaders headers,
            HttpRequest.Builder request,
            String name) {

        String value = headers.getHeaderString(name);

        if (value != null) {
            request.header(name, value);
        }
    }
}
