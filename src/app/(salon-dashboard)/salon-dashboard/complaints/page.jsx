"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Eye,
  EyeOff,
  Mail,
  Phone,
  User,
  Calendar,
  MessageSquare,
  X,
  MoreVertical
} from "lucide-react";
import { toast } from "react-toastify";

const SalonComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [viewedComplaints, setViewedComplaints] = useState(new Set());

  // Fetch complaints from API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/complaints/salon');
        const data = await response.json();
        
        if (data.success) {
          setComplaints(data.data);
          setFilteredComplaints(data.data);
        } else {
          toast.error(data.message || 'Failed to fetch complaints');
        }
      } catch (error) {
        console.error('Error fetching complaints:', error);
        toast.error('Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Filter complaints
  useEffect(() => {
    let result = [...complaints];

    // Filter by complaint type
    if (filter !== "all") {
      result = result.filter(complaint => complaint.complaint_about === filter);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(complaint => 
        complaint.full_name?.toLowerCase().includes(term) ||
        complaint.description?.toLowerCase().includes(term) ||
        complaint.email?.toLowerCase().includes(term)
      );
    }

    setFilteredComplaints(result);
  }, [complaints, filter, searchTerm]);

  const markAsRead = async (complaintId) => {
    try {
      const response = await fetch(`/api/salons/complaints/${complaintId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setComplaints(prev => prev.map(complaint => 
          complaint.id === complaintId 
            ? { ...complaint, is_read: true }
            : complaint
        ));
        
        // Add to viewed set
        setViewedComplaints(prev => new Set(prev.add(complaintId)));
        toast.success('Marked as read');
      } else {
        toast.error(data.message || 'Failed to mark as read');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/salon/complaints/mark-all-read', {
        method: 'PATCH',
      });

      const data = await response.json();

      if (data.success) {
        // Update all complaints as read
        setComplaints(prev => prev.map(complaint => ({ ...complaint, is_read: true })));
        toast.success('All complaints marked as read');
      } else {
        toast.error(data.message || 'Failed to mark all as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const getStats = () => {
    const total = complaints.length;
    const unread = complaints.filter(c => !c.is_read).length;
    const salonComplaints = complaints.filter(c => c.complaint_about === 'salon').length;
    const serviceComplaints = complaints.filter(c => c.complaint_about === 'services').length;

    return { total, unread, salonComplaints, serviceComplaints };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Complaints</h1>
              <p className="text-gray-600">Manage and respond to customer feedback</p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <button
                onClick={markAllAsRead}
                disabled={stats.unread === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Mark All as Read
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-600">Total Complaints</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
              <div className="text-sm text-red-600">Unread</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.salonComplaints}</div>
              <div className="text-sm text-orange-600">Salon Complaints</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.serviceComplaints}</div>
              <div className="text-sm text-purple-600">Service Complaints</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Types</option>
                    <option value="salon">Salon Complaints</option>
                    <option value="services">Service Complaints</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                  <select
                    onChange={(e) => {
                      // You can add status filter logic here
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Status</option>
                    <option value="unread">Unread Only</option>
                    <option value="read">Read Only</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onView={() => setSelectedComplaint(complaint)}
                onMarkAsRead={() => markAsRead(complaint.id)}
                isViewed={viewedComplaints.has(complaint.id) || complaint.is_read}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No complaints found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Complaint Detail Modal */}
        <AnimatePresence>
          {selectedComplaint && (
            <ComplaintDetailModal
              complaint={selectedComplaint}
              onClose={() => setSelectedComplaint(null)}
              onMarkAsRead={() => {
                markAsRead(selectedComplaint.id);
                setSelectedComplaint(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ComplaintCard = ({ complaint, onView, onMarkAsRead, isViewed }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${
        isViewed ? 'border-l-gray-300' : 'border-l-red-500'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
            {complaint.user_image ? (
              <img 
                src={complaint.user_image} 
                alt={complaint.full_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-indigo-600" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900">{complaint.full_name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                complaint.complaint_about === 'salon' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {complaint.complaint_about}
              </span>
              {!isViewed && (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  New
                </span>
              )}
            </div>
            
            <p className="text-gray-700 line-clamp-2 mb-3">{complaint.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(complaint.created_at).toLocaleDateString()}
              </div>
              
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {complaint.email}
              </div>

              {complaint.phone_number && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {complaint.phone_number}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isViewed && (
            <button
              onClick={onMarkAsRead}
              className="p-2 text-gray-400 hover:text-green-600"
              title="Mark as read"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onView}
            className="p-2 text-gray-400 hover:text-indigo-600"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ComplaintDetailModal = ({ complaint, onClose, onMarkAsRead }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Complaint Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              {complaint.user_image ? (
                <img 
                  src={complaint.user_image} 
                  alt={complaint.full_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-indigo-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{complaint.full_name}</h3>
              <p className="text-gray-600">{complaint.email}</p>
              {complaint.phone_number && (
                <p className="text-gray-600">{complaint.phone_number}</p>
              )}
            </div>
          </div>

          {/* Complaint Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Complaint Type</label>
              <div className={`px-3 py-2 rounded-lg ${
                complaint.complaint_about === 'salon' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {complaint.complaint_about}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Submitted On</label>
              <div className="px-3 py-2 bg-gray-100 rounded-lg">
                {new Date(complaint.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* Complaint Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            {!complaint.is_read && (
              <button
                onClick={onMarkAsRead}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Mark as Read
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SalonComplaints;