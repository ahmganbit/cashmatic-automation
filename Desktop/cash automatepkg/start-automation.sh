#!/bin/bash

# Affiliate Marketing Automation Startup Script
echo "🚀 Starting Affiliate Marketing Automation System..."

# Start the dashboard server
echo "📊 Starting dashboard server..."
node simple-server.js &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Start the automation scheduler
echo "🤖 Starting automation scheduler..."
node auto-scheduler.js start &
SCHEDULER_PID=$!

echo "✅ System started successfully!"
echo "📊 Dashboard: http://localhost:3000"
echo "🤖 Automation: Running in background"
echo ""
echo "To stop the system:"
echo "kill $SERVER_PID $SCHEDULER_PID"
echo ""
echo "To check status:"
echo "node auto-scheduler.js status"
echo ""
echo "💰 Your passive income machine is now running 24/7!"

# Keep script running
wait
