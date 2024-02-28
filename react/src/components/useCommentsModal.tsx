import {create} from "zustand";

interface CommentsModalStore {
    isOpen: boolean,
    Comments: any,
    postId: string,
    setComments: (postComments:any) => void,
    onOpen: (Comments: any, postId: string, setComments: (postComments:any) => void) => void,
    onClose: () => void
}

const useCommentModal = create<CommentsModalStore>((set) => ({
    isOpen: false,
    Comments: [],
    setComments: (postComments:any) => {},
    postId: "",
    onOpen: (newComments, newPostId, newSetComments) => {
        set({isOpen: true, Comments: newComments, postId: newPostId, setComments: newSetComments})
    },
    onClose: () => set({isOpen: false}),
}))

export default useCommentModal