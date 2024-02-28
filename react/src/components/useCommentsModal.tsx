import {create} from "zustand";

interface CommentsModalStore {
    isOpen: boolean,
    Comments?: any,
    postId?: string,
    onOpen: (Comments: any, postId:string) => void,
    onClose: () => void
}

const useCommentModal = create<CommentsModalStore>((set) => ({
    isOpen: false,
    Comments: [],
    postId: "",
    onOpen: (newComments, newPostId) => {
        set({isOpen: true, Comments: newComments, postId: newPostId})
    },
    onClose: () => set({isOpen: false}),
}))

export default useCommentModal