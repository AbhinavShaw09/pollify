#!/bin/bash

echo "🔍 Debugging Pollify Docker Swarm deployment..."

echo "📊 Stack Status:"
docker stack ps pollify

echo ""
echo "🌐 Networks:"
docker network ls | grep pollify

echo ""
echo "🔧 Services with Replicas:"
docker stack services pollify

echo ""
echo "📍 Replica Distribution:"
docker stack ps pollify --format "table {{.Name}}\t{{.Node}}\t{{.CurrentState}}\t{{.Error}}"

echo ""
echo "📝 Backend Logs (last 20 lines):"
docker service logs --tail 20 pollify_backend

echo ""
echo "📝 Frontend Logs (last 20 lines):"
docker service logs --tail 20 pollify_frontend

echo ""
echo "🧪 Testing Backend Health:"
curl -f http://localhost:8000/docs > /dev/null 2>&1 && echo "✅ Backend is responding" || echo "❌ Backend is not responding"

echo ""
echo "🧪 Testing Frontend:"
curl -f http://localhost:3000 > /dev/null 2>&1 && echo "✅ Frontend is responding" || echo "❌ Frontend is not responding"

echo ""
echo "🔧 Load Balancer Test (5 requests to backend):"
for i in {1..5}; do
  echo "Request $i: $(curl -s http://localhost:8000/docs | grep -o '<title>.*</title>' || echo 'Failed')"
done

echo ""
echo "📊 Resource Usage:"
docker system df
