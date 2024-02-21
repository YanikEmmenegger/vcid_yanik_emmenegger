from datetime import timedelta

from flask import request, Blueprint
from helpers import createResponse, errorHandler
from supabase import Client


def create_auth_blueprint(supabase: Client):
    auth_blueprint = Blueprint('auth', __name__)

    @auth_blueprint.route('/login', methods=['POST'])
    def login():
        email = request.json.get('email')
        password = request.json.get('password')
        if not email or not password:
            return createResponse("Bad Request - please provide email and password", 400)
        try:
            # separate login and register
            session = supabase.auth.sign_in_with_password({"email": email, "password": password})
            user = supabase.table('users').select('*').eq('email', email).execute()
            response = createResponse("Login successful", 200, user.data, session.session.refresh_token)
            response.set_cookie('uuid', user.data[0]['id'], httponly=True, secure=True, samesite='Strict',  max_age=timedelta(days=30))
            return response
        except Exception as e:
            return errorHandler(str(e))

    @auth_blueprint.route('/logout', methods=['GET'])
    def logout():
        refresh_token = request.cookies.get('refresh_token')
        if not refresh_token:
            return createResponse("no cookie available - already logged out", 400)
        try:
            supabase.auth.sign_out()
            response = createResponse("Logout successful", 200)
            response.set_cookie('refresh_token', '', httponly=True, secure=True, samesite='Strict', max_age=0)
            response.set_cookie('uuid', '', httponly=True, secure=True, samesite='Strict', max_age=0)
            return response
        except Exception as e:
            return errorHandler(str(e))

    return auth_blueprint
