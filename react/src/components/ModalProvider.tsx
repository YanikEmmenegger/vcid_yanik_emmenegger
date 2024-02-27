import {useEffect, useState} from "react";
import PostModal from "./PostModal";
import LikeModal from "./LikeModal";
import CommentModal from "./CommentModal";
import ProfileModal from "./ProfileModal";
import NewPostModal from "./NewPostModal";


const ModalProvider = ()=>{
    const [isMounted, setIsMounted] = useState(false)
    useEffect(()=>{
        setIsMounted(true)

    }, [])

    if (!isMounted){
        return null;
    }
    return (
        <>
            <PostModal/>
            <LikeModal/>
            <CommentModal/>
            <ProfileModal/>
            <NewPostModal/>
        </>
    )
}
export default ModalProvider
