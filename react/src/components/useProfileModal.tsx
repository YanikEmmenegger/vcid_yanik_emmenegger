import {create} from "zustand";

interface ProfileModalStore {
    isOpen: boolean,
    Profile: any,
    onOpen: (Profile: any) => void,
    onClose: () => void
}

const useProfileModal = create<ProfileModalStore>((set) => ({
    isOpen: false,
    Profile: {} as any,
    onOpen: (newProfile) => {
        set({isOpen: true, Profile: newProfile})
    },
    onClose: () => set({isOpen: false}),
}))

export default useProfileModal