"use client";
import React, { useState } from 'react';
import { FiEye, FiCheckCircle, FiXCircle, FiCalendar, FiX } from "react-icons/fi";

const AppointmentManagement = () => {
  // Sample appointment data
  const [appointments, setAppointments] = useState([
    { id: 1, customer: "Emma Watson", salon: "Elite Salon", service: "Hair Color", date: "Today, 10:30 AM", amount: 120, status: "pending", phone: "+1 555-1234", email: "emma@example.com", notes: "Wants balayage with caramel tones" },
    { id: 2, customer: "Olivia Parker", salon: "Glamour Studio", service: "Manicure", date: "Today, 2:00 PM", amount: 35, status: "pending", phone: "+1 555-5678", email: "olivia@example.com", notes: "French manicure requested" },
    { id: 3, customer: "Sophia Lee", salon: "Luxe Beauty", service: "Haircut", date: "Tomorrow, 11:00 AM", amount: 45, status: "pending", phone: "+1 555-9012", email: "sophia@example.com", notes: "Trim 2 inches, add layers" },
    { id: 4, customer: "Ava Martinez", salon: "Elite Salon", service: "Keratin Treatment", date: "Yesterday, 3:00 PM", amount: 250, status: "completed", phone: "+1 555-3456", email: "ava@example.com", notes: "Sensitive scalp - use gentle products" },
    { id: 5, customer: "Mia Johnson", salon: "Urban Cuts", service: "Balayage", date: "Yesterday, 1:00 PM", amount: 180, status: "completed", phone: "+1 555-7890", email: "mia@example.com", notes: "Wants to go 2 shades lighter" },
    { id: 6, customer: "Isabella Brown", salon: "Posh Spa", service: "Extensions", date: "15 May, 10:00 AM", amount: 300, status: "rejected", phone: "+1 555-2345", email: "isabella@example.com", notes: "Needs consultation first" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState("");

  const handleAppointmentAction = (id, action) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === id ? { ...appointment, status: action } : appointment
    ));
    setShowConfirmModal(false);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         appointment.salon.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    
    // Basic date filtering
    const matchesDate = (!startDate && !endDate) || 
                       (appointment.date.toLowerCase().includes(startDate.toLowerCase()) || 
                        appointment.date.toLowerCase().includes(endDate.toLowerCase()));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const prepareAction = (id, type) => {
    setSelectedAppointment(appointments.find(a => a.id === id));
    setActionType(type);
    setShowConfirmModal(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Appointment Management</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 text-sm rounded-md ${
                statusFilter === "all" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white border text-gray-700"
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1 text-sm rounded-md ${
                statusFilter === "completed" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white border text-gray-700"
              }`}
            >
              Completed
            </button>
            <button 
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1 text-sm rounded-md ${
                statusFilter === "pending" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white border text-gray-700"
              }`}
            >
              Pending
            </button>
            <button 
              onClick={() => setStatusFilter("rejected")}
              className={`px-3 py-1 text-sm rounded-md ${
                statusFilter === "rejected" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white border text-gray-700"
              }`}
            >
              Rejected
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search appointments..."
              className="px-3 py-1 border rounded-md text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="date"
                className="px-3 py-1 border rounded-md text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="px-3 py-1 border rounded-md text-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{appointment.customer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{appointment.salon}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{appointment.service}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="text-gray-400" size={14} />
                        <span className="text-sm">{appointment.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">${appointment.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        appointment.status === "completed" ? "bg-green-100 text-green-800" :
                        appointment.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowViewModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>
                      {appointment.status === "pending" && (
                        <>
                          <button 
                            onClick={() => prepareAction(appointment.id, "completed")}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Completed"
                          >
                            <FiCheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => prepareAction(appointment.id, "rejected")}
                            className="text-red-600 hover:text-red-900"
                            title="Reject Appointment"
                          >
                            <FiXCircle size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No appointments found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">Appointment Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedAppointment.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Salon</p>
                  <p className="font-medium">{selectedAppointment.salon}</p>
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
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">${selectedAppointment.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedAppointment.status === "completed" ? "bg-green-100 text-green-800" :
                    selectedAppointment.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedAppointment.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedAppointment.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="font-medium">{selectedAppointment.notes}</p>
                </div>
              </div>
            </div>
            <div className="border-t p-4 flex justify-end">
              <button 
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">
                {actionType === "completed" ? "Complete Appointment" : "Reject Appointment"}
              </h3>
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-700">
                Are you sure you want to {actionType === "completed" ? "mark this appointment as completed?" : "reject this appointment?"}
              </p>
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{selectedAppointment.customer}</p>
                <p className="text-sm">{selectedAppointment.service} at {selectedAppointment.salon}</p>
                <p className="text-sm">{selectedAppointment.date}</p>
              </div>
            </div>
            <div className="border-t p-4 flex justify-end space-x-2">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleAppointmentAction(selectedAppointment.id, actionType)}
                className={`px-4 py-2 rounded-md text-white ${
                  actionType === "completed" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {actionType === "completed" ? "Complete" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;