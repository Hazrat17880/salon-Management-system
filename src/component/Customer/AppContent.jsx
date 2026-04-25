"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  FiCalendar, FiClock, FiDollarSign, FiEdit2, FiTrash2, 
  FiCheck, FiX, FiAlertTriangle 
} from "react-icons/fi";

const AppointmentsContent = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ date: "", time: "" });
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: "" });

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/user/appointments", { method: "GET" });
        const data = await res.json();
        if (res.ok) {
          setAppointments(data.data || []);
        } else {
          toast.error(data.message || "Failed to fetch appointments");
        }
      } catch (error) {
        toast.error("Error loading appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  console.log("your appointment are :", appointments);

  // Fix: Use appointment_status instead of status for filtering
  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((a) => {
          if (filter === "confirmed") {
            return a.appointment_status === "accept" || a.appointment_status === "confirmed";
          } else if (filter === "pending") {
            return a.appointment_status === "pending" || a.appointment_status === "";
          } else if (filter === "completed") {
            return a.appointment_status === "completed";
          } else if (filter === "rejected") {
            return a.appointment_status === "rejected";
          }
          return a.appointment_status === filter;
        });

  // Cancel appointment with confirmation
  const confirmCancelAppointment = (id, name) => {
    setDeleteConfirm({ show: true, id, name });
  };

  const cancelAppointment = async (id) => {
    try {
      const res = await fetch(`/api/user/appointments/appointment/?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Appointment cancelled");
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        setDeleteConfirm({ show: false, id: null, name: "" });
      } else {
        toast.error(data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Edit appointment
  const handleEditClick = (appointment) => {
    setEditingId(appointment.id);
    setEditData({
      date: formatDateForInput(appointment.appointment_date),
      time: appointment.appointment_time || "",
    });
  };

  const updateAppointment = async (id, updated) => {
    try {
      const res = await fetch(`/api/user/appointments/appointment/?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Appointment updated");
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === id ? { 
              ...a, 
              appointment_date: updated.date, 
              appointment_time: updated.time 
            } : a
          )
        );
        setEditingId(null);
      } else {
        toast.error(data.message || "Failed to update appointment");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleUpdate = (id) => {
    updateAppointment(id, editData);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({ date: "", time: "" });
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      // Convert to local date and format as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      return "";
    }
  };

  // Helper function to get display status
  const getDisplayStatus = (appointment) => {
    const status = appointment.appointment_status;
    if (!status || status === "pending") return "pending";
    if (status === "accept") return "confirmed";
    if (status === "reject") return "rejected";
    return status;
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-xl shadow-md">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm({ show: false, id: null, name: "" })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-red-100 rounded-full mr-3">
                  <FiAlertTriangle className="text-red-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Cancellation</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel your appointment at{" "}
                <span className="font-medium">{deleteConfirm.name}</span>? 
                This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm({ show: false, id: null, name: "" })}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Keep Appointment
                </button>
                <button
                  onClick={() => cancelAppointment(deleteConfirm.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <FiTrash2 className="mr-2" />
                  Yes, Cancel Appointment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                      f === "all"
                        ? "bg-indigo-600"
                        : f === "pending"
                        ? "bg-yellow-500"
                        : f === "confirmed"
                        ? "bg-green-500"
                        : f === "completed"
                        ? "bg-blue-500"
                        : "bg-red-500"
                    } text-white shadow-md`
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center py-8 text-gray-500">Loading appointments...</p>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showActions={true}
                onCancel={() => confirmCancelAppointment(appointment.id, appointment.salon_name)}
                onEdit={() => handleEditClick(appointment)}
                isEditing={editingId === appointment.id}
                editData={editData}
                setEditData={setEditData}
                onUpdate={() => handleUpdate(appointment.id)}
                onCancelEdit={handleCancelEdit}
                formatDateForInput={formatDateForInput}
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
      )}
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
  onCancelEdit,
  formatDateForInput
}) => {
  // Fix: Map database status to display status
  const getDisplayStatus = () => {
    const status = appointment.appointment_status;
    if (!status || status === "pending") return "pending";
    if (status === "accept") return "confirmed";
    if (status === "reject") return "rejected";
    if (status === "completed") return "completed";
    return "pending";
  };

  const displayStatus = getDisplayStatus();

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusIcons = {
    pending: <FiClock className="mr-1" />,
    confirmed: <FiCheck className="mr-1" />,
    completed: <FiCheck className="mr-1" />,
    rejected: <FiX className="mr-1" />,
  };

  // Fix: Check if actions should be shown based on display status
  const shouldShowActions = showActions && 
    displayStatus !== "completed" && 
    displayStatus !== "rejected";

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
              {appointment.salon_name}
            </h4>
            <span
              className={`text-xs px-2.5 py-1 rounded-full flex items-center ${statusColors[displayStatus]}`}
            >
              {statusIcons[displayStatus]}
              {displayStatus}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-700 flex items-center">
            <FiDollarSign className="mr-1" />
            {appointment.service_price}RM
          </p>
        </div>
        <p className="text-sm text-gray-600">{appointment.service_name}</p>
        {appointment.discount > 0 && (
          <p className="text-xs text-green-600 mt-1">
            {appointment.discount}% discount applied
          </p>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={editData.date}
                onChange={(e) =>
                  setEditData({ ...editData, date: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={editData.time}
                onChange={(e) =>
                  setEditData({ ...editData, time: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onCancelEdit}
              className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
            >
              <FiX className="mr-1" /> Cancel
            </button>
            <button
              onClick={onUpdate}
              disabled={!editData.date || !editData.time}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
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
              {appointment.appointment_date ? new Date(appointment.appointment_date).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              }) : "Date not set"}
            </p>
            <p className="text-gray-900 font-medium flex items-center mt-1">
              <FiClock className="mr-2 text-indigo-600" />
              {appointment.appointment_time || "Time not set"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Duration: {appointment.duration_minutes} minutes
            </p>
          </div>

          {shouldShowActions && (
            <div className="flex space-x-3">
              <button
                onClick={onEdit}
                className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <FiEdit2 className="mr-1" /> Reschedule
              </button>
              <button
                onClick={onCancel}
                className="px-3 py-1.5 text-sm bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center"
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