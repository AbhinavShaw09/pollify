#!/bin/bash

case "$1" in
    dev|backend|frontend)
        echo "Stopping development servers..."
        pkill -f "python3 main.py"
        pkill -f "next dev"
        echo "Development servers stopped"
        ;;
    staging)
        echo "Stopping staging environment..."
        docker-compose down
        ;;
    production)
        echo "Stopping production environment..."
        docker stack rm pollify
        echo "Production stack removed"
        ;;
    *)
        echo "Usage: $0 {dev|backend|frontend|staging|production}"
        echo "  dev/backend/frontend - Stop development servers"
        echo "  staging             - Stop Docker Compose"
        echo "  production          - Stop Docker Swarm stack"
        exit 1
        ;;
esac
