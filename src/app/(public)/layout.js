// src/app/layout.jsx
'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css"

import Navbar from "../../component/common/NavBar";
import Footer from "../../component/common/Footer";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  const hideLayoutPaths = [
    // "/dashboard",
    // "/dashboard/",
    "/salon/staff/dashboard",
    "/admin/",
    "/staff",
    "/staff/"
  ];

  const shouldHideLayout = hideLayoutPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  return (

        <Suspense>
          {!shouldHideLayout && <Navbar />}
          {children}
          {!shouldHideLayout && <Footer />}
        </Suspense>
      
  );
}