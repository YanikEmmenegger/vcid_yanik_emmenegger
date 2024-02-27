import {create} from "zustand";

interface PostModalStore {
    isOpen: boolean,
    PostModalItem?: any,
    onOpen: (PostModalItem: any) => void,
    onClose: () => void
}

const usePostModal = create<PostModalStore>((set) => ({
    isOpen: false,
    PostModalItem: {
        "comments": [],
        "created_at": "",
        "id": "",
        "likes": [],
        "post": "",
        "updated_at": null,
        "user_id": ""
    },
    onOpen: (newPostModalItem) => {
        set({isOpen: true, PostModalItem: newPostModalItem})
    },
    onClose: () => set({isOpen: false}),
}))

export default usePostModal