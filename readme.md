# VCID App Anleitung

Dieses Dokument beschreibt, wie du die VCID App auf deinem Server einrichtest und betreibst.

## Vorbedingungen

Stelle sicher, dass `git`, `docker`, `docker-compose` und `pip` auf deinem Server installiert sind.

## Boot-Script ausführbar machen

Um das Boot-Script ausführbar zu machen, navigiere im Terminal zu deinem Repository-Verzeichnis und führe folgenden Befehl aus:

```bash
chmod +x boot.sh
```
## Zertifikate erstellen

Falls HTTPS-Zertifikate für vcid.yanik.pro (verknüpfte domain mit vm) noch nicht vorhanden sind, kannst du sie mit certbot erstellen. Führe die folgenden Befehle aus, um certbot zu installieren und die Zertifikate zu erstellen:
!!! Achtung: App muss über https erreichbar sein, da sonst gewisse Funktionen nicht funktionieren. Falls https nicht möglich ist, müssen die Cookie Settings in der Flask App angepasst werden. !!!
Entweder die .env Datei erweitern mit ENVIRONMENT=dev oder in der App die Cookie Settings anpassen.
```pyhton app.py
conf = {
        'secure': False,
        'samesite': None
    }
```

    
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d vcid.yanik.pro (eigene domain)
```
## Nginx Konfiguration anpassen
setze unter nginx/nginx.conf die korrekten Pfade für ssl_certificate und ssl_certificate_key:
```bash
ssl_certificate /etc/letsencrypt/live/DEINE_DOMAIN/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/DEINE_DOMAIN/privkey.pem;
```

## .env Datei erstellen

Erstelle eine .env Datei im Root-Verzeichnis des Projekts, um deine Supabase-Konfigurationen zu speichern. Die Datei sollte folgende Umgebungsvariablen beinhalten:
    
```bash
SUPABASE_URL=deine_supabase_url
SUPABASE_KEY=dein_supabase_key
```
Ersetze deine_supabase_url und dein_supabase_key mit deinen tatsächlichen Supabase-URL und Key.

## App starten
Um die App zu starten, führe das Boot-Script aus:
    
```bash
./boot.sh
```
Script holt sich die neuste Version von vcid und startet die App.

## Zusatz -> Auto Update wenn neuste Version verfügbar auf Github

unter autoupdater/ befindet sich eine weitere Flask app. Diese dient als Webhook für Github.

```bash
cd autoupdater
python3 -m venv venv
source venv/bin/activate
pip install gunicorn
pip install flask
```
Webhook app starten: 
```bash
gunicorn -w 4 app:app -b 0.0.0.0:8000
```

Webhook in Github einrichten:
.github/workflows/push.yml -> Domain anpassen
```bash
    steps:
    - name: Call webhook
      run: |
        curl -X POST http://vcid.yanik.pro:8000
```



