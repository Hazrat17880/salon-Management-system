"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiHome, FiUser, FiCalendar, FiMessageSquare, FiBell, FiSettings, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { FaCut, FaRegSmile, FaRegFrown } from "react-icons/fa";
import { motion } from "framer-motion";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    joined: "January 2023"
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
    router.push("/login");
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
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                {profileData.name.charAt(0)}
              </div>
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

// Dashboard Content Component
const DashboardContent = ({ appointments }) => {
  const stats = [
    { name: 'Upcoming', value: appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length },
    { name: 'Completed', value: appointments.filter(a => a.status === 'completed').length },
    { name: 'Salons', value: 4 },
    { name: 'Messages', value: 2 }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-xs md:text-sm text-gray-500 font-medium">{stat.name}</h3>
            <p className="text-xl md:text-3xl font-bold text-indigo-600 mt-1 md:mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </div>
      
      <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-800">Recent Appointments</h3>
          <button className="text-xs md:text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-3 md:space-y-4">
          {appointments.slice(0, 3).map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Appointment Card Component
const AppointmentCard = ({ appointment, showActions = false, onCancel }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800"
  };
  
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="flex flex-col p-3 md:p-4 border border-gray-200 rounded-lg hover:shadow-sm transition"
    >
      <div className="flex-1">
        <div className="flex items-center mb-1 md:mb-2">
          <h4 className="text-sm md:text-base font-medium text-gray-900 mr-2 md:mr-3 truncate">
            {appointment.salon}
          </h4>
          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[appointment.status]}`}>
            {appointment.status}
          </span>
        </div>
        <p className="text-xs md:text-sm text-gray-600 truncate">{appointment.service}</p>
      </div>
      
      <div className="mt-2 text-sm md:text-base">
        <p className="text-gray-900 font-medium">
          <span className="md:hidden">{appointment.date.split('-')[1]}/{appointment.date.split('-')[2]}</span>
          <span className="hidden md:inline">{appointment.date}</span> at {appointment.time}
        </p>
        <p className="text-xs md:text-sm text-gray-600">{appointment.price}</p>
      </div>
      
      {showActions && (
        <div className="mt-2 flex space-x-2">
          <button className="px-2 py-1 md:px-3 text-xs md:text-sm bg-indigo-600 text-white rounded md:rounded-lg hover:bg-indigo-700">
            Reschedule
          </button>
          <button 
            onClick={onCancel}
            className="px-2 py-1 md:px-3 text-xs md:text-sm bg-gray-200 text-gray-700 rounded md:rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      )}
    </motion.div>
  );
};

// Profile Content Component
const ProfileContent = ({ profileData, setProfileData }) => {
  const [editing, setEditing] = useState(false);
  
  const handleSave = () => {
    setEditing(false);
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h3 className="text-lg font-semibold text-gray-800">My Profile</h3>
        {editing ? (
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <button 
              onClick={() => setEditing(false)}
              className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm md:text-base"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-3 py-1 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm md:text-base"
            >
              Save
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setEditing(true)}
            className="px-3 py-1 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm md:text-base"
          >
            Edit Profile
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-indigo-100 flex items-center justify-center mb-3 md:mb-4">
            <span className="text-3xl md:text-4xl font-bold text-indigo-600">
              {profileData.name.charAt(0)}
            </span>
          </div>
          {editing && (
            <button className="text-indigo-600 text-sm font-medium">
              Change Photo
            </button>
          )}
        </div>
        
        <div className="space-y-3 md:space-y-4">
          <ProfileField 
            label="Full Name" 
            value={profileData.name} 
            editing={editing}
            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
          />
          <ProfileField 
            label="Email" 
            value={profileData.email} 
            editing={editing}
            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
          />
          <ProfileField 
            label="Phone" 
            value={profileData.phone} 
            editing={editing}
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
          />
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
            <p className="text-gray-800">{profileData.joined}</p>
          </div>
        </div>
      </div>
      
      {editing && (
        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
          <h4 className="text-md font-semibold text-gray-800 mb-3 md:mb-4">Change Password</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" className="w-full px-3 py-2 md:px-4 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" className="w-full px-3 py-2 md:px-4 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Profile Field Component
const ProfileField = ({ label, value, editing, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      {editing ? (
        <input 
          type="text" 
          value={value} 
          onChange={onChange}
          className="w-full px-3 py-2 md:px-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      ) : (
        <p className="text-gray-800">{value}</p>
      )}
    </div>
  );
};

// Appointments Content Component
const AppointmentsContent = ({ appointments, cancelAppointment }) => {
  const [filter, setFilter] = useState("all");
  
  const filteredAppointments = filter === "all" 
    ? appointments 
    : appointments.filter(a => a.status === filter);
  
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 md:mb-0">My Appointments</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter("all")}
            className={`px-2 py-1 md:px-3 text-xs md:text-sm rounded-lg ${filter === "all" ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("pending")}
            className={`px-2 py-1 md:px-3 text-xs md:text-sm rounded-lg ${filter === "pending" ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter("confirmed")}
            className={`px-2 py-1 md:px-3 text-xs md:text-sm rounded-lg ${filter === "confirmed" ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Confirmed
          </button>
          <button 
            onClick={() => setFilter("completed")}
            className={`px-2 py-1 md:px-3 text-xs md:text-sm rounded-lg ${filter === "completed" ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Completed
          </button>
          <button 
            onClick={() => setFilter("rejected")}
            className={`px-2 py-1 md:px-3 text-xs md:text-sm rounded-lg ${filter === "rejected" ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Rejected
          </button>
        </div>
      </div>
      
      <div className="space-y-3 md:space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(appointment => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment} 
              showActions={true}
              onCancel={() => cancelAppointment(appointment.id)}
            />
          ))
        ) : (
          <div className="text-center py-6 md:py-8 text-gray-500">
            No appointments found for this filter
          </div>
        )}
      </div>
    </div>
  );
};

// Messages Content Component
const MessagesContent = ({ messages }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 md:mb-0">Messages</h3>
        <button className="px-3 py-1 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm md:text-base">
          New Message
        </button>
      </div>
      
      <div className="space-y-3 md:space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`p-3 md:p-4 border rounded-lg cursor-pointer transition ${message.unread ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div className="mb-2 md:mb-0">
                <h4 className="font-medium text-gray-900">{message.salon}</h4>
                <p className="text-gray-600 mt-1 text-sm md:text-base">{message.message}</p>
              </div>
              <span className="text-xs text-gray-500">{message.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Notifications Content Component
const NotificationsContent = ({ notifications, markAsRead }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        <button className="text-indigo-600 hover:text-indigo-800 text-sm md:text-base font-medium">
          Mark All as Read
        </button>
      </div>
      
      <div className="space-y-3 md:space-y-4">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`p-3 md:p-4 border rounded-lg cursor-pointer transition ${!notification.read ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}
            onClick={() => !notification.read && markAsRead(notification.id)}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <p className="text-gray-800 mb-2 md:mb-0 text-sm md:text-base">{notification.message}</p>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Salons Content Component
const SalonsContent = () => {
  const salons = [
    {
      id: 1,
      name: "Glamour Studio",
      rating: 4.8,
      services: ["Haircut", "Coloring", "Styling"],
      distance: "0.5 miles",
      image: "/salon1.jpg"
    },
    {
      id: 2,
      name: "Beauty Lounge",
      rating: 4.5,
      services: ["Manicure", "Pedicure", "Waxing"],
      distance: "1.2 miles",
      image: "/salon2.jpg"
    },
    {
      id: 3,
      name: "Elite Barbers",
      rating: 4.9,
      services: ["Haircut", "Shave", "Beard Trim"],
      distance: "0.8 miles",
      image: "/salon3.jpg"
    }
  ];
  
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 md:mb-4">Find Salons Near You</h3>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for salons, services..."
            className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg pl-10 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
          />
          <svg className="absolute left-3 top-2.5 md:top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {salons.map(salon => (
          <motion.div 
            key={salon.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg md:rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <div className="h-32 md:h-40 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Salon Image</span>
            </div>
            <div className="p-3 md:p-4">
              <div className="flex justify-between items-start mb-2 md:mb-3">
                <h4 className="font-semibold text-base md:text-lg">{salon.name}</h4>
                <div className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs md:text-sm">
                  <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{salon.rating}</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs md:text-sm mb-2 md:mb-3">{salon.distance} away</p>
              
              <div className="flex flex-wrap gap-1 mb-3 md:mb-4">
                {salon.services.map((service, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {service}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <button className="text-indigo-600 hover:text-indigo-800 text-xs md:text-sm font-medium">
                  View Details
                </button>
                <button className="px-2 py-1 md:px-3 bg-indigo-600 text-white text-xs md:text-sm rounded md:rounded-lg hover:bg-indigo-700">
                  Book Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Complaints Content Component
const ComplaintsContent = () => {
  const [complaint, setComplaint] = useState("");
  
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-6">Submit a Complaint</h3>
      
      <form className="space-y-3 md:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 md:px-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Related Appointment</label>
          <select className="w-full px-3 py-2 md:px-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base">
            <option>Select an appointment</option>
            <option>Haircut at Glamour Studio - June 15</option>
            <option>Manicure at Beauty Lounge - June 18</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Details</label>
          <textarea 
            rows={4}
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            className="w-full px-3 py-2 md:px-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
          />
        </div>
        
        <div className="flex justify-end">
          <button 
            type="submit"
            className="px-4 py-2 md:px-6 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm md:text-base"
          >
            Submit Complaint
          </button>
        </div>
      </form>
    </div>
  );
};