"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiUser,
  FiBell,
  FiLogOut,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiSettings,
  FiAlertCircle,
} from "react-icons/fi";
import { FaCut, FaRegCalendarCheck, FaRegCalendarTimes } from "react-icons/fa";
import Overview from "@/app/(public)/component/staffDashboard/Overview";
import Appointments from "@/app/(public)/component/staffDashboard/Appointment";
import Customers from "@/app/(public)/component/staffDashboard/Customer";
import Services from "@/app/(public)/component/staffDashboard/Services";
import ProfileSetting from "@/app/(public)/component/staffDashboard/ProfileSetting";

export default function SalonStaffDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [profileData, setProfileData] = useState({
    name: "Sarah Johnson",
    role: "Senior Stylist",
    email: "sarah@prestigesalon.com",
    phone: "+1 (555) 123-4567",
    joinDate: "15 March 2020",
    bio: "Specialized in hair coloring and keratin treatments with 8 years of experience.",
  });

  // Mock data fetch
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    setNotifications([
      {
        id: 1,
        type: "warning",
        message: "Customer complaint about color mismatch",
        time: "2 hours ago",
        read: false,
      },
      {
        id: 2,
        type: "appointment",
        message: "New appointment request from Lisa Ray",
        time: "5 hours ago",
        read: true,
      },
      {
        id: 3,
        type: "system",
        message: "System maintenance scheduled for tonight",
        time: "1 day ago",
        read: true,
      },
    ]);

    setAppointments([
      {
        id: 1,
        customer: "Emma Watson",
        service: "Hair Color + Cut",
        date: "Today, 10:30 AM",
        status: "pending",
      },
      {
        id: 2,
        customer: "Olivia Parker",
        service: "Keratin Treatment",
        date: "Today, 2:00 PM",
        status: "pending",
      },
      {
        id: 3,
        customer: "Sophia Lee",
        service: "Manicure + Pedicure",
        date: "Tomorrow, 11:00 AM",
        status: "pending",
      },
      {
        id: 4,
        customer: "Ava Martinez",
        service: "Haircut",
        date: "Yesterday, 3:30 PM",
        status: "completed",
      },
      {
        id: 5,
        customer: "Mia Johnson",
        service: "Balayage",
        date: "Yesterday, 1:00 PM",
        status: "completed",
      },
      {
        id: 6,
        customer: "Isabella Brown",
        service: "Extensions",
        date: "15 May, 10:00 AM",
        status: "rejected",
        reason: "Requested stylist unavailable",
      },
    ]);

    setServices([
      { id: 1, name: "Haircut", duration: "45 min", price: 45, active: true },
      {
        id: 2,
        name: "Hair Color",
        duration: "2 hours",
        price: 120,
        active: true,
      },
      {
        id: 3,
        name: "Keratin Treatment",
        duration: "3 hours",
        price: 250,
        active: true,
      },
      { id: 4, name: "Manicure", duration: "30 min", price: 25, active: true },
      { id: 5, name: "Pedicure", duration: "45 min", price: 35, active: true },
    ]);
  }, []);

  const handleAppointmentAction = (id, action, reason = "") => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status: action, ...(action === "rejected" && { reason }) }
          : app
      )
    );
  };

  const toggleServiceStatus = (id) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, active: !service.active } : service
      )
    );
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Close sidebar on mobile when a tab is selected
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {!sidebarOpen && (
        <div
          className="fixed inset-0 z-20  bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:static z-30 w-64 h-full bg-white shadow-lg lg:shadow-none"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-indigo-600">Prestige Salon</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <FiUser className="text-indigo-600" size={20} />
            </div>
            <div>
              <h3 className="font-medium">{profileData.name}</h3>
              <p className="text-sm text-gray-500">{profileData.role}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <button
            onClick={() => handleTabChange("dashboard")}
            className={`flex items-center w-full p-2 rounded-lg ${
              activeTab === "dashboard"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FiUser className="mr-3" />
            Dashboard
          </button>
          <button
            onClick={() => handleTabChange("appointments")}
            className={`flex items-center w-full p-2 rounded-lg ${
              activeTab === "appointments"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FiCalendar className="mr-3" />
            Appointments
          </button>
          <button
            onClick={() => handleTabChange("customers")}
            className={`flex items-center w-full p-2 rounded-lg ${
              activeTab === "customers"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FiUsers className="mr-3" />
            Customers
          </button>
          <button
            onClick={() => handleTabChange("services")}
            className={`flex items-center w-full p-2 rounded-lg ${
              activeTab === "services"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaCut className="mr-3" />
            Services
          </button>
          <button
            onClick={() => handleTabChange("profile")}
            className={`flex items-center w-full p-2 rounded-lg ${
              activeTab === "profile"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FiSettings className="mr-3" />
            Profile Settings
          </button>
          <button className="flex items-center w-full p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <FiLogOut className="mr-3" />
            Logout
          </button>
        </nav>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <FiMenu size={20} />
            </button>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                  <FiBell size={20} />
                  {notifications.some((n) => !n.read) && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>
              <div className="hidden md:block">
                <h3 className="font-medium">{profileData.name}</h3>
                <p className="text-xs text-gray-500">{profileData.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {activeTab === "dashboard" && <Overview />}

          {activeTab === "appointments" && (
            <Appointments
              appointments={appointments}
              handleAppointmentAction={handleAppointmentAction}
            />
          )}

          {activeTab === "customers" && <Customers />}

          {activeTab === "services" && <Services />}

          {activeTab === "profile" && (
            <ProfileSetting/>
          )}
        </main>
      </div>
    </div>
  );
}