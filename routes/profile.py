from datetime import timedelta
import re
from flask import request, Blueprint, jsonify
from helpers import createResponse, errorHandler, checkSession
from supabase import Client


def create_profile_blueprint(supabase: Client):
    profile_blueprint = Blueprint('profile', __name__)

    @profile_blueprint.route('/likes', methods=['GET'])
    def get_likes():
        # check if profile is logged in
        tokenOrError = checkSession(request, supabase)
        if not isinstance(tokenOrError, str):
            # if tokenOrError is not a string, it is a response object (profile not logged in, or error occurred)
            return tokenOrError

        # get uuid from cookies
        uuid = request.cookies.get('uuid')
        if not uuid:
            # if no uuid is found, return a 401 response
            response = createResponse("Unauthorized - no uuid provided", 401)
            response.set_cookie('refresh_token', '', httponly=True, secure=True, samesite=None, max_age=0)
            return response
        # -----------------------------------------------------------------------------------------------
        # Database query to get likes - error handling with try/except
        # -----------------------------------------------------------------------------------------------
        try:
            # get likes from supabase
            likes = supabase.table('likes').select('post_id').eq('user_id', uuid).execute()
            # create links for each post
            links = []
            for like in likes.data:
                links.append(f"/api/post/{like['post_id']}")
            # return response with likes - 200 status code
            data = {
                "count": len(likes.data),
                "liked_posts": links
            }
            return createResponse("Likes found", 200, data, tokenOrError)
        except Exception as e:
            # if an error occurs, return an error response
            response = errorHandler(str(e))
            return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite=None,
                                       max_age=timedelta(days=30))

    @profile_blueprint.route('/bio', methods=['PATCH'])
    def change_bio():
        # check if profile is logged in
        tokenOrError = checkSession(request, supabase)
        if not isinstance(tokenOrError, str):
            # if tokenOrError is not a string, it is a response object (profile not logged in, or error occurred)
            return tokenOrError
        # get bio from request body
        bio = request.json.get('bio')

        # check if bio is not empty

        if not bio:
            # if bio is empty, return a 400 response
            return createResponse("No bio provided", 400, refresh_token=tokenOrError)
        # check if bio is too long
        if len(bio) > 100:
            # if bio is too long, return a 400 response
            return createResponse("Bio too long", 400, refresh_token=tokenOrError)
        # -----------------------------------------------------------------------------------------------
        # Database query to change bio - error handling with try/except
        # -----------------------------------------------------------------------------------------------
        try:
            # update bio in supabase
            supabase.table('users').update({'bio': bio}).eq('id', request.cookies.get('uuid')).execute()
            data = {
                "user": "/api/user/" + request.cookies.get('uuid')
            }

            return createResponse("Bio updated", 200, data, tokenOrError)
        except Exception as e:
            # if an error occurs, return an error response
            response = errorHandler(str(e))
            return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite=None,
                                       max_age=timedelta(days=30))

    @profile_blueprint.route('/avatar', methods=['PATCH'])
    def change_avatar():
        # check if profile is logged in
        tokenOrError = checkSession(request, supabase)
        if not isinstance(tokenOrError, str):
            # if tokenOrError is not a string, it is a response object (profile not logged in, or error occurred)
            return tokenOrError
        # get bio from request body
        avatar_id = request.json.get('avatar_id')
        # check if avatar_id is not empty
        if not avatar_id:
            # if avatar_id is empty, return a 400 response
            return createResponse("No avatar_id provided", 400, refresh_token=tokenOrError)
        # check if avatar_id exists
        try:
            avatar = supabase.table('avatars').select('id').eq('id', avatar_id).execute()

            if not avatar.data:
                # if avatar_id does not exist, return a 400 response
                return createResponse("Avatar not found", 404, refresh_token=tokenOrError)
            try:
                # update avatar in supabase
                supabase.table('users').update({'avatar_id': avatar_id}).eq('id', request.cookies.get('uuid')).execute()
                data = {
                    "user": "/api/user/" + request.cookies.get('uuid')
                }
                return createResponse("Avatar updated", 200, data, tokenOrError)
            except Exception as e:
                # if an error occurs, return an error response
                response = errorHandler(str(e))
                return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite=None,
                                           max_age=timedelta(days=30))
        except Exception as e:
            # if an error occurs, return an error response
            response = errorHandler(str(e))
            return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite=None,
                                       max_age=timedelta(days=30))

    @profile_blueprint.route('/name', methods=['PATCH'])
    def change_name():
        # check if profile is logged in
        tokenOrError = checkSession(request, supabase)
        if not isinstance(tokenOrError, str):
            # if tokenOrError is not a string, it is a response object (profile not logged in, or error occurred)
            return tokenOrError
        # get bio from request body
        name = request.json.get('name')

        # check if name is not empty

        if not name:
            # if name is empty, return a 400 response
            return createResponse("No name provided", 400, refresh_token=tokenOrError)
        # check if name is too long
        if len(name) > 100:
            # if name is too long, return a 400 response
            return createResponse("name too long", 400, refresh_token=tokenOrError)
        # -----------------------------------------------------------------------------------------------
        # Database query to change name - error handling with try/except
        # -----------------------------------------------------------------------------------------------
        try:
            # update name in supabase
            supabase.table('users').update({'name': name}).eq('id', request.cookies.get('uuid')).execute()
            data = {
                "user": "/api/user/" + request.cookies.get('uuid')
            }

            return createResponse("name updated", 200, data, tokenOrError)
        except Exception as e:
            # if an error occurs, return an error response
            response = errorHandler(str(e))
            return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite=None,
                                       max_age=timedelta(days=30))

    return profile_blueprint
