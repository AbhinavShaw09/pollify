#!/bin/bash

echo "🛑 Stopping Pollify Docker Compose deployment..."

# Stop and remove containers
echo "Stopping and removing containers..."
docker-compose down --remove-orphans

# Remove any remaining Pollify containers
echo "Removing any remaining Pollify containers..."
docker ps -a | grep pollify | awk '{print $1}' | xargs docker rm -f 2>/dev/null || true

# Remove images
echo "Removing Pollify images..."
docker rmi pollify-frontend:latest pollify-backend:latest 2>/dev/null || true

# Clean up any dangling images
echo "Cleaning up dangling images..."
docker image prune -f

echo "✅ Pollify Docker Compose deployment stopped and cleaned up!"
echo "💡 To restart: ./setup/start.sh"
