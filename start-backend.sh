#!/bin/bash

# SACIT Symposium Backend Server Startup Script

echo "🚀 Starting SACIT Symposium Backend API Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Navigate to backend directory
cd backend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in backend directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if port 8000 is available
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8000 is already in use. Stopping existing process..."
    lsof -ti:8000 | xargs kill -9
fi

# Start the server
echo "🌐 Starting server on http://localhost:8000"
echo "📊 Health check: http://localhost:8000/api/health"
echo "📝 Registrations: http://localhost:8000/api/registrations"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev 