from datetime import timedelta
import re
from flask import request, Blueprint, jsonify
from helpers import createResponse, errorHandler, checkSession
from supabase import Client


def create_avatar_blueprint(supabase: Client):
    avatar_blueprint = Blueprint('avatar', __name__)

    @avatar_blueprint.route('/', methods=['GET'])
    def get_avatars():
        try:
            avatars = supabase.table('avatars').select('*').execute()
            data = {
                "count": len(avatars.data),
                "avatars": avatars.data
            }
            return createResponse("Avatars found", 200, data)
        except Exception as e:
            return errorHandler(str(e))
        
    @avatar_blueprint.route('/<path:avatar_id>', methods=['GET'])
    def get_avatar(avatar_id):
        # check if avatar_id has a shlash at the end, remove it
        if avatar_id.endswith("/"):
            avatar_id = avatar_id[:-1]
        try:
            # get avatar from supabase by id
            avatar = supabase.table('avatars').select('*').eq('id', avatar_id).single().execute()
            if not avatar:
                return createResponse("Avatar not found", 404)
            data = {
                "avatar": avatar.data
            }
            return createResponse("Avatar found", 200, data)
        except Exception as e:
            return errorHandler(str(e))

    return avatar_blueprint


