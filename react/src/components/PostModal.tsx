import usePostModal from "./usePostModal";
import Modal from "./Modal";
import toast from "react-hot-toast";
import {useEffect, useState} from "react";
import Button from "./Button";
import axios from "axios";
import {useNavigate} from "react-router-dom";


const PostModal = () => {

    //proccess ongoing state
    const [processOngoing, setProcessOngoing] = useState(false);
    const navigate = useNavigate()

    const postModal = usePostModal()
    const onChange = (open: boolean) => {
        if (!open) {
            postModal.onClose()
        }
    }
    const [post, setPost] = useState(postModal.PostModalItem.post);
    const handlePostChange = (e: any) => {
        setPost(e.target.value)
    }
    useEffect(() => {
        setPost(postModal.PostModalItem.post)
    }, [postModal.PostModalItem]);


    const saveChanges = async () => {
        setProcessOngoing(true)
        //save changes
        await toast.promise(
            axios.patch("/api/post/" + postModal.PostModalItem.id, {
                post: post
            }).then(res => {
                postModal.onClose()
                //navigate to same site with ?refresh=true
                navigate(0)
            }),
            {
                loading: 'Saving...',
                success: 'changes saved successfully!',
                error: 'An error occurred while trying to save changes! Try again later!',
            }
        );
        setProcessOngoing(false)
    }
    const deletePost = async () => {
        setProcessOngoing(true)
        //delete post
        await toast.promise(
            axios.delete("/api/post/" + postModal.PostModalItem.id).then(res => {
                postModal.onClose()
                //navigate to same site with ?refresh=true
                navigate(0)
            }),
            {
                loading: 'Deleting...',
                success: 'Post deleted successfully!',
                error: 'An error occurred while trying to save changes! Try again later!',
            }
        );
        setProcessOngoing(false)
    }

    return (
        <Modal isOpen={postModal.isOpen} onChange={onChange} title="Edit Post"
               description={"edit your post content or delete your post"}>
            <div className={"flex flex-col gap-6 w-full"}>
                <div className={"flex flex-col gap-6 w-full"}>
                    <div className={"flex flex-col gap-6 w-full"}>
                            <textarea value={post} onChange={handlePostChange} name="post-content" id="post-content"
                                      className={"outline-none bg-amber-600 w-full max-h-80 min-h-40 mx-1 p-3 rounded-lg"}/>
                    </div>
                    <div className={"flex flex-col w-full"}>
                        <Button onClick={saveChanges} text={"Save Changes"} disabled={processOngoing}
                                className={"bg-green-600"}/>
                        <Button onClick={deletePost} text={"Delete Post"} disabled={processOngoing}
                                className={"bg-red-600"}/>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default PostModal;
