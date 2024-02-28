import Modal from "./Modal";
import useCommentsModal from "./useCommentsModal";
import {useEffect, useState} from "react";
import CommentItem from "./CommentItem";
import Input from "./Input";
import IconButton from "./IconButton";
import toast from "react-hot-toast";
import {BiSend} from "react-icons/bi";
import axios from "axios";
import errorHandler from "../helpers/errorHandler";


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

        setComments(commentModal.Comments)
        setNewComment("")
    }, [commentModal.Comments]);

    const handleCommentChange = (e: any) => {
        setNewComment(e.target.value)
    }
    const createComment = async () => {
        if (newComment === "") {
            toast.error("Comment cannot be empty!")
            return
        }
        await toast.promise(
            axios.post("/api/post/" + commentModal.postId + "/comment", {
                comment: newComment
            }).then(res => {
                const allComments = [...comments, res.data.data.comment]
                commentModal.setComments!(allComments)
                setComments(allComments)
                setNewComment("")

            }),
            {
                loading: 'Creating comment...',
                success: 'Comment added successfully!',
                error: 'An error occurred while trying to add comment! Try again later!',
            }
        )
    }
    const deleteComment = async (commentId: string) => {
        const url = "/api/post/" + commentModal.postId + "/comment?id=" + commentId
        try {
            await toast.promise(
                axios.delete(url).then(res => {
                    const allComments = comments.filter((comment: any) => comment.id !== commentId)
                    commentModal.setComments!(allComments)
                    setComments(allComments)
                }),
                {
                    loading: 'Deleting comment...',
                    success: 'Comment deleted successfully!',
                    error: 'An error occurred while trying to delete comment! Try again later!',
                }
            )
        } catch (e: any) {
            errorHandler(e)
        }
    }



    return (
        <Modal isOpen={commentModal.isOpen} onChange={onChange} title="Comments"
               description={""}>
            <div className={"flex flex-col gap-6 w-full"}>
                {comments.length === 0 && <div className={"text-center"}>No comments yet</div>}
                <div className={"max-h-96 overflow-y-auto"}>
                    {comments.length > 0 && comments.map((comment: any) => {
                        return <CommentItem key={comment.id} deleteComment={() => deleteComment(comment.id)}
                                            comment={comment}/>
                    })
                    }
                </div>
                <div className={"flex items-center"}>
                    <Input className={"bg-amber-600"} placeholder={"Comment"} type={"text"} name={"comment"}
                           value={newComment} onChange={handleCommentChange}/>
                    <IconButton icon={BiSend} onClick={createComment}/>
                </div>

            </div>
        </Modal>
    )
}

export default CommentModal;