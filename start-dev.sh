#!/bin/bash

echo "Starting NaattuMarket Development Environment..."
echo ""

echo "Starting Backend Server..."
cd server
npm run dev &
BACKEND_PID=$!

sleep 3

echo "Starting Frontend Development Server..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
