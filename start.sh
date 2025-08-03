#!/bin/bash

echo "🚀 Starting Revolt Motors Voice Assistant..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your GEMINI_API_KEY"
    exit 1
fi

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
fi

echo "✅ Dependencies installed"

# Start server in background
echo "🔧 Starting server on port 3001..."
node server/app.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Check if server started successfully
if curl -s http://localhost:3001/api/test > /dev/null; then
    echo "✅ Server is running on http://localhost:3001"
else
    echo "❌ Failed to start server"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo "🌐 Starting client on port 3000..."
echo "📱 Open your browser to http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both server and client"

# Start client
cd client && npm start

# Cleanup on exit
trap "echo '🛑 Stopping server...'; kill $SERVER_PID 2>/dev/null; exit" INT 