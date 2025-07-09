#!/bin/bash

echo "🚀 Starting loopInt development environment..."

# Start only database services for development
docker compose up -d postgres redis

echo "✅ Database services started!"
echo "📊 PostgreSQL: localhost:5433"
echo "🔴 Redis: localhost:6379"
echo ""
echo "💡 Run 'npm run dev' to start your applications locally"