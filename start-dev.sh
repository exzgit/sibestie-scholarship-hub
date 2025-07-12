#!/bin/bash

echo "Starting Sibestie Scholarship Hub Development Environment..."
echo

echo "Starting Backend Server..."
cd backend && go run main.go &
BACKEND_PID=$!

echo "Waiting 3 seconds for backend to start..."
sleep 3

echo "Starting Frontend Server..."
cd ../client && npm run dev &
FRONTEND_PID=$!

echo
echo "Development servers are starting..."
echo "Backend: http://localhost:8081"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop all servers..."

# Function to cleanup processes
cleanup() {
    echo "Stopping all servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Servers stopped."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait 