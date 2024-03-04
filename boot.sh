#!/bin/bash

# Dieses Skript wird auf dem Server ausgeführt, um den Service neu zu starten.

# Setzen Sie das erwartete Verzeichnis
EXPECTED_DIR="/home/g1999emmenegger/vcid_yanik_emmenegger"

# Aktuelles Verzeichnis prüfen und wechseln falls notwendig
if [ "$(pwd)" != "$EXPECTED_DIR" ]; then
    cd $EXPECTED_DIR
fi

# prüfe ob .env Datei existiert
if [ ! -f .env ]; then
    echo "Die .env Datei existiert nicht. Erstelle eine neue .env Datei."
    exit 1
fi

# Aktualisiere das Repository und überschreibe lokale Änderungen
echo "Aktualisiere das Repository und überschreibe lokale Änderungen..."
git fetch --all
git reset --hard origin/master
git clean -fdx


# Änderungen außerhalb des "react" Ordners prüfen
if git status --porcelain | grep -v "^?? react/" | grep .; then
    echo "Änderungen außerhalb des 'react' Ordners erkannt. Erstelle ein neues Docker-Image."
    docker build -t vcid .
else
    echo "Keine Änderungen außerhalb des 'react' Ordners erkannt. Überspringe das Erstellen eines neuen Docker-Images."
fi


# Docker Compose zum Neustarten des Services verwenden
echo "Starte den Service neu..."
docker compose down && docker compose up -d

# Lösche alle nicht verwendeten Docker-Images
echo "Lösche alle nicht verwendeten Docker-Images..."
docker image prune -a --force

echo "Vorgang abgeschlossen."

