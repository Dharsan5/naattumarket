@echo off
echo Starting NaattuMarket Development Environment...
echo.

echo Starting Backend Server...
start cmd /k "cd /d d:\NattuMarket\server && npm run dev"

timeout /t 3 /nobreak > NUL

echo Starting Frontend Development Server...
start cmd /k "cd /d d:\NattuMarket && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > NUL
