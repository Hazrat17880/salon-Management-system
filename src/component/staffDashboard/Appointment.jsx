"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X, Check, Trash2 } from "lucide-react";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [appointmentToUpdate, setAppointmentToUpdate] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/salons/appointments", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
      } else {
        toast.error(data.message || "Failed to load appointments");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  console.log("your salon appointments are :", appointments);

  // Update appointment status
  const handleAppointmentAction = async (id, status, accept = null) => {
    try {
      const res = await fetch("/api/salons/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          appointment_id: id,
          status,
          accept,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Appointment updated!");
        fetchAppointments();
      } else {
        toast.error(data.message || "Failed to update appointment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating appointment");
    }
  };

  // Reject modal controls
  const openRejectModal = (appointment) => {
    setAppointmentToUpdate(appointment);
    setIsRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setAppointmentToUpdate(null);
    setRejectReason("");
  };

  const confirmReject = () => {
    if (!appointmentToUpdate) return;
    handleAppointmentAction(appointmentToUpdate.id, "reject", 0);
    closeRejectModal();
  };

  // Helper function to get display status
  const getDisplayStatus = (appointment) => {
    // If appointment_status exists and is not empty, use it
    if (appointment.appointment_status && appointment.appointment_status !== "") {
      return appointment.appointment_status;
    }
    // If appointment_status is empty but accept field indicates status
    if (appointment.accept === 1) {
      return "accept";
    }
    // Default to pending
    return "pending";
  };

  // Filtering based on appointment_status
  const filteredAppointments = appointments.filter((app) => {
    const displayStatus = getDisplayStatus(app);
    return filter === "all" ? true : displayStatus === filter;
  });

  // Status badge styling
  const getStatusBadgeClass = (appointment) => {
    const status = getDisplayStatus(appointment);
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "reject":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accept":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format status for display
  const formatStatus = (appointment) => {
    const status = getDisplayStatus(appointment);
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Check if actions should be shown based on status
  const shouldShowActions = (appointment) => {
    const status = getDisplayStatus(appointment);
    return status === "pending" || status === "accept";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Appointment Manager</h1>
            <p className="text-gray-600 mt-2">Manage all your salon appointments in one place</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-2 px-4">
            <span className="text-sm text-gray-500 mr-2">Total Appointments:</span>
            <span className="font-bold text-indigo-600">{appointments.length}</span>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">Appointment List</h2>
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "accept", "completed", "reject"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    filter === f
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-500">Loading appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments found</h3>
              <p className="mt-1 text-gray-500">Try changing your filter or check back later.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center bg-indigo-200 text-white font-bold text-sm overflow-hidden">
  {appointment.image ? (
    <img
      src={appointment.image}
      alt={appointment.user_name || appointment.user_email}
      className="h-full w-full object-cover"
    />
  ) : (
    // fallback: first letter of name or email
    (appointment.user_name?.[0] || appointment.user_email?.[0] || "?").toUpperCase()
  )}
</div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{appointment.user_name}</div>
                            <div className="text-xs text-gray-500">{appointment.user_email}</div>
                            {appointment.user_phone && (
                              <div className="text-xs text-gray-500">{appointment.user_phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{appointment.service_name}</div>
                        <div className="text-xs text-gray-500">
                          ${appointment.service_price} 
                          {appointment.discount > 0 && ` (${appointment.discount}% off)`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {new Date(appointment.appointment_date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {appointment.appointment_time} • {appointment.duration_minutes} min
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment)}`}>
                          {formatStatus(appointment)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {shouldShowActions(appointment) && (
                            <>
                              {getDisplayStatus(appointment) === "pending" && (
                                <button
                                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors"
                                  onClick={() => handleAppointmentAction(appointment.id, "accept", 1)}
                                >
                                  <Check size={16} /> Accept
                                </button>
                              )}
                              
                              {getDisplayStatus(appointment) === "accept" && (
                                <button
                                  className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors"
                                  onClick={() => handleAppointmentAction(appointment.id, "completed", 1)}
                                >
                                  <Check size={16} /> Complete
                                </button>
                              )}
                              
                              {getDisplayStatus(appointment) !== "completed" && 
                               getDisplayStatus(appointment) !== "reject" && (
                                <button
                                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors"
                                  onClick={() => openRejectModal(appointment)}
                                >
                                  <Trash2 size={16} /> Reject
                                </button>
                              )}
                            </>
                          )}
                          
                          {getDisplayStatus(appointment) === "completed" && (
                            <span className="text-xs text-gray-500 italic">Completed</span>
                          )}
                          {getDisplayStatus(appointment) === "reject" && (
                            <span className="text-xs text-gray-500 italic">Rejected</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Reject Appointment</h3>
              <button onClick={closeRejectModal}>
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to reject this appointment?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Reject Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}