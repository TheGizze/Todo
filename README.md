# Todo App

A full-stack Todo application built to learn TypeScript, React, and AWS.

## Tech Stack

- **Frontend**: React with Vite and TypeScript
- **Backend**: Node.js with TypeScript
- **E2E Testing**: Python with Robot Framework
- **Cloud**: AWS (deployment target)

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **Git** - [Download here](https://git-scm.com/)

## Project Setup

### Quick Setup (Recommended)

For a quick setup of the entire development environment:

**macOS/Linux:**
```bash
# Clone the repository
git clone <repository-url>
cd Todo

# Run the setup script
./setup.sh
```

**Windows:**
```cmd
# Clone the repository
git clone <repository-url>
cd Todo

# Run the setup script
setup.bat
```

This script will:
- Check prerequisites (Node.js, Python)
- Install pipenv if needed
- Set up frontend dependencies
- Set up backend dependencies  
- Set up E2E testing environment
- Create default .env files

### Manual Setup

If you prefer to set up components individually:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Todo
```

### 2. Frontend Setup (React + Vite)

**Option A: Using setup script (recommended)**

*macOS/Linux:*
```bash
cd frontend
./setup.sh
```

*Windows:*
```cmd
cd frontend
setup.bat
```

**Option B: Manual setup**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:3000" > .env

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173` (default Vite port).

### 3. Backend Setup (Node.js + TypeScript)

**Option A: Using setup script (recommended)**

*macOS/Linux:*
```bash
cd backend
./setup.sh
```

*Windows:*
```cmd
cd backend
setup.bat
```

**Option B: Manual setup**
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=3000
NODE_ENV=development
DATABASE_URL=your_database_url_here
EOF

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:3000` (or your configured port).

### 4. E2E Testing Setup (Python + Robot Framework)

```bash
# Navigate to e2e testing directory (adjust path as needed)
cd e2e-tests

# Install pipenv if not already installed
pip install pipenv

# Install dependencies and create virtual environment
pipenv install

# Run E2E tests
pipenv run robot tests/
```

*Note: The setup scripts above will automatically handle E2E testing setup for both macOS/Linux and Windows.*

## Development Workflow

### Running All Services

You can run all services simultaneously using the following commands in separate terminals:

1. **Terminal 1** - Frontend:
   ```bash
   cd frontend && npm run dev
   ```

2. **Terminal 2** - Backend:
   ```bash
   cd backend && npm run dev
   ```

### Building for Production

#### Frontend
```bash
cd frontend
npm run build
```

#### Backend
```bash
cd backend
npm run build
```

### Running Tests

#### Unit Tests (Frontend)
```bash
cd frontend
npm run test
```

#### Unit Tests (Backend)
```bash
cd backend
npm run test
```

#### E2E Tests
```bash
cd e2e-tests
pipenv run robot tests/
```

## Environment Variables

Create the following environment files:

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=your_database_url
```

## Common Issues & Troubleshooting

- **Port conflicts**: If default ports are in use, update the port numbers in your configuration
- **Pipenv installation**: Make sure pipenv is installed globally (`pip install pipenv`)
- **Node version**: Ensure you're using Node.js v18 or higher for optimal compatibility

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
