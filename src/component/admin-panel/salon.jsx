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
  FileText,
  ImageIcon,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

const SalonManagement = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedSalon, setEditedSalon] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState({ type: '', url: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, salon: null });
  const router = useRouter();

  // Fetch salons from API
  const fetchSalons = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/salons`, {
        credentials: 'include'
      });
      console.log("your salon data are here :",response);

      if (!response.ok) {
        throw new Error('Failed to fetch salons');
      }

      const data = await response.json();
      console.log("your salons data are :",data);
      
      if (data.success) {
        setSalons(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching salons:', err);
      toast.error('Failed to fetch salons');
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchSalons();
  }, []);

  // Handle salon status toggle (active/inactive)
  const toggleSalonStatus = async (salonId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      
      const response = await fetch('/api/admin/salons', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          salonId,
          active: newStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setSalons(prev => prev.map(salon => 
          salon.id === salonId ? { ...salon, active: newStatus } : salon
        ));
        
        // Refresh the view if a salon is open
        if (viewMode && selectedSalon?.id === salonId) {
          setSelectedSalon(prev => ({ ...prev, active: newStatus }));
        }
        
        toast.success(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating salon status:', err);
      toast.error(err.message);
    }
  };

  // Handle salon verification
  const toggleSalonVerification = async (salonId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      
      const response = await fetch('/api/admin/salons?action=verification', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          salonId,
          is_verified: newStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setSalons(prev => prev.map(salon => 
          salon.id === salonId ? { ...salon, is_verified: newStatus } : salon
        ));
        
        toast.success(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating salon verification:', err);
      toast.error(err.message);
    }
  };

  // Show delete confirmation
  const showDeleteConfirm = (salon) => {
    setDeleteConfirm({ show: true, salon });
  };

  // Hide delete confirmation
  const hideDeleteConfirm = () => {
    setDeleteConfirm({ show: false, salon: null });
  };

  // Handle salon deletion
  const handleDelete = async () => {
    if (!deleteConfirm.salon) return;

    try {
      const response = await fetch('/api/admin/salons', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ salonId: deleteConfirm.salon.id })
      });

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        setSalons(prev => prev.filter(salon => salon.id !== deleteConfirm.salon.id));
        
        // Close modals if open
        if (viewMode && selectedSalon?.id === deleteConfirm.salon.id) {
          setViewMode(false);
        }
        if (editMode && editedSalon?.id === deleteConfirm.salon.id) {
          setEditMode(false);
        }
        
        toast.success(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting salon:', err);
      toast.error(err.message);
    } finally {
      hideDeleteConfirm();
    }
  };

  // Handle salon edit save
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Prepare the data for API
      const updateData = {
        salonId: editedSalon.id,
        salon_name: editedSalon.salon_name,
        owner_name: editedSalon.owner_name,
        email: editedSalon.email,
        phone_number: editedSalon.phone_number,
        street_info: editedSalon.street_info,
        city: editedSalon.city,
        state: editedSalon.state,
        country: editedSalon.country,
        postal_code: editedSalon.postal_code,
        description: editedSalon.description
      };

      const response = await fetch('/api/admin/salons', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setSalons(prev => prev.map(salon => 
          salon.id === editedSalon.id ? { ...salon, ...updateData } : salon
        ));
        setEditMode(false);
        toast.success(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating salon:', err);
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // View salon details
  const handleView = (salon) => {
    setSelectedSalon(salon);
    setViewMode(true);
  };

  // Edit salon
  const handleEdit = (salon) => {
    setEditedSalon({...salon});
    setEditMode(true);
  };

  // Navigate to salon detail page
  const viewSalonDetails = (salonId) => {
    router.push(`/admin-dashboard/salons/${salonId}`);
  };

  // Preview document/image
  const previewDocument = (url, type) => {
    setImagePreview({ type, url });
  };

  // Close document preview
  const closePreview = () => {
    setImagePreview({ type: '', url: '' });
  };

  // Filter salons locally based on search and filter criteria
  const filteredSalons = salons.filter(salon => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      salon.salon_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      salon.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && salon.active) ||
      (statusFilter === "inactive" && !salon.active);
    
    // Verification filter
    const matchesVerification = verificationFilter === "all" || 
      (verificationFilter === "verified" && salon.is_verified) ||
      (verificationFilter === "unverified" && !salon.is_verified);
    
    return matchesSearch && matchesStatus && matchesVerification;
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && salons.length === 0) {
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
                  Delete Salon
                </h3>
                
                <p className="text-sm text-gray-500 text-center mb-6">
                  Are you sure you want to delete <span className="font-medium">{deleteConfirm.salon?.salon_name}</span>? 
                  This action cannot be undone.
                </p>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={hideDeleteConfirm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {imagePreview.url && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            >
              <button 
                onClick={closePreview}
                className="absolute top-4 right-4 z-10 text-white bg-gray-800 rounded-full p-1 hover:bg-gray-700"
              >
                <X size={24} />
              </button>
              
              <div className="p-4">
                {imagePreview.type === 'image' ? (
                  <img 
                    src={imagePreview.url} 
                    alt="Preview" 
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                ) : (
                  <iframe 
                    src={imagePreview.url} 
                    className="w-full h-[80vh]"
                    title="Document preview"
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewMode && selectedSalon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{selectedSalon.salon_name}</h3>
                  <button 
                    onClick={() => setViewMode(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Owner:</span> {selectedSalon.owner_name}</p>
                      <p><span className="font-medium">Location:</span> {selectedSalon.city}, {selectedSalon.state}</p>
                      <p><span className="font-medium">Address:</span> {selectedSalon.street_info}</p>
                      <p><span className="font-medium">Registered:</span> {formatDate(selectedSalon.created_at)}</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          selectedSalon.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {selectedSalon.active ? 'Active' : 'Inactive'}
                        </span>
                      </p>
                      <p><span className="font-medium">Verified:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          selectedSalon.is_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {selectedSalon.is_verified ? 'Verified' : 'Not Verified'}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Email:</span> {selectedSalon.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedSalon.phone_number}</p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700">{selectedSalon.description || 'No description provided.'}</p>
                  </div>
                  
                  {/* Documents Section */}
                  {/* Documents Section */}
<div className="md:col-span-2">
  <h4 className="font-medium text-gray-900 mb-2">Documents & Images</h4>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    
    {/* ID Card */}
    {selectedSalon.id_card && (
      <div className="border rounded-lg p-3 flex flex-col items-center">
        <FileText className="text-blue-500 mb-2" size={32} />
        <p className="text-sm font-medium mb-2">ID Card</p>
        <img
          src={selectedSalon.id_card}
          alt="ID Card"
          className="w-full h-32 object-cover rounded mb-2 border cursor-pointer"
          onClick={() => previewDocument(selectedSalon.id_card, 'image')}
        />
        <button
          onClick={() => previewDocument(selectedSalon.id_card, 'image')}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View Full Image
        </button>
      </div>
    )}

    {/* License */}
    {selectedSalon.license && (
      <div className="border rounded-lg p-3 flex flex-col items-center">
        <FileText className="text-green-500 mb-2" size={32} />
        <p className="text-sm font-medium mb-2">Business License</p>
        <img
          src={selectedSalon.license}
          alt="License"
          className="w-full h-32 object-cover rounded mb-2 border cursor-pointer"
          onClick={() => previewDocument(selectedSalon.license, 'image')}
        />
        <button
          onClick={() => previewDocument(selectedSalon.license, 'image')}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View Full Image
        </button>
      </div>
    )}

    {/* Salon Image */}
    {selectedSalon.image && (
      <div className="border rounded-lg p-3 flex flex-col items-center">
        <ImageIcon className="text-purple-500 mb-2" size={32} />
        <p className="text-sm font-medium mb-2">Salon Image</p>
        <img
          src={selectedSalon.image}
          alt="Salon"
          className="w-full h-32 object-cover rounded mb-2 border cursor-pointer"
          onClick={() => previewDocument(selectedSalon.image, 'image')}
        />
        <button
          onClick={() => previewDocument(selectedSalon.image, 'image')}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View Full Image
        </button>
      </div>
    )}

    {/* Show message if no documents */}
    {!selectedSalon.id_card && !selectedSalon.license && !selectedSalon.image && (
      <div className="md:col-span-3 text-center py-4 text-gray-500">
        No documents or images uploaded.
      </div>
    )}
  </div>

  {/* Inline Image Preview Modal inside View Modal */}
  {imagePreview.url && (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-auto p-4"
      >
        <button 
          onClick={closePreview}
          className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-1 hover:bg-gray-700 z-10"
        >
          <X size={24} />
        </button>
        <img
          src={imagePreview.url}
          alt="Preview"
          className="w-full h-auto max-h-[75vh] object-contain rounded"
        />
      </motion.div>
    </div>
  )}
</div>
                  {/* View Full Details Button */}
                  <div className="md:col-span-2 mt-4">
                    <button
                      onClick={() => viewSalonDetails(selectedSalon.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      <ExternalLink size={18} />
                      View Full Salon Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editMode && editedSalon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Edit Salon</h3>
                  <button 
                    onClick={() => setEditMode(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Salon Information */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Salon Name*</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={editedSalon.salon_name || ''}
                      onChange={(e) => setEditedSalon({...editedSalon, salon_name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Owner Name*</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={editedSalon.owner_name || ''}
                      onChange={(e) => setEditedSalon({...editedSalon, owner_name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email*</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border rounded-md"
                      value={editedSalon.email || ''}
                      onChange={(e) => setEditedSalon({...editedSalon, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border rounded-md"
                      value={editedSalon.phone_number || ''}
                      onChange={(e) => setEditedSalon({...editedSalon, phone_number: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Street Address*</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={editedSalon.street_info || ''}
                      onChange={(e) => setEditedSalon({...editedSalon, street_info: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">City*</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={editedSalon.city || ''}
                      onChange={(e) => setEditedSalon({...editedSalon, city: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">State*</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={editedSalon.state || ''}
                      onChange={(e) => setEditedSalon({...editedSalon, state: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Postal Code*</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={editedSalon.postal_code || ''}
                      onChange={(e) => setEditedSalon({...editedSalon, postal_code: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md"
                      rows="3"
                      value={editedSalon.description || ''}
                      onChange={(e) => setEditedSalon({...editedSalon, description: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleSave}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    whileTap={{ scale: 0.98 }}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Salon Management</h2>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="flex flex-wrap gap-2">
            {/* Status Filter Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm bg-white appearance-none pr-8"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            
            {/* Verification Filter Dropdown */}
            <div className="relative">
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm bg-white appearance-none pr-8"
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search salons..."
            className="px-3 py-1 border rounded-md text-sm w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={() => fetchSalons()}
            className="px-4 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition whitespace-nowrap flex items-center gap-1"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Salon Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salon Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSalons.length > 0 ? (
                filteredSalons.map(salon => (
                  <tr key={salon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{salon.salon_name}</div>
                      <div className="text-sm text-gray-500">{salon.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{salon.owner_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{salon.city}, {salon.state}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(salon.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        salon.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {salon.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        salon.is_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {salon.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button 
                        onClick={() => handleView(salon)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => viewSalonDetails(salon.id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Full Details"
                      >
                        <ExternalLink size={18} />
                      </button>
                      <button 
                        onClick={() => handleEdit(salon)}
                        className="text-yellow-600 hover:text-yellow-900 p-1"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => toggleSalonStatus(salon.id, salon.active)}
                        className={`p-1 rounded-full ${
                          salon.active 
                            ? "text-green-600 hover:bg-green-100" 
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        title={salon.active ? "Deactivate" : "Activate"}
                      >
                        <Power size={18} />
                      </button>
                      <button
                        onClick={() => toggleSalonVerification(salon.id, salon.is_verified)}
                        className={`p-1 rounded-full ${
                          salon.is_verified 
                            ? "text-blue-600 hover:bg-blue-100" 
                            : "text-yellow-600 hover:bg-yellow-100"
                        }`}
                        title={salon.is_verified ? "Unverify" : "Verify"}
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button 
                        onClick={() => showDeleteConfirm(salon)}
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
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {loading ? 'Loading salons...' : 'No salons found matching your criteria'}
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

export default SalonManagement;