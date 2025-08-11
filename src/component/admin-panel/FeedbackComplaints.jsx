"use client";
import React, { useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiMail, FiSearch, FiChevronDown, FiSend } from "react-icons/fi";

const FeedbackComplaints = () => {
  // Sample complaints data
  const [complaints, setComplaints] = useState([
    { id: 1, from: "Emma Watson", against: "Elite Salon", type: "Service Quality", date: "10 Jun 2023", status: "pending", message: "Color didn't match what I asked for" },
    { id: 2, from: "Olivia Parker", against: "Glamour Studio", type: "Hygiene", date: "12 Jun 2023", status: "resolved", message: "Tools were not properly sanitized" },
    { id: 3, from: "Sophia Lee", against: "Luxe Beauty", type: "Staff Behavior", date: "14 Jun 2023", status: "investigating", message: "Stylist was rude during service" },
    { id: 4, from: "Ava Martinez", against: "Urban Cuts", type: "Service Quality", date: "16 Jun 2023", status: "pending", message: "Haircut was uneven" },
    { id: 5, from: "Mia Johnson", against: "Posh Spa", type: "Pricing", date: "18 Jun 2023", status: "resolved", message: "Charged more than quoted price" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedComplaint, setExpandedComplaint] = useState(null);

  // Calculate complaint stats
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === "pending").length;
  const resolvedComplaints = complaints.filter(c => c.status === "resolved").length;

  const handleComplaintAction = (id, action) => {
    setComplaints(prev => prev.map(complaint => 
      complaint.id === id ? { ...complaint, status: action } : complaint
    ));
  };

  const handleReply = (id) => {
    if (replyingTo === id) {
      // Send reply logic would go here
      console.log("Sending reply:", replyMessage);
      setReplyingTo(null);
      setReplyMessage("");
    } else {
      setReplyingTo(id);
    }
  };

  const toggleExpandComplaint = (id) => {
    setExpandedComplaint(expandedComplaint === id ? null : id);
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.from.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         complaint.against.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Feedback & Complaints</h2>
        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search complaints..."
            className="pl-10 pr-3 py-2 border rounded-lg text-sm w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-white to-indigo-50 p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Complaints</p>
              <h3 className="text-2xl font-bold text-gray-800">{totalComplaints}</h3>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <FiAlertCircle size={22} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-amber-50 p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Resolution</p>
              <h3 className="text-2xl font-bold text-gray-800">{pendingComplaints}</h3>
            </div>
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <FiAlertCircle size={22} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50 p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Resolved</p>
              <h3 className="text-2xl font-bold text-gray-800">{resolvedComplaints}</h3>
            </div>
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
              <FiCheckCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-3 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                statusFilter === "all" 
                  ? "bg-indigo-600 text-white shadow-md" 
                  : "bg-white border text-gray-700 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                statusFilter === "pending" 
                  ? "bg-amber-500 text-white shadow-md" 
                  : "bg-white border text-gray-700 hover:bg-gray-100"
              }`}
            >
              Pending
            </button>
            <button 
              onClick={() => setStatusFilter("investigating")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                statusFilter === "investigating" 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-white border text-gray-700 hover:bg-gray-100"
              }`}
            >
              Investigating
            </button>
            <button 
              onClick={() => setStatusFilter("resolved")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                statusFilter === "resolved" 
                  ? "bg-emerald-600 text-white shadow-md" 
                  : "bg-white border text-gray-700 hover:bg-gray-100"
              }`}
            >
              Resolved
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Showing {filteredComplaints.length} of {complaints.length} complaints
          </p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map(complaint => (
              <div key={complaint.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        {complaint.from.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{complaint.from}</p>
                        <p className="text-sm text-gray-500">Against: <span className="font-medium">{complaint.against}</span></p>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        complaint.status === "resolved" ? "bg-emerald-100 text-emerald-800" :
                        complaint.status === "investigating" ? "bg-blue-100 text-blue-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                      </span>
                      <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                        {complaint.type}
                      </span>
                      <span className="text-xs text-gray-400">
                        {complaint.date}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleExpandComplaint(complaint.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiChevronDown className={`transition-transform ${expandedComplaint === complaint.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                {(expandedComplaint === complaint.id) && (
                  <div className="mt-4 pl-12 space-y-4">
                     <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 pt-4">{complaint.message}</p>
                    </div>
                    
                    {/* Reply Section */}
                    {replyingTo === complaint.id && (
                      <div className="mt-3 space-y-2">
                        <label className="text-xs font-medium text-gray-500">Your response</label>
                        <textarea
                          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          rows="3"
                          placeholder="Type your response here..."
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => handleComplaintAction(complaint.id, "resolved")}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                            complaint.status === "resolved" ? "bg-emerald-700" : "bg-emerald-600"
                          } text-white hover:shadow-md flex items-center gap-1`}
                        >
                          <FiCheckCircle size={14} />
                          Resolved
                        </button>
                        <button 
                          onClick={() => handleComplaintAction(complaint.id, "investigating")}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                            complaint.status === "investigating" ? "bg-blue-700" : "bg-blue-600"
                          } text-white hover:shadow-md flex items-center gap-1`}
                        >
                          <FiAlertCircle size={14} />
                          Investigate
                        </button>
                        <button 
                          onClick={() => handleComplaintAction(complaint.id, "pending")}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                            complaint.status === "pending" ? "bg-amber-600" : "bg-amber-500"
                          } text-white hover:shadow-md flex items-center gap-1`}
                        >
                          <FiAlertCircle size={14} />
                          Reopen
                        </button>
                      </div>
                      <button 
                        onClick={() => handleReply(complaint.id)}
                        className={`text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                          replyingTo === complaint.id 
                            ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                            : "text-indigo-600 hover:bg-indigo-50"
                        }`}
                      >
                        {replyingTo === complaint.id ? (
                          <>
                            <FiSend size={14} />
                            Send Reply
                          </>
                        ) : (
                          <>
                            <FiMail size={14} />
                            Reply
                          </>
                        )}
                      </button>
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
    </div>
  );
};

export default FeedbackComplaints;