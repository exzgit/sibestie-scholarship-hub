@echo off
echo Starting Sibestie Scholarship Hub Development Environment...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && go run main.go"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd client && npm run dev"

echo.
echo Development servers are starting...
echo Backend: http://localhost:8081
echo Frontend: http://localhost:5173
echo.
echo Press any key to close all servers...
pause > nul

echo Stopping all servers...
taskkill /f /im go.exe > nul 2>&1
taskkill /f /im node.exe > nul 2>&1
echo Servers stopped. 