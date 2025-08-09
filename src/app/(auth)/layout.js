import React from 'react';
import "@/app/globals.css"
const Layout = ({children}) => {
    return (
  <html lang="en">
      <head>
        <title>
            Login & Signup page
        </title>
      </head>
      <body
    
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
    );
}

export default Layout;
