"use client";
import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiMail, FiSearch, FiChevronDown, FiSend, FiRefreshCw, FiChevronRight, FiUsers, FiStar, FiCalendar, FiClock } from "react-icons/fi";
import { toast } from 'react-toastify';

const AppointmentsManagement = () => {
  const [salons, setSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState('salons'); // 'salons' or 'appointments'

  // Fetch salons with appointment counts from API
  const fetchSalonsWithAppointments = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/admin/appointments');
      
      if (response.status === 401) {
        localStorage.clear();
        toast.warning("Your session has expired. Please login again.");
        window.location.href = '/admin/login';
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch salons with appointments');
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      if (data.success) {
        // Ensure we're working with an array
        const salonsData = Array.isArray(data.data) ? data.data : 
                          Array.isArray(data.data.salons) ? data.data.salons : 
                          Array.isArray(data.data.appointments) ? [] : // Handle case where data might be appointments
                          [];
        setSalons(salonsData);
      } else {
        toast.error(data.message || 'Failed to load salons');
        setSalons([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Error fetching salons:', error);
      toast.error('Failed to load salons. Please try again.');
      setSalons([]); // Set empty array on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch appointments for a specific salon
  const fetchAppointmentsForSalon = async (salonId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/appointments?salonId=${salonId}`);
      
      if (response.status === 401) {
        localStorage.clear();
        toast.warning("Your session has expired. Please login again.");
        window.location.href = '/admin/login';
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const data = await response.json();
      console.log('Appointments API Response:', data); // Debug log
      
      if (data.success) {
        // Handle different possible response structures
        const appointmentsData = Array.isArray(data.data) ? data.data : 
                               Array.isArray(data.data.appointments) ? data.data.appointments : 
                               [];
        setAppointments(appointmentsData);
        
        // Set selected salon data
        const salonData = data.data.salon || data.data || { id: salonId };
        setSelectedSalon(salonData);
        setView('appointments');
      } else {
        toast.error(data.message || 'Failed to load appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalonsWithAppointments();
  }, []);

  // Calculate overall stats - with safe array handling
  const totalAppointments = Array.isArray(salons) ? salons.reduce((sum, salon) => sum + (salon.total_appointments || 0), 0) : 0;
  const pendingAppointments = Array.isArray(salons) ? salons.reduce((sum, salon) => sum + (salon.pending_appointments || 0), 0) : 0;
  const completedAppointments = Array.isArray(salons) ? salons.reduce((sum, salon) => sum + (salon.completed_appointments || 0), 0) : 0;
  const acceptedAppointments = Array.isArray(salons) ? salons.reduce((sum, salon) => sum + (salon.accepted_appointments || 0), 0) : 0;
  const rejectedAppointments = Array.isArray(salons) ? salons.reduce((sum, salon) => sum + (salon.rejected_appointments || 0), 0) : 0;

  const handleAppointmentAction = async (id, action) => {
    try {
      // Update appointment status
      const response = await fetch(`/api/admin/appointments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: action })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update local state
          setAppointments(prev => prev.map(appointment => 
            appointment.id === id ? { ...appointment, appointment_status: action } : appointment
          ));
          toast.success(`Appointment marked as ${action}`);
          
          // Refresh the data to get updated counts
          if (selectedSalon) {
            fetchAppointmentsForSalon(selectedSalon.id);
          }
        }
      } else {
        throw new Error('Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment status');
    }
  };

  // Rest of the component remains the same until the filtering section...

  const filteredSalons = Array.isArray(salons) ? salons.filter(salon => {
    return salon.salon_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           salon.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           salon.email?.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  const filteredAppointments = Array.isArray(appointments) ? appointments.filter(appointment => {
    const matchesSearch = 
      appointment.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      appointment.service_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || appointment.appointment_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'accept': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {view === 'appointments' ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={goBackToSalons}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <FiChevronRight className="transform rotate-180" />
                </button>
                Appointments for {selectedSalon?.salon_name || 'Salon'}
              </div>
            ) : (
              "Appointments"
            )}
          </h2>
          <p className="text-gray-500 mt-1">
            {view === 'appointments' 
              ? `Managing appointments for ${selectedSalon?.salon_name || 'selected salon'}` 
              : "Manage appointments by salon"}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={view === 'salons' ? "Search salons..." : "Search appointments..."}
              className="pl-10 pr-3 py-2 border rounded-lg text-sm w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {view === 'appointments' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accept">Accepted</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          )}
          <button
            onClick={view === 'salons' ? fetchSalonsWithAppointments : () => selectedSalon && fetchAppointmentsForSalon(selectedSalon.id)}
            disabled={refreshing}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Stats Overview */}
      {view === 'salons' && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-indigo-600" />
              <span className="text-sm font-medium text-gray-600">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-1">{totalAppointments}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <FiClock className="text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Pending</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-1">{pendingAppointments}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-green-600" />
              <span className="text-sm font-medium text-gray-600">Completed</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-1">{completedAppointments}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Accepted</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-1">{acceptedAppointments}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="text-red-600" />
              <span className="text-sm font-medium text-gray-600">Rejected</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-1">{rejectedAppointments}</p>
          </div>
        </div>
      )}

      {view === 'salons' ? (
        /* Salons List View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <p className="text-sm text-gray-500">
              Showing {filteredSalons.length} of {salons.length} salons with appointments
            </p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredSalons.length > 0 ? (
              filteredSalons.map(salon => (
                <div 
                  key={salon.id} 
                  className="p-5 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => fetchAppointmentsForSalon(salon.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-lg">
                          {salon.salon_name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{salon.salon_name || 'Unnamed Salon'}</h3>
                          <p className="text-sm text-gray-500">
                            {salon.city && `${salon.city}, `}{salon.country}
                            {salon.email && ` • ${salon.email}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-800">{salon.total_appointments || 0}</span>
                          <FiCalendar className="text-indigo-500" />
                        </div>
                        <span className="text-xs text-gray-500">Total appointments</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <FiUsers size={24} />
                </div>
                <h4 className="text-gray-600 font-medium">No salons with appointments found</h4>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm ? "Try a different search term" : "No salons have appointments yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Appointments List View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-3 bg-gray-50">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Filter by status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accept">Accepted</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <p className="text-sm text-gray-500">
              Showing {filteredAppointments.length} of {appointments.length} appointments
            </p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(appointment => (
                <div key={appointment.id} className={`p-5 hover:bg-gray-50 transition-colors`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                          {appointment.user_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{appointment.user_name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">
                            {appointment.user_email && `${appointment.user_email} • `}
                            {appointment.user_phone}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="font-medium text-gray-800">{appointment.service_title || 'Unknown Service'}</p>
                        <p className="text-sm text-gray-600">
                          {appointment.service_price && `$${appointment.service_price} • `}
                          {appointment.service_duration ? `${appointment.service_duration} mins` : ''}
                        </p>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(appointment.appointment_status)}`}>
                          {appointment.appointment_status || 'unknown'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {appointment.appointment_date ? new Date(appointment.appointment_date).toLocaleDateString() : 'No date'} 
                          {appointment.appointment_time && ` at ${appointment.appointment_time}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setExpandedAppointment(expandedAppointment === appointment.id ? null : appointment.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <FiChevronDown className={`transition-transform ${expandedAppointment === appointment.id ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  {(expandedAppointment === appointment.id) && (
                    <div className="mt-4 pl-13 space-y-4">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleAppointmentAction(appointment.id, 'accept')}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                          disabled={appointment.appointment_status === 'accept'}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAppointmentAction(appointment.id, 'completed')}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
                          disabled={appointment.appointment_status === 'completed'}
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleAppointmentAction(appointment.id, 'rejected')}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
                          disabled={appointment.appointment_status === 'rejected'}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <FiCalendar size={24} />
                </div>
                <h4 className="text-gray-600 font-medium">No appointments found</h4>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm ? "Try a different search term" : "No appointments match the selected filters"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsManagement;