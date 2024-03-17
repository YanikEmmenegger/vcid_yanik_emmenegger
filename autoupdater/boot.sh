#!/bin/bash

# Dieses Skript wird auf dem Server ausgeführt, um den Service neu zu starten.

# Setzen Sie das erwartete Verzeichnis
EXPECTED_DIR=PFAD_ANPASSEN_INSTALLER

# Aktuelles Verzeichnis prüfen und wechseln falls notwendig
if [ "$(pwd)" != "$EXPECTED_DIR" ]; then
    cd $EXPECTED_DIR
fi

# Prüfen ob .env existiert
if [ ! -f .env ]; then
    echo "Die .env Datei existiert nicht."
    exit 1
fi

cp .env .env_backup

# Git-Repository aktualisieren
git stash push --include-untracked
git pull
git stash pop

# Wiederherstellen der .env Datei und boot.sh Berechtigungen
mv .env_backup .env
chmod +x STARTER.sh
chmod +x autoupdater/boot.sh

# Tests ausführen
python3 -m unittest discover -s tests
# Prüfen ob Tests erfolgreich waren
if [ $? -ne 0 ]; then
    echo "Tests fehlgeschlagen. Abbruch."
    exit 1
fi

# Images neu erstellen
docker compose down --rmi all
docker compose up -d --build

# Lösche alle nicht verwendeten Docker-Images
echo "Lösche alle nicht verwendeten Docker-Images..."
docker image prune -a --force

echo -e "\e[32m\nApplication wurde aktualisiert und neu gestartet !!.\e[0m"
exit 0
