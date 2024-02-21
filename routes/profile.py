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
        return createResponse("Profile bio changed", 200, refresh_token=tokenOrError)

    @profile_blueprint.route('/bio', methods=['PATCH'])
    def change_bio():
        # check if profile is logged in
        tokenOrError = checkSession(request, supabase)
        if not isinstance(tokenOrError, str):
            # if tokenOrError is not a string, it is a response object (profile not logged in, or error occurred)
            return tokenOrError
        return createResponse("Profile bio changed", 200, refresh_token=tokenOrError)

    @profile_blueprint.route('/bio', methods=['PATCH'])
    def change_avatar():
        # check if profile is logged in
        tokenOrError = checkSession(request, supabase)
        if not isinstance(tokenOrError, str):
            # if tokenOrError is not a string, it is a response object (profile not logged in, or error occurred)
            return tokenOrError
        return createResponse("Profile bio changed", 200, refresh_token=tokenOrError)

    @profile_blueprint.route('/bio', methods=['PATCH'])
    def change_name():
        # check if profile is logged in
        tokenOrError = checkSession(request, supabase)
        if not isinstance(tokenOrError, str):
            # if tokenOrError is not a string, it is a response object (profile not logged in, or error occurred)
            return tokenOrError
        return createResponse("Profile bio changed", 200, refresh_token=tokenOrError)

    return profile_blueprint
