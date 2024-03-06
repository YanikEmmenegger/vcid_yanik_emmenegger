#!/bin/bash

# Stelle sicher, dass Skript als root ausgeführt wird


# Update Package List
sudo apt update

# Installiere notwendige Pakete
sudo apt install -y git docker docker-compose pip certbot python3-certbot-nginx

# Mache Skripts ausführbar
chmod +x ./boot.sh
chmod +x ./autoupdater/boot.sh
chmod +x ./STARTER.sh

# Frage den Benutzer nach der Domain
read -p "Bitte geben Sie Ihre Domain ein: " DOMAIN

# Führe den Certbot Befehl aus
sudo certbot --nginx -d $DOMAIN

# Anpassen der nginx Konfiguration
sudo sed -i "s|ssl_certificate /etc/letsencrypt/live/DEINE_DOMAIN/fullchain.pem;|ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;|" ./nginx/nginx.conf
sudo sed -i "s|ssl_certificate_key /etc/letsencrypt/live/DEINE_DOMAIN/privkey.pem;|ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;|" ./nginx/nginx.conf

# Frage nach Supabase URL und Key
read -p "Bitte geben Sie Ihre Supabase URL ein: " SUPABASE_URL
read -p "Bitte geben Sie Ihren Supabase Key ein: " SUPABASE_KEY

# Speichere diese in einer .env-Datei
echo "SUPABASE_URL=$SUPABASE_URL" > .env
echo "SUPABASE_KEY=$SUPABASE_KEY" >> .env

# Wechsle ins Verzeichnis autoupdater und setze Umgebung auf
cd autoupdater
python3 -m venv venv
source venv/bin/activate
pip install gunicorn flask

# Wechsle Verzeichnis zurück und führe STARTER.sh aus
cd ..
./STARTER.sh

