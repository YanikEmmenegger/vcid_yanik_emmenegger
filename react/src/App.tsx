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
    if (process.env.REACT_APP_API_BASE_URL) {
        axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL
    } else {
        axios.defaults.baseURL = "https://" + window.location.host
    }
    console.debug(axios.defaults.baseURL)
//REsultat ist https://vcid.yanik.pro -> Fehlermeldung: The page at 'https://vcid.yanik.pro/' was loaded over HTTPS, but requested an insecure resource 'http://vcid.yanik.pro/api/auth/logout'. This request has been blocked; the content must be served over HTTPS.


    return <RouterProvider router={router}/>;
}

export default App;
