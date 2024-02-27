import usePostModal from "./usePostModal";
import Modal from "./Modal";
import useNewPostModal from "./useNewPostModal";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Button from "./Button";


const NewPostModal = () => {

    //proccess ongoing state
    const [processOngoing, setProcessOngoing] = useState(false);
    const navigate = useNavigate()

    const newPostModal = useNewPostModal()
    const onChange = (open: boolean) => {
        if (!open) {
            newPostModal.onClose()
        }
    }
    const [post, setPost] = useState('');
    const handlePostChange = (e: any) => {
        setPost(e.target.value)
    }
    const createPost = async () => {
        setProcessOngoing(true)
        //delete post
        await toast.promise(
            axios.post("/api/post/", {post: post}).then(res => {
                newPostModal.onClose()
                setPost('')
                //navigate to same site with ?refresh=true
                //check if user is on profile page
                if (window.location.pathname === '/app/profile') {
                    navigate(0)
                } else {
                    navigate('/app/profile')
                }

            }),
            {
                loading: 'Creating post...',
                success: 'Post created successfully!',
                error: 'An error occurred while trying to save changes! Try again later!',
            }
        );
        setProcessOngoing(false)
    }

    return (
        <Modal isOpen={newPostModal.isOpen} onChange={onChange} title="Create Post"
               description={"create a new post here"}>
            <div className={"flex flex-col gap-6 w-full"}>
                <div className={"flex flex-col gap-6 w-full"}>
                    <div className={"flex flex-col gap-6 w-full"}>
                            <textarea value={post} onChange={handlePostChange} name="post-content" id="post-content"
                                      className={"outline-none bg-neutral-800 w-full max-h-80 min-h-40 mx-1 p-3 rounded-lg"}/>
                    </div>
                    <div className={"flex flex-col w-full"}>
                        <Button onClick={createPost} text={"Create"} disabled={processOngoing}
                                className={"bg-green-600"}/>

                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default NewPostModal
