from flask import Flask
from flask_cors import CORS
from routes.auth import create_auth_blueprint
from supabase import create_client, Client
from dotenv import load_dotenv
import os

from routes.post import create_post_blueprint
from routes.profile import create_profile_blueprint
from routes.user import create_user_blueprint

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)
CORS(app)

auth_blueprint = create_auth_blueprint(supabase)
app.register_blueprint(auth_blueprint, url_prefix='/api/auth')

user_blueprint = create_user_blueprint(supabase)
app.register_blueprint(user_blueprint, url_prefix='/api/user')

post_blueprint = create_post_blueprint(supabase)
app.register_blueprint(post_blueprint, url_prefix='/api/post')

profile_blueprint = create_profile_blueprint(supabase)
app.register_blueprint(profile_blueprint, url_prefix='/api/profile')

if __name__ == '__main__':
    app.run(debug=True)
