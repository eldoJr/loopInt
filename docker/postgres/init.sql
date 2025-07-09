-- Initialize PostgreSQL database for loopInt
CREATE DATABASE IF NOT EXISTS loopint;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'UTC';