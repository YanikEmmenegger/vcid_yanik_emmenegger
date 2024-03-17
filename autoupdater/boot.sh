#!/bin/bash

# Dieses Skript wird auf dem Server ausgeführt, um den Service zu aktualisieren und neu zu starten.

# Setze den erwarteten Pfad zu deinem Projekt
EXPECTED_DIR="PFAD_ANPASSEN_INSTALLER"

# Wechsle zum erwarteten Verzeichnis, falls nicht bereits dort
if [ "$(pwd)" != "$EXPECTED_DIR" ]; then
    cd $EXPECTED_DIR || exit
fi

# Überprüfe die Existenz der .env Datei
if [ ! -f .env ]; then
    echo "Die .env Datei existiert nicht."
    exit 1
fi

# Sichere die .env Datei
cp .env .env_backup

# Aktualisiere das Git-Repository
git stash push --include-untracked
git pull
git stash pop

# Stelle die .env Datei und Berechtigungen wieder her
mv .env_backup .env
chmod +x STARTER.sh
chmod +x autoupdater/boot.sh

# Führe die Tests aus
echo "Führe Tests aus..."
python3 -m unittest discover tests

# Prüfe den Exit-Code der Tests
if [ $? -eq 0 ]; then
    echo "Tests erfolgreich. Führe Deployment aus..."

    # Images neu erstellen und starten
    docker compose down --rmi all
    docker compose up -d --build

    # Lösche alle nicht verwendeten Docker-Images
    echo "Lösche alle nicht verwendeten Docker-Images..."
    docker image prune -a --force

    echo -e "\e[32mApplication wurde aktualisiert und neu gestartet.\e[0m"
else
    echo "Tests fehlgeschlagen. Abbruch des Deployments."
    exit 1
fi
exit 0