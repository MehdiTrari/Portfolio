# Mise en production du portfolio

Ce guide explique comment deployer le portfolio Next.js sur un VPS depuis GitHub, avec un nom de domaine, Docker, Nginx et HTTPS.

Le depot GitHub utilise dans les exemples est :

```bash
https://github.com/MehdiTrari/Portfolio.git
```

## Objectif final

A la fin, le site doit etre accessible publiquement sur une URL comme :

```text
https://mehditrari.com
```

ou :

```text
https://mehditrari.fr
```

Le serveur devra contenir :

- le code recupere depuis GitHub ;
- une image Docker de production ;
- un conteneur Next.js expose en local sur le port `3000` ;
- Nginx comme reverse proxy public ;
- un certificat HTTPS Let's Encrypt ;
- une procedure simple pour mettre a jour le site avec `git pull`.

## Choisir le nom de domaine

Tu as deja les domaines suivants pour ce projet :

- `mehditrari.com` : meilleur choix principal, clair, professionnel, facile a associer a ton nom.
- `mehditrari.fr` : bon domaine secondaire pour le marche francais.
- `mehditrari.org` : utile si tu veux aussi proteger la marque, mais pas necessaire pour le portfolio.
- `mehditrari.store` : peu pertinent pour ce portfolio, a garder seulement en reserve.

Recommandation :

```text
Utiliser mehditrari.com comme domaine canonique.
Rediriger mehditrari.fr vers mehditrari.com.
Laisser mehditrari.org et mehditrari.store hors scope pour le premier deploiement.
```

## Pre-requis

Tu dois avoir :

- un VPS actif ;
- une adresse IPv4 publique du VPS, par exemple `123.123.123.123` ;
- un acces SSH au VPS ;
- un utilisateur avec droits `sudo` ;
- le depot GitHub contenant le projet ;
- un nom de domaine si tu veux une URL propre ;
- Docker et Docker Compose installes sur le VPS ;
- Nginx installe sur le VPS ;
- Certbot installe sur le VPS pour HTTPS.

Dans ce guide, les exemples utilisent :

```text
Utilisateur SSH : ubuntu
IP du VPS       : 123.123.123.123
Domaine         : mehditrari.com
Projet serveur  : /var/www/portfolio
Port app local  : 3000
```

Remplace ces valeurs par les tiennes.

## Connexion SSH au VPS

Depuis ton PC :

```bash
ssh ubuntu@123.123.123.123
```

Si ton fournisseur VPS t'a donne un autre utilisateur, par exemple `root` :

```bash
ssh root@123.123.123.123
```

Si tu utilises une cle SSH specifique :

```bash
ssh -i ~/.ssh/ma_cle ubuntu@123.123.123.123
```

## Preparation du serveur

Sur le VPS, mets les paquets a jour :

```bash
sudo apt update
sudo apt upgrade -y
```

Installe les outils de base :

```bash
sudo apt install -y git curl ca-certificates nginx certbot python3-certbot-nginx
```

Docker doit aussi etre installe. Si ton VPS ne l'a pas encore, suis la documentation officielle Docker pour ta distribution.

Verifie ensuite :

```bash
docker --version
docker compose version
nginx -v
git --version
```

## Pare-feu

Si tu utilises `ufw`, autorise SSH, HTTP et HTTPS :

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

Ports importants :

- `22` : SSH ;
- `80` : HTTP, necessaire pour la validation Let's Encrypt ;
- `443` : HTTPS ;
- `3000` : port interne de l'application, idealement non expose publiquement.

## Configuration DNS du domaine

Chez ton registrar, configure les entrees DNS.

Pour le domaine principal :

```text
Type : A
Nom  : @
Valeur : IP_DU_VPS
TTL : Auto ou 3600
```

Exemple :

```text
Type : A
Nom  : @
Valeur : 123.123.123.123
```

Pour `www` :

```text
Type : CNAME
Nom  : www
Valeur : mehditrari.com
```

Si ton VPS a une IPv6, tu peux aussi ajouter :

```text
Type : AAAA
Nom  : @
Valeur : IPv6_DU_VPS
```

Attends ensuite la propagation DNS. Cela peut prendre quelques minutes, parfois plusieurs heures.

Tu peux tester depuis ton PC :

```bash
nslookup mehditrari.com
nslookup www.mehditrari.com
```

L'IP retournee doit etre celle du VPS.

## Recuperer le projet depuis GitHub

Sur le VPS :

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone https://github.com/MehdiTrari/Portfolio.git portfolio
cd portfolio
```

Si le depot devient prive plus tard, il faudra utiliser une cle SSH GitHub ou un token d'acces personnel.

Pour verifier :

```bash
git status
git remote -v
```

## Fichier Docker Compose de production

Le fichier `docker-compose.yml` actuel est oriente developpement, car il utilise :

```yaml
target: dev
```

En production, il faut utiliser le stage `runner` du `Dockerfile`.

Le depot contient deja un fichier `docker-compose.prod.yml`.

Contenu recommande :

```yaml
services:
  portfolio:
    build:
      context: .
      target: runner
    container_name: portfolio
    restart: unless-stopped
    ports:
      - "127.0.0.1:3000:3000"
    environment:
      NODE_ENV: production
      NEXT_TELEMETRY_DISABLED: "1"
      NEXT_PUBLIC_SITE_URL: "https://mehditrari.com"
```

Le port est lie a `127.0.0.1` pour eviter d'exposer directement Next.js sur Internet. Nginx sera le seul point d'entree public.

## Premier lancement de l'application

Depuis `/var/www/portfolio` :

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Verifie que le conteneur tourne :

```bash
docker ps
```

Teste localement sur le VPS :

```bash
curl -I http://127.0.0.1:3000
```

Tu dois obtenir une reponse HTTP, par exemple `200 OK` ou une redirection.

Voir les logs :

```bash
docker logs -f portfolio
```

## Configuration Nginx

Le depot contient deja un template de depart dans `infra/nginx/portfolio.http.conf`.

Cree une configuration Nginx :

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Contenu initial pour `mehditrari.com` et `mehditrari.fr` :

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name mehditrari.com www.mehditrari.com mehditrari.fr www.mehditrari.fr;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Active le site :

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
```

Si le site par defaut Nginx est encore actif, tu peux le desactiver :

```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

Teste la configuration :

```bash
sudo nginx -t
```

Recharge Nginx :

```bash
sudo systemctl reload nginx
```

A ce stade, si le DNS pointe deja vers le VPS, le site doit repondre en HTTP :

```text
http://mehditrari.com
```

## Activer HTTPS avec Let's Encrypt

Quand le DNS est bien propage et que HTTP fonctionne :

```bash
sudo certbot --nginx -d mehditrari.com -d www.mehditrari.com -d mehditrari.fr -d www.mehditrari.fr
```

Certbot va :

- demander une adresse email ;
- proposer d'accepter les conditions ;
- modifier la configuration Nginx ;
- installer le certificat HTTPS ;
- configurer le renouvellement automatique.

Teste le renouvellement :

```bash
sudo certbot renew --dry-run
```

Verifie ensuite :

```text
https://mehditrari.com
```

## Redirection www vers domaine principal

Apres Certbot, tu peux garder `www.mehditrari.com` fonctionnel.

Recommandation SEO :

```text
Garder mehditrari.com comme domaine canonique.
Rediriger www.mehditrari.com vers mehditrari.com.
Rediriger aussi mehditrari.fr et www.mehditrari.fr vers mehditrari.com.
```

Une configuration Nginx possible :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name mehditrari.com www.mehditrari.com mehditrari.fr www.mehditrari.fr;
    return 301 https://mehditrari.com$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.mehditrari.com mehditrari.fr www.mehditrari.fr;

    ssl_certificate /etc/letsencrypt/live/mehditrari.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mehditrari.com/privkey.pem;

    return 301 https://mehditrari.com$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name mehditrari.com;

    ssl_certificate /etc/letsencrypt/live/mehditrari.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mehditrari.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Attention : Certbot genere souvent lui-meme une partie de la configuration SSL. Ne remplace pas a l'aveugle une configuration qui fonctionne deja. Fais toujours :

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Mettre a jour le site depuis GitHub

Quand tu modifies le site sur ton PC :

```bash
git add .
git commit -m "message du changement"
git push
```

Puis sur le VPS :

```bash
cd /var/www/portfolio
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

Nettoyer les anciennes images Docker si besoin :

```bash
docker image prune -f
```

## Script de deploiement simple

Le depot contient deja un script `deploy.sh` pour eviter de retaper les commandes.

Contenu :

```bash
#!/usr/bin/env bash
set -euo pipefail

cd /var/www/portfolio
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
docker image prune -f
```

Rends-le executable :

```bash
chmod +x /var/www/portfolio/deploy.sh
```

Utilisation :

```bash
/var/www/portfolio/deploy.sh
```

## Variables d'environnement

Pour l'instant, le portfolio ne semble pas avoir besoin de variables secretes.

Si tu ajoutes plus tard des variables, cree un fichier `.env.production` sur le VPS, mais ne le commit jamais dans GitHub.

Exemple :

```bash
nano /var/www/portfolio/.env.production
```

Puis adapte le `docker-compose.prod.yml` :

```yaml
services:
  portfolio:
    build:
      context: .
      target: runner
    container_name: portfolio
    restart: unless-stopped
    ports:
      - "127.0.0.1:3000:3000"
    env_file:
      - .env.production
    environment:
      NODE_ENV: production
      NEXT_TELEMETRY_DISABLED: "1"
```

## Sauvegardes

Le portfolio est majoritairement statique. La sauvegarde principale est le depot GitHub.

Elements a conserver :

- le depot GitHub ;
- les fichiers non commit sur le VPS, par exemple `.env.production` si tu en ajoutes un ;
- la configuration Nginx ;
- les certificats Let's Encrypt, meme s'ils peuvent etre regeneres.

Commandes utiles :

```bash
sudo cp /etc/nginx/sites-available/portfolio /var/www/portfolio/nginx-portfolio.backup
```

## Verification apres mise en production

Checklist :

- le domaine pointe vers l'IP du VPS ;
- `http://mehditrari.com` repond ;
- `https://mehditrari.com` repond ;
- `www.mehditrari.com` redirige correctement ;
- `mehditrari.fr` redirige correctement ;
- le cadenas HTTPS est visible dans le navigateur ;
- `docker ps` montre le conteneur `portfolio` actif ;
- `docker logs portfolio` ne montre pas d'erreur bloquante ;
- `sudo nginx -t` retourne `syntax is ok` ;
- `sudo certbot renew --dry-run` fonctionne ;
- le site est responsive sur mobile ;
- les liens GitHub, LinkedIn et email fonctionnent.

## Commandes de diagnostic

Etat du conteneur :

```bash
docker ps
docker logs -f portfolio
```

Redemarrer l'application :

```bash
docker restart portfolio
```

Reconstruire l'application :

```bash
cd /var/www/portfolio
docker compose -f docker-compose.prod.yml up -d --build
```

Etat Nginx :

```bash
sudo systemctl status nginx
sudo nginx -t
sudo journalctl -u nginx -n 100 --no-pager
```

Tester le port local :

```bash
curl -I http://127.0.0.1:3000
```

Tester le domaine :

```bash
curl -I http://mehditrari.com
curl -I https://mehditrari.com
```

Verifier le DNS :

```bash
nslookup mehditrari.com
nslookup www.mehditrari.com
```

## Problemes courants

### Le domaine ne pointe pas vers le VPS

Verifie les entrees DNS chez le registrar.

Commande :

```bash
nslookup mehditrari.com
```

Si l'IP n'est pas celle du VPS, attends la propagation ou corrige l'entree `A`.

### Certbot echoue

Ca arrive souvent si :

- le DNS ne pointe pas encore vers le VPS ;
- le port `80` est bloque ;
- Nginx ne repond pas correctement ;
- le `server_name` ne correspond pas au domaine.

Verifie :

```bash
sudo nginx -t
sudo systemctl status nginx
curl -I http://mehditrari.com
```

### Le site marche sur le port 3000 mais pas sur le domaine

Le probleme vient probablement de Nginx ou du DNS.

Verifie :

```bash
curl -I http://127.0.0.1:3000
sudo nginx -t
sudo systemctl reload nginx
```

### Le conteneur ne demarre pas

Voir les logs :

```bash
docker logs portfolio
```

Reconstruire :

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Git pull demande un mot de passe

Si le depot est public, utilise l'URL HTTPS :

```bash
git remote set-url origin https://github.com/MehdiTrari/Portfolio.git
```

Si le depot est prive, configure une cle SSH GitHub :

```bash
ssh-keygen -t ed25519 -C "vps-portfolio"
cat ~/.ssh/id_ed25519.pub
```

Ajoute ensuite la cle publique dans GitHub, puis utilise :

```bash
git remote set-url origin git@github.com:MehdiTrari/Portfolio.git
```

Teste :

```bash
ssh -T git@github.com
git pull origin main
```

## Procedure complete resumee

Sur le VPS :

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git curl ca-certificates nginx certbot python3-certbot-nginx

sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone https://github.com/MehdiTrari/Portfolio.git portfolio
cd portfolio

nano docker-compose.prod.yml
docker compose -f docker-compose.prod.yml up -d --build

sudo nano /etc/nginx/sites-available/portfolio
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

sudo certbot --nginx -d mehditrari.com -d www.mehditrari.com -d mehditrari.fr -d www.mehditrari.fr
sudo certbot renew --dry-run
```

Pour chaque mise a jour :

```bash
cd /var/www/portfolio
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

## Notes importantes

- Ne mets jamais de secret dans GitHub.
- Le fichier `docker-compose.yml` du projet sert au developpement local.
- Pour la production, utilise `docker-compose.prod.yml`.
- Garde le domaine principal stable pour ton CV et LinkedIn.
- Si tu possedes plusieurs domaines, choisis un domaine canonique et redirige les autres vers celui-ci.
- Pour un portfolio personnel, `mehditrari.com` est le choix le plus propre.
