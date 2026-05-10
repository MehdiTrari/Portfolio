#!/bin/bash

set -e

echo "=== Début du déploiement Portfolio ==="

cd /var/www/portfolio

echo "=== Récupération du code ==="
git fetch origin main
git reset --hard origin/main

echo "=== Build Docker ==="
docker build -t portfolio .

echo "=== Redémarrage du conteneur ==="
docker stop portfolio || true
docker rm portfolio || true

docker run -d \
  --name portfolio \
  --restart unless-stopped \
  -p 3000:3000 \
  portfolio

echo "=== Vérification Docker ==="
docker ps --filter "name=portfolio"

echo "=== Attente du démarrage de l'app ==="
sleep 5

echo "=== Vérification HTTP locale ==="
for i in {1..10}; do
  if curl -I http://127.0.0.1:3000; then
    echo "App disponible"
    break
  fi

  echo "App pas encore prête, tentative $i/10..."
  sleep 3
done

echo "=== Vérification Nginx ==="
sudo nginx -t
sudo systemctl reload nginx

echo "=== Déploiement terminé avec succès ==="