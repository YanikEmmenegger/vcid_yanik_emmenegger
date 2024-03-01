import React, {useEffect, useState} from 'react';
import toast from "react-hot-toast";
import axios from "axios";
import PostsComponent from "../components/PostsComponent";
import IconButton from "../components/IconButton";
import {CiRedo} from "react-icons/ci";
import LoadingIndicator from "../components/LoadingIndicator";
import errorHandler from "../helpers/errorHandler";

const HomePage: React.FC = () => {

    //poststate
    const [posts, setPosts] = useState<any>([]);
    //loading more state
    const [loadingMore, setLoadingMore] = useState(false);
    //next posts link
    const [nextPosts, setNextPosts] = useState([]);
    //loading state
    const [loading, setLoading] = useState(true);
    const getPosts = async () => {
        setLoading(true)
        try {
            console.log(axios.defaults.baseURL)
            const res = await axios.get('/api/post');
            setNextPosts(res.data.data.links)
            setPosts(res.data.data.posts)
            setLoading(false)
        } catch (e: any) {
            errorHandler(e)
        }
    }

    useEffect(() => {
        getPosts()
    }, [])

    const fetchNextPosts = async () => {
        setLoadingMore(true)
        const link = nextPosts[0]
        //delete first element of nextPosts
        setNextPosts(nextPosts.slice(1))
        try {
            const res = await axios.get(link)
            setPosts([...posts, ...res.data.data.posts])
            setLoadingMore(false)
        } catch (e: any) {
            errorHandler(e)
        }
    }

    useEffect(() => {

        const handleScroll = () => {
            const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            const body = document.body;
            const html = document.documentElement;
            const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
            const windowBottom = windowHeight + window.pageYOffset;
            if (windowBottom >= docHeight - 100) { // 100px vor dem Ende der Seite
                if (!loadingMore && nextPosts.length > 0) {
                    fetchNextPosts();
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [posts]);

    const handleRefresh = () => {
        //cancel all previous requests
        axios.CancelToken.source().cancel('Operation canceled by the user.');
        setPosts([])
        getPosts()
    }


    return (
        <div className={"mt-3"}>
            <div className={"flex"}>
                <h1 className={"text-2xl mb-3"}>Latest Posts </h1>
                <IconButton icon={CiRedo} onClick={handleRefresh}/>
            </div>
            <PostsComponent posts={posts}/>
            <LoadingIndicator active={loading}/>
            <div className={"pb-48"}>
                {nextPosts.length === 0 && <h1 className={"text-xl text-center"}>No more Posts</h1>}
            </div>
        </div>
    );
};

export default HomePage;
