#!/bin/bash

echo "Setting up development environment..."

# Setup backend
echo "Installing backend dependencies..."
cd backend
if command -v poetry &> /dev/null; then
    poetry install
else
    pip3 install fastapi uvicorn sqlalchemy pydantic python-jose[cryptography] passlib[bcrypt] python-multipart
fi

# Setup frontend
echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo "Development setup complete!"
echo "Run ./local-setup/dev-start.sh to start both servers"
