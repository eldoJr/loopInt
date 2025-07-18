#!/bin/bash

# loopInt Setup Script (Non-Docker)
# This script helps set up the loopInt project without Docker

echo "🚀 Setting up loopInt project..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if PostgreSQL is installed
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL is installed"
    
    # Ask if user wants to create a local database
    read -p "Do you want to create a local PostgreSQL database? (y/n): " create_db
    if [[ $create_db == "y" || $create_db == "Y" ]]; then
        read -p "Enter database name (default: loopintdb): " db_name
        db_name=${db_name:-loopintdb}
        
        read -p "Enter PostgreSQL username (default: postgres): " db_user
        db_user=${db_user:-postgres}
        
        read -sp "Enter PostgreSQL password: " db_password
        echo ""
        
        # Create database
        echo "🗄️ Creating database $db_name..."
        PGPASSWORD=$db_password createdb -U $db_user $db_name
        
        if [ $? -eq 0 ]; then
            echo "✅ Database created successfully"
            
            # Update .env file
            echo "📝 Updating .env file..."
            cat > apps/api/.env << EOF
DATABASE_URL=postgresql://$db_user:$db_password@localhost:5432/$db_name
DB_HOST=localhost
DB_PORT=5432
DB_NAME=$db_name
DB_USER=$db_user
DB_PASSWORD=$db_password
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
EOF
            echo "✅ .env file updated"
            
            # Import schema if available
            if [ -f "database/schema.sql" ]; then
                echo "📄 Importing database schema..."
                PGPASSWORD=$db_password psql -U $db_user -d $db_name < database/schema.sql
                echo "✅ Schema imported"
            fi
        else
            echo "❌ Failed to create database"
        fi
    fi
else
    echo "⚠️ PostgreSQL is not installed or not in PATH"
    echo "Please install PostgreSQL or ensure you have access to a remote PostgreSQL instance"
    echo "Then update the connection details in apps/api/.env"
fi

echo ""
echo "🎉 Setup complete! You can now start the development servers with:"
echo "npm run dev"
echo ""
echo "This will start:"
echo "- Frontend: http://localhost:5173"
echo "- Backend: http://localhost:3000"
echo ""
echo "For more information, see LOCAL_SETUP.md"