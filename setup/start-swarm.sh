#!/bin/bash

echo "🚀 Starting Pollify Docker Swarm deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Initialize swarm if not already initialized
if ! docker info | grep -q "Swarm: active"; then
    echo "🔧 Initializing Docker Swarm..."
    docker swarm init --advertise-addr 127.0.0.1
fi

# Build images first
echo "🔨 Building Docker images..."
docker build -t pollify-backend:latest ./backend
docker build -t pollify-frontend:latest ./frontend

# Create overlay network if it doesn't exist
if ! docker network ls | grep -q pollify-network; then
    echo "🌐 Creating overlay network..."
    docker network create --driver overlay --attachable pollify-network
fi

# Deploy the stack
echo "📦 Deploying Pollify stack..."
docker stack deploy -c docker-compose.swarm.yml pollify

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Show service status
echo "📊 Service Status:"
docker stack ps pollify

echo ""
echo "✅ Pollify deployment complete!"
echo "🌐 Frontend: http://localhost:3000 (3 replicas with load balancing)"
echo "🔧 Backend API: http://localhost:8000 (3 replicas with load balancing)"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "🔧 Scaling Commands:"
echo "   Scale all to 5: ./setup/scale-swarm.sh --all 5"
echo "   Scale backend: ./setup/scale-swarm.sh --backend 10"
echo "   Check status: ./setup/scale-swarm.sh --status"
echo ""
echo "📝 To check logs:"
echo "   Backend: docker service logs pollify_backend -f"
echo "   Frontend: docker service logs pollify_frontend -f"
echo ""
echo "🛑 To stop: ./setup/stop-swarm.sh"
