#!/bin/bash

case "$1" in
    dev)
        echo "Starting development environment..."
        ./local-setup/dev-start.sh
        ;;
    backend)
        echo "Starting backend only..."
        ./local-setup/start-backend.sh
        ;;
    frontend)
        echo "Starting frontend only..."
        ./local-setup/start-frontend.sh
        ;;
    staging)
        echo "Starting staging environment with Docker..."
        docker-compose up --build
        ;;
    production)
        echo "Starting production environment with Docker Swarm..."
        docker swarm init 2>/dev/null || true
        docker stack deploy -c docker-compose.swarm.yml pollify
        echo "Production stack deployed. Access:"
        echo "Frontend: http://localhost:3000"
        echo "Backend: http://localhost:8000"
        ;;
    *)
        echo "Usage: $0 {dev|backend|frontend|staging|production}"
        echo "  dev        - Start both backend and frontend servers"
        echo "  backend    - Start only backend server"
        echo "  frontend   - Start only frontend server"
        echo "  staging    - Start with Docker Compose"
        echo "  production - Start with Docker Swarm"
        exit 1
        ;;
esac
