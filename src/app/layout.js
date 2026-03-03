"use client";

import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <SessionProvider>
          <ToastContainer theme="colored" position="top-right" />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
