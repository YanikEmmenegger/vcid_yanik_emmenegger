import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Layout from './components/Layout';
import {routes} from "./helpers/routes";
import axios from "axios"; // Assuming you have an About component


const childRoutes = routes.map((route) => {
    return {
        path: "/app/" + route.path,
        element: route.element,
    };
});


// Define your routes here, including the layout and any child routes
const router = createBrowserRouter([
    {
        path: "/app/",
        element: <Layout/>,
        children: childRoutes,
    },
]);


function App() {
    //set axios defaults withCredentials to true to send cookies and base url
    axios.defaults.withCredentials = true;


    return <RouterProvider router={router}/>;
}

export default App;
