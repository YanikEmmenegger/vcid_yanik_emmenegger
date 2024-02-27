import {create} from "zustand";

interface CommentsModalStore {
    isOpen: boolean,
    Comments?: any,
    onOpen: (Comments: any) => void,
    onClose: () => void
}

const useCommentModal = create<CommentsModalStore>((set) => ({
    isOpen: false,
    Comments: [],
    onOpen: (newComments) => {
        set({isOpen: true, Comments: newComments})
    },
    onClose: () => set({isOpen: false}),
}))

export default useCommentModal