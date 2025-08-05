# Local Development Setup Guide

This guide will help you set up the loopInt project for local development without Docker.

## Prerequisites

- Node.js 18+ (recommended: Node.js 20)
- PostgreSQL 15+ (local installation or remote access)
- Redis (optional, for caching)

## Setup Steps

### 1. Install Dependencies

```bash
# Install project dependencies
npm install
```

### 2. Database Configuration

The project is currently configured to use an AWS RDS PostgreSQL instance. You have two options:

#### Option 1: Continue using the remote database (if you have access)
No changes needed to the configuration.

#### Option 2: Set up a local PostgreSQL database

1. Install PostgreSQL on your machine if not already installed
2. Create a new database:
   ```sql
   CREATE DATABASE loopintdb;
   ```
3. Update the database connection in `/apps/api/.env`:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/loopintdb
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=loopintdb
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

### 3. Redis Configuration (Optional)

If you want to use Redis for caching:

1. Install Redis on your machine
2. Update the Redis connection in your application code as needed

### 4. Start Development Servers

```bash
# Start all services in development mode
npm run dev
```

This will start both the frontend and backend services:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### 5. Individual Service Development

You can also run services individually:

```bash
# Start only the API (backend)
cd apps/api
npm run start:dev

# Start only the Web (frontend)
cd apps/web
npm run dev
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify your PostgreSQL service is running
2. Check the connection details in `/apps/api/.env`
3. Ensure your database user has the correct permissions

### Port Conflicts

If you encounter port conflicts:

1. For the API (NestJS), you can modify the port in `/apps/api/src/main.ts`
2. For the Web (Vite), you can modify the port in `/apps/web/vite.config.ts`