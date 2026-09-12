FROM maven:3.9.16-eclipse-temurin-21 AS build

WORKDIR /middleware

COPY . .
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /middleware

COPY --from=build /middleware/target/quarkus-app/ ./

EXPOSE 8080

CMD ["java", "-jar", "quarkus-run.jar"]
