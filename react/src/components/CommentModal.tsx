import Modal from "./Modal";
import useLikeModal from "./useLikeModal";
import useCommentsModal from "./useCommentsModal";
import {useEffect, useState} from "react";
import CommentItem from "./CommentItem";
import Input from "./Input";
import IconButton from "./IconButton";
import toast from "react-hot-toast";
import {BiSend} from "react-icons/bi";
import axios from "axios";


const CommentModal = () => {
    const [newComment, setNewComment] = useState("")
    const commentModal = useCommentsModal()
    const onChange = (open: boolean) => {
        if (!open) {
            commentModal.onClose()
        }
    }

   const [comments, setComments] = useState(commentModal.Comments)
    useEffect(() => {
        //change order of comments
        const newOrder =commentModal.Comments.sort((a: any, b: any) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        setComments(newOrder)
        setNewComment("")
    }, [commentModal.Comments]);

    const handleCommentChange = (e: any) => {
        setNewComment(e.target.value)
    }
    const createComment = async () => {
        if (newComment === "") {
            toast.error("Comment cannot be empty!")
            console.log(comments)
            return
        }
       toast.success("Comment added successfully!")
    }

    return (
        <Modal isOpen={commentModal.isOpen} onChange={onChange} title="Comments"
               description={""}>
            <div className={"flex flex-col gap-6 w-full"}>
                {comments.length === 0 && <div className={"text-center"}>No comments yet</div>}
                <div className={"max-h-96 overflow-y-auto"}>
                    {comments.length > 0 && comments.map((comment: any) => {
                        return <CommentItem key={comment.id} comment={comment}/>
                    })
                    }
                </div>
                <div className={"flex items-center"}>
                    <Input className={"bg-amber-600"} placeholder={"Comment"} type={"text"} name={"comment"} value={newComment} onChange={handleCommentChange}/>
                    <IconButton icon={BiSend} onClick={createComment}/>
                </div>

            </div>
        </Modal>
    )
}

export default CommentModal;