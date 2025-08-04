"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Sample data for demonstration
const sampleAppointments = [
  {
    id: 1,
    salon: "Luxury Hair Studio",
    service: "Premium Haircut & Styling",
    status: "confirmed",
    date: "2023-06-15",
    time: "10:30 AM",
    price: "$65"
  },
  {
    id: 2,
    salon: "Beauty Nails Spa",
    service: "Deluxe Manicure & Pedicure",
    status: "pending",
    date: "2023-06-16",
    time: "2:00 PM",
    price: "$45"
  },
  {
    id: 3,
    salon: "Royal Massage Center",
    service: "60min Deep Tissue Massage",
    status: "completed",
    date: "2023-06-10",
    time: "4:30 PM",
    price: "$85"
  },
  {
    id: 4,
    salon: "Elite Barber Shop",
    service: "Beard Trim & Shave",
    status: "rejected",
    date: "2023-06-18",
    time: "11:00 AM",
    price: "$30"
  },
  {
    id: 5,
    salon: "Glamour Beauty Lounge",
    service: "Full Face Makeup",
    status: "confirmed",
    date: "2023-06-20",
    time: "3:45 PM",
    price: "$55"
  },
  {
    id: 6,
    salon: "Organic Skin Care",
    service: "Facial Treatment",
    status: "pending",
    date: "2023-06-22",
    time: "9:15 AM",
    price: "$75"
  }
];

const AppointmentsContent = ({ appointments = sampleAppointments, cancelAppointment }) => {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState("all");
  
  // Ensure appointments is always an array
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  
  const filteredAppointments = filter === "all" 
    ? safeAppointments 
    : safeAppointments.filter(a => a.status === filter);

  const displayedAppointments = showAll 
    ? filteredAppointments 
    : filteredAppointments.slice(0, 3);

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">My Appointments</h3>
          {filteredAppointments.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <span>{showAll ? 'Show Less' : `View All (${filteredAppointments.length})`}</span>
              <svg 
                className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs md:text-sm rounded-lg transition-all ${filter === "all" ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 text-xs md:text-sm rounded-lg transition-all ${filter === "pending" ? 'bg-yellow-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter("confirmed")}
            className={`px-3 py-1.5 text-xs md:text-sm rounded-lg transition-all ${filter === "confirmed" ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Confirmed
          </button>
          <button 
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 text-xs md:text-sm rounded-lg transition-all ${filter === "completed" ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Completed
          </button>
          <button 
            onClick={() => setFilter("rejected")}
            className={`px-3 py-1.5 text-xs md:text-sm rounded-lg transition-all ${filter === "rejected" ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Rejected
          </button>
        </div>
      </div>
      
      <div className="space-y-3 md:space-y-4">
        {displayedAppointments.length > 0 ? (
          <AnimatePresence>
            {displayedAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AppointmentCard 
                  appointment={appointment} 
                  showActions={true}
                  onCancel={() => cancelAppointment(appointment.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 md:py-12"
          >
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-gray-500 font-medium">No appointments found</h4>
            <p className="text-gray-400 text-sm mt-1">Try changing your filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const AppointmentCard = ({ appointment, showActions = false, onCancel }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800"
  };
  
  const statusIcons = {
    pending: "⏳",
    confirmed: "✅",
    completed: "✔️",
    rejected: "❌"
  };
  
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="flex flex-col p-4 md:p-5 border border-gray-200 rounded-lg hover:shadow-sm transition-all bg-white"
    >
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-base md:text-lg font-semibold text-gray-900 truncate pr-2">
            {appointment.salon}
          </h4>
          <span className={`text-xs px-2.5 py-1 rounded-full ${statusColors[appointment.status]} flex items-center gap-1`}>
            {statusIcons[appointment.status]} {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </div>
        <p className="text-sm md:text-base text-gray-600 truncate flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {appointment.service}
        </p>
      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-gray-900 font-medium flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="md:hidden">{appointment.date.split('-')[1]}/{appointment.date.split('-')[2]}</span>
            <span className="hidden md:inline">{appointment.date}</span>
          </p>
          <p className="text-sm text-gray-600 ml-6">{appointment.time}</p>
        </div>
        <p className="text-sm md:text-base font-medium text-gray-900">
          {appointment.price}
        </p>
      </div>
      
      {showActions && (
        <div className="mt-4 flex space-x-3">
          <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Reschedule
          </button>
          <button 
            onClick={onCancel}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default AppointmentsContent;