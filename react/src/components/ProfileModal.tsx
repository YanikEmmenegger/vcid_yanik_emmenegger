import Modal from "./Modal";
import useLikeModal from "./useLikeModal";
import useProfileModal from "./useProfileModal";


const ProfileModal = () => {
    const profileModal = useProfileModal()
    const onChange = (open: boolean) => {
        if (!open) {
            profileModal.onClose()
        }
    }

    return (
        <Modal isOpen={profileModal.isOpen} onChange={onChange} title="Edit your Profile"
               description={""}>
            <div className={"flex flex-col gap-6 w-full"}>
            </div>
        </Modal>
    )
}

export default ProfileModal;