"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import {
  FiBarChart2,
  FiUser,
  FiUsers,
  FiCalendar,
  FiSettings,
  FiDollarSign,
  FiAlertCircle,
  FiTrendingUp,
  FiLogOut,
  FiX,
  FiMessageSquare,
  FiMessageCircle,
} from "react-icons/fi";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Map tabs to routes and labels/icons
  const tabs = [
    { tab: "dashboard", icon: FiBarChart2, label: "Dashboard", route: "/admin-dashboard/" },
    { tab: "salons", icon: FiUser, label: "Salon Management", route: "/admin-dashboard/salons" },
    { tab: "customers", icon: FiUsers, label: "Customer Management", route: "/admin-dashboard/customers" },
    { tab: "appointments", icon: FiCalendar, label: "Appointments", route: "/admin-dashboard/appointments" },
    { tab: "services", icon: FiSettings, label: "Services", route: "/admin-dashboard/services" },
    { tab: "feedbacks", icon: FiMessageSquare , label: "Feedbacks", route: "/admin-dashboard/feedbacks" },
    { tab: "complaints", icon: FiAlertCircle, label: "Complaints", route: "/admin-dashboard/complaints" },
    // { tab: "reports", icon: FiTrendingUp, label: "Reports & Analysis", route: "/admin-dashboard/reports" },
    { tab: "messages", icon: FiMessageCircle, label: "Messages", route: "/admin-dashboard/messages" },
  ];

  // Derive active tab by matching pathname
  // For example, "/dashboard" -> "dashboard"
  const currentTab = pathname.split("/")[1] || "dashboard";

  const handleTabClick = (route) => {
    router.push(route);
    if (isMobile) setSidebarOpen(false);
  };

  const handleLogout = () => {
    // Add your logout logic here
    // For example, clear tokens, user data, etc.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
            toast.success("Admin Logout Successfully")
    
    // Redirect to login page
    router.push("/admin/login");

  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4"
          >
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <FiLogOut className="text-red-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen || !isMobile ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed lg:static z-30 w-64 h-full bg-white shadow-xl rounded-r-xl border-r border-gray-200 flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-indigo-600 tracking-wide select-none">
            Salon Admin
          </h1>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Close sidebar"
            >
              <FiX size={22} />
            </button>
          )}
        </div>

        <nav className="flex-grow px-4 py-6 space-y-2 text-sm overflow-y-auto">
          {tabs.map(({ tab, icon: Icon, label, route }) => {
            const isActive = currentTab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleTabClick(route)}
                className={`flex items-center w-full p-2 rounded-xl transition-all duration-200 focus:outline-none ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="mr-3" size={18} />
                {label}
              </button>
            );
          })}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center w-full p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-xl transition focus:outline-none"
          >
            <FiLogOut className="mr-3" /> Logout
          </button>
        </nav>
      </motion.div>
    </>
  );
}