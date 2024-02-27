from datetime import timedelta
from datetime import datetime
import re
from flask import request, Blueprint, jsonify
from helpers import createResponse, errorHandler, checkSession
from supabase import Client


def create_post_blueprint(supabase: Client):
    post_blueprint = Blueprint('post', __name__)

    @post_blueprint.route('/', methods=['POST'])
    def create_post():
        # check if profile is logged in
        tokenOrError = checkSession(request, supabase)
        if not isinstance(tokenOrError, str):
            # if tokenOrError is not a string, it is a response object (profile not logged in, or error occurred)
            return tokenOrError
        # get request json
        post = request.json.get('post')
        if not post:
            return createResponse("Bad Request - please provide a post", 400, refresh_token=tokenOrError)
        # get user_id from cookies
        user_id = request.cookies.get('uuid')
        # create post in supabase
        try:
            post = supabase.table('posts').insert(
                {'post': post, 'user_id': user_id}).execute().data[0]

            # add user link to post
            post['user'] = f"/api/user/{user_id}"
            # add link to post
            post['link'] = f"/api/post/{post['id']}"

            data = {
                "post": post
            }
            # if post is created, return a 201 response
            return createResponse("post created", 201, data=data, refresh_token=tokenOrError)
        except Exception as e:
            # if an error occurs, return an error response
            response = errorHandler(str(e))
            return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite=None,
                                       max_age=timedelta(days=30))

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
            # app supabase query to get posts count
            supabase_query_no_limit = supabase.table('posts').select('*', count='exact')
            if uuid:
                # app supabase query to get posts count for a specific user
                supabase_query_no_limit = supabase_query_no_limit.eq('user_id', uuid)
            if query:
                # app supabase query to get posts count for a specific query
                supabase_query_no_limit = supabase_query_no_limit.ilike('post', f'%{query}%')

            try:
                # execute supabase query
                posts_count = supabase_query_no_limit.execute().count
            except Exception as e:
                # if an error occurs, return an error response
                return errorHandler(str(e))
        # app supabase query to get posts with likes and comments
        supabase_query = supabase.table('posts').select(
            '*, likes(id, user_id), comments(comment, created_at, id, user_id, post_id)').order('created_at', desc=True).limit(limit).offset(offset)
        if uuid:
            # app supabase query to get posts for a specific user
            supabase_query = supabase_query.eq('user_id', uuid)
        if query:
            # app supabase query to get posts for a specific query
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

            # add user link to each post
            for post in posts:
                post['user'] = f"/api/user/{post['user_id']}"
            # add link to post
            for post in posts:
                post['link'] = f"/api/post/{post['id']}"

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
        if post_id.endswith("/"):
            post_id = post_id[:-1]
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
                '*, likes(id, user_id), comments(comment, created_at, id, user_id, post_id)', count='exact').eq('id',
                                                                                                       post_id).execute()
            if post.count == 0:
                # if post is not found, return a 404 response
                return createResponse("post not found", 404)
            data = {
                "post": post.data[0],
                "user": f"/api/user/{post.data[0]['user_id']}"
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
            if len(deletion.data) == 0:
                # if post is not found, return a 404 response
                return createResponse("post not found, already deleted or action not allowed for user", 404,
                                      refresh_token=tokenOrError)
            return createResponse("post deleted", 200, refresh_token=tokenOrError)
        except Exception as e:
            # if an error occurs, return an error response
            response = errorHandler(str(e))
            return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite=None,
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
                if supabase.table('likes').select('id', count='exact').eq('post_id', post_id).eq('user_id',
                                                                                                 request.cookies.get(
                                                                                                     'uuid')).execute().count == 1:
                    # delete like if post is already liked
                    try:
                        supabase.table('likes').delete().eq('post_id', post_id).eq('user_id', request.cookies.get(
                            'uuid')).execute()
                        likesOrError = getAllLikesForPost(post_id)
                        # check if likes is array or error response

                        if isinstance(likesOrError, list) or likesOrError == []:
                            data = {
                                "likes": likesOrError
                            }

                            return createResponse("post unliked", 200, data=data, refresh_token=tokenOrError)
                        return likesOrError.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True,
                                                       samesite=None,
                                                       max_age=timedelta(days=30))
                    except Exception as e:
                        # if an error occurs, return an error response
                        response = errorHandler(str(e))
                        return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True,
                                                   samesite=None,
                                                   max_age=timedelta(days=30))
                # like post
                try:
                    supabase.table('likes').insert(
                        {'post_id': post_id, 'user_id': request.cookies.get('uuid')}).execute()
                    likesOrError = getAllLikesForPost(post_id)
                    # check if likes is array or error response
                    if isinstance(likesOrError, list):
                        data = {
                            "likes": likesOrError
                        }
                        return createResponse("post liked", 200, data=data, refresh_token=tokenOrError)
                    return likesOrError.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True,
                                                   samesite=None,
                                                   max_age=timedelta(days=30))
                except Exception as e:
                    # if an error occurs, return an error response
                    response = errorHandler(str(e))
                    return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True,
                                               samesite=None,
                                               max_age=timedelta(days=30))
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

    @post_blueprint.route('/<path:post_id>/comment', methods=['POST'])
    def comment_post(post_id):
        # check if profile is logged in
        tokenOrError = checkSession(request, supabase)
        if not isinstance(tokenOrError, str):
            # if tokenOrError is not a string, it is a response object (profile not logged in, or error occurred)
            return tokenOrError
            # get request json
        comment = request.json.get('comment')
        if not comment:
            return createResponse("Bad Request - please provide a comment", 400, refresh_token=tokenOrError)
        # get user_id from cookies
        user_id = request.cookies.get('uuid')
        # create comment in supabase
        try:
            comment = supabase.table('comments').insert(
                {'comment': comment, 'user_id': user_id, 'post_id': post_id}).execute().data[0]
            # add user link to comment
            comment['user'] = f"/api/user/{user_id}"
            # add link to post
            comment['post'] = f"/api/post/{post_id}"
            data = {
                "comment": comment
            }
            # if comment is created, return a 201 response
            return createResponse("comment created", 201, data=data, refresh_token=tokenOrError)
        except Exception as e:
            # if an error occurs, return an error response
            response = errorHandler(str(e))
            return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite=None,
                                       max_age=timedelta(days=30))

    @post_blueprint.route('/<path:post_id>/comment', methods=['DELETE'])
    def delete_comment(post_id):

        # check if profile is logged in
        tokenOrError = checkSession(request, supabase)
        if not isinstance(tokenOrError, str):
            # if tokenOrError is not a string, it is a response object (profile not logged in, or error occurred)
            return tokenOrError
        # get comment_id from request args
        comment_id = request.args.get('comment_id')
        # check if comment_id is a valid number
        if not re.match(r'^[0-9a-f-]+$', comment_id):
            # if comment_id is not a valid number, return a 404 response
            return createResponse("comment not found", 404, refresh_token=tokenOrError)
        try:
            deletion = supabase.table('comments').delete().eq('id', comment_id).execute().data
            if len(deletion) == 0:
                # if comment is not found, return a 404 response
                return createResponse("comment not found, already deleted or action not allowed for user", 404,
                                      refresh_token=tokenOrError)
            return createResponse("comment deleted", 200, refresh_token=tokenOrError)
        except Exception as e:
            # if an error occurs, return an error response
            response = errorHandler(str(e))
            return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite=None,
                                       max_age=timedelta(days=30))

    @post_blueprint.route('/<path:post_id>', methods=['PATCH'])
    def edit_post(post_id):
        # check if profile is logged in
        tokenOrError = checkSession(request, supabase)
        if not isinstance(tokenOrError, str):
            # if tokenOrError is not a string, it is a response object (profile not logged in, or error occurred)
            return tokenOrError
        # get request json
        post = request.json.get('post')
        if not post:
            return createResponse("Bad Request - please provide a post", 400, refresh_token=tokenOrError)
        # get user_id from cookies
        user_id = request.cookies.get('uuid')
        # create post in supabase
        try:
            # create timestamp for now
            now = datetime.now()
            timestamp = now.strftime('%Y-%m-%d %H:%M:%S')

            post = supabase.table('posts').update(
                {'post': post, 'updated_at': timestamp}).eq('id', post_id).execute().data
            if len(post) == 0:
                return createResponse("post not found or user not allowed", 404, refresh_token=tokenOrError)
            # add user link to post
            post[0]['user'] = f"/api/user/{user_id}"
            # add link to post
            post[0]['link'] = f"/api/post/{post_id}"
            data = {
                "post": post[0]
            }
            return createResponse("post updated", 200, data=data, refresh_token=tokenOrError)
        except Exception as e:
            # if an error occurs, return an error response
            response = errorHandler(str(e))
            return response.set_cookie('refresh_token', tokenOrError, httponly=True, secure=True, samesite=None,
                                       max_age=timedelta(days=30))

    return post_blueprint
