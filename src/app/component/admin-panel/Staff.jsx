"use client";
import React, { useState } from 'react';
import { FiEye, FiEdit2, FiCheckCircle, FiXCircle, FiTrash2, FiX } from "react-icons/fi";

const StaffManagement = () => {
  // Sample staff data
  const [staff, setStaff] = useState([
    { id: 1, name: "Robert Johnson", salon: "Elite Salon", role: "Senior Stylist", status: "active", joinDate: "10 Jan 2023", email: "robert@example.com", phone: "+1 555-1234" },
    { id: 2, name: "Jennifer Smith", salon: "Glamour Studio", role: "Nail Technician", status: "pending", joinDate: "15 Feb 2023", email: "jennifer@example.com", phone: "+1 555-5678" },
    { id: 3, name: "William Davis", salon: "Luxe Beauty", role: "Barber", status: "active", joinDate: "20 Mar 2023", email: "william@example.com", phone: "+1 555-9012" },
    { id: 4, name: "Elizabeth Wilson", salon: "Urban Cuts", role: "Color Specialist", status: "rejected", joinDate: "5 Apr 2023", email: "elizabeth@example.com", phone: "+1 555-3456" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedStaff, setEditedStaff] = useState({});

  const handleStaffAction = (id, action) => {
    setStaff(prev => prev.map(staffMember => 
      staffMember.id === id ? { ...staffMember, status: action } : staffMember
    ));
  };

  const handleView = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowViewModal(true);
  };

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    setEditedStaff({...staffMember});
    setShowEditModal(true);
  };

  const handleDelete = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setStaff(prev => prev.filter(member => member.id !== selectedStaff.id));
    setShowDeleteModal(false);
  };

  const saveChanges = () => {
    setStaff(prev => prev.map(member => 
      member.id === editedStaff.id ? editedStaff : member
    ));
    setShowEditModal(false);
  };

  const filteredStaff = staff.filter(staffMember => {
    const matchesSearch = staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         staffMember.salon.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staffMember.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || staffMember.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
      
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
            placeholder="Search staff..."
            className="px-3 py-1 border rounded-md text-sm w-full md:w-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filteredStaff.length > 0 ? (
                filteredStaff.map(staffMember => (
                  <tr key={staffMember.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{staffMember.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{staffMember.salon}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{staffMember.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{staffMember.joinDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        staffMember.status === "active" ? "bg-green-100 text-green-800" :
                        staffMember.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {staffMember.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button 
                        onClick={() => handleView(staffMember)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>
                      <button 
                        onClick={() => handleEdit(staffMember)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit Staff"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      {staffMember.status === "pending" && (
                        <>
                          <button 
                            onClick={() => handleStaffAction(staffMember.id, "active")}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <FiCheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleStaffAction(staffMember.id, "rejected")}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <FiXCircle size={18} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDelete(staffMember)}
                        className="text-red-600 hover:text-red-900"
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
                    No staff members found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Staff Details</h3>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{selectedStaff.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Salon</p>
                  <p className="font-medium">{selectedStaff.salon}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">{selectedStaff.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedStaff.status === "active" ? "bg-green-100 text-green-800" :
                    selectedStaff.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {selectedStaff.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium">{selectedStaff.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedStaff.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedStaff.phone}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button 
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Edit Staff Member</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={editedStaff.name}
                  onChange={(e) => setEditedStaff({...editedStaff, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Salon</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={editedStaff.salon}
                  onChange={(e) => setEditedStaff({...editedStaff, salon: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Role</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={editedStaff.role}
                  onChange={(e) => setEditedStaff({...editedStaff, role: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded"
                  value={editedStaff.status}
                  onChange={(e) => setEditedStaff({...editedStaff, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
              <button 
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={saveChanges}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-700">Are you sure you want to delete <span className="font-semibold">{selectedStaff.name}</span>? This action cannot be undone.</p>
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;