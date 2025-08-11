"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import Sidebar from "@/component/common/AdminSideBar";
import Topbar from "@/component/common/AdminTopNavBar";
import "./../globals.css"
export default function AdminLayout({ children }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setNotifications([
      { id: 1, type: "warning", message: "New salon registration requires approval", time: "2 hours ago", read: false },
      { id: 2, type: "complaint", message: "Customer complaint about Elite Salon", time: "5 hours ago", read: true },
      { id: 3, type: "system", message: "System update available", time: "1 day ago", read: true }
    ]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleLogout = () => {
    console.log("User logged out");
    setShowLogoutConfirm(false);
    // Redirect or logout logic here
  };

  return (
  <html>
    <body>

        <div className="flex h-screen bg-gradient-to-r from-gray-50 to-indigo-50 font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Logout Confirmation Modal */}
      {/* <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <FiLogOut className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Logout</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to logout from the admin panel?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence> */}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          unreadCount={unreadCount}
          notifications={notifications}
          markAsRead={markAsRead}
          onLogout={() => setShowLogoutConfirm(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
          {/* You can switch page components here based on activeTab */}
          {children}
        </main>
      </div>
    </div>
    </body>
  </html>
  );
}
