from datetime import timedelta
import re
from flask import request, Blueprint, jsonify
from helpers import createResponse, errorHandler, checkSession
from supabase import Client


def create_post_blueprint(supabase: Client):
    post_blueprint = Blueprint('post', __name__)

    @post_blueprint.route('/', methods=['GET'])
    def get_posts():
        # get request args
        uuid = request.args.get('uuid')
        offset = (request.args.get('offset')) or 0
        query = request.args.get('query')
        limit = request.args.get('limit')

        # set posts_count to None (will be used for pagination if limit is not set)
        posts_count = None
        # if no limit is set, set limit to 50 and get posts count for pagination
        if not limit:
            limit = 50
            # build supabase query to get posts count
            supabase_query_no_limit = supabase.table('posts').select('*', count='exact')
            if uuid:
                # build supabase query to get posts count for a specific user
                supabase_query_no_limit = supabase_query_no_limit.eq('user_id', uuid)
            if query:
                # build supabase query to get posts count for a specific query
                supabase_query_no_limit = supabase_query_no_limit.ilike('post', f'%{query}%')

            try:
                # execute supabase query
                posts_count = supabase_query_no_limit.execute().count
            except Exception as e:
                # if an error occurs, return an error response
                return errorHandler(str(e))
        # build supabase query to get posts with likes and comments
        supabase_query = supabase.table('posts').select(
            '*, likes(id, user_id), comments(comment, created_at, id, user_id)').limit(limit).offset(offset)
        if uuid:
            # build supabase query to get posts for a specific user
            supabase_query = supabase_query.eq('user_id', uuid)
        if query:
            # build supabase query to get posts for a specific query
            supabase_query = supabase_query.ilike('post', f'%{query}%')

        try:
            # execute supabase query
            posts = supabase_query.execute().data
            # if more than 50 posts, create links to next pages
            post_links = []
            if posts_count:
                limit = 50
                offset = 50
                pages = posts_count // limit + (1 if posts_count % limit > 50 else 0)
                for page in range(pages):
                    # create links to next pages
                    post_link = f"/api/post?offset={offset}&limit={limit}"
                    if uuid:
                        # add uuid to link
                        post_link += f"&uuid={uuid}"
                    if query:
                        # add query to link
                        post_link += f"&query={query}"
                    post_links.append(post_link)
                    offset += limit
            # create response with posts and links
            data = {
                "posts": posts,
                "count": len(posts),
                "total": posts_count or len(posts),
                "links": post_links
            }
            # return response with posts and links - 200 status code
            return createResponse("posts found", 200, data)
        except Exception as e:
            return errorHandler(str(e))

    @post_blueprint.route('/<path:post_id>', methods=['GET'])
    def get_post(post_id):
        # check if uuid is a valid number
        if not re.match(r'^[0-9a-f-]+$', post_id):
            # if uuid is not a valid uuid, return a 404 response
            return createResponse("post re not found", 404)
        # -----------------------------------------------------------------------------------------------
        # Database querys to get post and posts - error handling with try/except
        # -----------------------------------------------------------------------------------------------
        try:
            # get post from supabase
            post = supabase.table('posts').select(
                '*, likes(id, user_id), comments(comment, created_at, id, user_id)').eq('id',
                                                                                        post_id).single().execute()
            if not post:
                # if post is not found, return a 404 response
                return createResponse("post not found", 404)
            data = {
                "post": post.data,
                "user": f"/api/user/{post.data['user_id']}"
            }
            return createResponse("post found", 200, data)
        except Exception as e:
            # if an error occurs, return an error response
            return errorHandler(str(e))

    
    @post_blueprint.route('/<path:post_id>', methods=['DELETE'])
    def delete_post(post_id):
        # check if profile is logged in
        tokenOrError = checkSession(request, supabase)
        if not isinstance(tokenOrError, str):
            # if tokenOrError is not a string, it is a response object (profile not logged in, or error occurred)
            return tokenOrError
        
        # check if post_id has a shlash at the end, remove it
        if post_id.endswith("/"):
            post_id = post_id[:-1]
        # check if uuid is a valid number
        if not re.match(r'^[0-9a-f-]+$', post_id):
            # if post_id is not a valid number, return a 404 response
            return createResponse("post not found", 404, refresh_token=tokenOrError)
        try: 
            deletion = supabase.table('posts').delete().eq('id', post_id).execute()
            print(deletion)
            if len(deletion.data) == 0:
                # if post is not found, return a 404 response
                return createResponse("post not found, already deleted or action not allowed for user", 404, refresh_token=tokenOrError)
            return createResponse("post deleted", 200, refresh_token=tokenOrError)
        except Exception as e:
           # if an error occurs, return an error response
            response = errorHandler(str(e))
            return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite='Strict',
                                       max_age=timedelta(days=30))
        
        
    @post_blueprint.route('/<path:post_id>/like', methods=['POST'])
    def like_post(post_id):


        def getAllLikesForPost(post_id):
            try: 
                likes = supabase.table('likes').select('*').eq('post_id', post_id).execute().data
                return likes
            except Exception as e:
                return errorHandler(str(e))

        # check if profile is logged in
        tokenOrError = checkSession(request, supabase)
        if not isinstance(tokenOrError, str):
            # if tokenOrError is not a string, it is a response object (profile not logged in, or error occurred)
            return tokenOrError
        try: 
            # check if post exists
            if not supabase.table('posts').select('id', count='exact').eq('id', post_id).execute().count == 1:
                # if post is not found, return a 404 response
                return createResponse("post not found", 404, refresh_token=tokenOrError)
            # check if post is already liked
            try: 
                if  supabase.table('likes').select('id', count='exact').eq('post_id', post_id).eq('user_id', request.cookies.get('uuid')).execute().count == 1:
                    # delete like if post is already liked
                    try: 
                        supabase.table('likes').delete().eq('post_id', post_id).eq('user_id', request.cookies.get('uuid')).execute()
                        likesOrError = getAllLikesForPost(post_id)
                        #check if likes is array or error response
                        print(likesOrError)
                        if isinstance(likesOrError, list) or likesOrError == []:
                            data = {
                                "likes": likesOrError
                            }
                            print(data)
                            return createResponse("post unliked", 200, data=data, refresh_token=tokenOrError)
                        return likesOrError.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite='Strict',
                                       max_age=timedelta(days=30))
                    except Exception as e:
                        # if an error occurs, return an error response
                        response = errorHandler(str(e))
                        return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite='Strict',
                                       max_age=timedelta(days=30))
                # like post
                try:
                    supabase.table('likes').insert({'post_id': post_id, 'user_id': request.cookies.get('uuid')}).execute()
                    likesOrError = getAllLikesForPost(post_id)
                    #check if likes is array or error response
                    if isinstance(likesOrError, list):
                        data = {
                            "likes": likesOrError
                        }
                        return createResponse("post liked", 200, data=data, refresh_token=tokenOrError)
                    return likesOrError.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite='Strict',
                                       max_age=timedelta(days=30))
                except Exception as e:
                    # if an error occurs, return an error response
                    response = errorHandler(str(e))
                    return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite='Strict',
                                       max_age=timedelta(days=30))
            except Exception as e:
                # if an error occurs, return an error response
                response = errorHandler(str(e))
                return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite='Strict',
                                       max_age=timedelta(days=30))
        except Exception as e:
            # if an error occurs, return an error response
            response = errorHandler(str(e))
            return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite='Strict',
                                       max_age=timedelta(days=30))
        
        


    return post_blueprint
