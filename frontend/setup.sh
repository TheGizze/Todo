#!/bin/bash

# Frontend Setup Script
# Sets up the React + Vite frontend

set -e  # Exit on any error

echo "🎨 Setting up Frontend (React + Vite)..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Make sure you're in the frontend directory."
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
VITE_API_URL=http://localhost:3000
EOF
    echo "✅ .env file created with default values"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "✅ Frontend setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "The frontend will be available at http://localhost:5173"
