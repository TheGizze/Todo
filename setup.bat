@echo off
REM Todo App Setup Script for Windows
REM This script sets up the entire development environment

echo 🚀 Setting up Todo App development environment...

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher from https://nodejs.org/
    pause
    exit /b 1
)

REM Get Node.js version
for /f "tokens=1" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js version %NODE_VERSION% detected

REM Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher from https://python.org/
    pause
    exit /b 1
)

echo ✅ Python detected

REM Install pipenv if not installed
where pipenv >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Installing pipenv...
    pip install pipenv
    if %errorlevel% neq 0 (
        echo ❌ Failed to install pipenv. Please install it manually: pip install pipenv
        pause
        exit /b 1
    )
)

echo ✅ pipenv is available

REM Setup Frontend
echo 🎨 Setting up Frontend (React + Vite)...
if exist "frontend" (
    cd frontend
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo ✅ Frontend dependencies installed
    cd ..
) else (
    echo ⚠️  Frontend directory not found, skipping frontend setup
)

REM Setup Backend
echo 🖥️  Setting up Backend (Node.js + TypeScript)...
if exist "backend" (
    cd backend
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo ✅ Backend dependencies installed
    cd ..
) else (
    echo ⚠️  Backend directory not found, skipping backend setup
)

REM Setup E2E Tests
echo 🧪 Setting up E2E Tests (Python + Robot Framework)...
if exist "e2e-tests" (
    cd e2e-tests
    call pipenv install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install E2E test dependencies
        pause
        exit /b 1
    )
    echo ✅ E2E test dependencies installed
    cd ..
) else (
    echo ⚠️  E2E tests directory not found, skipping E2E setup
)

echo.
echo 🎉 Setup complete! You can now start developing:
echo.
echo Frontend (Terminal 1):
echo   cd frontend ^&^& npm run dev
echo.
echo Backend (Terminal 2):
echo   cd backend ^&^& npm run dev
echo.
echo E2E Tests:
echo   cd e2e-tests ^&^& pipenv run robot tests/
echo.
echo Happy coding! 🚀
pause
