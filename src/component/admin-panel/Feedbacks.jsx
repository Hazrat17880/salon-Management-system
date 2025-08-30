"use client";
import React, { useState, useEffect } from 'react';
import { FiStar, FiSearch, FiChevronRight, FiRefreshCw, FiMessageSquare, FiEye, FiEyeOff, FiMail, FiUser, FiCalendar } from "react-icons/fi";
import { toast } from 'react-toastify';

const FeedbackManagement = () => {
  const [salons, setSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState('salons'); // 'salons' or 'feedbacks'
  const [expandedFeedback, setExpandedFeedback] = useState(null);

  // Fetch salons with feedback data from API
  const fetchSalonsWithFeedbacks = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/admin/feedbacks');
      
      console.log(response, 'the respnse is');
      if (response.status === 401) {
        localStorage.clear();
        toast.warning("Your session has expired. Please login again.");
        window.location.href = '/admin/login';
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback data');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSalons(data.data);
      } else {
        toast.error(data.message || 'Failed to load feedback data');
      }
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      toast.error('Failed to load feedback data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch feedbacks for a specific salon
  const fetchFeedbacksForSalon = async (salonId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/feedbacks?salonId=${salonId}`);
      
      if (response.status === 401) {
        localStorage.clear();
        toast.warning("Your session has expired. Please login again.");
        window.location.href = '/admin/login';
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedbacks');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setFeedbacks(data.data.feedbacks || []);
        setSelectedSalon(data.data);
        setView('feedbacks');
      } else {
        toast.error(data.message || 'Failed to load feedbacks');
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to load feedbacks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalonsWithFeedbacks();
  }, []);

  // Mark feedback as read/unread
  const markFeedbackAsRead = async (feedbackId, isRead) => {
    try {
      const response = await fetch('/api/admin/feedbacks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: feedbackId, 
          action: isRead ? 'read' : 'unread' 
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update local state
          setFeedbacks(prev => prev.map(feedback => 
            feedback.id === feedbackId ? { ...feedback, is_read: isRead } : feedback
          ));
          toast.success(`Feedback marked as ${isRead ? 'read' : 'unread'}`);
        }
      } else {
        throw new Error('Failed to update feedback status');
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast.error('Failed to update feedback status');
    }
  };

  // Send response to feedback
  const sendResponse = async (feedbackId) => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a response message');
      return;
    }

    try {
      const response = await fetch('/api/admin/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          feedbackId: feedbackId, 
          message: replyMessage 
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update local state
          setFeedbacks(prev => prev.map(feedback => 
            feedback.id === feedbackId ? { ...feedback, is_responded: true } : feedback
          ));
          setReplyingTo(null);
          setReplyMessage("");
          toast.success('Response sent successfully');
        }
      } else {
        throw new Error('Failed to send response');
      }
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response');
    }
  };

  const goBackToSalons = () => {
    setView('salons');
    setSelectedSalon(null);
    setFeedbacks([]);
  };

  const toggleExpandFeedback = (id) => {
    setExpandedFeedback(expandedFeedback === id ? null : id);
  };

  // Filter salons based on search term
  const filteredSalons = salons.filter(salon => {
    return salon.salon_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           salon.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           salon.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Filter feedbacks based on search term and filters
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = 
      feedback.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = ratingFilter === "all" || feedback.rating == ratingFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "unread" && !feedback.is_read) ||
      (statusFilter === "read" && feedback.is_read) ||
      (statusFilter === "responded" && feedback.is_responded);
    
    return matchesSearch && matchesRating && matchesStatus;
  });

  // Calculate overall stats
  const totalFeedbacks = salons.reduce((sum, salon) => sum + (salon.total_feedbacks || 0), 0);
  const unreadFeedbacks = salons.reduce((sum, salon) => sum + (salon.unread_feedbacks || 0), 0);
  const averageRating = salons.reduce((sum, salon) => sum + (parseFloat(salon.average_rating) || 0), 0) / (salons.length || 1);

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
            {view === 'feedbacks' ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={goBackToSalons}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <FiChevronRight className="transform rotate-180" />
                </button>
                Feedback for {selectedSalon?.salon_name}
              </div>
            ) : (
              "Customer Feedback Management"
            )}
          </h2>
          <p className="text-gray-500 mt-1">
            {view === 'feedbacks' 
              ? `Managing customer feedback for ${selectedSalon?.salon_name}` 
              : "View and manage customer feedback across all salons"}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={view === 'salons' ? "Search salons..." : "Search feedback..."}
              className="pl-10 pr-3 py-2 border rounded-lg text-sm w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={view === 'salons' ? fetchSalonsWithFeedbacks : () => fetchFeedbacksForSalon(selectedSalon.id)}
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
              Showing {filteredSalons.length} of {salons.length} salons with feedback
            </p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredSalons.length > 0 ? (
              filteredSalons.map(salon => (
                <div 
                  key={salon.id} 
                  className="p-5 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => fetchFeedbacksForSalon(salon.id)}
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
                          <span className="text-lg font-bold text-gray-800">{salon.total_feedbacks || 0}</span>
                          <FiMessageSquare className="text-indigo-500" />
                        </div>
                        <span className="text-xs text-gray-500">Total feedback</span>
                      </div>
                      
                      {salon.unread_feedbacks > 0 && (
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-amber-600">{salon.unread_feedbacks || 0}</span>
                            <FiEyeOff className="text-amber-600" />
                          </div>
                          <span className="text-xs text-amber-600">Unread</span>
                        </div>
                      )}
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-emerald-600">{salon.average_rating || '0.0'}</span>
                          <FiStar className="text-emerald-600" />
                        </div>
                        <span className="text-xs text-gray-500">Avg rating</span>
                      </div>
                      
                      <FiChevronRight className="text-gray-400" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <FiMessageSquare size={24} />
                </div>
                <h4 className="text-gray-600 font-medium">No salons with feedback found</h4>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm ? "Try a different search term" : "No salons have received feedback yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Feedbacks List View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-3 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {/* Rating Filter */}
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

            
            </div>
            <p className="text-sm text-gray-500">
              Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks
            </p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map(feedback => (
                <div key={feedback.id} className={`p-5 hover:bg-gray-50 transition-colors ${!feedback.is_read ? 'bg-blue-50' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        
                        {feedback.user_image?<img src={feedback.user_image} className='h-10 w-10 rounded-full'/>:  feedback.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{feedback.full_name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">
                            {feedback.email && `${feedback.email} • `}
                            {feedback.phone_number}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {/* Star Rating */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <FiStar
                              key={star}
                              size={14}
                              className={star <= feedback.stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">({feedback.rating})</span>
                        </div>
                        
                        <span className="text-xs text-gray-400">
                          <FiCalendar size={12} className="inline mr-1" />
                          {new Date(feedback.created_at).toLocaleDateString()}
                        </span>
                        
                     
                        
                      </div>
                    </div>
                    <div className="flex gap-2">
                    
                      <button 
                        onClick={() => toggleExpandFeedback(feedback.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <FiChevronRight className={`transition-transform ${expandedFeedback === feedback.id ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  {(expandedFeedback === feedback.id) && (
                    <div className="mt-4 pl-13 space-y-4">
                      {/* Feedback Comment */}
                      {feedback.review && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">{feedback.title}</h4>
                          <p className="text-sm text-gray-700">{feedback.review}</p>
                        </div>
                      )}
                      
                   

                     {console.log(feedback, 'the feedback is')}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <FiMessageSquare size={24} />
                </div>
                <h4 className="text-gray-600 font-medium">No feedback found</h4>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm ? "Try a different search term" : "No feedback matches the selected filters"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;