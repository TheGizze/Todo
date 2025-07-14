#!/bin/bash

# Backend Setup Script
# Sets up the Node.js + TypeScript backend

set -e  # Exit on any error

echo "🖥️  Setting up Backend (Node.js + TypeScript)..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Make sure you're in the backend directory."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher from https://nodejs.org/"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
PORT=3000
NODE_ENV=development
DATABASE_URL=your_database_url_here
EOF
    echo "✅ .env file created with default values"
    echo "⚠️  Please update DATABASE_URL in .env with your actual database connection string"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "The backend API will be available at http://localhost:3000"
