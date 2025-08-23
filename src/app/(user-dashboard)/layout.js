"use client";

import "./../globals.css";
import UserSidebar from "@/component/Customer/UserSideBar";
import UserTopNav from "@/component/Customer/UserTopNav";
import { useState, useEffect } from "react";

export default function CustomerLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [messages, setMessages] = useState([]);

  const profileData = {
    name: "Hazrat Usman",
    image: "/fe1.webp",
  };

  useEffect(() => {
    setMessages([
      { id: 1, text: "Your appointment is confirmed", unread: true },
      { id: 2, text: "Payment received", unread: false },
    ]);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="bg-gray-50 h-screen flex flex-col">
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Top Navigation */}
      <div className="flex-shrink-0">
        <UserTopNav
          activeTab={activeTab}
          onMenuToggle={toggleMobileMenu}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          unreadNotifications={unreadNotifications}
          profileData={profileData}
        />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative z-50 top-0 left-0 h-full w-64 transform transition-transform duration-300 ease-in-out bg-white shadow-lg md:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
         <UserSidebar
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  unreadNotifications={unreadNotifications}
  messages={messages}
  setMobileMenuOpen={setMobileMenuOpen} // ✅ Add this
/>

        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
