"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
} from "react-icons/fi";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [isMobile, setIsMobile] = useState(false);
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
    { tab: "complaints", icon: FiAlertCircle, label: "Feedback & Complaints", route: "/admin-dashboard/complaints" },
    { tab: "reports", icon: FiTrendingUp, label: "Reports & Analysis", route: "/admin-dashboard/reports" },
  ];

  // Derive active tab by matching pathname
  // For example, "/dashboard" -> "dashboard"
  const currentTab = pathname.split("/")[1] || "dashboard";

  const handleTabClick = (route) => {
    router.push(route);
    if (isMobile) setSidebarOpen(false);
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
            onClick={() => alert("Trigger logout modal in Topbar")}
            className="flex items-center w-full p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-xl transition focus:outline-none"
          >
            <FiLogOut className="mr-3" /> Logout
          </button>
        </nav>
      </motion.div>
    </>
  );
}
