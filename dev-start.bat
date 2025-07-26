@echo off
echo ===================================================
echo Starting NaattuMarket Development Environment
echo ===================================================
echo.
echo 1. Starting Backend Server on port 5000...
cd server
start cmd /k "npm run dev"
cd ..
echo.
echo 2. Waiting for backend to initialize...
timeout /t 5
echo.
echo 3. Starting Frontend on port 5173...
start cmd /k "npm run dev"
echo.
echo ===================================================
echo Development servers started!
echo.
echo Backend API: http://localhost:5000
echo Frontend UI: http://localhost:5173
echo ===================================================
echo.
echo Press any key to exit this window (servers will keep running)
pause > nul
