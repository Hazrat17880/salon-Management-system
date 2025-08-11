"use client"
import ProfileContent from '@/component/Customer/Profile';
import React, { useState } from 'react';

const Page = () => {
      const [profileData, setProfileData] = useState({
        name: "Hazrat Usman",
        email: "hazratusman17880@gmail.com",
        phone: "+92 315 94492 46",
        joined: "January 2023",
        image:"/fe1.webp"
      });
    return (
     <ProfileContent profileData={profileData} setProfileData={setProfileData} />
    );
}

export default Page;
