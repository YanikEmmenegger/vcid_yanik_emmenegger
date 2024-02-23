import {FC, useEffect} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import toast from "react-hot-toast";
import LikeButton from "../components/LikeButton";
import Button from "../components/Button";
import {useNavigate} from "react-router-dom";


const ProfilePage: FC = () => {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies();


    const handleLogout = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/auth/logout');
            if (res.status === 200) {
                toast.success("You have successfully logged out!");
                navigate("/app/login")
                return;
            }
        } catch (e: any) {
            if (e.response.status === 400) {
                toast.success("You have successfully logged out!");
                navigate("/app/login");
                return;
            }
            toast.error("An error occurred while trying to log out! Try again later!");
        }
    }


    const like = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:5000/api/post/145/like');
            if (res.status === 200) {
                toast.success("Liked / unliked");
                return;
            }
        } catch (e: any) {
            if (e.response.status === 400) {
                toast.success("400");
                return;
            }
            toast.error("An error occurred while trying to log out! Try again later!");
        }
    }

    useEffect(() => {
        console.log(cookies)
        if (cookies.uuid === undefined || cookies.uuid === "") {
           navigate("/app/login")
        }
    }, [cookies])





    return (
        <>
            <div className={"text-center content-center mx-auto"}>
                <Button onClick={handleLogout} text={"Logout"} disabled={false}></Button>
                <Button onClick={like} text={"Test refresh_token"} disabled={false}></Button>
            </div>
        </>
    );
}

export default ProfilePage;