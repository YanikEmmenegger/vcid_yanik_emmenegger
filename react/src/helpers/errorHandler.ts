import axios from "axios";
import toast from "react-hot-toast";



const errorHandler = (error: any) => {

    const error307 = async () => {
        try {
            const res = await axios.get('/api/auth/logout')
            if (res.status === 200) {
                toast.success("You have been logged out!")
                return;
            }
        } catch (e: any) {
            toast.error("An error occurred while trying to log out! Try again later!")
        }
    }
    const error500 = () => {
        toast.error("An error occurred while trying to log out! Try again later!")
    }

    const error404 = () => {
        toast.error("Ressource not found!")
    }

    console.log(error)
    const errorCode =  error.code || error.response.status


    switch (errorCode) {
        case 307:
            error307()
            break;
        case 500:
            error500()
            break;
        case 404:
            error404()
            break;
        default:
            error500()
            break;
    }
}




export default errorHandler;