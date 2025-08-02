FROM openjdk:17-jdk-slim

WORKDIR /app

# Install maven
RUN apt-get update && apt-get install -y maven

COPY . .

RUN mvn clean package -DskipTests

CMD ["java", "-jar", "target/todo-app-0.0.1-SNAPSHOT.jar"]
