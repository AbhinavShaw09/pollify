#!/bin/bash

echo "🐳 Starting Pollify in Docker Swarm Mode..."

# Initialize swarm if not already initialized
if ! docker info | grep -q "Swarm: active"; then
    echo "Initializing Docker Swarm..."
    docker swarm init
fi

# Remove existing stack if it exists
if docker stack ls | grep -q pollify; then
    echo "Removing existing stack..."
    docker stack rm pollify
    echo "Waiting for cleanup..."
    sleep 10
fi

# Clean up any remaining networks
docker network ls | grep pollify_default && docker network rm pollify_default 2>/dev/null || true

# Create docker-compose.swarm.yml if it doesn't exist
if [ ! -f docker-compose.swarm.yml ]; then
    echo "Creating Swarm configuration..."
    cat > docker-compose.swarm.yml << EOF
services:
  backend:
    image: pollify-backend:latest
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./polls.db
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure

  frontend:
    image: pollify-frontend:latest
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure
EOF
fi

echo "Building images..."
docker-compose -f docker-compose.swarm.yml build

echo "Deploying stack to swarm..."
docker stack deploy --detach=false -c docker-compose.swarm.yml pollify

echo "✅ Pollify deployed to Docker Swarm!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📊 Check status: docker stack services pollify"
