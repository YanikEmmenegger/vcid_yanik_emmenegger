    import React from 'react';
    import { createBrowserRouter, RouterProvider } from 'react-router-dom';
    import Layout from './components/Layout';
    import {routes} from "./helpers/routes";
    import axios from "axios"; // Assuming you have an About component


    const childRoutes = routes.map((route) => {
        return {
            path: "/app/"+route.path,
            element: route.element,
        };
    });

    axios.defaults.withCredentials = true;

    // Define your routes here, including the layout and any child routes
    const router = createBrowserRouter([
        {
            path: "/app/",
            element: <Layout />,
            children: childRoutes,
        },
    ]);

    function App() {
        return <RouterProvider router={router} />;
    }

    export default App;
