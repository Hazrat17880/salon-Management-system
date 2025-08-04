"use client";
import React, { useState } from 'react';
import { FiEdit2, FiPlus, FiX, FiSave, FiEye, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const Services = ({ initialServices = [] }) => {
  const [services, setServices] = useState(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [newService, setNewService] = useState({
    name: '',
    duration: '',
    price: '',
    active: true
  });

  // Toggle service status (active/inactive)
  const toggleServiceStatus = (id) => {
    setServices(prev =>
      prev.map(service =>
        service.id === id ? { ...service, active: !service.active } : service
      )
    );
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
  const handleAddService = () => {
    if (!newService.name || !newService.duration || !newService.price) return;
    
    const service = {
      ...newService,
      id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1,
      price: parseFloat(newService.price)
    };

    setServices(prev => [...prev, service]);
    setNewService({
      name: '',
      duration: '',
      price: '',
      active: true
    });
    setIsModalOpen(false);
  };

  // Edit existing service
  const handleEditService = (service) => {
    setCurrentService(service);
    setNewService(service);
    setIsModalOpen(true);
  };

  // Delete service
  const handleDeleteService = (id) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  // View service details
  const handleViewService = (service) => {
    setCurrentService(service);
    setIsViewModalOpen(true);
  };

  // Sample data
  const addSampleData = () => {
    const sampleServices = [
      { id: 1, name: "Haircut", duration: "45 min", price: 45, active: true, description: "Basic haircut with styling" },
      { id: 2, name: "Hair Color", duration: "2 hours", price: 120, active: true, description: "Full hair coloring service" },
      { id: 3, name: "Manicure", duration: "30 min", price: 25, active: true, description: "Basic manicure with polish" },
      { id: 4, name: "Pedicure", duration: "45 min", price: 35, active: true, description: "Relaxing pedicure treatment" },
      { id: 5, name: "Facial", duration: "60 min", price: 60, active: true, description: "Complete facial with massage" }
    ];
    setServices(sampleServices);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Service Management
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setCurrentService(null);
              setNewService({
                name: '',
                duration: '',
                price: '',
                active: true
              });
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
          >
            <FiPlus /> Add New Service
          </button>
          <button 
            onClick={addSampleData}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2"
          >
            Add Sample Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-medium">Available Services ({services.length})</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Active: {services.filter(s => s.active).length}
            </span>
            <span className="text-sm text-gray-500">
              Inactive: {services.filter(s => !s.active).length}
            </span>
          </div>
        </div>

        <div className="divide-y">
          {services.length > 0 ? (
            services.map((service) => (
              <div key={service.id} className={`p-4 transition-colors ${service.active ? 'hover:bg-gray-50' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {service.name}
                      {!service.active && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          Inactive
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {service.duration} • ${service.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleViewService(service)}
                      className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50"
                      title="View"
                    >
                      <FiEye size={16} />
                    </button>
                    <button 
                      onClick={() => handleEditService(service)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      onClick={() => toggleServiceStatus(service.id)}
                      className={`p-2 rounded-full ${service.active ? 'text-green-600 hover:text-green-800 hover:bg-green-50' : 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50'}`}
                      title={service.active ? "Deactivate" : "Activate"}
                    >
                      {service.active ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No services available. Add some services to get started.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {currentService ? "Edit Service" : "Add New Service"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newService.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Haircut, Coloring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={newService.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 30 min, 1 hour"
                />
              </div>
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newService.description || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Service description"
                  rows="3"
                />
              </div>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    checked={newService.active}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Active Service
                  </span>
                </label>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddService}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                disabled={!newService.name || !newService.duration || !newService.price}
              >
                <FiSave /> {currentService ? "Update" : "Save"} Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Service Modal */}
      {isViewModalOpen && currentService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Service Details</h3>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold">{currentService.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentService.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentService.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{currentService.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">${currentService.price}</p>
                </div>
              </div>
              
              {currentService.description && (
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-700">{currentService.description}</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
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
    </div>
  );
};

export default Services;