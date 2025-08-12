"use client"
import Overview from '@/component/admin-panel/overview';
import React, { useEffect, useState } from 'react';
import { FaCut, FaMagic, FaRegCalendarCheck } from 'react-icons/fa';
import { FiAlertCircle, FiDollarSign } from 'react-icons/fi';
import { IoMdColorPalette } from 'react-icons/io';
import { RiScissorsFill } from 'react-icons/ri';

const Page = () => {
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
  
 
    return (
       <Overview 
                        profileData={profileData} 
                        appointments={appointments} 
                        notifications={notifications}
                      />
    );
}

export default Page;
