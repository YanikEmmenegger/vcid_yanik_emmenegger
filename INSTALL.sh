#!/bin/bash

# Update Package List
sudo apt update

# Installiere notwendige Pakete
sudo apt install -y git docker docker-compose python3-pip certbot
sudo apt-get install apt-utils
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt -y install docker-compose-plugin
sudo apt-get -y install docker-compose-plugin
sudo usermod -aG docker $USER

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
sudo certbot certonly --standalone -d $DOMAIN -v

# Anpassen der NGINX-Konfiguration mit der tatsächlichen Domain
NGINX_CONF_PATH="./nginx/nginx.conf" # Pfad zur NGINX-Konfigurationsdatei anpassen
#sudo sed -i "s|ssl_certificate /etc/letsencrypt/live/DEINE_DOMAIN/fullchain.pem;|ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;|g" $NGINX_CONF_PATH
#sudo sed -i "s|ssl_certificate_key /etc/letsencrypt/live/DEINE_DOMAIN/privkey.pem;|ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;|g" $NGINX_CONF_PATH
# Ändere die Domain in der NGINX-Konfiguration überall wo DOMAIN_NAME steht
sudo sed -i "s|DOMAIN_NAME|$DOMAIN|g" $NGINX_CONF_PATH
# Frage nach Supabase URL und Key
read -p "Bitte geben Sie Ihre Supabase URL ein: " SUPABASE_URL
read -p "Bitte geben Sie Ihren Supabase Key ein: " SUPABASE_KEY

# Speichere diese in einer .env-Datei
echo "SUPABASE_URL=$SUPABASE_URL" > .env
echo "SUPABASE_KEY=$SUPABASE_KEY" >> .env

# passe die datei autoupdater/boot.sh an, damit sie das richtige Verzeichnis erwartet PFAD_ANPASSEN_INSTALLER ersetzen mit pwd
sed -i "s|PFAD_ANPASSEN_INSTALLER|$(pwd)|g" autoupdater/boot.sh

# Wechsle ins Verzeichnis autoupdater und setze Umgebung auf
cd autoupdater
sudo apt install -y python3.11-venv
python3 -m venv venv
source venv/bin/activate
pip install gunicorn flask

# Wechsle Verzeichnis zurück und führe STARTER.sh aus
echo "Installation abgeschlossen. Bitte logge dich aus und wieder ein, um die Docker-Gruppe zu aktualisieren."
echo "Führe ./STARTER.sh aus, um die Anwendung zu starten."

