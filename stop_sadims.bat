@echo off
echo ===================================================
echo             SADIMS FORCE TERMINATION
echo ===================================================

echo [1/2] Killing Backend (Java/Maven)...
taskkill /F /IM java.exe /T >nul 2>&1
taskkill /F /IM mvn.exe /T >nul 2>&1

echo [2/2] Killing ML Service (Python)...
taskkill /F /IM python.exe /T >nul 2>&1

echo.
echo [DONE] All SADIMS processes have been terminated.
echo You can now run start_sadims.bat safely.
echo.
pause
