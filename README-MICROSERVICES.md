# Dreampath Discover – Java Full Stack Microservices

This repository started as the original Dreampath Discover static tourism website and now includes an educational Java/Spring Boot microservices backend.

## Architecture

Angular/HTML frontend -> Spring Cloud Gateway -> Eureka-discovered microservices

Services:
- Eureka Server: 8761
- API Gateway: 8080
- User Service: 8081
- Tour Service: 8082
- Booking Service: 8083
- Payment Service: 8084
- Notification Service: 8085
- PostgreSQL: 5432
- Demo frontend: 4200

## Requirements
- Java 21
- Maven 3.9+
- Docker Desktop

## Build
From the project root:

    mvn clean package -DskipTests

## Run with Docker

    docker compose build
    docker compose up -d

Open:
- Frontend: http://localhost:4200
- Eureka: http://localhost:8761
- Gateway: http://localhost:8080

## API examples

### Create a user
POST http://localhost:8080/api/users

    {"name":"Haris","email":"haris@example.com","phone":"9876543210"}

### Create a tour
POST http://localhost:8080/api/tours

    {"destination":"Kodaikanal","title":"Kodaikanal Escape","description":"3 day hill escape","price":5999,"durationDays":3,"available":true}

### List tours
GET http://localhost:8080/api/tours

### Create booking
POST http://localhost:8080/api/bookings

    {"userId":1,"tourId":1,"guests":2,"travelDate":"2026-10-15"}

### Create payment
POST http://localhost:8080/api/payments

    {"bookingId":1,"amount":5999,"method":"UPI"}

## Important note
The payment service is a demonstration service; it does not connect to a real payment provider. JWT/security, Kafka, and production payment processing can be added as the next learning stage.

## Interview explanation
"I built Dreampath Discover as a Spring Boot microservices travel booking platform. The API Gateway is the single entry point, Eureka handles service discovery, and separate services manage users, tours, bookings, payments and notifications. Each core service has its own PostgreSQL database. Booking Service communicates with Tour Service through OpenFeign. Docker Compose runs the complete environment."
