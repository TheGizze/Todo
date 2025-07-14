@echo off
REM Backend Setup Script for Windows
REM Sets up the Node.js + TypeScript backend

echo 🖥️  Setting up Backend (Node.js + TypeScript)...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ package.json not found. Make sure you're in the backend directory.
    pause
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher from https://nodejs.org/
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo 📝 Creating .env file...
    (
        echo PORT=3000
        echo NODE_ENV=development
        echo DATABASE_URL=your_database_url_here
    ) > .env
    echo ✅ .env file created with default values
    echo ⚠️  Please update DATABASE_URL in .env with your actual database connection string
) else (
    echo ℹ️  .env file already exists
)

echo.
echo ✅ Backend setup complete!
echo.
echo To start the development server:
echo   npm run dev
echo.
echo The backend API will be available at http://localhost:3000
pause
