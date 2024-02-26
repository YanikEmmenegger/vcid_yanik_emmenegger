import {FC, useEffect, useState} from "react";
import UserHeader from "./userHeader";
import PostsComponent from "./PostsComponent";
import axios from "axios";
import toast from "react-hot-toast";

interface UserComponentProps {
    user: any;
    posts: any[];
    isOwner?: boolean;
    next?: any[];
}

const UserComponent: FC<UserComponentProps> = ({user, posts, isOwner, next}) => {

    //post state
    const [userPosts, setUserPosts] = useState(posts);
    //loading more state
    const [loadingMore, setLoadingMore] = useState(false);
    //next posts link
    const [nextPosts, setNextPosts] = useState(next ? next : []);

    const fetchNextPosts = async () => {
        console.log(next)
        setLoadingMore(true)
        const link = nextPosts[0]
        //delete first element of nextPosts
        setNextPosts(nextPosts.slice(1))
        try{
            const res = await axios.get(link)
            setUserPosts([...userPosts, ...res.data.data.posts])
            setLoadingMore(false)
        }catch (e: any) {
            toast.error("An error occurred while trying to get more posts! Try again later!");
        }
    }


    // Erkennen, ob der Benutzer am unteren Ende der Seite ist
    useEffect(() => {

        const handleScroll = () => {
            const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            const body = document.body;
            const html = document.documentElement;
            const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
            const windowBottom = windowHeight + window.pageYOffset;
            if (windowBottom >= docHeight - 100) { // 100px vor dem Ende der Seite
                if (!loadingMore && nextPosts.length > 0) {fetchNextPosts();}
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [userPosts]);


    return (
        <>
            <UserHeader avatar={user.avatars.icon} name={user.name} bio={user.bio}
                         isOwner={isOwner}/>
            <PostsComponent posts={userPosts} />

        </>
    );
}

export default UserComponent;