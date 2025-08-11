"use client"
import Appointments from '@/component/staffDashboard/Appointment';
import React, { useState } from 'react';

const Page = () => {
      const [notifications, setNotifications] = useState([]);
      const [appointments, setAppointments] = useState([]);
      const [services, setServices] = useState([]);
   
    
     
    
      const handleAppointmentAction = (id, action, reason = "") => {
        setAppointments((prev) =>
          prev.map((app) =>
            app.id === id
              ? { ...app, status: action, ...(action === "rejected" && { reason }) }
              : app
          )
        );
      };
    
  
    return (
       <Appointments
                       appointments={appointments}
                       handleAppointmentAction={handleAppointmentAction}
                     />
    );
}

export default Page;
