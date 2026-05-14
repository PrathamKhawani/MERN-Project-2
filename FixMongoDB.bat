@echo off
echo ==========================================
echo 🛠️  MERN Project MongoDB Repair Tool
echo ==========================================
echo.
echo Attempting to start MongoDB service...
echo (You may see a permission request, please click YES)
echo.
powershell -Command "Start-Process cmd -ArgumentList '/c net start MongoDB' -Verb RunAs"
echo.
echo Checking status...
timeout /t 5 >nul
net start | findstr "MongoDB" >nul
if %errorlevel% equ 0 (
    echo ✅ MongoDB is now RUNNING!
) else (
    echo ❌ Failed to start automatically. 
    echo 👉 Please right-click this file and select 'Run as Administrator'.
)
echo.
pause
