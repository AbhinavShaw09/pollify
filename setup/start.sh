#!/bin/bash

echo "🚀 Starting Pollify Application..."
echo "Building and starting containers..."

docker-compose up --build -d

echo "✅ Application started successfully!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
