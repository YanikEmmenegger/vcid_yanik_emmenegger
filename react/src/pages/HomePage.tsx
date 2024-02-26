import React, {useEffect, useState} from 'react';
import toast from "react-hot-toast";
import axios from "axios";
import PostsComponent from "../components/PostsComponent";

const HomePage: React.FC = () => {

    //poststate
    const [posts, setPosts] = useState<any>([]);
    //loading more state
    const [loadingMore, setLoadingMore] = useState(false);
    //next posts link
    const [nextPosts, setNextPosts] = useState([]);


    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await axios.get('/api/post');
                console.log(res)
                setNextPosts(res.data.data.links)
                setPosts(res.data.data.posts)
            } catch (e: any) {
                toast.error("An error occurred while trying to get posts! Try again later!");
            }
        }

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
            toast.error("An error occurred while trying to get more posts! Try again later!");
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


    return (
        <div className={"mt-3"}>
            <PostsComponent posts={posts}/>
        </div>
    );
};

export default HomePage;
