#!/bin/bash

# Update Package List
sudo apt update

# Installiere notwendige Pakete
sudo apt install -y git docker docker-compose python3-pip certbot

# Mache Skripts ausführbar
chmod +x ./boot.sh
chmod +x ./autoupdater/boot.sh
chmod +x ./STARTER.sh

# Frage den Benutzer nach der Domain
read -p "Bitte geben Sie Ihre Domain ein: " DOMAIN

# Stelle sicher, dass Port 80 verfügbar ist
echo "Stelle sicher, dass Port 80 frei ist für die Certbot-Validierung"
sudo fuser -k 80/tcp

# Führe den Certbot Befehl im Standalone-Modus aus
sudo certbot certonly --standalone -d $DOMAIN

# Anpassen der NGINX-Konfiguration mit der tatsächlichen Domain
NGINX_CONF_PATH="./nginx/nginx.conf" # Pfad zur NGINX-Konfigurationsdatei anpassen
sudo sed -i "s|ssl_certificate /etc/letsencrypt/live/DEINE_DOMAIN/fullchain.pem;|ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;|g" $NGINX_CONF_PATH
sudo sed -i "s|ssl_certificate_key /etc/letsencrypt/live/DEINE_DOMAIN/privkey.pem;|ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;|g" $NGINX_CONF_PATH

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
