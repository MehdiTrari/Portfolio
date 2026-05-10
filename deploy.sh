#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/var/www/portfolio"
COMPOSE_FILE="docker-compose.prod.yml"

cd "$PROJECT_DIR"
git pull origin main
docker compose -f "$COMPOSE_FILE" up -d --build
docker image prune -f
