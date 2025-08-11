import AppointmentsContent from '@/component/Customer/AppContent';
import React from 'react';

const Page = () => {

    const [appointments, setAppointments] = useState([]);
        const cancelAppointment = (id) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };
    return (
        <AppointmentsContent appointments={appointments} cancelAppointment={cancelAppointment} />
    );
}

export default Page;
