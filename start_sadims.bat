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

echo [CHECK] Verifying PostgreSQL (Port 5432) status...
netstat -ano | findstr :5432 >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] PostgreSQL is NOT detected on Port 5432.
    echo Please start your PostgreSQL Server and make sure database 'sadims_db' exists.
    echo.
    echo Press any key once PostgreSQL is started, or Ctrl+C to abort...
    pause >nul
)

echo [1/3] Launching Spring Boot Backend...
cd backend
if exist "mvnw.cmd" (
    start "SADIMS Backend" cmd /k "call mvnw.cmd spring-boot:run || pause"
) else (
    echo [INFO] mvnw.cmd not found, using global mvn...
    start "SADIMS Backend" cmd /k "mvn spring-boot:run || pause"
)
cd ..

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
start http://localhost:8080/

echo.
echo ===================================================
echo  SADIMS is booting up! 
echo  - Backend: http://localhost:8080
echo  - ML Service: http://localhost:5000
echo.
echo  If the windows above show errors, please check:
echo  1. PostgreSQL is running (Port 5432) and 'sadims_db' exists
echo  2. Java 17+ is installed
echo ===================================================
pause
