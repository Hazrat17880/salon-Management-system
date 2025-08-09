"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu, FiX, FiUser, FiBell, FiLogOut, FiCalendar,
  FiDollarSign, FiUsers, FiSettings, FiAlertCircle,
  FiBarChart2, FiTrendingUp, FiMail
} from "react-icons/fi";
import Overview from "@/app/(public)/component/admin-panel/overview";
import SalonManagement from "@/app/(public)/component/admin-panel/salon";
import CustomerManagement from "@/app/(public)/component/admin-panel/Customer";
import StaffManagement from "@/app/(public)/component/admin-panel/Staff";
import AppointmentManagement from "@/app/(public)/component/admin-panel/Appointment";
import ServiceManagement from "@/app/(public)/component/admin-panel/Services";
import PaymentsAndEarnings from "@/app/(public)/component/admin-panel/Payment&Earning";
import FeedbackComplaints from "@/app/(public)/component/admin-panel/FeedbackComplaints";
import Report from "@/app/(public)/component/admin-panel/Report";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    setNotifications([
      { id: 1, type: "warning", message: "New salon registration requires approval", time: "2 hours ago", read: false },
      { id: 2, type: "complaint", message: "Customer complaint about Elite Salon", time: "5 hours ago", read: true },
      { id: 3, type: "system", message: "System update available", time: "1 day ago", read: true }
    ]);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleNotificationPopup = () => {
    setShowNotificationPopup(!showNotificationPopup);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleLogout = () => {
    // Here you would typically call your logout API
    console.log("User logged out");
    // Then redirect to login page
    // router.push('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-50 to-indigo-50 font-sans">
      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
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
      </AnimatePresence>

      {/* Overlay - only shown on mobile when sidebar is closed */}
      {isMobile && !sidebarOpen && (
        <div
          className="fixed inset-0 z-20  bg-opacity-40"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed lg:static z-30 w-64 h-full bg-white shadow-xl rounded-r-xl border-r border-gray-200"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-indigo-600 tracking-wide">Salon Admin</h1>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              <FiX size={22} />
            </button>
          )}
        </div>

        <nav className="px-4 py-6 space-y-2 text-sm">
          {[
            { tab: "dashboard", icon: FiBarChart2, label: "Dashboard" },
            { tab: "salons", icon: FiUser, label: "Salon Management" },
            { tab: "customers", icon: FiUsers, label: "Customer Management" },
            { tab: "staff", icon: FiUser, label: "Staff Management" },
            { tab: "appointments", icon: FiCalendar, label: "Appointments" },
            { tab: "services", icon: FiSettings, label: "Services" },
            { tab: "payments", icon: FiDollarSign, label: "Payments & Earnings" },
            { tab: "complaints", icon: FiAlertCircle, label: "Feedback & Complaints" },
            { tab: "reports", icon: FiTrendingUp, label: "Reports & Analysis" }
          ].map(({ tab, icon: Icon, label }) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`flex items-center w-full p-2 rounded-xl transition-all duration-200 ${
                activeTab === tab
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="mr-3" size={18} /> {label}
            </button>
          ))}
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center w-full p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-xl transition"
          >
            <FiLogOut className="mr-3" /> Logout
          </button>
        </nav>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md">
          <div className="flex items-center justify-between px-6 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            <div className="flex items-center space-x-5">
              <div className="relative">
                <button 
                  onClick={toggleNotificationPopup}
                  className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 p-2 rounded-full"
                >
                  <FiBell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                
                {/* Notification Popup */}
                <AnimatePresence>
                  {showNotificationPopup && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="fixed left-80 top-12 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-20"
                    >
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="font-medium text-gray-800">Notifications ({unreadCount})</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notification.read ? "bg-indigo-50" : ""
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start">
                              <div
                                className={`mt-1 mr-3 w-2 h-2 rounded-full flex-shrink-0 ${
                                  notification.type === "warning"
                                    ? "bg-yellow-500"
                                    : notification.type === "complaint"
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                                }`}
                              ></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <span className="text-xs text-indigo-600 font-medium ml-2">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-200 text-center">
                        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="hidden md:block text-right">
                <h3 className="text-sm font-semibold text-gray-700">Admin User</h3>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
          {activeTab === "dashboard" && <Overview />}
          {activeTab === "salons" && <SalonManagement />}
          {activeTab === "customers" && <CustomerManagement />}
          {activeTab === "staff" && <StaffManagement />}
          {activeTab === "appointments" && <AppointmentManagement />}
          {activeTab === "services" && <ServiceManagement />}
          {activeTab === "payments" && <PaymentsAndEarnings />}
          {activeTab === "complaints" && <FeedbackComplaints />}
          {activeTab === "reports" && <Report/>}
        </main>
      </div>
    </div>
  );
}