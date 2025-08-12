"use client";
import { motion } from "framer-motion";
import { useState } from "react";

import { FiCalendar, FiClock, FiDollarSign, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

const AppointmentsContent = ({ appointments, cancelAppointment, updateAppointment }) => {
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ date: "", time: "" });
  
  const filteredAppointments = filter === "all" 
    ? appointments 
    : appointments.filter(a => a.status === filter);

  const handleEditClick = (appointment) => {
    setEditingId(appointment.id);
    setEditData({
      date: appointment.date,
      time: appointment.time
    });
  };

  const handleUpdate = (id) => {
    updateAppointment(id, editData);
    setEditingId(null);
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 md:mb-0 flex items-center">
          <FiCalendar className="mr-2" /> My Appointments
        </h3>
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "confirmed", "completed", "rejected"].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all flex items-center ${
                filter === f 
                  ? `${
                      f === "all" ? "bg-indigo-600" :
                      f === "pending" ? "bg-yellow-500" :
                      f === "confirmed" ? "bg-green-500" :
                      f === "completed" ? "bg-blue-500" : "bg-red-500"
                    } text-white shadow-md` 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(appointment => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment} 
              showActions={true}
              onCancel={() => cancelAppointment(appointment.id)}
              onEdit={() => handleEditClick(appointment)}
              isEditing={editingId === appointment.id}
              editData={editData}
              setEditData={setEditData}
              onUpdate={() => handleUpdate(appointment.id)}
              onCancelEdit={() => setEditingId(null)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
            <FiCalendar className="mx-auto text-3xl mb-2" />
            <p className="text-lg">No appointments found</p>
            <p className="text-sm mt-1">Try changing your filter selection</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AppointmentCard = ({ 
  appointment, 
  showActions = false, 
  onCancel,
  onEdit,
  isEditing,
  editData,
  setEditData,
  onUpdate,
  onCancelEdit
}) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800"
  };
  
  const statusIcons = {
    pending: <FiClock className="mr-1" />,
    confirmed: <FiCheck className="mr-1" />,
    completed: <FiCheck className="mr-1" />,
    rejected: <FiX className="mr-1" />
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`flex flex-col p-4 border border-gray-200 rounded-xl transition-all ${
        isEditing ? "ring-2 ring-indigo-500 bg-indigo-50" : "hover:shadow-md"
      }`}
    >
      <div className="flex-1 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h4 className="text-base md:text-lg font-semibold text-gray-900 mr-3">
              {appointment.salon}
            </h4>
            <span className={`text-xs px-2.5 py-1 rounded-full flex items-center ${statusColors[appointment.status]}`}>
              {statusIcons[appointment.status]}
              {appointment.status}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-700 flex items-center">
            <FiDollarSign className="mr-1" />
            {appointment.price}
          </p>
        </div>
        <p className="text-sm text-gray-600">{appointment.service}</p>
      </div>
      
      {isEditing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={editData.date}
                onChange={(e) => setEditData({...editData, date: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={editData.time}
                onChange={(e) => setEditData({...editData, time: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button 
              onClick={onCancelEdit}
              className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
            >
              <FiX className="mr-1" /> Cancel
            </button>
            <button 
              onClick={onUpdate}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <FiCheck className="mr-1" /> Confirm Changes
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <p className="text-gray-900 font-medium flex items-center">
              <FiCalendar className="mr-2 text-indigo-600" />
              {new Date(appointment.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-gray-900 font-medium flex items-center mt-1">
              <FiClock className="mr-2 text-indigo-600" />
              {appointment.time}
            </p>
          </div>
          
          {showActions && appointment.status !== "completed" && appointment.status !== "rejected" && (
            <div className="flex space-x-3">
              <button 
                onClick={onEdit}
                className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <FiEdit2 className="mr-1" /> Reschedule
              </button>
              <button 
                onClick={onCancel}
                className="px-3 py-1.5 text-sm bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50 flex items-center"
              >
                <FiTrash2 className="mr-1" /> Cancel
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default AppointmentsContent;