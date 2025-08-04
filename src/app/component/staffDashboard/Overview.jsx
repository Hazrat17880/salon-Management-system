import React, { useState } from "react";
import { FiCalendar, FiBell, FiAlertCircle } from "react-icons/fi";
import { FaRegCalendarCheck, FaRegCalendarTimes } from "react-icons/fa";

const Overview = () => {
  const [stats, setStats] = useState({
    totalAppointments: 124,
    completed: 98,
    pending: 12,
    rejected: 14,
    totalEarnings: 5820,
    customers: 76
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New appointment request from John Doe",
      time: "10 minutes ago",
      read: false,
      type: "appointment"
    },
    {
      id: 2,
      message: "Customer complaint about service",
      time: "1 hour ago",
      read: false,
      type: "warning"
    },
    {
      id: 3,
      message: "System maintenance scheduled",
      time: "2 days ago",
      read: true,
      type: "info"
    }
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      customer: "John Smith",
      service: "Haircut & Styling",
      date: "Today, 10:30 AM",
      status: "pending"
    },
    {
      id: 2,
      customer: "Sarah Johnson",
      service: "Manicure",
      date: "Today, 2:00 PM",
      status: "completed"
    },
    {
      id: 3,
      customer: "Michael Brown",
      service: "Beard Trim",
      date: "Today, 4:45 PM",
      status: "pending"
    }
  ]);

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Staff Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Appointments</p>
              <h3 className="text-2xl font-bold">{stats.totalAppointments}</h3>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <FiCalendar size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <h3 className="text-2xl font-bold text-green-600">
                {stats.completed}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaRegCalendarCheck size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiCalendar size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <h3 className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FaRegCalendarTimes size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium flex items-center">
            <FiBell className="mr-2" /> Notifications & Complaints
          </h3>
        </div>
        <div className="divide-y">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 ${!notification.read ? "bg-blue-50" : ""}`}
              onClick={() => markNotificationAsRead(notification.id)}
            >
              <div className="flex items-start">
                <div
                  className={`p-2 rounded-full mr-3 ${
                    notification.type === "warning"
                      ? "bg-red-100 text-red-600"
                      : notification.type === "appointment"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {notification.type === "warning" ? (
                    <FiAlertCircle size={18} />
                  ) : (
                    <FiBell size={18} />
                  )}
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
          <h3 className="font-medium">Today's Appointments</h3>
        </div>
        <div className="divide-y">
          {appointments
            .filter((app) => app.date.includes("Today"))
            .map((appointment) => (
              <div key={appointment.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{appointment.customer}</p>
                    <p className="text-sm text-gray-500">
                      {appointment.service}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {appointment.date.split(",")[1]}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;