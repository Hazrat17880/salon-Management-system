"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiHome, FiUser, FiCalendar, FiMessageSquare, FiBell, FiSettings, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { FaCut, FaRegSmile, FaRegFrown } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";

// import components 
import DashboardContent from "../component/Customer/Overview";
import ProfileContent from "../component/Customer/Profile";
import AppointmentsContent from "../component/Customer/AppContent";
import SalonsContent from "../component/Customer/Salon";
import MessagesContent from "../component/Customer/Message";
import ComplaintsContent from "../component/Customer/Complaints";
import NotificationsContent from "../component/Customer/Notification";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Hazrat Usman",
    email: "hazratusman17880@gmail.com",
    phone: "+92 315 94492 46",
    joined: "January 2023",
    image:"/fe1.webp"
  });
  const router = useRouter();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeTab]);

  useEffect(() => {
    setAppointments([
      {
        id: 1,
        salon: "Glamour Studio",
        service: "Haircut & Styling",
        date: "2023-06-15",
        time: "14:30",
        status: "confirmed",
        price: "$45"
      },
      {
        id: 2,
        salon: "Beauty Lounge",
        service: "Manicure",
        date: "2023-06-18",
        time: "11:00",
        status: "pending",
        price: "$25"
      },
      {
        id: 3,
        salon: "Elite Barbers",
        service: "Beard Trim",
        date: "2023-06-10",
        time: "16:45",
        status: "completed",
        price: "$20"
      },
      {
        id: 4,
        salon: "Posh Spa",
        service: "Facial Treatment",
        date: "2023-06-22",
        time: "13:15",
        status: "rejected",
        price: "$60"
      }
    ]);

    setNotifications([
      {
        id: 1,
        message: "Your appointment at Glamour Studio is confirmed",
        time: "2 hours ago",
        read: false
      },
      {
        id: 2,
        message: "New message from Beauty Lounge",
        time: "1 day ago",
        read: false
      },
      {
        id: 3,
        message: "Special offer: 20% off your next visit",
        time: "3 days ago",
        read: true
      }
    ]);

    setMessages([
      {
        id: 1,
        salon: "Beauty Lounge",
        message: "Hi Alex, we can accommodate your requested time. Please confirm.",
        time: "Yesterday, 4:32 PM",
        unread: true
      },
      {
        id: 2,
        salon: "Glamour Studio",
        message: "Thank you for your visit! How was your experience?",
        time: "June 10, 11:20 AM",
        unread: false
      }
    ]);
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    router.push("/login");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
    setUnreadNotifications(unreadNotifications - 1);
  };

  const cancelAppointment = (id) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent appointments={appointments} />;
      case "profile":
        return <ProfileContent profileData={profileData} setProfileData={setProfileData} />;
      case "appointments":
        return <AppointmentsContent appointments={appointments} cancelAppointment={cancelAppointment} />;
      case "messages":
        return <MessagesContent messages={messages} />;
      case "notifications":
        return <NotificationsContent notifications={notifications} markAsRead={markAsRead} />;
      case "salons":
        return <SalonsContent />;
      case "complaints":
        return <ComplaintsContent />;
      default:
        return <DashboardContent appointments={appointments} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout from your account?</p>
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

      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-600"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <h2 className="text-xl font-semibold text-gray-800 capitalize">
          {activeTab.replace(/-/g, ' ')}
        </h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiBell size={22} className="text-gray-600" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-indigo-800 text-white shadow-lg z-10`}>
        <div className="p-4 md:p-6">
          <h1 className="text-2xl font-bold">BeautyConnect</h1>
          <p className="text-indigo-200 text-sm">Customer Dashboard</p>
        </div>
        
        <nav className="mt-4 md:mt-8">
          <NavItem 
            icon={<FiHome size={20} />} 
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </NavItem>
          
          <NavItem 
            icon={<FiUser size={20} />} 
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          >
            My Profile
          </NavItem>
          
          <NavItem 
            icon={<FiCalendar size={20} />} 
            active={activeTab === "appointments"}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments
          </NavItem>
          
          <NavItem 
            icon={<FaCut size={20} />} 
            active={activeTab === "salons"}
            onClick={() => setActiveTab("salons")}
          >
            Find Salons
          </NavItem>
          
          <NavItem 
            icon={<FiMessageSquare size={20} />} 
            active={activeTab === "messages"}
            onClick={() => setActiveTab("messages")}
            badge={messages.filter(m => m.unread).length}
          >
            Messages
          </NavItem>
          
          <NavItem 
            icon={<FiBell size={20} />} 
            active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
            badge={unreadNotifications}
          >
            Notifications
          </NavItem>
          
          <NavItem 
            icon={<FiSettings size={20} />} 
            active={activeTab === "complaints"}
            onClick={() => setActiveTab("complaints")}
          >
            Complaints
          </NavItem>
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
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Desktop Header */}
        <header className="hidden md:flex bg-white shadow-sm p-4 justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {activeTab.replace(/-/g, ' ')}
          </h2>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiBell size={22} className="text-gray-600" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </div>
            
            <div className="flex items-center">
              {profileData.image ? (
                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                  <Image
                    src={profileData.image}
                    alt={profileData.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                  {profileData.name.charAt(0)}
                </div>
              )}
              <span className="ml-2 text-gray-700">{profileData.name}</span>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="p-4 md:p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

// Navigation Item Component
const NavItem = ({ icon, children, active, onClick, badge }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center px-4 py-3 md:px-6 cursor-pointer transition ${active ? 'bg-indigo-700' : 'hover:bg-indigo-700/50'}`}
      onClick={onClick}
    >
      <div className="text-indigo-200 mr-3">
        {icon}
      </div>
      <span className="font-medium">{children}</span>
      {badge > 0 && (
        <span className="ml-auto bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </motion.div>
  );
};