"use client";
import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX, FiInfo } from "react-icons/fi";

// Reusable form components
const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

const SelectField = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      value={value}
      onChange={onChange}
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const TextAreaField = ({ label, value, onChange, rows = 3 }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      value={value}
      onChange={onChange}
    />
  </div>
);

const ToggleField = ({ label, checked, onChange }) => (
  <div className="flex items-center">
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange}
        className="sr-only peer" 
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
      <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
    </label>
  </div>
);

const ServiceManagement = () => {
  // Sample service data
  const [services, setServices] = useState([
    { id: 1, name: "Haircut", category: "Hair", duration: "45 min", price: 45, salons: 12, active: true, description: "Professional haircut with styling" },
    { id: 2, name: "Hair Color", category: "Hair", duration: "2 hours", price: 120, salons: 8, active: true, description: "Full hair coloring service with premium products" },
    { id: 3, name: "Manicure", category: "Nails", duration: "30 min", price: 25, salons: 15, active: true, description: "Basic manicure with nail shaping and polish" },
    { id: 4, name: "Pedicure", category: "Nails", duration: "45 min", price: 35, salons: 14, active: false, description: "Luxury pedicure with foot massage" },
    { id: 5, name: "Facial", category: "Skin", duration: "1 hour", price: 60, salons: 10, active: true, description: "Deep cleansing facial with mask treatment" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [newService, setNewService] = useState({
    name: "",
    category: "Hair",
    duration: "",
    price: "",
    description: "",
    active: true
  });

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
    setIsEditModalOpen(true);
  };

  const handleDeleteService = (id) => {
    setCurrentService(services.find(s => s.id === id));
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setServices(prev => prev.filter(service => service.id !== currentService.id));
    setIsDeleteModalOpen(false);
  };

  const saveEditedService = () => {
    setServices(prev => prev.map(service => 
      service.id === currentService.id ? currentService : service
    ));
    setIsEditModalOpen(false);
  };

  const handleAddService = () => {
    const newServiceWithId = {
      ...newService,
      id: services.length + 1,
      salons: 0,
      price: parseFloat(newService.price)
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
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(services.map(service => service.category))];
  const serviceCountByCategory = categories.reduce((acc, category) => {
    acc[category] = services.filter(s => s.category === category).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Service Management</h2>
        <button 
          onClick={() => setIsAddServiceModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-sm"
        >
          <FiPlus size={18} />
          Add New Service
        </button>
      </div>
      
      {/* Service Categories */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-4 border-b">
          <h3 className="font-medium text-gray-700">Service Categories</h3>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => setCategoryFilter("all")}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              categoryFilter === "all" ? "border-indigo-500 bg-indigo-50 shadow-sm" : "hover:border-gray-300"
            }`}
          >
            <h4 className="font-medium text-gray-800">All Services</h4>
            <p className="text-sm text-gray-500 mt-1">{services.length} services</p>
          </div>
          
          {categories.map(category => (
            <div 
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                categoryFilter === category ? "border-indigo-500 bg-indigo-50 shadow-sm" : "hover:border-gray-300"
              }`}
            >
              <h4 className="font-medium text-gray-800">{category} Services</h4>
              <p className="text-sm text-gray-500 mt-1">{serviceCountByCategory[category]} services</p>
            </div>
          ))}
        </div>
      </div>

      {/* All Services */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-3">
          <h3 className="font-medium text-gray-700">All Services</h3>
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              className="pl-10 pr-3 py-2 border rounded-lg text-sm w-full focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredServices.length > 0 ? (
            filteredServices.map(service => (
              <div key={service.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-gray-800 truncate">{service.name}</p>
                      <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                        service.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {service.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 truncate">
                      {service.category} • {service.duration} • ${service.price}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Offered by {service.salons} {service.salons === 1 ? "salon" : "salons"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 ml-4">
                    <button 
                      onClick={() => handleViewService(service)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors p-1.5 rounded-full hover:bg-indigo-50"
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                    <button 
                      onClick={() => handleEditService(service)}
                      className="text-yellow-600 hover:text-yellow-900 transition-colors p-1.5 rounded-full hover:bg-yellow-50"
                      title="Edit Service"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-600 hover:text-red-900 transition-colors p-1.5 rounded-full hover:bg-red-50"
                      title="Delete Service"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No services found matching your criteria
            </div>
          )}
        </div>
      </div>

      {/* Add Service Modal */}
      {isAddServiceModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold text-gray-800">Add New Service</h3>
              <button 
                onClick={() => setIsAddServiceModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <InputField 
                label="Service Name"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
                placeholder="e.g. Hair Coloring"
              />
              
              <SelectField 
                label="Category"
                value={newService.category}
                options={["Hair", "Nails", "Skin", "Other"]}
                onChange={(e) => setNewService({...newService, category: e.target.value})}
              />
              
              <InputField 
                label="Duration"
                value={newService.duration}
                onChange={(e) => setNewService({...newService, duration: e.target.value})}
                placeholder="e.g. 30 min"
              />
              
              <InputField 
                label="Price ($)"
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({...newService, price: e.target.value})}
              />

              <TextAreaField 
                label="Description"
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
              />
              
              <ToggleField 
                label="Active Status"
                checked={newService.active}
                onChange={(e) => setNewService({...newService, active: e.target.checked})}
              />
            </div>
            
            <div className="border-t p-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddServiceModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddService}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold text-gray-800">Service Details</h3>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Service Name</p>
                  <p className="font-medium text-gray-800">{currentService.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-800">{currentService.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium text-gray-800">{currentService.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium text-gray-800">${currentService.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    currentService.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {currentService.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Salons Offering</p>
                  <p className="font-medium text-gray-800">{currentService.salons}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium text-gray-800 mt-1">{currentService.description}</p>
              </div>
            </div>
            
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {isEditModalOpen && currentService && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 ">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold text-gray-800">Edit Service</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-4 ">
              <InputField 
                label="Service Name"
                value={currentService.name}
                onChange={(e) => setCurrentService({...currentService, name: e.target.value})}
              />
              
              <SelectField 
                label="Category"
                value={currentService.category}
                options={["Hair", "Nails", "Skin", "Other"]}
                onChange={(e) => setCurrentService({...currentService, category: e.target.value})}
              />
              
              <InputField 
                label="Duration"
                value={currentService.duration}
                onChange={(e) => setCurrentService({...currentService, duration: e.target.value})}
                placeholder="e.g. 30 min"
              />
              
              <InputField 
                label="Price ($)"
                type="number"
                value={currentService.price}
                onChange={(e) => setCurrentService({...currentService, price: e.target.value})}
              />

              <TextAreaField 
                label="Description"
                value={currentService.description}
                onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
              />
              
              <ToggleField 
                label="Active Status"
                checked={currentService.active}
                onChange={(e) => setCurrentService({...currentService, active: e.target.checked})}
              />
            </div>
            
            <div className="border-t p-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedService}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentService && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-gray-700">
                Are you sure you want to delete the service <span className="font-semibold">"{currentService.name}"</span>? This action cannot be undone.
              </p>
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">Category: {currentService.category}</p>
                <p className="text-sm text-gray-500">Price: ${currentService.price}</p>
                <p className="text-sm text-gray-500">Offered by {currentService.salons} salons</p>
              </div>
            </div>
            
            <div className="border-t p-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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