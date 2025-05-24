# Star-Note Docker Guide

This README provides instructions on how to build and run the Star-Note application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your machine
- Git (to clone the repository)

## Building and Running with Docker Compose

1. Make sure you are in the project root directory (where the `docker-compose.yml` file is located)

2. Build and start the containers:

   ```
   docker-compose up --build
   ```

   This command will:

   - Build the Docker images for both frontend and backend
   - Start the containers
   - Connect the services through a Docker network

3. Access the application:

   - Frontend: http://localhost:80
   - Backend API: http://localhost:5001/api

4. To stop the application, press `Ctrl+C` in the terminal where docker-compose is running, or run:
   ```
   docker-compose down
   ```

## Running in Detached Mode

If you want to run the containers in the background:

```
docker-compose up -d --build
```

To check the logs:

```
docker-compose logs -f
```

## Rebuild and Restart

If you make changes to the code, you need to rebuild the images:

```
docker-compose down
docker-compose up --build
```

## Individual Container Management

- To rebuild just the frontend:

  ```
  docker-compose build frontend
  docker-compose up -d frontend
  ```

- To rebuild just the backend:

  ```
  docker-compose build backend
  docker-compose up -d backend
  ```

- To view logs for a specific service:
  ```
  docker-compose logs -f [service_name]
  ```
  Replace [service_name] with either 'frontend' or 'backend'
