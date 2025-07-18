#!/bin/bash

# Initialize LoopInt Database
echo "Initializing LoopInt database..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL client is not installed. Please install it first."
    exit 1
fi

# Load environment variables from .env file
if [ -f "apps/api/.env" ]; then
    source <(grep -v '^#' apps/api/.env | sed -E 's/(.*)=(.*)/export \1="\2"/g')
fi

# Check if we have database connection details
if [ -z "$DB_USER" ] || [ -z "$DB_NAME" ]; then
    echo "Database connection details not found in apps/api/.env"
    echo "Please set up your database connection first"
    exit 1
fi

# Ask for password if not in environment
if [ -z "$DB_PASSWORD" ]; then
    read -sp "Enter PostgreSQL password for user $DB_USER: " DB_PASSWORD
    echo ""
fi

# Check if schema file exists
SCHEMA_FILE="database/schema.sql"
if [ ! -f "$SCHEMA_FILE" ]; then
    echo "Schema file not found: $SCHEMA_FILE"
    exit 1
fi

# Execute the schema file
echo "Creating database schema..."
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME < $SCHEMA_FILE

if [ $? -eq 0 ]; then
    echo "Database schema created successfully!"
else
    echo "Error creating database schema"
    exit 1
fi

echo "Database initialization complete!"