"use client";
import React, { useState } from 'react';
import { FiDollarSign, FiTrendingUp, FiUsers, FiEye, FiDownload, FiX } from "react-icons/fi";

const PaymentsAndEarnings = () => {
  // Sample data
  const [payments, setPayments] = useState([
    { 
      id: 1, 
      customer: "Emma Watson", 
      salon: "Elite Salon", 
      date: "15 Jun 2023", 
      amount: 120, 
      status: "completed",
      paymentMethod: "Credit Card",
      transactionId: "TXN123456",
      service: "Hair Color",
      commission: 12 // 10% of $120
    },
    { 
      id: 2, 
      customer: "Olivia Parker", 
      salon: "Glamour Studio", 
      date: "16 Jun 2023", 
      amount: 35, 
      status: "completed",
      paymentMethod: "PayPal",
      transactionId: "TXN789012",
      service: "Manicure",
      commission: 3.5
    },
    { 
      id: 3, 
      customer: "Sophia Lee", 
      salon: "Luxe Beauty", 
      date: "17 Jun 2023", 
      amount: 45, 
      status: "completed",
      paymentMethod: "Credit Card",
      transactionId: "TXN345678",
      service: "Haircut",
      commission: 4.5
    },
    { 
      id: 4, 
      customer: "Ava Martinez", 
      salon: "Elite Salon", 
      date: "18 Jun 2023", 
      amount: 250, 
      status: "completed",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN901234",
      service: "Keratin Treatment",
      commission: 25
    },
    { 
      id: 5, 
      customer: "Mia Johnson", 
      salon: "Urban Cuts", 
      date: "19 Jun 2023", 
      amount: 180, 
      status: "completed",
      paymentMethod: "Credit Card",
      transactionId: "TXN567890",
      service: "Balayage",
      commission: 18
    }
  ]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Calculate totals
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const platformEarnings = payments.reduce((sum, payment) => sum + payment.commission, 0);
  const salonPayouts = totalRevenue - platformEarnings;

  const filteredPayments = payments.filter(payment => {
    if (!startDate && !endDate) return true;
    const paymentDate = new Date(payment.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    return (
      (!start || paymentDate >= start) && 
      (!end || paymentDate <= end)
    );
  });

  const handleDownloadReport = () => {
    // In a real app, this would generate and download a report
    console.log("Generating report for:", startDate, "to", endDate);
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Payments & Earnings</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">${totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiDollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Platform Earnings</p>
              <h3 className="text-2xl font-bold">${platformEarnings.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiTrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Salon Payouts</p>
              <h3 className="text-2xl font-bold">${salonPayouts.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiUsers size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-3">
          <h3 className="font-medium">Payment History</h3>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="flex gap-2">
              <input
                type="date"
                className="px-3 py-1 border rounded-md text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="px-3 py-1 border rounded-md text-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <button 
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                onClick={() => { /* Filter logic is automatic */ }}
              >
                Filter
              </button>
            </div>
            <button 
              className="px-3 py-1 text-sm bg-white border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 flex items-center gap-1"
              onClick={handleDownloadReport}
            >
              <FiDownload size={16} />
              Export
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filteredPayments.length > 0 ? (
                filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">PAY-{payment.id.toString().padStart(4, '0')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{payment.customer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{payment.salon}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{payment.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">${payment.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleViewPayment(payment)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No payments found for the selected date range
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Payment Modal */}
      {showViewModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold text-gray-800">Payment Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Payment ID</p>
                  <p className="font-medium">PAY-{selectedPayment.id.toString().padStart(4, '0')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-medium">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedPayment.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Salon</p>
                  <p className="font-medium">{selectedPayment.salon}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium">{selectedPayment.service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{selectedPayment.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">${selectedPayment.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Platform Commission</p>
                  <p className="font-medium">${selectedPayment.commission}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{selectedPayment.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {selectedPayment.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="border-t p-4 flex justify-end">
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
    </div>
  );
};

export default PaymentsAndEarnings;