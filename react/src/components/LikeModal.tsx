import Modal from "./Modal";
import useLikeModal from "./useLikeModal";
import LikeElement from "./LikeElement";


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
                {likeModal.Likes.map((like:any) => {
                    return <LikeElement key={like.id} like={like}/>
                })}
            </div>
        </Modal>
    )
}

export default LikeModal;