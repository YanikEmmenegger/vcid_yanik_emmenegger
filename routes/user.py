from datetime import timedelta
import re
from flask import request, Blueprint, jsonify
from helpers import createResponse, errorHandler, checkSession
from supabase import Client


def create_user_blueprint(supabase: Client):
    user_blueprint = Blueprint('user', __name__)

    @user_blueprint.route('/', methods=['GET'])
    def get_users():

        name = request.args.get('name')
        if not name:
            # if no query is set, return a 400 response
            return createResponse("Bad Request - please provide a query", 400)
        # -----------------------------------------------------------------------------------------------
        # Database query to get users - error handling with try/except
        # -----------------------------------------------------------------------------------------------
        try:
            # get users from supabase
            users = supabase.table('users').select('bio, email, id, name, avatars(icon)').ilike('name',
                                                                                                f'%{name}%').limit(
                50).execute()
            # add link to user
            for user in users.data:
                user['user'] = f"/api/user/{user['id']}"
            data = {
                "count": len(users.data),
                "users": users.data
            }
            # return response with users - 200 status code
            return createResponse("Users found", 200, data, )
        except Exception as e:
            # if an error occurs, return an error response
            return errorHandler(str(e))

    @user_blueprint.route('/<path:uuid>', methods=['GET'])
    def get_user(uuid: str):

        # get args parameter "UserDetailsOnly"
        userDetailsOnly = request.args.get('UserDetailsOnly')

        print(userDetailsOnly)

        if not re.match(r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$', uuid):
            # if uuid is not a valid uuid, return a 404 response
            return createResponse("user not found", 404)
        # -----------------------------------------------------------------------------------------------
        # Database querys to get user and posts - error handling with try/except
        # -----------------------------------------------------------------------------------------------
        try:
            # get user from supabase
            user = supabase.table('users').select('bio, email, id, name, avatars(icon)').eq('id',
                                                                                            uuid).single().execute()
            if not user:
                # if user is not found, return a 404 response
                return createResponse("User not found", 404)
        except Exception as e:
            # if an error occurs, return an error response
            return errorHandler(str(e))

        if userDetailsOnly:
            # if userDetailsOnly is set, return only user details - 200 status code
            return createResponse("User found", 200, user.data)

        try:
            # get posts count from supabase
            posts_count = supabase.table('posts').select("id", count='exact').eq('user_id', uuid).order('created_at', desc=True).execute()
        except Exception as e:
            # if an error occurs, return an error response
            return errorHandler(str(e))

        try:
            # get posts from supabase
            posts = supabase.table('posts').select(
                '*, likes(id, user_id), comments(comment, created_at, id, user_id, post_id)').eq('user_id', uuid).order('created_at', desc=True).limit(
                50).execute()
            # if more than 50 posts, create links to next pages
            post_links = []
            if posts_count.count > 50:
                limit = 50
                offset = 50
                # calculate number of pages
                pages = posts_count.count // limit + (1 if posts_count.count % limit > 50 else 0)
                # create links to next pages
                for page in range(pages):
                    post_link = f"/api/post?uuid={uuid}&offset={offset}&limit={limit}"
                    post_links.append(post_link)
                    offset += limit
            # create response with user and posts
            data = {
                "user": user.data,
                "posts": {
                    "total_posts": posts_count.count,
                    "count": len(posts.data),
                    "posts": posts.data,
                    "links": post_links
                }
            }
            # return response with user and posts - 200 status code
            return createResponse("User found", 200, data, )
        except Exception as e:
            # if an error occurs, return an error response
            return errorHandler(str(e))

    return user_blueprint
