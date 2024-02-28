import {FC} from "react";
import Button from "./Button";
import toast from "react-hot-toast";
import IconButton from "./IconButton";
import {CiEdit, CiLogout} from "react-icons/ci";
import {twMerge} from "tailwind-merge";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import useProfileModal from "./useProfileModal";
import errorHandler from "../helpers/errorHandler";

interface UserHeaderProps {
    avatar: string;
    name: string;
    bio: string;
    isOwner?: boolean;
}

const UserHeader: FC<UserHeaderProps> = ({avatar, bio, name, isOwner}) => {

    const navigate = useNavigate();
    const profileModal = useProfileModal();

    const handleLogout = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/auth/logout');
            if (res.status === 200) {
                toast.success("You have successfully logged out!");
                navigate("/app/login")
                return;
            }
        } catch (e: any) {
           errorHandler(e)
        }
    }

    return (
        <div id={"user-header"} className={"mb-2"}>
            <div className={"flex bg-amber-500 rounded-t-lg w-full mx-auto items-center "}>
                <div className={"flex w-[80%] items-center"}>
                    <span className={"text-[30pt] pl-5 pr-3 "}>
                        {avatar}
                    </span>
                    <div className={"flex bg-amber-700"}>
                        <h1 className={"mx-3 text-md font-bold"}>{name.toUpperCase()} </h1>

                    </div>
                </div>
                <div className={twMerge("flex text-center justify-end pr-5 w-[20%]", isOwner ? "": "hidden")}>
                    <IconButton icon={CiEdit} onClick={() => {
                        profileModal.onOpen({avatar: avatar, name: name, bio:bio})
                    }}/>
                    <IconButton icon={CiLogout} onClick={() => {
                        handleLogout()
                    }}/>
                </div>

            </div>
            <div
                className={twMerge("my-1 border-b-2 border-amber-500 flex pl-5  py-5 flex-row w-full mx-auto content-center items-center", bio === '' || bio === null || bio === undefined ? "hidden" : "false")}>
                {bio}
            </div>
        </div>
    );
}

export default UserHeader;