import React from 'react';
import {Outlet} from 'react-router-dom';
import ToasterProvider from "./ToasterProvider";
import NavigationBar from "./navigation/NavigationBar";

const Layout = () => {
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
