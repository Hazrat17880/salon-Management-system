"use client";
import { useState } from "react";

export default function Appointments({ appointments = [], handleAppointmentAction }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  // Filter appointments based on selected filter
  const filteredAppointments = filter === "all" 
    ? appointments 
    : appointments.filter(app => app.status === filter);

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Appointment Management</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-medium">All Appointments</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === "all" ? "bg-indigo-600 text-white" : "bg-white border text-gray-700"
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("pending")}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === "pending" ? "bg-indigo-600 text-white" : "bg-white border text-gray-700"
              }`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === "completed" ? "bg-indigo-600 text-white" : "bg-white border text-gray-700"
              }`}
            >
              Completed
            </button>
            <button 
              onClick={() => setFilter("rejected")}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === "rejected" ? "bg-indigo-600 text-white" : "bg-white border text-gray-700"
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filteredAppointments.map(appointment => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{appointment.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{appointment.service}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{appointment.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      appointment.status === "completed" ? "bg-green-100 text-green-800" :
                      appointment.status === "rejected" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {appointment.status}
                    </span>
                    {appointment.reason && (
                      <p className="text-xs text-gray-500 mt-1">{appointment.reason}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    {appointment.status === "pending" && (
                      <>
                        <button 
                          onClick={() => handleAppointmentAction(appointment.id, "completed")}
                          className="text-sm bg-green-600 text-white px-3 py-1 rounded-md"
                        >
                          Complete
                        </button>
                        <button 
                          onClick={() => {
                            const reason = prompt("Reason for rejection:");
                            if (reason) handleAppointmentAction(appointment.id, "rejected", reason);
                          }}
                          className="text-sm bg-red-600 text-white px-3 py-1 rounded-md"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => openModal(appointment)}
                      className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-md"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">Appointment Details</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{selectedAppointment.customer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium">{selectedAppointment.service}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">{selectedAppointment.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedAppointment.status === "completed" ? "bg-green-100 text-green-800" :
                    selectedAppointment.status === "rejected" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {selectedAppointment.status}
                  </span>
                </p>
              </div>
              {selectedAppointment.reason && (
                <div>
                  <p className="text-sm text-gray-500">Rejection Reason</p>
                  <p className="font-medium">{selectedAppointment.reason}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}