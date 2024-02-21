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
                "total": posts_count or len(posts.data),
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
            print(data)
            return createResponse("post found", 200, data)
        except Exception as e:
            # if an error occurs, return an error response
            return errorHandler(str(e))

    return post_blueprint
