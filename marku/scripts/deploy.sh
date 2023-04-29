#!/bin/bash

# Exit in case of error
set -e

# Stop the running containers
docker compose -f docker-compose.prod.yml down

# Pull the latest changes from Git
git pull

# Build and start the containers
docker compose -f docker-compose.prod.yml up -d --build

# Clean up unused containers and images
docker system prune -f
