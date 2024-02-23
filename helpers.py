from flask import jsonify, make_response
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import timedelta
import os

load_dotenv()


def errorHandler(e):
    # print error
    print(e)
    # create switcher to handle different errors
    switcher = {
        'Invalid login credentials': createResponse("Unauthorized - invalid login credentials", 400),
        'Invalid Refresh Token: Refresh Token Not Found': createResponse("Unauthorized - invalid token", 401),
        'Invalid Refresh Token: Refresh Token Expired': createResponse("Unauthorized - invalid token", 401),
        'Email not confirmed': createResponse("Unauthorized - email not confirmed", 401),
    }
    # return error response, return 500 if error is not found in switcher (unexpected error)
    return switcher.get(e, createResponse("Unexpected Errors", 500))


def checkSession(request, supabase: Client):
    # get refresh token from cookies
    refresh_token = request.cookies.get('refresh_token')
    # if no refresh token is found, return an error response
    if not refresh_token:
        return createResponse("Unauthorized - no token provided", 401)
    # get session from supabase
    session = supabase.auth.get_session()
    # if no session is found, try to refresh the session
    if not session:
        try:
            # refresh the session
            newSession = supabase.auth.refresh_session(refresh_token)
            # return the new refresh token
            return newSession.session.refresh_token
        except Exception as e:
            # if an error occurs, return an error response
            return errorHandler(str(e))
    # if a session is found, return the refresh token
    return session.refresh_token


def createResponse(message, statusCode, data=None, refresh_token=None):
    # create response object
    response_data = {"status": {"code": statusCode, "message": message}}
    # if data is provided, add it to the response object
    if data:
        response_data["data"] = data
    # create response with JSON data and status code
    response = make_response(jsonify(response_data), statusCode)
    # if refresh token is provided, set it as a cookie
    if refresh_token:
        # set refresh token as a cookie
        response.set_cookie('refresh_token', refresh_token, httponly=True, secure=True, samesite='Strict',
                            max_age=timedelta(days=30))
    # return response
    return response
