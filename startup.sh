#!/bin/bash
echo "Installing server dependencies..."
cd /home/site/wwwroot/server
npm install --production
echo "Starting server..."
node server.js
