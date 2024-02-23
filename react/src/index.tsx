import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css'; // Importiert globale Styles


import App from "./App";
import {CookiesProvider} from "react-cookie";

// Rendere die App mit dem RouterProvider
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <CookiesProvider>
            <App/>
        </CookiesProvider>
    </React.StrictMode>
);
