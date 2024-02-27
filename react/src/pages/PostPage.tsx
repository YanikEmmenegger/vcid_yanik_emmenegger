import {FC, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import PostItem from "../components/PostItem";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingIndicator from "../components/LoadingIndicator";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;


const PostPage: FC = () => {

    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState('');
    const [error404, setError404] = useState(false);

    const fetchPost = async () => {
        try {
            //fetch post data
            const response = await axios.get('/api/post/' + id)
            //set post data
            setPost(response.data.data.post)
            setError404(false)
        } catch (e: any) {
            if (e.response.status === 404) {
                //set post data
                setError404(true)
                return
            }
            toast.error("An error occurred while trying to get post data! Try again later!");
        }
    }

    useEffect(() => {
        setLoading(true)

        fetchPost()
        setTimeout(() => setLoading(false), 1)

    }, [id])

    const loadContent = () => {
        if (loading) {
            return <div className={"mx-auto w-full  content-center text-center"}><LoadingIndicator active={true}
                                                                                                   fontSize={"50px"}/>
            </div>
        } else if (error404) {
            return <div className={"mx-auto w-full  content-center text-center"}><h1>404 Post not found</h1></div>
        } else {
            console.log(post)
            return <PostItem post={post}/>
        }
    }

    return (
        <div className={"mt-40"}>
            <LoadingIndicator active={loading} fontSize={"50px"}/>
            {error404 && <h1>404 Post not found</h1>}
            {!error404 && !loading && post !== '' && <PostItem post={post}/>}
        </div>)
}

export default PostPage;