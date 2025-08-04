"use client";
import React, { useState } from 'react';
import { FiEye, FiEdit2, FiCheckCircle, FiXCircle, FiTrash2, FiX , FiPower } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 


const SalonManagement = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Sample salon data with enhanced fields
  const [salons, setSalons] = useState([
    { 
      id: 1, 
      name: "Elite Salon", 
      owner: "Sarah Johnson", 
      status: "active", 
      location: "Downtown", 
      registrationDate: "15 Jan 2023",
      services: ["Haircut", "Coloring", "Styling"],
      contact: "sarah@elitesalon.com",
      phone: "+1 555-1234",
      description: "Premium salon offering high-end hair services with certified stylists."
    },
    { 
      id: 2, 
      name: "Glamour Studio", 
      owner: "Michael Brown", 
      status: "pending", 
      location: "Uptown", 
      registrationDate: "20 Feb 2023",
      services: ["Manicure", "Pedicure", "Nail Art"],
      contact: "michael@glamourstudio.com",
      phone: "+1 555-5678",
      description: "Specialized nail studio with artistic designs and premium products."
    },
    { 
      id: 3, 
      name: "Luxe Beauty", 
      owner: "Emily Davis", 
      status: "active", 
      location: "Midtown", 
      registrationDate: "5 Mar 2023",
      services: ["Facials", "Waxing", "Skin Treatments"],
      contact: "emily@luxebeauty.com",
      phone: "+1 555-9012",
      description: "Full-service beauty spa focusing on skin health and relaxation."
    },
    { 
      id: 4, 
      name: "Urban Cuts", 
      owner: "David Wilson", 
      status: "rejected", 
      location: "Suburb", 
      registrationDate: "10 Apr 2023",
      services: ["Haircut", "Beard Trim", "Shaves"],
      contact: "david@urbancuts.com",
      phone: "+1 555-3456",
      description: "Modern barber shop specializing in men's grooming services."
    }
  ]);


    // New toggle function for enable/disable
  const toggleSalonStatus = (id) => {
    setSalons(prev => prev.map(salon => 
      salon.id === id ? { 
        ...salon, 
        status: salon.status === "active" ? "disabled" : "active" 
      } : salon
    ));
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedSalon, setEditedSalon] = useState(null);

  const handleSalonAction = (id, action) => {
    setSalons(prev => prev.map(salon => 
      salon.id === id ? { ...salon, status: action } : salon
    ));
  };

  const handleView = (salon) => {
    setSelectedSalon(salon);
    setViewMode(true);
  };

  const handleEdit = (salon) => {
    setEditedSalon({...salon});
    setEditMode(true);
  };

  const handleSave = () => {
    setSalons(prev => prev.map(salon => 
      salon.id === editedSalon.id ? editedSalon : salon
    ));
    setEditMode(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this salon?")) {
      setSalons(prev => prev.filter(salon => salon.id !== id));
    }
  };

  const filteredSalons = salons.filter(salon => {
    const matchesSearch = salon.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         salon.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         salon.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || salon.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* View Modal */}
      <AnimatePresence>
        {viewMode && selectedSalon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{selectedSalon.name}</h3>
                  <button 
                    onClick={() => setViewMode(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Owner:</span> {selectedSalon.owner}</p>
                      <p><span className="font-medium">Location:</span> {selectedSalon.location}</p>
                      <p><span className="font-medium">Registered:</span> {selectedSalon.registrationDate}</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          selectedSalon.status === "active" ? "bg-green-100 text-green-800" :
                          selectedSalon.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {selectedSalon.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Email:</span> {selectedSalon.contact}</p>
                      <p><span className="font-medium">Phone:</span> {selectedSalon.phone}</p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700">{selectedSalon.description}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-2">Services Offered</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSalon.services.map((service, index) => (
                        <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                          {service}
                        </span>
                      ))}
                    </div>
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
          <FiX size={24} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Salon Information */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Salon Name*</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={editedSalon.name}
            onChange={(e) => setEditedSalon({...editedSalon, name: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Owner Name*</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={editedSalon.owner}
            onChange={(e) => setEditedSalon({...editedSalon, owner: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email*</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            value={editedSalon.email}
            onChange={(e) => setEditedSalon({...editedSalon, email: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
          <input
            type="tel"
            className="w-full px-3 py-2 border rounded-md"
            value={editedSalon.phone}
            onChange={(e) => setEditedSalon({...editedSalon, phone: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Location*</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={editedSalon.location}
            onChange={(e) => setEditedSalon({...editedSalon, location: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Registration Date</label>
          <div className="relative">
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-md"
              value={editedSalon.registrationDate}
              onChange={(e) => setEditedSalon({...editedSalon, registrationDate: e.target.value})}
            />
            <FaRegCalendarAlt className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Status*</label>
          <select
            className="w-full px-3 py-2 border rounded-md"
            value={editedSalon.status}
            onChange={(e) => setEditedSalon({...editedSalon, status: e.target.value})}
            required
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
        
        {/* Password Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 border rounded-md pr-10"
              value={editedSalon.password}
              onChange={(e) => setEditedSalon({...editedSalon, password: e.target.value})}
              placeholder="Leave blank to keep current"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        
        {/* Additional Fields */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Services* (comma separated)</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={editedSalon.services.join(", ")}
            onChange={(e) => setEditedSalon({...editedSalon, services: e.target.value.split(",").map(s => s.trim())})}
            required
          />
        </div>
        
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full px-3 py-2 border rounded-md"
            rows="3"
            value={editedSalon.description}
            onChange={(e) => setEditedSalon({...editedSalon, description: e.target.value})}
          />
        </div>
        
        {/* Remember Me Checkbox */}
        <div className="flex items-center md:col-span-2">
          <input
            id="remember-me"
            type="checkbox"
            checked={editedSalon.rememberMe}
            onChange={(e) => setEditedSalon({...editedSalon, rememberMe: e.target.checked})}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
            Remember this device
          </label>
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
          disabled={isLoading}
        >
          {isLoading ? (
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
            <button 
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 text-sm rounded-md ${
                statusFilter === "all" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white border text-gray-700"
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1 text-sm rounded-md ${
                statusFilter === "active" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white border text-gray-700"
              }`}
            >
              Active
            </button>
            <button 
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1 text-sm rounded-md ${
                statusFilter === "pending" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white border text-gray-700"
              }`}
            >
              Pending
            </button>
            <button 
              onClick={() => setStatusFilter("rejected")}
              className={`px-3 py-1 text-sm rounded-md ${
                statusFilter === "rejected" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white border text-gray-700"
              }`}
            >
              Rejected
            </button>
          </div>
          <input
            type="text"
            placeholder="Search salons..."
            className="px-3 py-1 border rounded-md text-sm w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button disabled className="px-4 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition whitespace-nowrap">
            Add New Salon
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
            <div className="font-medium text-gray-900">{salon.name}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500">{salon.owner}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{salon.location}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500">{salon.registrationDate}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-2 py-1 text-xs rounded-full ${
              salon.status === "active" ? "bg-green-100 text-green-800" :
              salon.status === "pending" ? "bg-yellow-100 text-yellow-800" :
              salon.status === "rejected" ? "bg-red-100 text-red-800" :
              salon.status === "disabled" ? "bg-gray-100 text-gray-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {salon.status}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap space-x-2">
            <button 
              onClick={() => handleView(salon)}
              className="text-indigo-600 hover:text-indigo-900 p-1"
              title="View"
            >
              <FiEye size={18} />
            </button>
            <button 
              onClick={() => handleEdit(salon)}
              className="text-yellow-600 hover:text-yellow-900 p-1"
              title="Edit"
            >
              <FiEdit2 size={18} />
            </button>
            {salon.status === "pending" && (
              <>
                <button 
                  onClick={() => handleSalonAction(salon.id, "active")}
                  className="text-green-600 hover:text-green-900 p-1"
                  title="Approve"
                >
                  <FiCheckCircle size={18} />
                </button>
                <button 
                  onClick={() => handleSalonAction(salon.id, "rejected")}
                  className="text-red-600 hover:text-red-900 p-1"
                  title="Reject"
                >
                  <FiXCircle size={18} />
                </button>
              </>
            )}
            <button
              onClick={() => toggleSalonStatus(salon.id)}
              className={`p-1 rounded-full ${
                salon.status === "active" 
                  ? "text-green-600 hover:bg-green-100" 
                  : salon.status === "disabled"
                  ? "text-gray-600 hover:bg-gray-100"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              title={
                salon.status === "active" ? "Disable" :
                salon.status === "disabled" ? "Enable" :
                "Approve first to enable/disable"
              }
              disabled={!["active", "disabled"].includes(salon.status)}
            >
              <FiPower size={18} />
            </button>
            <button 
              onClick={() => handleDelete(salon.id)}
              className="text-red-600 hover:text-red-900 p-1"
              title="Delete"
            >
              <FiTrash2 size={18} />
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
          No salons found matching your criteria
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