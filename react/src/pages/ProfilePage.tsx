import React, {FC, useEffect, useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import toast from "react-hot-toast";
import LikeButton from "../components/LikeButton";
import Button from "../components/Button";
import {useNavigate} from "react-router-dom";
import UserComponent from "../components/userComponent";
import LoadingIndicator from "../components/LoadingIndicator";


const ProfilePage: FC = () => {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies();

    //create loading state
    const [loading, setLoading] = useState(true);
    //user state
    const [user, setUser] = useState('');
    //post state
    const [posts, setPosts] = useState([]);
    //next posts link
    const [next, setNext] = useState([]);


    useEffect(() => {

        if (cookies.uuid === undefined || cookies.uuid === "") {
            navigate("/app/login")

        } else {
            setLoading(false)
        }
    }, [cookies])

    useEffect(() => {
        if (!loading) {
            const getUser = async () => {
                try {
                    const res = await axios.get('/api/user/' + cookies.uuid);
                    setUser(res.data.data.user)
                    setPosts(res.data.data.posts.posts)
                    setNext(res.data.data.posts.links)
                } catch (e: any) {
                    toast.error("An error occurred while trying to get user data! Try again later!");
                }
            }

            getUser()
        }
    }, [loading])


    return (
        //if loading true render empty div else render profile page
        <>
            {(loading || user === '' || !posts) ?
                <div className={"mx-auto w-full  content-center text-center"}><LoadingIndicator active={true} fontSize={"50px"}/></div> :
                <>
                        <UserComponent next={next} user={user} posts={posts} isOwner={true}/>
                </>}
        </>
    );
}

export default ProfilePage;
