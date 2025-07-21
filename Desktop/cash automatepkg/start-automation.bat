@echo off
echo 🚀 Starting Affiliate Marketing Automation System...

echo 📊 Starting dashboard server...
start /B node simple-server.js

timeout /t 3 /nobreak > nul

echo 🤖 Starting automation scheduler...
start /B node auto-scheduler.js start

echo ✅ System started successfully!
echo 📊 Dashboard: http://localhost:3000
echo 🤖 Automation: Running in background
echo.
echo To check status: node auto-scheduler.js status
echo.
echo 💰 Your passive income machine is now running 24/7!

pause
