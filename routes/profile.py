from flask import request, Blueprint, jsonify
from helpers import createResponse, errorHandler, checkSession
from supabase import Client


def create_profile_blueprint(supabase: Client):
    profile_blueprint = Blueprint('profile', __name__)

    @profile_blueprint.route('/', methods=['GET'])
    def self():
        access_token = checkSession(request, supabase)
        if not isinstance(access_token, str):
            return access_token

        try:
            session = supabase.auth.get_session()
            user = supabase.table('users').select('*').eq('id', session.user.id).execute()
            countPosts = supabase.table('posts').select("id", count="exact").eq('user_id', session.user.id).execute()


            data = {
                "user": user.data,
                "posts": countPosts.data
            }

            return createResponse("Profile retrieved", 200, data, session.refresh_token)

        except Exception as e:
            return errorHandler(str(e))

    return profile_blueprint
