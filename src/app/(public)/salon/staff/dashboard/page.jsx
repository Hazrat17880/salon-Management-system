'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FiChevronRight,
  FiClock,
  FiCheckCircle,
  FiPlus
} from "react-icons/fi";
import { FaCut, FaRegCalendarCheck, FaRegCalendarTimes, FaStar, FaMagic } from "react-icons/fa";
import { RiDashboardFill, RiScissorsFill } from "react-icons/ri";
import { IoMdColorPalette } from "react-icons/io";
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
    rating: 4.9,
    clients: 1243,
    avatar: "/avatars/stylist-1.jpg"
  });

  // Mock data fetch
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        type: "warning",
        message: "Customer feedback about color mismatch",
        time: "2 hours ago",
        read: false,
        icon: <FiAlertCircle className="text-amber-500" size={18} />
      },
      {
        id: 2,
        type: "appointment",
        message: "New booking from Lisa Ray for Balayage",
        time: "5 hours ago",
        read: true,
        icon: <FaRegCalendarCheck className="text-indigo-500" size={16} />
      },
      {
        id: 3,
        type: "payment",
        message: "Payment received for service #4582 ($120)",
        time: "1 day ago",
        read: true,
        icon: <FiDollarSign className="text-emerald-500" size={16} />
      },
    ]);

    setAppointments([
      {
        id: 1,
        customer: "Emma Watson",
        service: "Hair Color + Cut",
        date: "Today, 10:30 AM",
        duration: "2h 15m",
        status: "pending",
        avatar: "/avatars/client-1.jpg",
        price: 185
      },
      {
        id: 2,
        customer: "Olivia Parker",
        service: "Keratin Treatment",
        date: "Today, 2:00 PM",
        duration: "3h",
        status: "pending",
        avatar: "/avatars/client-2.jpg",
        price: 250
      },
      {
        id: 3,
        customer: "Sophia Lee",
        service: "Manicure + Pedicure",
        date: "Tomorrow, 11:00 AM",
        duration: "1h 15m",
        status: "pending",
        avatar: "/avatars/client-3.jpg",
        price: 60
      },
      {
        id: 4,
        customer: "Ava Martinez",
        service: "Haircut",
        date: "Yesterday, 3:30 PM",
        duration: "45m",
        status: "completed",
        avatar: "/avatars/client-4.jpg",
        price: 45
      },
    ]);

    setServices([
      { 
        id: 1, 
        name: "Haircut", 
        duration: "45 min", 
        price: 45, 
        active: true, 
        category: "Hair",
        icon: <RiScissorsFill className="text-indigo-500" />
      },
      { 
        id: 2, 
        name: "Balayage", 
        duration: "2.5 hours", 
        price: 185, 
        active: true, 
        category: "Color",
        icon: <IoMdColorPalette className="text-purple-500" />
      },
      { 
        id: 3, 
        name: "Keratin Treatment", 
        duration: "3 hours", 
        price: 250, 
        active: true, 
        category: "Treatment",
        icon: <FaMagic className="text-amber-500" />
      },
      { 
        id: 4, 
        name: "Signature Manicure", 
        duration: "45 min", 
        price: 35, 
        active: true, 
        category: "Nails",
        icon: <FaCut className="text-pink-500" />
      },
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
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      {/* Mobile sidebar backdrop */}
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

      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:static z-30 w-80 h-full bg-white shadow-xl lg:shadow-none border-r border-gray-200/70"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200/70">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mr-3">
              <RiScissorsFill className="text-white text-lg" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Prestige
            </h1>
          </motion.div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200/70">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                <img 
                  src={profileData.avatar} 
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/avatars/default.jpg";
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                  <FaStar className="text-white text-xs" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{profileData.name}</h3>
              <p className="text-sm text-gray-500">{profileData.role}</p>
              <div className="flex items-center mt-1">
                <FaStar className="text-amber-400 text-xs mr-1" />
                <span className="text-xs font-medium text-gray-700">
                  {profileData.rating} ({profileData.clients.toLocaleString()}+ clients)
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {[
            { id: "dashboard", icon: <RiDashboardFill size={20} />, label: "Dashboard" },
            { id: "appointments", icon: <FiCalendar size={20} />, label: "Appointments" },
            { id: "customers", icon: <FiUsers size={20} />, label: "Clients" },
            { id: "services", icon: <FaCut size={18} />, label: "Services" },
            { id: "profile", icon: <FiSettings size={20} />, label: "Profile" }
          ].map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTabChange(item.id)}
              className={`flex items-center w-full p-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-indigo-50/80 to-purple-50/80 text-indigo-600 shadow-sm border border-indigo-100"
                  : "text-gray-600 hover:bg-gray-50/50"
              }`}
            >
              <span className={`mr-3 ${activeTab === item.id ? "text-indigo-500" : "text-gray-400"}`}>
                {item.icon}
              </span>
              <span className="font-medium text-[15px]">{item.label}</span>
              {activeTab === item.id && (
                <FiChevronRight className="ml-auto text-indigo-400" />
              )}
            </motion.button>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-200/50">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center w-full p-3 rounded-xl text-gray-600 hover:bg-gray-50/50 transition-colors"
            >
              <FiLogOut className="mr-3 text-gray-400" size={20} />
              <span className="font-medium text-[15px]">Sign Out</span>
            </motion.button>
          </div>
        </nav>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200/70">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
            >
              <FiMenu size={22} />
            </button>

            <div className="flex items-center space-x-5">
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors relative"
                >
                  <FiBell size={20} />
                  {notifications.some((n) => !n.read) && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"
                    />
                  )}
                </motion.button>

                {/* Notifications dropdown would go here */}
              </div>
              
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  <img 
                    src={profileData.avatar} 
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/avatars/default.jpg";
                    }}
                  />
                </div>
                <div className="text-right">
                  <h3 className="font-medium text-gray-800 text-sm">{profileData.name}</h3>
                  <p className="text-xs text-gray-500">{profileData.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50/30 to-gray-100/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === "dashboard" && (
                <Overview 
                  profileData={profileData} 
                  appointments={appointments} 
                  notifications={notifications}
                />
              )}
              {activeTab === "appointments" && (
                <Appointments
                  appointments={appointments}
                  handleAppointmentAction={handleAppointmentAction}
                />
              )}
              {activeTab === "customers" && <Customers />}
              {activeTab === "services" && (
                <Services 
                  services={services} 
                  toggleServiceStatus={toggleServiceStatus} 
                />
              )}
              {activeTab === "profile" && (
                <ProfileSetting 
                  profileData={profileData} 
                  setProfileData={setProfileData}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}