#!/bin/bash

echo "Starting loopInt full development environment with Docker..."

# Stop any existing containers
docker compose down

# Start all services including API and Web
docker compose --profile development up --build -d

echo "All services started!"
echo "PostgreSQL: localhost:5433"
echo "Redis: localhost:6379"
echo "API: localhost:3000"
echo "Web: localhost:5173"
echo ""
echo "View logs with: npm run docker:logs"