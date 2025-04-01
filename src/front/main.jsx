import React from 'react';
import ReactDOM from 'react-dom/client'
import './index.css'// Global styles for your application
import { RouterProvider } from "react-router-dom"// Import RouterProvider to use the router
import { router } from "./routes"// Import the router configuration
import { StoreProvider } from './hooks/useGlobalReducer'// Import the StoreProvider for global state management
import { BackendURL } from './components/BackendURL'// Componente para establecer la URL del backend si no está definida

const Main = () => {
    if (!import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL == "") {
        return (
            <React.StrictMode>
                <BackendURL />
            </React.StrictMode>
        );
    }

    return (
        <React.StrictMode>
            <StoreProvider>
                <RouterProvider router={router} />
            </StoreProvider>
        </React.StrictMode>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
