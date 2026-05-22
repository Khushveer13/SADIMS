@echo off
setlocal
:: Ensure the script runs from its own directory
cd /d "%~dp0"

echo ===================================================
echo             SADIMS PROJECT LAUNCHER
echo ===================================================

echo [CHECK] Verifying Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java not found! Please install JDK 17+ and add to Path.
    pause
    exit /b
)

echo [CHECK] Verifying PostgreSQL (Port 2178) status...
netstat -ano | findstr :2178 >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] PostgreSQL is NOT detected on Port 2178.
    echo Please start your PostgreSQL Server and make sure database 'sadims_db' exists.
    echo.
    echo Press any key once PostgreSQL is started, or Ctrl+C to abort...
    pause >nul
)

echo [1/3] Launching Spring Boot Backend...
if exist "backend\mvnw.cmd" (
    cd backend
    start "SADIMS Backend" cmd /k "call mvnw.cmd spring-boot:run || pause"
    cd ..
) else (
    echo [ERROR] backend\mvnw.cmd not found!
    pause
)

echo [2/3] Launching Python ML Service...
if exist "ml_service\app.py" (
    cd ml_service
    start "SADIMS ML Service" cmd /k "python app.py || pause"
    cd ..
) else (
    echo [ERROR] ml_service\app.py not found!
    pause
)

echo [3/3] Initializing services (Waiting 15s)...
timeout /t 15

echo [FINISH] Opening Frontend...
if exist "frontend\index.html" (
    start frontend/index.html
) else (
    echo [ERROR] frontend\index.html not found!
)

echo.
echo ===================================================
echo  SADIMS is booting up! 
echo  - Backend: http://localhost:8080
echo  - ML Service: http://localhost:5000
echo.
echo  If the windows above show errors, please check:
echo  1. PostgreSQL is running (Port 2178) and 'sadims_db' exists
echo  2. Java 17+ is installed
echo ===================================================
pause
