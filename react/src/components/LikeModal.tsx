import Modal from "./Modal";
import useLikeModal from "./useLikeModal";


const LikeModal = () => {
    const likeModal = useLikeModal()
    const onChange = (open: boolean) => {
        if (!open) {
            likeModal.onClose()
        }
    }

    return (
        <Modal isOpen={likeModal.isOpen} onChange={onChange} title="Likes"
               description={""}>
            <div className={"flex flex-col gap-6 w-full"}>
            </div>
        </Modal>
    )
}

export default LikeModal;