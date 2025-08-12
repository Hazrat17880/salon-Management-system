import React from 'react';
import "@/app/globals.css"
import { ToastContainer } from 'react-toastify';
const Layout = ({children}) => {
    return (

        <>
        <ToastContainer theme='colored' position='top-right'/>
        {children}
        </>
     
    );
}

export default Layout;
