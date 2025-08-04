"use client";
import { useState } from "react";
import { FiUser, FiX, FiLock, FiUnlock, FiEdit2, FiTrash2 } from "react-icons/fi";

const CustomerModal = ({ customer, onClose, onBlockToggle }) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Customer Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <FiUser className="text-indigo-600" size={24} />
            </div>
            <div>
              <h3 className="font-medium text-xl flex items-center gap-2">
                {customer.name}
                {customer.isBlocked ? (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center gap-1">
                    <FiLock size={12} /> Blocked
                  </span>
                ) : (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                    <FiUnlock size={12} /> Active
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500">Member since {customer.joinDate}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p>{customer.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Phone</label>
              <p>{customer.phone}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Last Visit</label>
              <p>{customer.lastVisit}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Total Visits</label>
              <p>{customer.totalVisits}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Preferred Services</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {customer.services.map((service, index) => (
                <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded">
                  {service}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Notes</label>
            <p className="mt-1">{customer.notes}</p>
          </div>
        </div>
        <div className="p-4 border-t flex justify-between">
          <button
            onClick={() => onBlockToggle(customer.id)}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              customer.isBlocked
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {customer.isBlocked ? <FiUnlock /> : <FiLock />}
            {customer.isBlocked ? "Unblock Customer" : "Block Customer"}
          </button>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 flex items-center gap-2">
              <FiEdit2 /> Edit
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerStatusBadge = ({ isBlocked }) => (
  <span className={`text-xs px-2 py-1 rounded-full ${
    isBlocked 
      ? "bg-red-100 text-red-800" 
      : "bg-green-100 text-green-800"
  }`}>
    {isBlocked ? "Blocked" : "Active"}
  </span>
);

const Customers = ({ customers = [] }) => {
  // Sample data with isBlocked property
  const sampleCustomers = [
    {
      id: 1,
      name: "Emma Watson",
      email: "emma@example.com",
      phone: "+1 (555) 123-7890",
      joinDate: "10 January 2022",
      lastVisit: "Today, 10:30 AM",
      totalVisits: 12,
      isBlocked: false,
      notes: "Prefers organic hair products. Loyal customer since 2022.",
      services: ["Hair Color", "Haircut", "Blowout"]
    },
    {
      id: 2,
      name: "Olivia Parker",
      email: "olivia@example.com",
      phone: "+1 (555) 456-7890",
      joinDate: "15 March 2023",
      lastVisit: "Today, 2:00 PM",
      totalVisits: 5,
      isBlocked: true,
      notes: "Allergic to ammonia-based hair dyes. Prefers evening appointments.",
      services: ["Keratin Treatment", "Deep Conditioning"]
    },
    {
      id: 3,
      name: "Sophia Lee",
      email: "sophia@example.com",
      phone: "+1 (555) 789-1234",
      joinDate: "22 May 2023",
      lastVisit: "Yesterday, 11:00 AM",
      totalVisits: 8,
      isBlocked: false,
      notes: "VIP customer. Referred 3 friends. Enjoys scalp massages.",
      services: ["Manicure", "Pedicure", "Gel Polish"]
    },
    {
      id: 4,
      name: "Ava Martinez",
      email: "ava@example.com",
      phone: "+1 (555) 234-5678",
      joinDate: "5 July 2022",
      lastVisit: "Yesterday, 3:30 PM",
      totalVisits: 15,
      isBlocked: false,
      notes: "Prefers same stylist every visit. Very particular about layers.",
      services: ["Haircut", "Balayage", "Root Touch-Up"]
    },
    {
      id: 5,
      name: "Mia Johnson",
      email: "mia@example.com",
      phone: "+1 (555) 345-6789",
      joinDate: "18 September 2023",
      lastVisit: "Last week",
      totalVisits: 3,
      isBlocked: true,
      notes: "New customer. Interested in extensions for wedding.",
      services: ["Consultation", "Extensions"]
    }
  ];

  const [displayCustomers, setDisplayCustomers] = useState(
    customers.length > 0 ? customers : sampleCustomers
  );
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCustomerModal = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const toggleBlockStatus = (customerId) => {
    setDisplayCustomers(prev =>
      prev.map(customer =>
        customer.id === customerId
          ? { ...customer, isBlocked: !customer.isBlocked }
          : customer
      )
    );
    // In a real app, you would also make an API call here
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <FiUser /> Add New Customer
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-medium">Customer List ({displayCustomers.length})</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Active: {displayCustomers.filter(c => !c.isBlocked).length}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Blocked: {displayCustomers.filter(c => c.isBlocked).length}
            </span>
          </div>
        </div>

        <div className="divide-y">
          {displayCustomers.map((customer) => (
            <div 
              key={customer.id} 
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                customer.isBlocked ? "bg-red-50" : ""
              }`}
              onClick={() => openCustomerModal(customer)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    customer.isBlocked ? "bg-red-100" : "bg-indigo-100"
                  }`}>
                    <FiUser className={customer.isBlocked ? "text-red-600" : "text-indigo-600"} />
                  </div>
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {customer.name}
                      <CustomerStatusBadge isBlocked={customer.isBlocked} />
                    </p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{customer.lastVisit}</p>
                  <p className="text-xs text-gray-500">{customer.totalVisits} {customer.totalVisits === 1 ? 'visit' : 'visits'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <CustomerModal 
          customer={selectedCustomer} 
          onClose={() => setIsModalOpen(false)}
          onBlockToggle={toggleBlockStatus}
        />
      )}
    </div>
  );
};

export default Customers;