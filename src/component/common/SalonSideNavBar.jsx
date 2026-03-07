'use client';
import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 13+ app router
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearAllAuthData } from "@/lib/cookiesAction";
import { signOut } from "next-auth/react";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiCalendar,
  FiUsers,
  FiSettings,
} from "react-icons/fi";
import { RiDashboardFill, RiScissorsFill } from "react-icons/ri";
import useLogout from "../hooks/SalonLogout";
import { AlertTriangle, Calendar, LayoutDashboard, MessageSquare, Scissors, Settings, Star, User, Users } from "lucide-react";

export default function SalonsSideBar({profileData}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Add loading state

  // Define URLs for each tab
  const menuItems = [
    // Main Sections
    { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/salon-dashboard/" },
    { id: "appointments", icon: <Calendar size={20} />, label: "Appointments", href: "/salon-dashboard/appointments" },
    { id: "services", icon: <Scissors size={20} />, label: "Services", href: "/salon-dashboard/services" },
    { id: "staff", icon: <Users size={20} />, label: "Staff", href: "/salon-dashboard/staff" },
    
    // Customer Interaction
    { id: "messages", icon: <MessageSquare size={20} />, label: "Messages", href: "/salon-dashboard/messages" },
    { id: "reviews", icon: <Star size={20} />, label: "Reviews", href: "/salon-dashboard/reviews" },
    { id: "complaints", icon: <AlertTriangle size={20} />, label: "Complaints", href: "/salon-dashboard/complaints" },
    
    // Settings
    { id: "profile", icon: <User size={20} />, label: "Profile", href: "/salon-dashboard/profile" },
    { id: "Connect Account", icon: <Settings size={20} />, label: "Bank Account", href: "/salon-dashboard/bank-account" },
  ];

  function handleTabChange(id, href) {
    setActiveTab(id);
    router.push(href);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }

  const confirmLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    try {
      setIsLoggingOut(true);
      
      // 1️⃣ Call backend logout API to clear HttpOnly cookies
      const response = await fetch("/api/auth/salons/logout", {
        method: "POST",
        credentials: "include", // Important for cookies
      });

      if (!response.ok) {
        console.error("Logout API failed with status:", response.status);
      }

      // 2️⃣ Clear all frontend auth data
      clearAllAuthData();

      // 3️⃣ Force redirect to signin page with cache busting
      // Use window.location for a hard redirect to ensure all state is cleared
      window.location.href = "/salon/signin?t=" + Date.now();
      
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API fails, try to clear local data and redirect
      clearAllAuthData();
      window.location.href = "/salon/signin?t=" + Date.now();
    } finally {
      setShowLogoutModal(false);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(true)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:static z-30 w-72 h-full bg-white shadow-xl lg:shadow-none border-r border-gray-200/70"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200/70">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mr-3">
              <RiScissorsFill className="text-white text-lg" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {profileData.salon_name}
            </h1>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="p-4 ">
          {menuItems.map(({ id, icon, label, href }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id, href)}
              className={`flex items-center w-full p-3 cursor-pointer rounded-lg font-semibold transition-colors ${
                activeTab === id
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"
              }`}
              aria-current={activeTab === id ? "page" : undefined}
            >
              <span className="mr-3">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className=" p-3 mb-2 ml-3 border-t border-gray-200/70 flex items-center justify-between">
          <button
            onClick={() => setShowLogoutModal(true)} // ← FIXED: Open modal instead of direct logout
            className="flex items-center text-red-600 cursor-pointer hover:text-red-700 font-semibold"
            aria-label="Logout"
          >
            <FiLogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </motion.aside>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white shadow-lg text-gray-700 hover:text-indigo-600 lg:hidden"
          aria-label="Open sidebar"
        >
          <FiMenu size={24} />
        </button>
      )}

      {/* Logout Modal - Single instance */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-lg shadow-lg p-6 w-80 max-w-full text-center"
            >
              <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to logout from your salon dashboard?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmLogout}
                  disabled={isLoggingOut}
                  className={`bg-red-600 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-red-700 ${
                    isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}