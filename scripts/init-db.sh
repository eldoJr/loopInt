#!/bin/bash

# Initialize LoopInt Database
echo "Initializing LoopInt database..."

# Check if PostgreSQL container is running
if ! docker ps | grep -q "loopint-postgres"; then
    echo "PostgreSQL container is not running. Please start it first with:"
    echo "docker-compose up postgres"
    exit 1
fi

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Execute the schema file
echo "Creating database schema..."
docker exec -i loopint-postgres psql -U postgres -d loopintdb < docker/postgres/schema.sql

if [ $? -eq 0 ]; then
    echo "Database schema created successfully!"
else
    echo "Error creating database schema"
    exit 1
fi

echo "Database initialization complete!"