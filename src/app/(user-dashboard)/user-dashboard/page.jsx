"use client"
import DashboardContent from '@/component/Customer/Overview';
import React, { useState } from 'react';

const Page = () => {
  const [appointments, setAppointments] = useState([]);

  return (
<DashboardContent appointments={appointments} />
  );
}

export default Page;
