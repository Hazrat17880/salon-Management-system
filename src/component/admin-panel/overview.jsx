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

const Overview = ({ profileData, appointments, notifications, services, dashboardData }) => {
  // Transform revenue data for chart
  const revenueData = dashboardData?.revenueByMonth?.map(item => ({
    name: getMonthName(item.month),
    revenue: item.revenue,
    completedAppointments: item.completedAppointments
  })) || [];

  // Transform booking data for chart
  const bookingTrendData = dashboardData?.weeklyBookings?.map(item => ({
    name: `Week ${item.week}`,
    bookings: item.bookings
  })) || [];

  // Transform service distribution data for chart
  const serviceDistributionData = dashboardData?.servicesRevenue?.map(item => ({
    name: item.serviceName,
    value: item.completedCount,
    revenue: item.totalRevenue
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6B6B'];

  // Helper function to get month name
  function getMonthName(monthNumber) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1] || `Month ${monthNumber}`;
  }

  // Calculate stats from dashboard data
  const totalRevenue = dashboardData?.servicesRevenue?.reduce((sum, service) => sum + service.totalRevenue, 0) || 0;
  const completedAppointments = dashboardData?.appointments?.completed || 0;
  const pendingAppointments = dashboardData?.appointments?.pending || 0;
  const activeServices = services?.filter(service => service.active).length || 0;

  const markNotificationAsRead = (id) => {
    // Implementation would update the read status
    console.log(`Marking notification ${id} as read`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Salon Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Services</p>
              <h3 className="text-2xl font-bold">{activeServices}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiUser size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Appointments</p>
              <h3 className="text-2xl font-bold">{completedAppointments}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiCheckCircle size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Appointments</p>
              <h3 className="text-2xl font-bold">{pendingAppointments}</h3>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiUsers size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">${totalRevenue.toLocaleString()}</h3>
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
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={2} 
                  name="Revenue"
                />
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
                <Bar dataKey="bookings" fill="#82ca9d" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Service Performance */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-4">Service Performance</h3>
        <div className="h-64 flex">
          <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceDistributionData.slice(0, 6)} // Show top 6 services
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  nameKey="name"
                >
                  {serviceDistributionData.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${props.payload.revenue ? `$${props.payload.revenue}` : value}`, 
                    props.payload.revenue ? 'Revenue' : 'Completed'
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 flex items-center justify-center">
            <div className="space-y-2">
              {serviceDistributionData.slice(0, 6).map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm">{service.name}</span>
                  </div>
                  <span className="text-sm font-medium">${service.revenue}</span>
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

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-medium flex items-center">
              <FiCheckCircle className="mr-2" /> Recent Appointments
            </h3>
          </div>
          <div className="divide-y">
            {appointments.slice(0, 3).map(appointment => (
              <div key={appointment.id} className="p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{appointment.customer}</p>
                    <p className="text-sm text-gray-500">{appointment.service}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    appointment.status === "completed" ? "bg-green-100 text-green-800" :
                    appointment.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {appointment.status}
                  </span>
                </div>
                <p className="mt-2 text-sm">Date: {appointment.date}</p>
                <p className="text-sm">Price: ${appointment.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;