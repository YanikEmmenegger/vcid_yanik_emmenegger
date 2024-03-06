#!/bin/sh

# Setze deine Domain und E-Mail
DOMAIN="vcid.yanik.pro"
EMAIL="deine@email.de"

# Prüfe, ob Zertifikate bereits existieren und erstelle oder erneuere sie
if [ ! -e "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    certbot certonly --webroot -w /var/www/html -d $DOMAIN --email $EMAIL --agree-tos --no-eff-email
else
    certbot renew
fi

# Ersetze DEINE_DOMAIN in der NGINX-Konfiguration durch die tatsächliche Domain
sed -i "s/DEINE_DOMAIN/$DOMAIN/g" /etc/nginx/conf.d/nginx.conf

# Starte NGINX im Vordergrund
nginx -g 'daemon off;'
