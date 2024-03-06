# Verwenden Sie das offizielle Nginx-Image als Basis
FROM nginx:alpine

# Installieren Sie notwendige Pakete
RUN apk add --no-cache certbot

# Entfernen Sie die Standard-Nginx-Konfigurationsdateien
RUN rm /etc/nginx/conf.d/default.conf

# Kopieren Sie die benutzerdefinierte Nginx-Konfigurationsdatei in das Image
COPY nginx.conf /etc/nginx/conf.d/

# Kopiere das Startup-Skript in den Container
COPY start-nginx.sh /start-nginx.sh

# Mach das Startup-Skript ausführbar
RUN chmod +x /start-nginx.sh

# Starte NGINX über das Startup-Skript
CMD ["/start-nginx.sh"]