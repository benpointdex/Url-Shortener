# ============================================================
# Stage 1 – Build
#   Uses the full Maven + JDK image to compile and package
#   the application into a fat JAR.
# ============================================================
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy dependency manifest first so Docker can cache the
# dependency-download layer independently of source changes.
COPY pom.xml .




# Pre-fetch all dependencies (cache layer)
RUN mvn dependency:go-offline -B

# Copy the rest of the source tree
COPY src/ src/

# Build, skipping tests (tests require a live DB – run them in CI separately)
RUN mvn package -DskipTests -B

# ============================================================
# Stage 2 – Runtime
#   Lean JRE-only image; only the executable JAR is copied in.
# ============================================================
FROM eclipse-temurin:21-jre


WORKDIR /app



# Copy the fat JAR produced by the builder stage
COPY --from=builder /app/target/*.jar app.jar

# The application listens on 8081 (see application.yaml)
EXPOSE 8090



ENTRYPOINT [ "java","-jar", "app.jar"]
