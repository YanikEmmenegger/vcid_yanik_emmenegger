#!/bin/bash

# Dieses Skript wird auf dem Server ausgeführt, um den Service neu zu starten.

# Setzen Sie das erwartete Verzeichnis
EXPECTED_DIR="/home/g1999emmenegger/vcid_yanik_emmenegger"

# Aktuelles Verzeichnis prüfen und wechseln falls notwendig
if [ "$(pwd)" != "$EXPECTED_DIR" ]; then
    cd $EXPECTED_DIR
fi

# Pürfen ob .env existiert
if [ ! -f .env ]; then
    echo "Die .env Datei existiert nicht."
    exit 1
fi

# Sichern der .env Datei und boot.sh Berechtigungen
cp .env .env_backup
chmod_permissions=$(stat -c %a boot.sh)

# Git-Repository aktualisieren
git stash push --include-untracked
git pull
git stash pop

# Wiederherstellen der .env Datei und boot.sh Berechtigungen
mv .env_backup .env
chmod $chmod_permissions boot.sh

# Images neu erstellen
docker compose down --rmi all
docker compose up -d --build

# Lösche alle nicht verwendeten Docker-Images
echo "Lösche alle nicht verwendeten Docker-Images..."
docker image prune -a --force

echo "Vorgang abgeschlossen."
