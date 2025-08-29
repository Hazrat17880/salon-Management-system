"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  Edit2, 
  CheckCircle, 
  Trash2, 
  X, 
  Power, 
  EyeOff,
  RefreshCw,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, user: null });
  const router = useRouter();

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (verificationFilter !== 'all') params.append('verification', verificationFilter);

      const response = await fetch(`/api/admin/users?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user status toggle (active/inactive)
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          active: newStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, active: newStatus } : user
        ));
        
        // Refresh the view if a user is open
        if (viewMode && selectedUser?.id === userId) {
          setSelectedUser(prev => ({ ...prev, active: newStatus }));
        }
        
        toast.success(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating user status:', err);
      toast.error(err.message);
    }
  };

  // Handle user verification
  const toggleUserVerification = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      
      const response = await fetch('/api/admin/users?action=verification', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          is_verified: newStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, is_verified: newStatus } : user
        ));
        
        toast.success(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating user verification:', err);
      toast.error(err.message);
    }
  };

  // Show delete confirmation
  const showDeleteConfirm = (user) => {
    setDeleteConfirm({ show: true, user });
  };

  // Hide delete confirmation
  const hideDeleteConfirm = () => {
    setDeleteConfirm({ show: false, user: null });
  };

  // Handle user deletion
  const handleDelete = async () => {
    if (!deleteConfirm.user) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId: deleteConfirm.user.id })
      });

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        setUsers(prev => prev.filter(user => user.id !== deleteConfirm.user.id));
        
        // Close modals if open
        if (viewMode && selectedUser?.id === deleteConfirm.user.id) {
          setViewMode(false);
        }
        
        toast.success(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting user:', err);
      toast.error(err.message);
    } finally {
      hideDeleteConfirm();
    }
  };

  // View user details
  const handleView = (user) => {
    setSelectedUser(user);
    setViewMode(true);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format date of birth
  const formatDOB = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate age from date of birth
  const calculateAge = (dateString) => {
    if (!dateString) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 right-0 px-4 py-3"
            onClick={() => setError('')}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                  Delete User
                </h3>
                
                <p className="text-sm text-gray-500 text-center mb-6">
                  Are you sure you want to delete <span className="font-medium">{deleteConfirm.user?.full_name}</span>? 
                  This action cannot be undone.
                </p>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={hideDeleteConfirm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewMode && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{selectedUser.full_name}</h3>
                  <button 
                    onClick={() => setViewMode(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center mb-6">
                    {selectedUser.image ? (
                      <img 
                        src={selectedUser.image} 
                        alt={selectedUser.full_name}
                        className="w-32 h-32 rounded-full object-cover mb-4"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                        <User size={48} className="text-gray-400" />
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        selectedUser.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {selectedUser.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        selectedUser.is_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {selectedUser.is_verified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">{selectedUser.email}</span>
                    </div>
                    
                    {selectedUser.phone_number && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">{selectedUser.phone_number}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">
                        {formatDOB(selectedUser.date_of_birth)} ({calculateAge(selectedUser.date_of_birth)} years)
                      </span>
                    </div>
                    
                    {selectedUser.gender && (
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-700 capitalize">{selectedUser.gender}</span>
                      </div>
                    )}
                    
                    {selectedUser.address && (
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <span className="text-gray-700">{selectedUser.address}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">Joined: {formatDate(selectedUser.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="flex flex-wrap gap-2">
            {/* Status Filter Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-white appearance-none pr-8"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            {/* Verification Filter Dropdown */}
            <div className="relative">
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-white appearance-none pr-8"
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
          
          <input
            type="text"
            placeholder="Search users..."
            className="px-3 py-2 border rounded-md text-sm w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <button 
            onClick={fetchUsers}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition whitespace-nowrap flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* User Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.image ? (
                          <img 
                            src={user.image} 
                            alt={user.full_name}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <User size={20} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{user.full_name}</div>
                          {user.gender && (
                            <div className="text-sm text-gray-500 capitalize">{user.gender}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      {user.phone_number && (
                        <div className="text-sm text-gray-500">{user.phone_number}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(user.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        user.is_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {user.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button 
                        onClick={() => handleView(user)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id, user.active)}
                        className={`p-1 rounded-full ${
                          user.active 
                            ? "text-green-600 hover:bg-green-100" 
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        title={user.active ? "Deactivate" : "Activate"}
                      >
                        <Power size={18} />
                      </button>
                      <button
                        onClick={() => toggleUserVerification(user.id, user.is_verified)}
                        className={`p-1 rounded-full ${
                          user.is_verified 
                            ? "text-blue-600 hover:bg-blue-100" 
                            : "text-yellow-600 hover:bg-yellow-100"
                        }`}
                        title={user.is_verified ? "Unverify" : "Verify"}
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button 
                        onClick={() => showDeleteConfirm(user)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {loading ? 'Loading users...' : 'No users found matching your criteria'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;