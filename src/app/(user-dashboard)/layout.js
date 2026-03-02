"use client";

import "./../globals.css";
import UserSidebar from "@/component/Customer/UserSideBar";
import UserTopNav from "@/component/Customer/UserTopNav";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CustomerLayout({ children }) {
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [messages, setMessages] = useState([]);
  const [profileData, setProfileData] = useState(null); // ✅ object instead of []


useEffect(() => {
  console.log("=== Layout Mounted ===");

  fetch("/api/user/profile", {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Parsed Data:", data);
      if (data.success) {
        setProfileData(data.data);
      }
    })
    .catch((err) => {
      console.error("Fetch Error:", err);
    });

}, []);
  // ✅ Dummy notifications
  useEffect(() => {
    const data = [
      { id: 1, text: "Your appointment is confirmed", unread: true },
      { id: 2, text: "Payment received", unread: false },
    ];
    setMessages(data);
    setUnreadNotifications(data.filter((m) => m.unread).length);
  }, []);

  const toggleMobileMenu = () =>
    setMobileMenuOpen((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-50
          w-64 h-full flex-shrink-0
          bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <UserSidebar
  profileData={profileData}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  unreadNotifications={unreadNotifications}
  messages={messages}
  setMobileMenuOpen={setMobileMenuOpen}
/>
      </aside>

      {/* Right Side */}
      <div className="flex flex-col flex-1 min-w-0 ">

        {/* Top Navigation */}
        <header className="flex-shrink-0 z-30">
          <UserTopNav
            activeTab={activeTab}
            onMenuToggle={toggleMobileMenu}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            unreadNotifications={unreadNotifications}
            profileData={profileData}
          />
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* ✅ Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
}