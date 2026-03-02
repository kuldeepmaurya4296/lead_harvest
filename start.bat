@echo off
setlocal enabledelayedexpansion

echo ============================================
echo   LeadHarvest - Automated Startup Script
echo ============================================
echo.

:: 1. Backend Dependencies
echo [1/4] Checking Backend Dependencies...
cd /d "%~dp0"
python -m pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo Error installing backend dependencies.
    pause
    exit /b %ERRORLEVEL%
)

:: 2. Frontend Dependencies
echo [2/4] Checking Frontend Dependencies...
cd /d "%~dp0frontend"
if not exist "node_modules\" (
    echo node_modules not found. Installing...
    call npm install
) else (
    echo node_modules found. Skipping install.
)
if %ERRORLEVEL% neq 0 (
    echo Error installing frontend dependencies.
    pause
    exit /b %ERRORLEVEL%
)

:: 3. Start Backend
echo [3/4] Starting Backend (Port 8000)...
start "LeadHarvest-Backend" cmd /c "cd /d %~dp0 && python -m uvicorn app:app --host localhost --port 8000 --reload"

:: 4. Start Frontend
echo [4/4] Starting Frontend (Port 3000)...
:: We use 'call' for npm run dev to stay in the loop or start it separately
start "LeadHarvest-Frontend" cmd /c "cd /d %~dp0frontend && npm run dev"

echo.
echo ============================================
echo   SUCCESS: Servers are starting up!
echo ============================================
echo.
echo Please wait a moment for the servers to initialize...
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000 (or 3001 if 3000 is busy)
echo.
timeout /t 5 >nul
start http://localhost:3000
echo Instructions:
echo 1. Keep these windows open while using the app.
echo 2. Go to Google Maps, search for leads, and copy the URL.
echo 3. Paste the URL into the dashboard and click "Extract".
echo.
pause
