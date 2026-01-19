#!/bin/bash

# FV Auto Importaciones - Quick Deployment Script
# This script deploys the application with a single command

set -e

echo "🚀 FV Auto Importaciones - Deployment Script"
echo "=============================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed"
    echo "Please install Docker Compose first: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env to set your production passwords!"
    echo "   Run: nano .env"
    echo ""
    read -p "Press Enter to continue with default settings (or Ctrl+C to edit .env first)..."
fi

echo "🔨 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🌐 Your application is now running at:"
echo "   - Frontend: http://$(hostname -I | awk '{print $1}'):4245"
echo "   - Backend API: http://$(hostname -I | awk '{print $1}'):4246/api"
echo ""
echo "📋 Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop app: docker-compose down"
echo "   - Restart: docker-compose restart"
echo ""
echo "📚 For more information, see README-DOCKER.md"
echo ""
