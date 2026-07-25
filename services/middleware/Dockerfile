FROM quay.io/quarkus/quarkus-micro-image:2.0

COPY target/quarkus-app/ /middleware/

WORKDIR /middleware

COPY ./srcs ./srcs

EXPOSE 8080

CMD ["java", "-jar", "quarkus-run.jar"]