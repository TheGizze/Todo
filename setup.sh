#!/bin/bash

# Todo App Setup Script
# This script sets up the entire development environment

set -e  # Exit on any error

echo "🚀 Setting up Todo App development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install v18 or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher from https://python.org/"
    exit 1
fi

echo "✅ Python 3 detected"

# Install pipenv if not installed
if ! command -v pipenv &> /dev/null; then
    echo "📦 Installing pipenv..."
    pip3 install pipenv
fi

echo "✅ pipenv is available"

# Setup Frontend
echo "🎨 Setting up Frontend (React + Vite)..."
if [ -d "frontend" ]; then
    cd frontend
    npm install
    echo "✅ Frontend dependencies installed"
    cd ..
else
    echo "⚠️  Frontend directory not found, skipping frontend setup"
fi

# Setup Backend
echo "🖥️  Setting up Backend (Node.js + TypeScript)..."
if [ -d "backend" ]; then
    cd backend
    npm install
    echo "✅ Backend dependencies installed"
    cd ..
else
    echo "⚠️  Backend directory not found, skipping backend setup"
fi

# Setup E2E Tests
echo "🧪 Setting up E2E Tests (Python + Robot Framework)..."
if [ -d "e2e-tests" ]; then
    cd e2e-tests
    pipenv install
    echo "✅ E2E test dependencies installed"
    cd ..
else
    echo "⚠️  E2E tests directory not found, skipping E2E setup"
fi

echo ""
echo "🎉 Setup complete! You can now start developing:"
echo ""
echo "Frontend (Terminal 1):"
echo "  cd frontend && npm run dev"
echo ""
echo "Backend (Terminal 2):"
echo "  cd backend && npm run dev"
echo ""
echo "E2E Tests:"
echo "  cd e2e-tests && pipenv run robot tests/"
echo ""
echo "Happy coding! 🚀"
