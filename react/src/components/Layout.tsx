import React, {useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import ToasterProvider from "./ToasterProvider";
import NavigationBar from "./navigation/NavigationBar";

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

                <main className="container px-3 mt-2 mx-auto pb-32">
                    <Outlet/>
                </main>
                <NavigationBar/>
            </ToasterProvider>
        </div>
    );
};

export default Layout;
