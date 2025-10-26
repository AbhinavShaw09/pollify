#!/bin/bash

echo "🛑 Stopping Pollify Docker Swarm deployment..."

# Remove the stack
if docker stack ls | grep -q pollify; then
    echo "Removing Pollify stack..."
    docker stack rm pollify
    echo "Waiting for services to stop..."
    sleep 10
fi

# Clean up networks
echo "Cleaning up networks..."
docker network ls | grep pollify && docker network rm $(docker network ls | grep pollify | awk '{print $1}') 2>/dev/null || true

# Leave swarm if no other stacks are running
if [ $(docker stack ls --format "table {{.Name}}" | wc -l) -eq 1 ]; then
    echo "No other stacks running. Leaving swarm..."
    docker swarm leave --force
fi

# Remove Pollify images
echo "Removing Pollify images..."
docker images | grep pollify | awk '{print $1":"$2}' | xargs -r docker rmi 2>/dev/null || true

# Clean up unused resources
echo "Cleaning up unused Docker resources..."
docker system prune -f

echo "✅ Pollify swarm deployment stopped and cleaned up!"
echo "💡 To restart: ./setup/start-swarm.sh"
