'use client';
import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 13+ app router
import { motion, AnimatePresence } from "framer-motion";
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
import { MessageSquare } from "lucide-react";

export default function SalonsSideBar() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Define URLs for each tab
  const menuItems = [
    { id: "dashboard", icon: <RiDashboardFill size={20} />, label: "Dashboard", href: "/salon-dashboard/" },
    { id: "appointments", icon: <FiCalendar size={20} />, label: "Appointments", href: "/salon-dashboard/appointments" },
    // { id: "customers", icon: <FiUsers size={20} />, label: "Customers", href: "/salon-dashboard/customers" },
    { id: "services", icon: <FiSettings size={20} />, label: "Services", href: "/salon-dashboard/services" },
    { id: "messages", icon: <MessageSquare size={20} />, label: "Messages", href: "/salon-dashboard/messages" },

    { id: "profile", icon: <FiSettings size={20} />, label: "Profile Setting", href: "/salon-dashboard/profile" },
  ];

  function handleTabChange(id, href) {
    setActiveTab(id);
    router.push(href);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }

const logout = useLogout();
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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Prestige
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

        <nav className="p-4 space-y-1">
          {menuItems.map(({ id, icon, label, href }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id, href)}
              className={`flex items-center w-full p-3 rounded-lg font-semibold transition-colors ${
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

        <div className="mt-auto p-6 border-t border-gray-200/70 flex items-center justify-between">
          <button
            onClick={logout}
            className="flex items-center text-red-600 hover:text-red-700 font-semibold"
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
    </>
  );
}
