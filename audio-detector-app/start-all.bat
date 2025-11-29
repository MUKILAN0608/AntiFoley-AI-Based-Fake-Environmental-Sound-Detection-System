@echo off
echo ========================================
echo   Starting AntiFoley Audio Detector
echo ========================================
echo.
echo Starting Backend Server...
start "AntiFoley Backend" cmd /k "cd backend && python app.py"
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend...
start "AntiFoley Frontend" cmd /k "npm run dev"
echo.
echo ========================================
echo Both servers are starting...
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Wait a few seconds, then open:
echo http://localhost:5173
echo ========================================
echo.
echo Press any key to close this window...
pause > nul
