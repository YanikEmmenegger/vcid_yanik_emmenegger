import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import LoadingIndicator from "../components/LoadingIndicator";
import UserComponent from "../components/userComponent";
import errorHandler from '../helpers/errorHandler';

const UserPage = () => {

    //create loading state
    const [loading, setLoading] = useState(true);
    //user state
    const [user, setUser] = useState('');
    //post state
    const [posts, setPosts] = useState([]);
    //next posts link
    const [next, setNext] = useState([]);
    //error 404 state
    const [error, setError] = useState(false);

    const {id} = useParams();
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get('https://vcid.yanik.pro/api/user/' + id);
                setUser(res.data.data.user)
                setPosts(res.data.data.posts.posts)
                setNext(res.data.data.posts.links)
                setLoading(false)
            } catch (e: any) {
                if (e.response.status === 404) {
                    setLoading(false)
                    setError(true)
                    return
                }
                errorHandler(e)
            }
        }

        getUser()

    }, [loading])

    return (
        <div>
            {error && <h1>User not found</h1>}
            <div className={"mx-auto w-full  content-center text-center"}><LoadingIndicator active={loading}
                                                                                            fontSize={"50px"}/></div>
            <div>
                {!loading && !error && <UserComponent next={next} user={user} posts={posts} isOwner={false}/>}
            </div>
        </div>
    );
}

export default UserPage;
