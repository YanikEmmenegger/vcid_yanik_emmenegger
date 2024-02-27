import {create} from "zustand";

interface NewPostModalState {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void
}

const useProfileModal = create<NewPostModalState>((set) => ({
    isOpen: false,
    Profile: {},
    onOpen: () => {
        set({isOpen: true})
    },
    onClose: () => set({isOpen: false}),
}))

export default useProfileModal