import Modal from "./Modal";
import useLikeModal from "./useLikeModal";
import useProfileModal from "./useProfileModal";
import Input from "./Input";
import {useEffect, useState} from "react";
import Button from "./Button";
import toast from "react-hot-toast";
import axios from "axios";
import AvatarItem from "./AvatarItem";
import { useNavigate } from "react-router-dom";


const ProfileModal = () => {
    const profileModal = useProfileModal()
    const onChange = (open: boolean) => {
        if (!open) {
            profileModal.onClose()
        }
    }

    const navigate = useNavigate()
    const [name, setName] = useState(profileModal.Profile.name || "")
    const [bio, setBio] = useState(profileModal.Profile.bio || "")
    const [avatar, setAvatar] = useState(profileModal.Profile.avatar || "")

    const [newAvatarId, setNewAvatarId] = useState(null)
    const [allAvatars, setAllAvatars] = useState([])

    useEffect(() => {

        const getAvatar = async () => {
            try {
                const response = await axios.get("/api/avatar")
                setAllAvatars(response.data.data.avatars)
            } catch (e: any) {
                toast.error("An error occurred while trying to get the avatar! Try again later!")
            }
        }
        getAvatar()


        setName(profileModal.Profile.name)
        setBio(profileModal.Profile.bio)
        setAvatar(profileModal.Profile.avatar)
    }, [profileModal.Profile])
    const onNameChange = (e: any) => {
        setName(e.target.value)
    }
    const onBioChange = (e: any) => {
        setBio(e.target.value)
    }

    const save = async () => {
        let error = false
        if (name !== profileModal.Profile.name) {
            if (name === "") {
                toast.error("Name cannot be empty!")
                return
            }
            await toast.promise(axios.patch("/api/profile/name", {name: name}).catch(res => {
                error = true
            }), {
                loading: "Saving...",
                success: "Name updated!",
                error: "An error occurred while trying to save changes! Try again later!"
            })
        }
        if (bio !== profileModal.Profile.bio) {
            const newBio = bio === '' ? ' ' : bio
            await toast.promise(axios.patch("/api/profile/bio", {bio: newBio}).catch(res => {
                error = true
            }), {
                loading: "Saving...",
                success: "Bio updated!",
                error: "An error occurred while trying to save changes! Try again later!"
            })
        }
        if (newAvatarId !== null) {
            await toast.promise(axios.patch("/api/profile/avatar", {avatar_id: newAvatarId}).then(res => {
                setNewAvatarId(null)
            }).catch(res =>{
                error = true
            }), {
                loading: "Saving...",
                success: "Avatar updated!",
                error: "An error occurred while trying to save changes! Try again later!"
            })
        }
        if (!error) {
            profileModal.onClose()
            navigate(0)
        }else{
            toast.error("An error occurred while trying to save changes! Try again later!")
        }
    }


    return (
        <Modal isOpen={profileModal.isOpen} onChange={onChange} title="Edit your Profile"
               description={""}>
            <div className={"flex flex-col gap-1 w-full"}>
                <Input className={"bg-amber-600"} placeholder={"Name"} type={"text"} name={"name"} value={name}
                       onChange={onNameChange}/>
                <div className={"px-4"}>
                <textarea value={bio} onChange={onBioChange} name="post-content" id="post-content"
                          className={"outline-none  bg-amber-600 w-full max-h-52 min-h-40 p-3 rounded-lg"}/>
                </div>
                <div className={"px-4"}>
                    <h1>current avatar: {avatar}</h1>
                    <div
                        className={"rounded-lg flex flex-row overflow-x-auto flex-wrap align-items-start p-3 min-h-50 max-h-60 bg-amber-600 w-full"}>
                        {/*map allAvatars*/}
                        {
                            allAvatars.map((avatar: any) => {
                                return (
                                    <AvatarItem key={avatar.id} avatar={avatar.icon} active={newAvatarId === avatar.id}
                                                onclick={() => setNewAvatarId(avatar.id)}/>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={"mx-auto pt-3"}>
                    <Button onClick={save} text={"Save Changes"} className={"bg-green-600 px-6 w-auto"}/>
                </div>
            </div>
        </Modal>
    )
}

export default ProfileModal;