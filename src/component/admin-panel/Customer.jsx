"use client";
import React, { useState } from 'react';
import { 
  FiEye, 
  FiMail, 
  FiUserX, 
  FiUserCheck, 
  FiX, 
  FiUpload,
  FiSend  // Added this import
} from "react-icons/fi";


const CustomerManagement = () => {
  const [subject, setSubject] = useState("");
const [selectedImage, setSelectedImage] = useState(null);
  // Sample customer data
  const [customers, setCustomers] = useState([
    { id: 1, name: "Emma Watson", email: "emma@example.com", phone: "+1 555-1234", joinDate: "10 Jan 2023", status: "active", bookings: 5 },
    { id: 2, name: "Olivia Parker", email: "olivia@example.com", phone: "+1 555-5678", joinDate: "15 Feb 2023", status: "active", bookings: 3 },
    { id: 3, name: "Sophia Lee", email: "sophia@example.com", phone: "+1 555-9012", joinDate: "20 Mar 2023", status: "blocked", bookings: 2 },
    { id: 4, name: "Ava Martinez", email: "ava@example.com", phone: "+1 555-3456", joinDate: "5 Apr 2023", status: "active", bookings: 7 }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);


  

  const handleCustomerAction = (id, action) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, status: action } : customer
    ));
  };


  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  const handleSendMessage = (customer) => {
    setSelectedCustomer(customer);
    setShowMessageModal(true);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate sending message
    setTimeout(() => {
      setIsSending(false);
      setShowMessageModal(false);
      setMessage("");
      alert(`Message sent to ${selectedCustomer.name}`);
    }, 1500);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-3">
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
              onClick={() => setStatusFilter("blocked")}
              className={`px-3 py-1 text-sm rounded-md ${
                statusFilter === "blocked" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white border text-gray-700"
              }`}
            >
              Blocked
            </button>
          </div>
          <input
            type="text"
            placeholder="Search customers..."
            className="px-3 py-1 border rounded-md text-sm w-full md:w-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Since</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{customer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{customer.email}</div>
                      <div className="text-sm">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{customer.joinDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{customer.bookings}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        customer.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button 
                        onClick={() => handleViewDetails(customer)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>
                      <button 
                        onClick={() => handleSendMessage(customer)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Send Message"
                      >
                        <FiMail size={18} />
                      </button>
                      {customer.status === "active" ? (
                        <button 
                          onClick={() => handleCustomerAction(customer.id, "blocked")}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          title="Block Customer"
                        >
                          <FiUserX size={18} />
                          <span className="text-xs">Block</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleCustomerAction(customer.id, "active")}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          title="Unblock Customer"
                        >
                          <FiUserCheck size={18} />
                          <span className="text-xs">Unblock</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No customers found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showDetailsModal && selectedCustomer && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 animate-scaleIn">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b border-gray-100 p-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Customer Profile</h3>
          <p className="text-sm text-indigo-500 mt-1">Customer details and information</p>
        </div>
        <button 
          onClick={() => setShowDetailsModal(false)} 
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <FiX size={24} className="stroke-current" />
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-6 space-y-6">
        {/* Customer Header */}
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold">
            {selectedCustomer.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-800">{selectedCustomer.name}</h4>
            <p className="text-sm text-gray-500">ID: #{selectedCustomer.id.toString().padStart(4, '0')}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email Address</p>
            <p className="text-gray-700 font-medium flex items-center">
              <a href={`mailto:${selectedCustomer.email}`} className="hover:text-indigo-600 transition-colors">
                {selectedCustomer.email}
              </a>
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone Number</p>
            <p className="text-gray-700 font-medium">
              <a href={`tel:${selectedCustomer.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-indigo-600 transition-colors">
                {selectedCustomer.phone}
              </a>
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Member Since</p>
            <p className="text-gray-700 font-medium">{selectedCustomer.joinDate}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Bookings</p>
            <p className="text-gray-700 font-medium">
              <span className="text-indigo-600">{selectedCustomer.bookings}</span> sessions
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Account Status</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              selectedCustomer.status === "active" 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
            </span>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Customer Value</p>
            <div className="flex items-center">
              <span className="text-gray-700 font-medium">${
                selectedCustomer.bookings * 50 /* Assuming $50 per booking */
              }</span>
              <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                +{selectedCustomer.bookings * 10}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="border-t border-gray-100 px-6 py-4 flex justify-end space-x-3">
        <button 
          onClick={() => setShowDetailsModal(false)}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
        <button 
          onClick={() => {
            setShowDetailsModal(false);
            handleSendMessage(selectedCustomer);
          }}
          className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <FiMail className="mr-2" size={16} />
          Send Message
        </button>
      </div>
    </div>
  </div>
)}

     {showMessageModal && selectedCustomer && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold">Message {selectedCustomer.name}</h3>
        <button 
          onClick={() => {
            setShowMessageModal(false);
            setMessage("");
            setSubject("");
            setSelectedImage(null);
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleMessageSubmit} className="p-4 space-y-4">
        <div>
          <label className="block text-sm mb-1">Subject</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject..."
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Message</label>
          <textarea
            rows={4}
            className="w-full p-2 border rounded"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Attachment (optional)</label>
          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded cursor-pointer">
            {selectedImage ? (
              <div className="relative">
                <img 
                  src={URL.createObjectURL(selectedImage)} 
                  className="h-20 object-cover rounded"
                  alt="Preview"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              <>
                <FiUpload className="mb-2 text-gray-400" />
                <p className="text-sm">Click to upload</p>
              </>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && setSelectedImage(e.target.files[0])}
            />
          </label>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={() => setShowMessageModal(false)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center"
            disabled={isSending}
          >
            {isSending ? 'Sending...' : (
              <>
                <FiSend className="mr-2" /> Send
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default CustomerManagement;