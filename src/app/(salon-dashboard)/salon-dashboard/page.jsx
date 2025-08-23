"use client"
import Overview from '@/component/admin-panel/overview';
import React, { useEffect, useState } from 'react';
import { FaCut, FaMagic, FaRegCalendarCheck } from 'react-icons/fa';
import { FiAlertCircle, FiDollarSign } from 'react-icons/fi';
import { IoMdColorPalette } from 'react-icons/io';
import { RiScissorsFill } from 'react-icons/ri';
import { toast } from 'react-toastify';

const Page = () => {
  const [notifications, setNotifications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [profileData, setProfileData] = useState({
    name: "",
    role: "Salon Owner",
    email: "",
    phone: "",
    joinDate: "",
    bio: "",
    rating: 0,
    clients: 0,
    avatar: "/default-avatar.jpg"
  });
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/salons/dashboard'); // Adjust API endpoint as needed
        const result = await response.json();
        console.log(result, 'the result is');
        if (result.success) {
          setDashboardData(result.data);
          
          // Transform API data to match your component structure
          setServices(result.data.services.map(service => ({
            id: service.id,
            name: service.title,
            duration: `${service.duration_minutes} min`,
            price: service.price,
            active: service.status === 'active',
            category: service.main_category,
            icon: getServiceIcon(service.main_category)
          })));

          // You might need to fetch appointments separately or adjust your API
          // For now, I'll show how you might transform appointment data if available
          if (result.data.appointments) {
            setAppointments(transformAppointments(result.data.appointments));
          }

          // Set profile data (you might need a separate API for this)
          setProfileData({
            name: "Salon Owner", // You might get this from your auth context
            role: "Salon Owner",
            email: "", // Get from API if available
            phone: "", // Get from API if available
            joinDate: new Date().toLocaleDateString(),
            bio: "Salon business owner",
            rating: 4.5, // Calculate from reviews if available
            clients: result.data.appointments?.completed || 0,
            avatar: "/default-avatar.jpg"
          });

        } else {
          toast.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Error loading dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to get appropriate icon based on service category
  const getServiceIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'hair':
        return <RiScissorsFill className="text-indigo-500" />;
      case 'color':
        return <IoMdColorPalette className="text-purple-500" />;
      case 'treatment':
        return <FaMagic className="text-amber-500" />;
      case 'nails':
        return <FaCut className="text-pink-500" />;
      default:
        return <RiScissorsFill className="text-gray-500" />;
    }
  };

  // Transform appointments data (adjust based on your API response)
  const transformAppointments = (apptsData) => {
    // This is a placeholder - you'll need to adjust based on your actual API response
    return [
      {
        id: 1,
        customer: "Sample Customer",
        service: "Sample Service",
        date: new Date().toLocaleDateString(),
        duration: "1h",
        status: "pending",
        avatar: "/default-avatar.jpg",
        price: 50
      }
    ];
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Overview 
      profileData={profileData} 
      appointments={appointments} 
      notifications={notifications}
      services={services}
      dashboardData={dashboardData} // Pass the raw data if needed
    />
  );
}

export default Page;