# VCID App Anleitung

Dieses Dokument beschreibt, wie du die VCID App auf deinem Server einrichtest und betreibst.

## Voraussetzungen
```bash
# Installiere Git
sudo apt install -y git
```
Klonen des Repositories
```bash
git clone https://github.com/YanikEmmenegger/vcid_yanik_emmenegger.git
```
A-Record für die Domain auf die IP-Adresse des Servers zeigen lassen.

## Installation
```bash
# In verzeichnis wechseln
cd vcid_yanik_emmenegger
# Installer ausführbar machen
chmod +x INSTALL.sh
# Installer ausführen
./INSTALL.sh
```
Anweisung vom Installer folgen.

## App Starten
```bash
# In verzeichnis wechseln
cd vcid_yanik_emmenegger
# App starten
./STARTER.sh
```
Dies Startet den Nginx und Flask Container sowie eine weitere Flask-App auf dem Port 8000.
ein POST-Requst auf http://localhost:8000/ löst ein rebuild der App mit der neusten Version aus.

Dies kann in einer GitHub Action genutzt werden um die App automatisch zu aktualisieren, sobald ein Master Push stattfindet:
.github/workflows/push.yml
```yaml
name: Call Webhook on Push to Master

on:
  push:
    branches:
      - master

jobs:
  call-webhook:
    runs-on: ubuntu-latest

    steps:
    - name: Call webhook
      run: |
        curl -X POST http://DEINE_URL:8000
```
