import React, {useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import ToasterProvider from "./ToasterProvider";
import NavigationBar from "./navigation/NavigationBar";
import ModalProvider from "./ModalProvider";
import CircleButton from "./CircleButton";

const Layout = () => {

    //get url params
    const location = new URLSearchParams(window.location.search).get("location");
    const navigate = useNavigate();


    useEffect(() => {
        if (location) {
            navigate("/app/" + location);
        }
    }, [location])

    return (
        <div>
            <ToasterProvider>

                <main className="container md:w-3/4 mx-auto">
                    <Outlet/>
                </main>
                <NavigationBar/>
            </ToasterProvider>
            <ModalProvider/>
        </div>
    );
};

export default Layout;
