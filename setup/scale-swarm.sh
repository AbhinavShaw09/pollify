#!/bin/bash

show_help() {
    echo "🔧 Pollify Docker Swarm Scaling Tool"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --all N          Scale both services to N replicas"
    echo "  --backend N      Scale backend to N replicas"
    echo "  --frontend N     Scale frontend to N replicas"
    echo "  --status         Show current service status"
    echo "  --help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --all 5                    # Scale both to 5 replicas"
    echo "  $0 --backend 3 --frontend 2   # Scale backend to 3, frontend to 2"
    echo "  $0 --status                   # Show current status"
}

show_status() {
    echo "📊 Current Service Status:"
    docker stack services pollify
    echo ""
    echo "📍 Replica Distribution:"
    docker stack ps pollify --format "table {{.Name}}\t{{.Node}}\t{{.CurrentState}}"
}

scale_service() {
    local service=$1
    local replicas=$2
    
    echo "🔄 Scaling $service to $replicas replicas..."
    docker service scale pollify_$service=$replicas
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --all)
            BACKEND_REPLICAS="$2"
            FRONTEND_REPLICAS="$2"
            shift 2
            ;;
        --backend)
            BACKEND_REPLICAS="$2"
            shift 2
            ;;
        --frontend)
            FRONTEND_REPLICAS="$2"
            shift 2
            ;;
        --status)
            show_status
            exit 0
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            echo "❌ Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Check if stack exists
if ! docker stack ls | grep -q pollify; then
    echo "❌ Pollify stack not found. Please start it first with:"
    echo "   ./setup/start-swarm.sh"
    exit 1
fi

# Scale services if requested
if [[ -n "$BACKEND_REPLICAS" ]]; then
    scale_service "backend" "$BACKEND_REPLICAS"
fi

if [[ -n "$FRONTEND_REPLICAS" ]]; then
    scale_service "frontend" "$FRONTEND_REPLICAS"
fi

# Show status if scaling was performed
if [[ -n "$BACKEND_REPLICAS" || -n "$FRONTEND_REPLICAS" ]]; then
    echo ""
    echo "⏳ Waiting for scaling to complete..."
    sleep 5
    show_status
fi

# Show help if no arguments provided
if [[ $# -eq 0 ]]; then
    show_help
fi
