"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiPlus, 
  FiX, 
  FiEdit2, 
  FiTrash2, 
  FiSave,
  FiUser,
  FiBriefcase,
  FiStar,
  FiUpload,
  FiImage
} from 'react-icons/fi';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [newStaff, setNewStaff] = useState({
    title: '',
    image: null
  });

  // Fetch staff from API
  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/salons/staff', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }

      const data = await response.json();
      
      if (data.success) {
        setStaff(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching staff:', err);
      toast.error('Failed to fetch staff');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchStaff();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewStaff(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new staff member
  const handleAddStaff = async () => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('title', newStaff.title);
      if (newStaff.image) {
        formData.append('image', newStaff.image);
      }
      
      const response = await fetch('/api/salons/staff', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStaff(prev => [...prev, data.data]);
        resetForm();
        setIsModalOpen(false);
        toast.success('Staff member added successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error adding staff:', err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit staff member
  const handleEditStaff = (staffMember) => {
    setCurrentStaff(staffMember);
    setNewStaff({
      title: staffMember.title,
      image: null
    });
    setImagePreview(staffMember.image ? staffMember.image : null);
    setIsModalOpen(true);
  };

  // Update staff member
  const handleUpdateStaff = async () => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('id', currentStaff.id);
      formData.append('title', newStaff.title);
      if (newStaff.image) {
        formData.append('image', newStaff.image);
      }
      
      const response = await fetch('/api/salons/staff', {
        method: 'PATCH',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStaff(prev => prev.map(staffMember =>
          staffMember.id === currentStaff.id ? data.data : staffMember
        ));
        resetForm();
        setIsModalOpen(false);
        toast.success('Staff member updated successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating staff:', err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Show delete confirmation
  const showDeleteConfirm = (staffMember) => {
    setStaffToDelete(staffMember);
    setIsDeleteModalOpen(true);
  };

  // Hide delete confirmation
  const hideDeleteConfirm = () => {
    setStaffToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Delete staff member
  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/salons/staff', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id: staffToDelete.id })
      });

      const data = await response.json();

      if (data.success) {
        setStaff(prev => prev.filter(staffMember => staffMember.id !== staffToDelete.id));
        toast.success('Staff member deleted successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting staff:', err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
      hideDeleteConfirm();
    }
  };

  // Reset form
  const resetForm = () => {
    setNewStaff({
      title: '',
      image: null
    });
    setCurrentStaff(null);
    setImagePreview(null);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading && staff.length === 0) {
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
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && staffToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <FiTrash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Delete Staff Member
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete "{staffToDelete.title}"? This action cannot be undone.
                </p>
              </div>
              <div className="mt-5 sm:mt-6 flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={hideDeleteConfirm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteStaff}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Staff Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg w-full max-w-md"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {currentStaff ? "Edit Staff Member" : "Add Staff Member"}
                </h3>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title/Position
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newStaff.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Senior Stylist, Nail Technician"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  <div className="mt-1 flex items-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                      <span className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md">
                        <FiUpload size={16} />
                        Upload Image
                      </span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  
                  {(imagePreview || (currentStaff && currentStaff.image)) && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                      <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                        <img 
                          src={imagePreview || currentStaff.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={currentStaff ? handleUpdateStaff : handleAddStaff}
                  disabled={!newStaff.title || isLoading}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    newStaff.title && !isLoading
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Processing...' : (
                    <>
                      <FiSave /> {currentStaff ? 'Update' : 'Add'} Staff
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
        <button 
          onClick={() => {
            setCurrentStaff(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <FiPlus /> Add Staff Member
        </button>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium">Staff Members ({staff.length})</h3>
        </div>

        {staff.length > 0 ? (
          <div className="divide-y">
            {staff.map((staffMember) => (
              <div key={staffMember.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                      {staffMember.image ? (
                        <img 
                          src={staffMember.image} 
                          alt={staffMember.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="text-indigo-600 text-xl" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {staffMember.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-2">
                        Added: {formatDate(staffMember.created_at)}
                        {staffMember.updated_at !== staffMember.created_at && (
                          <span> • Updated: {formatDate(staffMember.updated_at)}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditStaff(staffMember)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      onClick={() => showDeleteConfirm(staffMember)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <FiBriefcase className="mx-auto text-4xl text-gray-300 mb-4" />
            <p>No staff members added yet.</p>
            <p className="text-sm mt-1">Add your first staff member to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffManagement;