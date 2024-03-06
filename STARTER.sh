#!/bin/bash

cd /home/g1999emmenegger/vcid_yanik_emmenegger/autoupdater

# prüfe ob port 8000 frei ist, wenn nicht kill den Prozess
if [ "$(sudo fuser -n tcp 8000)" != "" ]; then
    sudo fuser -k 8000/tcp
fi

python3 -m venv venv
source venv/bin/activate
pip install gunicorn flask
# Start gunicorn with your Flask app
gunicorn -b :8000 app:app &

# Wait a bit for the server to start
sleep 5

# Make a POST request
curl -X POST http://localhost:8000

# You might want to add more commands here to manage the server process
# or to perform additional actions.
