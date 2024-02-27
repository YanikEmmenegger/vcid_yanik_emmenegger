import {create} from "zustand";

interface LikeModalStore {
    isOpen: boolean,
    Likes?: any,
    onOpen: (Likes: any) => void,
    onClose: () => void
}

const useLikeModal = create<LikeModalStore>((set) => ({
    isOpen: false,
    Likes: [],
    onOpen: (newLikes) => {
        set({isOpen: true, Likes: newLikes})
    },
    onClose: () => set({isOpen: false}),
}))

export default useLikeModal