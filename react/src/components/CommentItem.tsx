import {FC, useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface CommentItemProps {
    comment: any
}

const CommentItem: FC<CommentItemProps> = ({comment}) => {

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
                const response = await axios.get('/api/user/' + comment.user_id+ '?UserDetailsOnly=true')
                setUser(response.data.data)

            } catch (e: any) {
                toast.error("An error occurred while trying to get user data! Try again later!");
            }
        }
        getUser()
    }, [comment])



    console.log(comment)
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
            <div className={"text-xl pt-5 px-3"}>
                {comment.comment}
            </div>
        </div>
    );
}

export default CommentItem;