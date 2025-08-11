"use client";
import "./../globals.css"
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
      { id: 1, unread: true },
      { id: 2, unread: false },
    ]);
  }, []);

  return (
    <html>
      <body>
          <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <UserTopNav
        activeTab={activeTab}
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
        unreadNotifications={unreadNotifications}
        profileData={profileData}
      />

      {mobileMenuOpen && (
        <div className="absolute top-0 left-0 w-full md:static md:block z-50">
          <UserSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            unreadNotifications={unreadNotifications}
            messages={messages}
          />
        </div>
      )}

      <div className="hidden md:block">
        <UserSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadNotifications={unreadNotifications}
          messages={messages}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
      </body>
    </html>
  );
}
