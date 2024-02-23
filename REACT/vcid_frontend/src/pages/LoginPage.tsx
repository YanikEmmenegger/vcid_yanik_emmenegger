import {FC, useState} from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import toast from "react-hot-toast";
import axios from "axios";

const LoginPage: FC = () => {

// Konfiguriere Axios global (optional)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Wrapper-Funktion für die E-Mail
    const handleEmailChange = (e: any) => setEmail(e.target.value);
    // Wrapper-Funktion für das Passwort
    const handlePasswordChange = (e: any) => setPassword(e.target.value);

    const handleClicked = async () => {
        if (email === "" || password === "") {
            toast.error("Please fill in all fields!");
            return;
        }
        //check if email is valid with regex
        const emailRegex = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$");
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address!");
            return;
        }
        //check if password is valid (6 characters)
        if (password.length < 6) {
            toast.error("Please enter a valid password! min 6 characters!");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:5000/api/auth/login", {
                email: email,
                password: password
            });
            if (response.status === 200) {
                console.log(response.data);
                toast.success("You have successfully logged in!");
                //window.location.href = "/profile";
            }
        }catch (e) {
            toast.error("An error occurred while trying to log in!");
            console.log(e)
            return;
        }


    }


    return (
        <>
            <div id="cc-auth-form" className="pt-12 mx-auto lg:w-1/2 w-[90%]">
                <h1 className="text-center text-3xl mb-3">Login | SignUp</h1>
                <div className="text-center">
                    <Input onChange={handleEmailChange} name="email" placeholder="E-Mail" type="text" value={email}/>
                    <Input onChange={handlePasswordChange} name="password" placeholder="Passwort" type="password"
                           value={password}/>
                    <Button onClick={handleClicked} text={"Login / SignUp"}/>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
