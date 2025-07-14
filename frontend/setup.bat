@echo off
REM Frontend Setup Script for Windows
REM Sets up the React + Vite frontend

echo 🎨 Setting up Frontend (React + Vite)...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ package.json not found. Make sure you're in the frontend directory.
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
    echo VITE_API_URL=http://localhost:3000 > .env
    echo ✅ .env file created with default values
) else (
    echo ℹ️  .env file already exists
)

echo.
echo ✅ Frontend setup complete!
echo.
echo To start the development server:
echo   npm run dev
echo.
echo The frontend will be available at http://localhost:5173
pause
