# Multi-stage build for VibeMatch Spring Boot Core Backend
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy pom.xml and source code from backend module
COPY backend/vibematch-core/pom.xml .
COPY backend/vibematch-core/src ./src

# Build production jar skipping unit tests
RUN mvn clean package -DskipTests

# Production JRE runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar
RUN mkdir -p /app/uploads

# Default to 8080 if PORT is not set by cloud provider
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
