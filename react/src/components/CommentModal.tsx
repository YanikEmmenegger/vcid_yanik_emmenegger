import Modal from "./Modal";
import useLikeModal from "./useLikeModal";
import useCommentsModal from "./useCommentsModal";


const CommentModal = () => {
    const commentModal = useCommentsModal()
    const onChange = (open: boolean) => {
        if (!open) {
            commentModal.onClose()
        }
    }

    return (
        <Modal isOpen={commentModal.isOpen} onChange={onChange} title="Comments"
               description={""}>
            <div className={"flex flex-col gap-6 w-full"}>
            </div>
        </Modal>
    )
}

export default CommentModal;