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
   - Set up health checks for both services
   - Configure proper logging

3. Access the application:

   - Frontend: http://localhost:80
   - Backend API: http://localhost:5001/api
   - Backend Health Check: http://localhost:5001/api/health

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

## Security Considerations

- The JWT secret and MongoDB credentials are stored in the docker-compose.yml file. For production environments, consider using Docker secrets or environment files.
- Both services use non-root users for better security.
- Health checks are configured for easier monitoring and management.
- The frontend Nginx configuration includes security headers.

## Troubleshooting

If you encounter issues:

1. Check the health status:

   ```
   docker-compose ps
   ```

2. View detailed logs:

   ```
   docker-compose logs -f
   ```

3. Check if MongoDB connection is working:

   ```
   curl http://localhost:5001/api/health
   ```

4. Restart services if needed:
   ```
   docker-compose restart backend frontend
   ```

## Persistent Data

- Backend logs are stored in a Docker volume named `backend_logs`
- To inspect logs:
  ```
  docker volume inspect starnote_backend_logs
  ```
