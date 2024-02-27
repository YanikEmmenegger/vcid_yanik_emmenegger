import React, {FC, useEffect, useState} from "react";
import axios from "axios";
import PostAuthor from "./PostAuthor";
import LikeButton from "./LikeButton";
import {CiEdit, CiReceipt, CiShare1} from "react-icons/ci";
import {useCookies} from "react-cookie";
import toast from "react-hot-toast";
import IconButton from "./IconButton";
import usePostModal from "./usePostModal";
import useLikeModal from "./useLikeModal";
import useCommentModal from "./useCommentsModal";
import {Link} from "react-router-dom";

interface PostItemProps {
    post: any;
}

const PostItem: FC<PostItemProps> = ({post}) => {

    //state for user
    const [user, setUser] = useState({
        'username': '',
        'avatar': '',
        'link': ''
    });
    const [cookies, removeCookie] = useCookies();

    const postModal = usePostModal()
    const likeModal = useLikeModal()
    const commentModal = useCommentModal()

    //state for likes
    const [likes, setLikes] = useState([]);
    //state for comments
    const [comments, setComments] = useState([]);

    //state for user hase liked
    const [userHasLiked, setUserHasLiked] = useState(false);
    //state for loading like
    const [loadingLike, setLoadingLike] = useState(false);

    const handleLike = async () => {
        if (cookies.uuid === undefined) {
            toast((t) => (
                <span>
                    🔒
                    you need to be logged in to like a post
                    <Link onClick={()=>{toast.dismiss(t.id)}} to={"/app/login"}><p className={"underline"}>Login</p></Link>
                </span>
            ));
            return
        }
        setLoadingLike(true)
        try {
            const response = await axios.post('/api/post/' + post.id + '/like')
            setLoadingLike(false)
            setLikes(response.data.data.likes)
        } catch (e: any) {
            toast.error("An error occurred while trying to like the post! Try again later!");
        }
    }

    const handleShare = () => {
        toast.error("This feature is not available yet!")
    }


    useEffect(() => {
        if (likes.length > 0) {
            //check if user has liked the post and set state accordingly
            const hasLiked = likes.filter((like: any) => like.user_id === cookies.uuid)
            if (hasLiked.length > 0) {
                setUserHasLiked(true)
            } else {
                setUserHasLiked(false)
            }

        } else {
            setUserHasLiked(false)
        }
    }, [likes]);

    useEffect(() => {
        //delete undefined in likes
        const clearedLikes = post.likes.filter((like: any) => like !== undefined)
        setLikes(clearedLikes)
        //delete undefined in comments
        const clearedComments = post.comments.filter((comment: any) => comment !== undefined)
        setComments(clearedComments)

        const getUser = async () => {
            try {
                const res = await axios.get('/api/user/' + post.user_id + '?UserDetailsOnly=true');
                const user = {
                    'username': res.data.data.name.toUpperCase(),
                    'avatar': res.data.data.avatars.icon,
                    'link': '/app/user/' + res.data.data.id
                }
                setUser(user)
            } catch (e: any) {
                toast.error("An error occurred while trying to get the user! Try again later!");
            }
        }
        getUser()
    }, [post]);

    return (
        <div className={"w-full p-3 bg-neutral-800 rounded-lg h-auto mb-5"}>
            <PostAuthor edited={post.edited_at} user={user}/>
            <div className={"w-full py-3"}>
                <p className={"text-[18pt]"}>{post.post}</p>
            </div>
            <div className={"flex justify-between"}>
                <div className={"w-full flex items-center "}>
                    <div className={"flex p-1"}>
                        <LikeButton onclick={handleLike} loading={loadingLike} liked={userHasLiked}/>
                        <h1 className={"cursor-pointer"}
                            onClick={() => likeModal.onOpen(likes)}>{likes.length} Likes</h1>
                    </div>
                    <div onClick={() => commentModal.onOpen(comments)} className={"flex cursor-pointer p-1"}>
                        <IconButton fontSize={"20px"} icon={CiReceipt} onClick={() => {
                        }}/>
                        <h1>{comments.length} comments</h1>
                    </div>
                    <IconButton fontSize={"20px"} icon={CiShare1} onClick={handleShare}/><p>Share</p>

                </div>
                <div>
                    {post.user_id === cookies.uuid && <IconButton icon={CiEdit} onClick={() => postModal.onOpen(post)}/>
                    }
                </div>
            </div>
        </div>
    );
}

export default PostItem;