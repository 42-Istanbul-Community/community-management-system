FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

COPY pom.xml .
COPY src src

RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /middleware

COPY --from=build /build/target/quarkus-app ./quarkus-app

EXPOSE 8080
CMD ["java", "-jar", "quarkus-app/quarkus-run.jar"]
