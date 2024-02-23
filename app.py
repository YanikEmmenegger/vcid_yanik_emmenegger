from flask import Flask, send_from_directory, redirect
import os
from flask_cors import CORS
from routes.auth import create_auth_blueprint
from supabase import create_client, Client
from dotenv import load_dotenv
# Importiere zusätzliche benötigte Module
from routes.avatar import create_avatar_blueprint
from routes.post import create_post_blueprint
from routes.profile import create_profile_blueprint
from routes.user import create_user_blueprint

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__, static_url_path='', static_folder='app')
# Konfiguriere CORS für Anfragen von localhost:3000
CORS(app, supports_credentials=True, resources={
    r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}
})

auth_blueprint = create_auth_blueprint(supabase)
app.register_blueprint(auth_blueprint, url_prefix='/api/auth')

user_blueprint = create_user_blueprint(supabase)
app.register_blueprint(user_blueprint, url_prefix='/api/user')

post_blueprint = create_post_blueprint(supabase)
app.register_blueprint(post_blueprint, url_prefix='/api/post')

profile_blueprint = create_profile_blueprint(supabase)
app.register_blueprint(profile_blueprint, url_prefix='/api/profile')

avatar_blueprint = create_avatar_blueprint(supabase)
app.register_blueprint(avatar_blueprint, url_prefix='/api/avatar')


# Route zum Servieren der React-App-Dateien
@app.route('/app/<path:path>')
def serve_app(path):
    return send_from_directory('app', path)


@app.route('/app/', defaults={'path': ''})
@app.route('/app/<path:path>')
def catch_all(path):
    if path != "" and os.path.exists("app/" + path):
        return send_from_directory('app', path)
    else:
        return send_from_directory('app', 'index.html')


# Neue Route für die Weiterleitung von / zu /app
@app.route('/')
def redirect_to_app():
    return redirect('/app/', code=302)


if __name__ == '__main__':
    app.run(debug=True)
