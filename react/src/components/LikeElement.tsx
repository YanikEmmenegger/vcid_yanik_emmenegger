import {FC, useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import errorHandler from "../helpers/errorHandler";

interface LikeElementProps {
    like: any;
}

const LikeElement: FC<LikeElementProps> = ({like}) => {

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
                const response = await axios.get('/api/user/' + like.user_id + '/?UserDetailsOnly=true')
                setUser(response.data.data)

            } catch (e: any) {
                errorHandler(e)
            }
        }
        getUser()
    }, [like])

    return (
        <div className={"flex py-5 bg-amber-600 text-2xl"}>
            <h1 className={"px-3"}>
                {user.avatars?.icon || "👤"}
            </h1>

            |
            <h1 className={"px-3"}>
                {user.name.toUpperCase()}
            </h1>
        </div>
    );
}

export default LikeElement;