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
# Verwenden Sie die --exclude Option, um .env vor dem Löschen zu schützen
git clean -fdx --exclude=.env
# exclude auch boot.sh
git clean -fdx --exclude=boot.sh
git pull


# Images neu erstellen
docker compose down --rmi all
docker compose up -d --build

# Lösche alle nicht verwendeten Docker-Images
echo "Lösche alle nicht verwendeten Docker-Images..."
docker image prune -a --force

echo "Vorgang abgeschlossen."

