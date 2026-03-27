"use client";
import React, { useState, useEffect } from 'react';
import { 
  FiEdit2, FiTrash2, FiPlus, FiSearch, FiX, FiInfo, 
  FiCheck, FiAlertCircle, FiDollarSign, FiClock, 
  FiTag, FiGrid, FiRefreshCw, FiFilter
} from "react-icons/fi";

// Reusable form components with improved styling
const InputField = ({ label, type = "text", value, onChange, placeholder, required = false, error = "" }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const SelectField = ({ label, value, options, onChange, required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
      value={value}
      onChange={onChange}
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const TextAreaField = ({ label, value, onChange, rows = 3, required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <textarea
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
      value={value}
      onChange={onChange}
    />
  </div>
);

const ToggleField = ({ label, checked, onChange, description = "" }) => (
  <div className="mb-4">
    <div className="flex items-center justify-between">
      <div>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={onChange}
          className="sr-only peer" 
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
      </label>
    </div>
  </div>
);

const StatCard = ({ title, value, icon: Icon, color = "indigo" }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
      </div>
      <div className={`p-3 bg-${color}-50 rounded-lg`}>
        <Icon className={`text-${color}-600`} size={24} />
      </div>
    </div>
  </div>
);

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [newService, setNewService] = useState({
    name: "",
    category: "Hair",
    duration: "",
    price: "",
    description: "",
    active: true
  });

  // Mock API call - Replace with actual API endpoint
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockServices = [
          { id: 1, name: "Classic Haircut", category: "Hair", duration: "45 min", price: 45, salons: 12, active: true, description: "Professional haircut with styling and finishing touches", created_at: "2024-01-15" },
          { id: 2, name: "Premium Hair Color", category: "Hair", duration: "2 hours", price: 120, salons: 8, active: true, description: "Full hair coloring service with premium organic products", created_at: "2024-01-20" },
          { id: 3, name: "Luxury Manicure", category: "Nails", duration: "30 min", price: 25, salons: 15, active: true, description: "Basic manicure with nail shaping, cuticle care, and polish", created_at: "2024-01-10" },
          { id: 4, name: "Spa Pedicure", category: "Nails", duration: "45 min", price: 35, salons: 14, active: false, description: "Luxury pedicure with foot massage and paraffin treatment", created_at: "2024-01-05" },
          { id: 5, name: "Deep Cleansing Facial", category: "Skin", duration: "1 hour", price: 60, salons: 10, active: true, description: "Deep cleansing facial with mask treatment and massage", created_at: "2024-01-25" },
          { id: 6, name: "Bridal Makeup", category: "Makeup", duration: "2 hours", price: 150, salons: 6, active: true, description: "Professional bridal makeup with premium products", created_at: "2024-01-30" },
          { id: 7, name: "Waxing Full Body", category: "Hair Removal", duration: "1.5 hours", price: 80, salons: 9, active: true, description: "Complete body waxing service", created_at: "2024-02-01" }
        ];
        setServices(mockServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  const validateForm = (service, isNew = true) => {
    const errors = {};
    if (!service.name.trim()) errors.name = "Service name is required";
    if (!service.duration.trim()) errors.duration = "Duration is required";
    if (!service.price) errors.price = "Price is required";
    if (service.price <= 0) errors.price = "Price must be greater than 0";
    if (!service.description.trim() && isNew) errors.description = "Description is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const toggleServiceStatus = (id) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, active: !service.active } : service
    ));
  };

  const handleViewService = (service) => {
    setCurrentService(service);
    setIsViewModalOpen(true);
  };

  const handleEditService = (service) => {
    setCurrentService({...service});
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleDeleteService = (id) => {
    setCurrentService(services.find(s => s.id === id));
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // await api.delete(`/services/${currentService.id}`);
      setServices(prev => prev.filter(service => service.id !== currentService.id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const saveEditedService = () => {
    if (!validateForm(currentService, false)) return;
    
    setServices(prev => prev.map(service => 
      service.id === currentService.id ? currentService : service
    ));
    setIsEditModalOpen(false);
  };

  const handleAddService = () => {
    if (!validateForm(newService)) return;
    
    const newServiceWithId = {
      ...newService,
      id: Math.max(...services.map(s => s.id), 0) + 1,
      salons: 0,
      price: parseFloat(newService.price),
      created_at: new Date().toISOString().split('T')[0]
    };
    setServices(prev => [...prev, newServiceWithId]);
    setIsAddServiceModalOpen(false);
    setNewService({
      name: "",
      category: "Hair",
      duration: "",
      price: "",
      description: "",
      active: true
    });
    setFormErrors({});
  };

  const getStats = () => {
    const total = services.length;
    const active = services.filter(s => s.active).length;
    const inactive = total - active;
    const totalSalons = services.reduce((sum, s) => sum + s.salons, 0);
    const avgPrice = total > 0 ? (services.reduce((sum, s) => sum + s.price, 0) / total).toFixed(2) : 0;
    
    return { total, active, inactive, totalSalons, avgPrice };
  };

  const stats = getStats();
  const categories = [...new Set(services.map(service => service.category))];
  const serviceCountByCategory = categories.reduce((acc, category) => {
    acc[category] = services.filter(s => s.category === category).length;
    return acc;
  }, {});

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && service.active) ||
                         (statusFilter === "inactive" && !service.active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Service Management</h2>
          <p className="text-gray-500 mt-1">Manage and organize all your beauty services</p>
        </div>
        <button 
          onClick={() => setIsAddServiceModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
        >
          <FiPlus size={18} />
          Add New Service
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Services" value={stats.total} icon={FiGrid} color="indigo" />
        <StatCard title="Active Services" value={stats.active} icon={FiCheck} color="green" />
        <StatCard title="Total Salons" value={stats.totalSalons} icon={FiTag} color="blue" />
        <StatCard title="Avg. Price" value={`$${stats.avgPrice}`} icon={FiDollarSign} color="purple" />
      </div>

      {/* Service Categories */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <FiFilter size={16} />
            Service Categories
          </h3>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <button 
            onClick={() => setCategoryFilter("all")}
            className={`border rounded-lg p-3 text-left transition-all ${
              categoryFilter === "all" 
                ? "border-indigo-500 bg-indigo-50 shadow-sm ring-2 ring-indigo-200" 
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <p className="font-medium text-gray-800">All Services</p>
            <p className="text-sm text-gray-500 mt-1">{services.length} services</p>
          </button>
          
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`border rounded-lg p-3 text-left transition-all ${
                categoryFilter === category 
                  ? "border-indigo-500 bg-indigo-50 shadow-sm ring-2 ring-indigo-200" 
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <p className="font-medium text-gray-800">{category}</p>
              <p className="text-sm text-gray-500 mt-1">{serviceCountByCategory[category]} services</p>
            </button>
          ))}
        </div>
      </div>

      {/* All Services */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="font-semibold text-gray-700">All Services</h3>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, category, description..."
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {(searchTerm || categoryFilter !== "all" || statusFilter !== "all") && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1 transition-colors"
                >
                  <FiRefreshCw size={14} />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredServices.length > 0 ? (
            filteredServices.map(service => (
              <div key={service.id} className="p-4 hover:bg-gray-50 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-800">{service.name}</p>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        service.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {service.active ? "Active" : "Inactive"}
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                        {service.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <FiClock size={12} />
                        {service.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiDollarSign size={12} />
                        ${service.price}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiTag size={12} />
                        {service.salons} {service.salons === 1 ? "salon" : "salons"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1">{service.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewService(service)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <FiInfo size={18} />
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={service.active} 
                        onChange={() => toggleServiceStatus(service.id)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                    <button 
                      onClick={() => handleEditService(service)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Edit Service"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Service"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <FiSearch size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No services found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
        
        {filteredServices.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <p className="text-sm text-gray-500">
              Showing {filteredServices.length} of {services.length} services
            </p>
          </div>
        )}
      </div>

      {/* Modals - Same structure but with improved styling */}
      {isAddServiceModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold text-gray-800">Add New Service</h3>
              <button 
                onClick={() => setIsAddServiceModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-5">
              <InputField 
                label="Service Name"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
                placeholder="e.g., Hair Coloring"
                required
                error={formErrors.name}
              />
              
              <SelectField 
                label="Category"
                value={newService.category}
                options={["Hair", "Nails", "Skin", "Makeup", "Hair Removal", "Other"]}
                onChange={(e) => setNewService({...newService, category: e.target.value})}
                required
              />
              
              <InputField 
                label="Duration"
                value={newService.duration}
                onChange={(e) => setNewService({...newService, duration: e.target.value})}
                placeholder="e.g., 30 min"
                required
                error={formErrors.duration}
              />
              
              <InputField 
                label="Price ($)"
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({...newService, price: e.target.value})}
                placeholder="0.00"
                required
                error={formErrors.price}
              />

              <TextAreaField 
                label="Description"
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
                rows={3}
                required
              />
              
              <ToggleField 
                label="Active Status"
                description="Active services will be visible to customers"
                checked={newService.active}
                onChange={(e) => setNewService({...newService, active: e.target.checked})}
              />
            </div>
            
            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddServiceModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddService}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                disabled={!newService.name || !newService.duration || !newService.price}
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Service Modal */}
      {isViewModalOpen && currentService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold text-gray-800">Service Details</h3>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-medium">Service Name</p>
                  <p className="font-semibold text-gray-800 mt-1">{currentService.name}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-medium">Category</p>
                  <p className="font-semibold text-gray-800 mt-1">{currentService.category}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-medium">Duration</p>
                  <p className="font-semibold text-gray-800 mt-1">{currentService.duration}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-medium">Price</p>
                  <p className="font-semibold text-gray-800 mt-1">${currentService.price}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-medium">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                    currentService.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {currentService.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-medium">Salons</p>
                  <p className="font-semibold text-gray-800 mt-1">{currentService.salons}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-medium mb-2">Description</p>
                <p className="text-gray-700">{currentService.description}</p>
              </div>
              
              {currentService.created_at && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Created At</p>
                  <p className="text-gray-700">{new Date(currentService.created_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {isEditModalOpen && currentService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold text-gray-800">Edit Service</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-5">
              <InputField 
                label="Service Name"
                value={currentService.name}
                onChange={(e) => setCurrentService({...currentService, name: e.target.value})}
                required
                error={formErrors.name}
              />
              
              <SelectField 
                label="Category"
                value={currentService.category}
                options={["Hair", "Nails", "Skin", "Makeup", "Hair Removal", "Other"]}
                onChange={(e) => setCurrentService({...currentService, category: e.target.value})}
                required
              />
              
              <InputField 
                label="Duration"
                value={currentService.duration}
                onChange={(e) => setCurrentService({...currentService, duration: e.target.value})}
                placeholder="e.g., 30 min"
                required
                error={formErrors.duration}
              />
              
              <InputField 
                label="Price ($)"
                type="number"
                value={currentService.price}
                onChange={(e) => setCurrentService({...currentService, price: e.target.value})}
                required
                error={formErrors.price}
              />

              <TextAreaField 
                label="Description"
                value={currentService.description}
                onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
                rows={3}
              />
              
              <ToggleField 
                label="Active Status"
                description="Active services will be visible to customers"
                checked={currentService.active}
                onChange={(e) => setCurrentService({...currentService, active: e.target.checked})}
              />
            </div>
            
            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedService}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-red-50 rounded-lg">
                  <FiAlertCircle className="text-red-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-800 font-medium">
                    Are you sure you want to delete this service?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="font-medium text-gray-800">{currentService.name}</p>
                <p className="text-sm text-gray-500 mt-1">{currentService.category}</p>
                <p className="text-sm text-gray-500">${currentService.price} • {currentService.duration}</p>
              </div>
              
              {currentService.salons > 0 && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                  <FiAlertCircle className="text-yellow-600" size={16} />
                  <p className="text-xs text-yellow-700">
                    Warning: This service is currently offered by {currentService.salons} salon(s). Deleting it may affect existing appointments.
                  </p>
                </div>
              )}
            </div>
            
            <div className="border-t p-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;