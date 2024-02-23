import {FC, useEffect} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import toast from "react-hot-toast";
import LikeButton from "../components/LikeButton";
import Button from "../components/Button";


const ProfilePage: FC = () => {
    const [cookies, removeCookie] = useCookies();


    const handleLogout = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/auth/logout');
            if (res.status === 200) {
                toast.success("You have successfully logged out!");
                window.location.href = "/app/login";
            }
        } catch (e: any) {
            if (e.response.status === 400) {
                toast.success("You have successfully logged out!");
                window.location.href = "/app/login";
            }
            toast.error("An error occurred while trying to log out! Try again later!");
        }
    }

    useEffect(() => {
        if (cookies.uuid === undefined || cookies.refresh_token === undefined ) {
            toast.error("Please log in first!")
            window.location.href = "/app/login";
        }
    }, [cookies])





    return (
        <>
            <div className={"text-center content-center mx-auto"}>
                <Button onClick={handleLogout} text={"Logout"} disabled={false}></Button>
            </div>
        </>
    );
}

export default ProfilePage;