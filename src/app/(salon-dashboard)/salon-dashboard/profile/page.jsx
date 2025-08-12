"use client"
import ProfileSetting from '@/component/staffDashboard/ProfileSetting';
import React, { useState } from 'react';

const Page = () => {
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

  

    return (
      <ProfileSetting 
                      profileData={profileData} 
                      setProfileData={setProfileData}
                    />
    );
}

export default Page;
