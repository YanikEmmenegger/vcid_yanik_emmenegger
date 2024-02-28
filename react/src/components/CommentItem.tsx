import {FC, useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import IconButton from "./IconButton";
import {useCookies} from "react-cookie";
import {AiOutlineDelete} from "react-icons/ai";
import errorHandler from "../helpers/errorHandler";

interface CommentItemProps {
    comment: any,
    deleteComment: () => void,
}

const CommentItem: FC<CommentItemProps> = ({comment, deleteComment}) => {

    const [cookies, removeCookie] = useCookies();

    const [user, setUser] = useState({
        'name': '',
        'avatars': {
            'icon': '👤'
        },
        'link': ''
    });


    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get('/api/user/' + comment.user_id + '?UserDetailsOnly=true')
                setUser(response.data.data)

            } catch (e: any) {
                errorHandler(e)
            }
        }
        getUser()
    }, [comment])

    const handleDelete = async () => {

    }


    return (
        <div className={"bg-amber-600 my-2 py-3"}>
            <div className={"flex mx-3  text-lg border-b-white border-b-2"}>
                <h1 className={"px-3"}>
                    {user.avatars?.icon || "👤"}
                </h1>

                |
                <h1 className={"px-3"}>
                    {user.name.toUpperCase()}
                </h1>
            </div>
            <div className={"text-xl flex justify-between pt-5 px-3"}>
                <h1>{comment.comment}</h1>
                {cookies.uuid === comment.user_id && <IconButton icon={AiOutlineDelete} onClick={deleteComment}/>
                }
            </div>
        </div>
    );
}

export default CommentItem;