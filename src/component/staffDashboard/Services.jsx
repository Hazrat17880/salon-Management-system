"use client";
import React, { useState, useEffect } from 'react';
import { 
  FiEdit2, FiPlus, FiX, FiSave, FiEye, 
  FiTrash2, FiToggleLeft, FiToggleRight, 
  FiChevronLeft, FiChevronRight, FiUpload, FiImage,
  FiFilter
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [newService, setNewService] = useState({
    main_category: 'unisex',
    sub_category: '',
    title: '',
    description: '',
    price: '',
    discount: 0,
    special_days: '',
    available_start_time: '',
    available_end_time: '',
    duration_minutes: 30,
    status: 'active'
  });

  // Fetch services from API
  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/salons/services');
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch services');
      }
    } catch (err) {
      setError('Failed to fetch services');
      toast.error('Failed to fetch services');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter services based on selected filters
  const filteredServices = services.filter(service => {
    if (categoryFilter !== 'all' && service.main_category !== categoryFilter) {
      return false;
    }
    if (statusFilter !== 'all' && service.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Clear image selection
  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  // Toggle service status (active/inactive)
  const toggleServiceStatus = async (id) => {
    try {
      const service = services.find(s => s.id === id);
      const updatedStatus = service.status === 'active' ? 'inactive' : 'active';
      
      const response = await fetch('/api/salons/services', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status: updatedStatus
        })
      });

      const data = await response.json();
      if (data.success) {
        setServices(prev =>
          prev.map(service =>
            service.id === id ? { ...service, status: updatedStatus } : service
          )
        );
        toast.success(`Service ${updatedStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      } else {
        toast.error(data.message || 'Failed to update service status');
      }
    } catch (err) {
      console.error('Error updating service status:', err);
      toast.error('Failed to update service status');
    }
  };

  // Handle input changes for form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Add new service
  const handleAddService = async () => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      // Append all service data
      Object.entries(newService).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Append image file if selected
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch('/api/salons/services', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setServices(prev => [...prev, data.data]);
        resetForm();
        setIsModalOpen(false);
        toast.success('Service created successfully');
      } else {
        toast.error(data.message || 'Failed to create service');
      }
    } catch (err) {
      console.error('Error adding service:', err);
      toast.error('Failed to create service');
    } finally {
      setIsLoading(false);
    }
  };

  // Edit existing service
  const handleEditService = (service) => {
    setCurrentService(service);
    setNewService({
      main_category: service.main_category,
      sub_category: service.sub_category,
      title: service.title,
      description: service.description,
      price: service.price,
      discount: service.discount,
      special_days: service.special_days,
      available_start_time: service.available_start_time,
      available_end_time: service.available_end_time,
      duration_minutes: service.duration_minutes,
      status: service.status
    });
    setImagePreview(service.image_url || '');
    setIsModalOpen(true);
    setCurrentStep(1);
  };

  // Update service
  const handleUpdateService = async () => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      // Append all service data
      Object.entries(newService).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Append image file if selected
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      // If we have a preview but no new file, it means we're keeping the existing image
      if (imagePreview && !imageFile && currentService.image_url) {
        formData.append('image_url', currentService.image_url);
      }
      
      // If we want to remove the image
      if (!imagePreview && currentService.image_url) {
        formData.append('remove_image', 'true');
      }

      formData.append('id', currentService.id);

      const response = await fetch('/api/salons/services', {
        method: 'PUT',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setServices(prev =>
          prev.map(service =>
            service.id === currentService.id ? data.data : service
          )
        );
        resetForm();
        setIsModalOpen(false);
        toast.success('Service updated successfully');
      } else {
        toast.error(data.message || 'Failed to update service');
      }
    } catch (err) {
      console.error('Error updating service:', err);
      toast.error('Failed to update service');
    } finally {
      setIsLoading(false);
    }
  };

  // Show delete confirmation
  const showDeleteConfirm = (service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  // Hide delete confirmation
  const hideDeleteConfirm = () => {
    setServiceToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Delete service
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/salons/services', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: serviceToDelete.id })
      });

      const data = await response.json();
      if (data.success) {
        setServices(prev => prev.filter(service => service.id !== serviceToDelete.id));
        toast.success('Service deleted successfully');
      } else {
        toast.error(data.message || 'Failed to delete service');
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      toast.error('Failed to delete service');
    } finally {
      setIsLoading(false);
      hideDeleteConfirm();
    }
  };

  // View service details
  const handleViewService = (service) => {
    setCurrentService(service);
    setIsViewModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setNewService({
      main_category: 'unisex',
      sub_category: '',
      title: '',
      description: '',
      price: '',
      discount: 0,
      special_days: '',
      available_start_time: '',
      available_end_time: '',
      duration_minutes: 30,
      status: 'active'
    });
    setImageFile(null);
    setImagePreview('');
    setCurrentStep(1);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  // Next step in form
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  // Previous step in form
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Form steps configuration
  const steps = [
    {
      id: 1,
      title: "Basic Information",
      fields: ['main_category', 'sub_category', 'title', 'description']
    },
    {
      id: 2,
      title: "Pricing & Duration",
      fields: ['price', 'discount', 'duration_minutes']
    },
    {
      id: 3,
      title: "Availability",
      fields: ['special_days', 'available_start_time', 'available_end_time']
    },
    {
      id: 4,
      title: "Media & Status",
      fields: ['status']
    }
  ];

  // Check if current step is valid
  const isStepValid = () => {
    const currentFields = steps.find(step => step.id === currentStep)?.fields || [];
    return currentFields.every(field => {
      if (field === 'price') return !isNaN(parseFloat(newService[field]));
      if (field === 'duration_minutes') return !isNaN(parseInt(newService[field]));
      return !!newService[field];
    });
  };

  return (
    <div className="space-y-6">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Service Management
        </h2>
        <button 
          onClick={() => {
            setCurrentService(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <FiPlus /> Add New Service
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setStatusFilter('all');
                }}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-medium">
            Available Services ({filteredServices.length})
            {services.length !== filteredServices.length && (
              <span className="text-sm text-gray-500 ml-2">
                (Filtered from {services.length} total)
              </span>
            )}
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Active: {services.filter(s => s.status === 'active').length}
            </span>
            <span className="text-sm text-gray-500">
              Inactive: {services.filter(s => s.status === 'inactive').length}
            </span>
          </div>
        </div>

        {isLoading && !services.length ? (
          <div className="p-8 text-center text-gray-500">
            Loading services...
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="divide-y">
            {filteredServices.map((service) => (
              <div key={service.id} className={`p-4 transition-colors ${service.status === 'active' ? 'hover:bg-gray-50' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {service.image_url && (
                      <div className="w-12 h-12 rounded-md overflow-hidden">
                        <img 
                          src={service.image_url} 
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {service.title}
                        <span className="text-xs px-2 py-1 rounded-full capitalize bg-indigo-100 text-indigo-800">
                          {service.main_category}
                        </span>
                        {service.status === 'inactive' && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            Inactive
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        {service.duration_minutes} min • ${service.price}
                        {service.discount > 0 && (
                          <span className="ml-2 text-green-600">
                            ({service.discount}% off)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleViewService(service)}
                      className="text-indigo-600 cursor-pointer hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50"
                      title="View"
                    >
                      <FiEye size={16} />
                    </button>
                    <button 
                      onClick={() => handleEditService(service)}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer p-2 rounded-full hover:bg-blue-50"
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      onClick={() => toggleServiceStatus(service.id)}
                      className={`p-2 rounded-full ${service.status === 'active' ? 'text-green-600 cursor-pointer hover:text-green-800 hover:bg-green-50' : 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50'}`}
                      title={service.status === 'active' ? "Deactivate" : "Activate"}
                    >
                      {service.status === 'active' ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                    </button>
                    <button 
                      onClick={() => showDeleteConfirm(service)}
                      className="text-red-600 hover:text-red-800 p-2 cursor-pointer rounded-full hover:bg-red-50"
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
            {services.length === 0 ? (
              'No services available. Add some services to get started.'
            ) : (
              'No services match your current filters. Try adjusting your filters.'
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && serviceToDelete && (
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
                  Delete Service
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete the service "{serviceToDelete.title}"? This action cannot be undone.
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
                  onClick={handleDeleteService}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete Service
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Service Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-lg font-medium">
                  {currentService ? "Edit Service" : "Add New Service"}
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

              {/* Step indicator */}
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {step.id}
                      </div>
                      <span className={`text-xs mt-1 ${currentStep === step.id ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 min-h-[400px] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: currentStep > steps.findIndex(s => s.id === currentStep) ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: currentStep > steps.findIndex(s => s.id === currentStep) ? -50 : 50 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Main Category
                          </label>
                          <select
                            name="main_category"
                            value={newService.main_category}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="unisex">Unisex</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sub Category
                          </label>
                          <input
                            type="text"
                            name="sub_category"
                            value={newService.sub_category}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g., Hair, Nails, Skin"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={newService.title}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g., Haircut, Manicure"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={newService.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Service description"
                            rows="3"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 2: Pricing & Duration */}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price ($)
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={newService.price}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g., 45, 120"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Discount (%)
                          </label>
                          <input
                            type="number"
                            name="discount"
                            value={newService.discount}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g., 10, 20"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (minutes)
                          </label>
                          <input
                            type="number"
                            name="duration_minutes"
                            value={newService.duration_minutes}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g., 30, 60"
                            min="5"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3: Availability */}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Special Days
                          </label>
                          <input
                            type="text"
                            name="special_days"
                            value={newService.special_days}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g., Weekends, Monday-Friday"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Available From
                            </label>
                            <input
                              type="time"
                              name="available_start_time"
                              value={newService.available_start_time}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Available To
                            </label>
                            <input
                              type="time"
                              name="available_end_time"
                              value={newService.available_end_time}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Media & Status */}
                    {currentStep === 4 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service Image
                          </label>
                          {imagePreview ? (
                            <div className="relative group">
                              <img
                                src={imagePreview}
                                alt="Service preview"
                                className="w-full h-48 object-cover rounded-md mb-2"
                              />
                              <button
                                type="button"
                                onClick={clearImage}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FiX size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  className="hidden"
                                />
                                <div className="flex flex-col items-center justify-center space-y-2">
                                  <FiUpload className="text-gray-400 text-2xl" />
                                  <span className="text-sm text-gray-600">
                                    Click to upload an image
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    (JPEG, PNG, max 5MB)
                                  </span>
                                </div>
                              </label>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="status"
                              checked={newService.status === 'active'}
                              onChange={(e) => {
                                handleInputChange({
                                  target: {
                                    name: 'status',
                                    value: e.target.checked ? 'active' : 'inactive'
                                  }
                                });
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-700">
                              Active Service
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="p-4 border-t flex justify-between">
                <div>
                  {currentStep > 1 && (
                    <button 
                      onClick={prevStep}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiChevronLeft /> Previous
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  {currentStep < steps.length ? (
                    <button 
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${isStepValid() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      Next <FiChevronRight />
                    </button>
                  ) : (
                    <button 
                      onClick={currentService ? handleUpdateService : handleAddService}
                      disabled={!isStepValid() || isLoading}
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${isStepValid() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      {isLoading ? 'Processing...' : (
                        <>
                          <FiSave /> {currentService ? 'Update' : 'Save'} Service
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Service Modal */}
      <AnimatePresence>
        {isViewModalOpen && currentService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium">Service Details</h3>
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {currentService.image_url && (
                  <div className="w-full h-48 rounded-md overflow-hidden">
                    <img 
                      src={currentService.image_url} 
                      alt={currentService.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{currentService.title}</h2>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                      {currentService.main_category}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      currentService.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {currentService.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                {currentService.sub_category && (
                  <div>
                    <h4 className="font-medium text-gray-700">Sub Category</h4>
                    <p className="text-gray-600">{currentService.sub_category}</p>
                  </div>
                )}
                
                {currentService.description && (
                  <div>
                    <h4 className="font-medium text-gray-700">Description</h4>
                    <p className="text-gray-600 whitespace-pre-line">{currentService.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Price</h4>
                    <p className="text-2xl font-bold text-gray-800">
                      ${currentService.price}
                      {currentService.discount > 0 && (
                        <span className="ml-2 text-sm text-green-600">
                          ({currentService.discount}% off)
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Duration</h4>
                    <p className="text-xl font-semibold text-gray-800">{currentService.duration_minutes} minutes</p>
                  </div>
                </div>
                
                {(currentService.available_start_time || currentService.available_end_time) && (
                  <div>
                    <h4 className="font-medium text-gray-700">Availability</h4>
                    <p className="text-gray-600">
                      {currentService.available_start_time} - {currentService.available_end_time}
                    </p>
                  </div>
                )}
                
                {currentService.special_days && (
                  <div>
                    <h4 className="font-medium text-gray-700">Special Days</h4>
                    <p className="text-gray-600">{currentService.special_days}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Services;