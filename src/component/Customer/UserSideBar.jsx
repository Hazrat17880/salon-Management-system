"use client";

import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import {
  FiHome,
  FiUser,
  FiCalendar,
  FiMessageSquare,
  FiBell,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { FaCut } from "react-icons/fa";
import { useState } from "react";

export default function UserSidebar({
  unreadNotifications,
  messages,
  setMobileMenuOpen,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => setShowLogoutConfirm(true);
  const confirmLogout = () => router.push("/login");
  const cancelLogout = () => setShowLogoutConfirm(false);

  // Navigation links
  const navLinks = [
    { label: "Dashboard", icon: <FiHome size={20} />, href: "/user-dashboard/" },
    { label: "My Profile", icon: <FiUser size={20} />, href: "/user-dashboard/profile" },
    { label: "Appointments", icon: <FiCalendar size={20} />, href: "/user-dashboard/appointments" },
    { label: "Find Salons", icon: <FaCut size={20} />, href: "/user-dashboard/salons" },
    { label: "Messages", icon: <FiMessageSquare size={20} />, href: "/user-dashboard/messages", badge: messages.filter(m => m.unread).length },
    { label: "Notifications", icon: <FiBell size={20} />, href: "/user-dashboard/notifications", badge: unreadNotifications },
    { label: "Complaints", icon: <FiSettings size={20} />, href: "/user-dashboard/complaints" },
  ];

  return (
    <>
      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout from your account?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-full md:w-64 bg-indigo-800 text-white shadow-lg z-10 h-full flex flex-col">
        <div className="p-4 md:p-6">
          <h1 className="text-2xl font-bold">BeautyConnect</h1>
          <p className="text-indigo-200 text-sm">Customer Dashboard</p>
        </div>

        <nav className="mt-4 md:mt-8 flex-1">
          {navLinks.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  router.push(item.href);
                  setMobileMenuOpen(false); // close on mobile
                }}
                className={`flex items-center px-4 py-3 md:px-6 cursor-pointer transition ${
                  isActive ? "bg-indigo-700" : "hover:bg-indigo-700/50"
                }`}
              >
                <div className="text-indigo-200 mr-3">{item.icon}</div>
                <span className="font-medium">{item.label}</span>
                {item.badge > 0 && (
                  <span className="ml-auto bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            );
          })}
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 text-indigo-200 hover:text-white hover:bg-indigo-700 rounded-lg transition"
          >
            <FiLogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
