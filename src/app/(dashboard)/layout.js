import React from 'react';
import "@/app/globals.css"
const Layout = ({children}) => {
    return (
  <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
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
