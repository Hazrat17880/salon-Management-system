"use client";
import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiMail, FiSearch, FiChevronDown, FiSend, FiRefreshCw, FiChevronRight, FiUsers, FiStar } from "react-icons/fi";
import { toast } from 'react-toastify';

const FeedbackComplaints = () => {
  const [salons, setSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState('salons'); // 'salons' or 'complaints'

  // Fetch salons with complaint counts from API
  const fetchSalonsWithComplaints = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/admin/complaints');
      
      if (response.status === 401) {
        localStorage.clear();
        toast.warning("Your session has expired. Please login again.");
        window.location.href = '/admin/login';
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch salons with complaints');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSalons(data.data);
      } else {
        toast.error(data.message || 'Failed to load salons');
      }
    } catch (error) {
      console.error('Error fetching salons:', error);
      toast.error('Failed to load salons. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch complaints for a specific salon
  const fetchComplaintsForSalon = async (salonId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/complaints?salonId=${salonId}`);
      
      if (response.status === 401) {
        localStorage.clear();
        toast.warning("Your session has expired. Please login again.");
        window.location.href = '/admin/login';
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setComplaints(data.data.complaints || []);
        setSelectedSalon(data.data);
        setView('complaints');
      } else {
        toast.error(data.message || 'Failed to load complaints');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalonsWithComplaints();
  }, []);

  // Calculate overall stats
  const totalComplaints = salons.reduce((sum, salon) => sum + (salon.total_complaints || 0), 0);
  const pendingComplaints = salons.reduce((sum, salon) => sum + (salon.unread_complaints || 0), 0);
  const resolvedComplaints = salons.reduce((sum, salon) => sum + (salon.resolved_complaints || 0), 0);

  const handleComplaintAction = async (id, action) => {
    try {
      // Update complaint status
      const response = await fetch(`/api/admin/complaints/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update local state
          setComplaints(prev => prev.map(complaint => 
            complaint.id === id ? { ...complaint, status: action } : complaint
          ));
          toast.success(`Complaint marked as ${action}`);
        }
      } else {
        throw new Error('Failed to update complaint status');
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Failed to update complaint status');
    }
  };

  const handleReply = async (id) => {
    if (replyingTo === id && replyMessage.trim()) {
      try {
        // Send reply logic
        const response = await fetch(`/api/admin/complaints/${id}/reply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: replyMessage })
        });

        if (response.ok) {
          toast.success('Reply sent successfully');
          setReplyingTo(null);
          setReplyMessage("");
        } else {
          throw new Error('Failed to send reply');
        }
      } catch (error) {
        console.error('Error sending reply:', error);
        toast.error('Failed to send reply');
      }
    } else {
      setReplyingTo(id);
    }
  };

  const toggleExpandComplaint = (id) => {
    setExpandedComplaint(expandedComplaint === id ? null : id);
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`/api/admin/complaints/${id}/read`, {
        method: 'PUT'
      });

      if (response.ok) {
        setComplaints(prev => prev.map(complaint => 
          complaint.id === id ? { ...complaint, is_read: true } : complaint
        ));
        toast.success('Marked as read');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const goBackToSalons = () => {
    setView('salons');
    setSelectedSalon(null);
    setComplaints([]);
  };

  const filteredSalons = salons.filter(salon => {
    return salon.salon_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           salon.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           salon.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      complaint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
            {view === 'complaints' ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={goBackToSalons}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <FiChevronRight className="transform rotate-180" />
                </button>
                Complaints for {selectedSalon?.salon_name}
              </div>
            ) : (
              "Complaints"
            )}
          </h2>
          <p className="text-gray-500 mt-1">
            {view === 'complaints' 
              ? `Managing complaints for ${selectedSalon?.salon_name}` 
              : "Manage customer complaints by salon"}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={view === 'salons' ? "Search salons..." : "Search complaints..."}
              className="pl-10 pr-3 py-2 border rounded-lg text-sm w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={view === 'salons' ? fetchSalonsWithComplaints : () => fetchComplaintsForSalon(selectedSalon.id)}
            disabled={refreshing}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
     

      {view === 'salons' ? (
        /* Salons List View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <p className="text-sm text-gray-500">
              Showing {filteredSalons.length} of {salons.length} salons with complaints
            </p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredSalons.length > 0 ? (
              filteredSalons.map(salon => (
                <div 
                  key={salon.id} 
                  className="p-5 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => fetchComplaintsForSalon(salon.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-lg">
                          {salon.salon_name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{salon.salon_name}</h3>
                          <p className="text-sm text-gray-500">
                            {salon.city}, {salon.country}
                            {salon.email && ` • ${salon.email}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-800">{salon.total_complaints || 0}</span>
                          <FiAlertCircle className="text-amber-500" />
                        </div>
                        <span className="text-xs text-gray-500">Total complaints</span>
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
                <h4 className="text-gray-600 font-medium">No salons with complaints found</h4>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm ? "Try a different search term" : "No salons have complaints yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Complaints List View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-3 bg-gray-50">
           
            <p className="text-sm text-gray-500">
              Showing {filteredComplaints.length} of {complaints.length} complaints
            </p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map(complaint => (
                <div key={complaint.id} className={`p-5 hover:bg-gray-50 transition-colors ${!complaint.is_read ? 'bg-blue-50' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                          {
                           complaint.user_image ? <img src={complaint.user_image} className='h-10 w-10 rounded-full'/>:complaint.full_name?.charAt(0) || 'U'
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{complaint.full_name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">
                            {complaint.email && `${complaint.email} • `}
                            {complaint.phone_number}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                          {complaint.complaint_about || 'General'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </span>
                       
                      </div>
                    </div>
                    <div className="flex gap-2">
                     
                      <button 
                        onClick={() => toggleExpandComplaint(complaint.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <FiChevronDown className={`transition-transform ${expandedComplaint === complaint.id ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  {(expandedComplaint === complaint.id) && (
                    <div className="mt-4 pl-13 space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Complaint Details</h4>
                        <p className="text-sm text-gray-700">{complaint.description}</p>
                      </div>
                      
                     

                     
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <FiAlertCircle size={24} />
                </div>
                <h4 className="text-gray-600 font-medium">No complaints found</h4>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm ? "Try a different search term" : "No complaints match the selected filters"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackComplaints;