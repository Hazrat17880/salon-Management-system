"use client"
import Services from '@/component/staffDashboard/Services';
import React, { useState } from 'react';

const Page = () => {
   
    const [services, setServices] = useState([]);
    
  


  
    const toggleServiceStatus = (id) => {
      setServices((prev) =>
        prev.map((service) =>
          service.id === id ? { ...service, active: !service.active } : service
        )
      );
    };
  
    return (
       <Services 
                        services={services} 
                        toggleServiceStatus={toggleServiceStatus} 
                      />
    );
}

export default Page;
