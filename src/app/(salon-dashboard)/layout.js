'use client';
import SalonsSideBar from "@/component/common/SalonSideNavBar";
import SalonsTopBar from "@/component/common/SalonTopNav";
import "./../globals.css"
import { ToastContainer } from "react-toastify";
export default function Layout({ children }) {
  // To sync sidebar open/close between Sidebar and TopBar,
  // you'd normally lift the state up here and pass as props,
  // but as per request no props are used.
  // So this layout just renders Sidebar + TopBar + children.

  return (
    <html>
      <body  suppressHydrationWarning={true}>
        <ToastContainer/>
        <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SalonsSideBar />
      <div className="flex flex-col flex-1 overflow-auto">
        <SalonsTopBar />
        <main className="flex-1 p-6 overflow-auto">
          {children ?? (
            <div className="text-center text-gray-400 select-none">
              <p>This is the main content area.</p>
              <p>Add your page content here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
      </body>
    </html>
  );
}
