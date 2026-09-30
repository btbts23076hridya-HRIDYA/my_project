@echo off
echo.
echo  Starting SoulSync Backend on port 5001...
echo.
cd /d "%~dp0backend"
npm install
node server.js
pause
