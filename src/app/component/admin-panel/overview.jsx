"use client";
import React from 'react';
import { 
  FiUser, 
  FiUsers, 
  FiCheckCircle, 
  FiDollarSign, 
  FiBell, 
  FiAlertCircle 
} from "react-icons/fi";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

const Overview = () => {
  // Sample data for charts
  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
  ];

  const bookingTrendData = [
    { name: 'Week 1', bookings: 240 },
    { name: 'Week 2', bookings: 139 },
    { name: 'Week 3', bookings: 380 },
    { name: 'Week 4', bookings: 278 },
  ];

  const serviceDistributionData = [
    { name: 'Hair Services', value: 45 },
    { name: 'Nail Services', value: 30 },
    { name: 'Skin Services', value: 15 },
    { name: 'Other', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const notifications = [
    { id: 1, type: "warning", message: "New salon registration requires approval", time: "2 hours ago", read: false },
    { id: 2, type: "complaint", message: "Customer complaint about Elite Salon", time: "5 hours ago", read: true },
    { id: 3, type: "system", message: "System update available", time: "1 day ago", read: true }
  ];

  const complaints = [
    { id: 1, from: "Emma Watson", against: "Elite Salon", type: "Service Quality", date: "10 Jun 2023", status: "pending", message: "Color didn't match what I asked for" },
    { id: 2, from: "Olivia Parker", against: "Glamour Studio", type: "Hygiene", date: "12 Jun 2023", status: "resolved", message: "Tools were not properly sanitized" },
    { id: 3, from: "Sophia Lee", against: "Luxe Beauty", type: "Staff Behavior", date: "14 Jun 2023", status: "investigating", message: "Stylist was rude during service" }
  ];

  const markNotificationAsRead = (id) => {
    // Implementation would update the read status
    console.log(`Marking notification ${id} as read`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Salons</p>
              <h3 className="text-2xl font-bold">24</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiUser size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <h3 className="text-2xl font-bold">1,245</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiUsers size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Appointments</p>
              <h3 className="text-2xl font-bold">986</h3>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiCheckCircle size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">$42,560</h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiDollarSign size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-4">Monthly Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Trend Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-4">Weekly Booking Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Service Distribution */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-4">Service Distribution</h3>
        <div className="h-64 flex">
          <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {serviceDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 flex items-center justify-center">
            <div className="space-y-2">
              {serviceDistributionData.map((service, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span>{service.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-medium flex items-center">
              <FiBell className="mr-2" /> Recent Notifications
            </h3>
          </div>
          <div className="divide-y">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 ${!notification.read ? "bg-blue-50" : ""}`}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-full mr-3 ${
                    notification.type === "warning" ? "bg-red-100 text-red-600" :
                    notification.type === "complaint" ? "bg-orange-100 text-orange-600" :
                    "bg-blue-100 text-blue-600"
                  }`}>
                    {notification.type === "warning" ? <FiAlertCircle size={18} /> : <FiBell size={18} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{notification.message}</p>
                    <p className="text-sm text-gray-500">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-medium flex items-center">
              <FiAlertCircle className="mr-2" /> Recent Complaints
            </h3>
          </div>
          <div className="divide-y">
            {complaints.slice(0, 3).map(complaint => (
              <div key={complaint.id} className="p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{complaint.from}</p>
                    <p className="text-sm text-gray-500">Against: {complaint.against}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    complaint.status === "resolved" ? "bg-green-100 text-green-800" :
                    complaint.status === "investigating" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {complaint.status}
                  </span>
                </div>
                <p className="mt-2 text-sm">{complaint.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;