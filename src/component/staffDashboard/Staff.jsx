"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiPlus, FiX, FiEdit2, FiTrash2, FiSave, FiUser, FiBriefcase, FiUpload
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
    name: '',
    position: '',
    email: '',
    phone: '',
    bio: '',
    status: 'active',
    image: null
  });

  // Fetch staff
  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/salons/staff', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch staff');
      const data = await res.json();
      if (data.success) setStaff(data.data);
      else throw new Error(data.message);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchStaff(); }, []);

  // Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff(prev => ({ ...prev, [name]: value }));
  };

  // Image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewStaff(prev => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Reset form
  const resetForm = () => {
    setNewStaff({
      name: '',
      position: '',
      email: '',
      phone: '',
      bio: '',
      status: 'active',
      image: null
    });
    setCurrentStaff(null);
    setImagePreview(null);
  };

  // Add staff
  const handleAddStaff = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      Object.keys(newStaff).forEach(key => {
        if (newStaff[key]) formData.append(key, newStaff[key]);
      });

      const res = await fetch('/api/salons/staff', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setStaff(prev => [...prev, data.data]);
      toast.success('Staff added successfully');
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally { setIsLoading(false); }
  };

  // Edit staff
  const handleEditStaff = (staffMember) => {
    setCurrentStaff(staffMember);
    setNewStaff({
      name: staffMember.name || '',
      position: staffMember.position || '',
      email: staffMember.email || '',
      phone: staffMember.phone || '',
      bio: staffMember.bio || '',
      status: staffMember.status || 'active',
      image: null
    });
    setImagePreview(staffMember.image || null);
    setIsModalOpen(true);
  };

  // Update staff
  const handleUpdateStaff = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('id', currentStaff.id);
      Object.keys(newStaff).forEach(key => {
        if (newStaff[key]) formData.append(key, newStaff[key]);
      });

      const res = await fetch('/api/salons/staff', {
        method: 'PATCH',
        credentials: 'include',
        body: formData
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setStaff(prev => prev.map(s => s.id === currentStaff.id ? data.data : s));
      toast.success('Staff updated successfully');
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally { setIsLoading(false); }
  };

  // Delete staff
  const showDeleteConfirm = (staffMember) => {
    setStaffToDelete(staffMember);
    setIsDeleteModalOpen(true);
  };
  const hideDeleteConfirm = () => { setStaffToDelete(null); setIsDeleteModalOpen(false); };
  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;
    try {
      setIsLoading(true);
      const res = await fetch('/api/salons/staff', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: staffToDelete.id })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setStaff(prev => prev.filter(s => s.id !== staffToDelete.id));
      toast.success('Staff deleted successfully');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
      hideDeleteConfirm();
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  // Modal form JSX
  const renderModalForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input type="text" name="name" value={newStaff.name} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
        <input type="text" name="position" value={newStaff.position} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" name="email" value={newStaff.email} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input type="text" name="phone" value={newStaff.phone} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea name="bio" value={newStaff.bio} onChange={handleInputChange} rows="3" className="w-full border border-gray-300 p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select name="status" value={newStaff.status} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
        {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded-md" />}
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
          <FiPlus /> Add Staff
        </button>
      </div>

      {/* Staff list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {staff.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiBriefcase className="text-4xl mb-2 mx-auto" />
            <p>No staff yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {staff.map(s => (
              <div key={s.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                    {s.image ? <img src={s.image} alt={s.name} className="w-full h-full object-cover" /> : <FiUser className="text-indigo-600 text-xl" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{s.name} ({s.position})</h4>
                    <p className="text-xs text-gray-500">
                      {s.email && <span>Email: {s.email} • </span>}
                      {s.phone && <span>Phone: {s.phone}</span>}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Status: {s.status}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditStaff(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><FiEdit2 /></button>
                  <button onClick={() => showDeleteConfirm(s)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"><FiTrash2 /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col shadow-xl"
            >
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-medium text-gray-900">{currentStaff ? 'Edit Staff' : 'Add Staff'}</h3>
                <button 
                  onClick={() => { resetForm(); setIsModalOpen(false); }} 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {renderModalForm()}
              </div>
              
              <div className="flex justify-end gap-2 p-6 border-t">
                <button 
                  onClick={() => { resetForm(); setIsModalOpen(false); }} 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={currentStaff ? handleUpdateStaff : handleAddStaff} 
                  disabled={isLoading} 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : (currentStaff ? 'Update' : 'Add') + ' Staff'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <FiTrash2 className="text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Delete Staff Member</h3>
              </div>
              
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete {staffToDelete?.name}? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-2">
                <button 
                  onClick={hideDeleteConfirm} 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteStaff} 
                  disabled={isLoading} 
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffManagement;