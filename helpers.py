from flask import jsonify, make_response
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import timedelta
import os

load_dotenv()


def errorHandler(e):
    print(e)
    switcher = {
        'Invalid login credentials': createResponse("Unauthorized - invalid login credentials", 401),
        'Invalid Refresh Token: Refresh Token Not Found': createResponse("Unauthorized - invalid token", 401),
    }
    return switcher.get(e, createResponse("Unexpected Error", 500))


def checkSession(request, supabase: Client):
    refresh_token = request.cookies.get('refresh_token')
    if not refresh_token:
        return createResponse("Unauthorized - no token provided", 401)
    session = supabase.auth.get_session()
    if not session:
        try:
            newSession = supabase.auth.refresh_session(refresh_token)
            return newSession.session.refresh_token
        except Exception as e:
            return errorHandler(str(e))
    return session.refresh_token


def createResponse(message, statusCode, data=None, refresh_token=None):
    response_data = {"status": {"code": statusCode, "message": message}}
    if data:
        response_data["data"] = data
    response = make_response(jsonify(response_data), statusCode)
    if refresh_token:
        response.set_cookie('refresh_token', refresh_token, httponly=True, secure=True, samesite='Strict',
                            max_age=timedelta(days=30))
    return response
