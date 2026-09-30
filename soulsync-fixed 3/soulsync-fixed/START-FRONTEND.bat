@echo off
echo.
echo  Starting SoulSync Frontend...
echo.
cd /d "%~dp0frontend"
npm install
npm start
pause
