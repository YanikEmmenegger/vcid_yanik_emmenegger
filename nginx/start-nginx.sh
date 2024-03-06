#!/bin/sh

# Festlegen der Domain und E-Mail
DOMAIN="vcid.yanik.pro"
EMAIL="deine@email.de" # Ersetze dies durch deine tatsächliche E-Mail-Adresse

# Stelle sicher, dass das Webroot-Verzeichnis existiert
mkdir -p /var/www/html

# Prüfe, ob Zertifikate bereits existieren und erstelle oder erneuere sie
if [ ! -e "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    certbot certonly --webroot -w /var/www/html -d $DOMAIN --email $EMAIL --agree-tos --no-eff-email
else
    certbot renew
fi

# Ersetze vcid.yanik.pro in der NGINX-Konfiguration
sed -i "s/vcid.yanik.pro/$DOMAIN/g" /etc/nginx/conf.d/*.conf

# Starte NGINX im Vordergrund
nginx -g 'daemon off;'
