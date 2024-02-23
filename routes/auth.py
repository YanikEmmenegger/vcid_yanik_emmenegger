from datetime import timedelta

from flask import request, Blueprint
from supabase import Client

from helpers import createResponse, errorHandler


def create_auth_blueprint(supabase: Client):
    auth_blueprint = Blueprint('auth', __name__)

    @auth_blueprint.route('/login', methods=['POST'])
    def login():
        # get email and password from request
        email = request.json.get('email')
        password = request.json.get('password')
        # if email or password is not provided, return a bad request response
        if not email or not password:
            return createResponse("Bad Request - please provide email and password", 400)
        # check if user exists
        try:
            user = supabase.table('users').select('bio, email, id, name, avatars(icon)').eq('email',
                                                                                            email).execute().data
            # if user does not exist (register)
            if not user:
                # try to sign up
                try:
                    supabase.auth.sign_up({"email": email, "password": password})
                    # if sign up is successful, return a success response with a message to verify email
                    return createResponse("Registration successful - please verify your account by email", 200)
                except Exception as e:
                    # if an error occurs, return an error response
                    return errorHandler(str(e))
            try:
                # if user exists, try to sign in
                session = supabase.auth.sign_in_with_password({"email": email, "password": password})
                try:
                    # select user from supabase
                    user = supabase.table('users').select('bio, email, id, name, avatars(icon)').eq('email',
                                                                                                    email).execute().data
                    # if user does not have a name, return a response to update profile
                    print(user[0]['name'])
                    if user[0]['name'] is None:
                        response = createResponse("Please update your profile", 200, user,
                                                  session.session.refresh_token)
                    else:
                        # create response object with user data and refresh token
                        response = createResponse("Login successful", 200, user, session.session.refresh_token)
                    # set uuid in cookies
                    response.set_cookie('uuid', user[0]['id'], httponly=False, secure=True, samesite=None,
                                        max_age=timedelta(days=30))
                    # return response
                    return response
                except Exception as e:
                    # if an error occurs, return an error response
                    return errorHandler(str(e))
            except Exception as e:
                # if an error occurs, return an error response
                return errorHandler(str(e))
        except Exception as e:
            # if an error occurs, return an error response
            return errorHandler(str(e))

    @auth_blueprint.route('/logout', methods=['GET'])
    def logout():
        # get refresh token from cookies
        refresh_token = request.cookies.get('refresh_token')
        # if no refresh token is found, return an error response
        if not refresh_token:
            # return an error response
            return createResponse("no cookie available - already logged out", 400)
        try:
            # sign out from supabase
            supabase.auth.sign_out()
            # create response object
            response = createResponse("Logout successful", 200)
            # set refresh token and uuid as cookies with max_age=0 to delete them
            response.set_cookie('refresh_token', '', httponly=False, secure=True, samesite=None, max_age=0)
            response.set_cookie('uuid', '', httponly=False, secure=True, samesite=None, max_age=0)
            # return response
            return response
        except Exception as e:
            # if an error occurs, return an error response
            return errorHandler(str(e))

    return auth_blueprint
