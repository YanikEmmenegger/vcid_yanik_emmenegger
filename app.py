from flask import Flask, send_from_directory, jsonify, redirect
import os
from flask_cors import CORS
from routes.auth import create_auth_blueprint
from supabase import create_client, Client
from dotenv import load_dotenv
from routes.avatar import create_avatar_blueprint
from routes.post import create_post_blueprint
from routes.profile import create_profile_blueprint
from routes.user import create_user_blueprint

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__, static_url_path='', static_folder='react/build')
# Konfiguriere CORS für Anfragen von localhost:3000
CORS(app, supports_credentials=True, resources={
    r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000", 'http://127.0.0.1:5000']}
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


@app.route('/')
def redirect_root_to_app():
    return redirect('/app/', code=302)


# Angepasste Route zum Servieren der React-App-Dateien für /app und darunter liegende Pfade
@app.route('/app/', defaults={'path': 'index.html'})
@app.route('/app/<path:path>')
def serve_app(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True)

