"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiLogOut, FiX } from "react-icons/fi";

export default function Topbar({ unreadCount, notifications, markAsRead, onLogout }) {
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const toggleNotificationPopup = () => {
    setShowNotificationPopup(!showNotificationPopup);
  };

  return (
    <header className="bg-white shadow-md z-10 sticky top-0">
      <div className="flex items-center justify-between px-6 py-3">
        <div /> {/* Empty left side for spacing, or add mobile menu button here */}
        <div className="flex items-center space-x-5">
          <div className="relative">
            <button
              onClick={toggleNotificationPopup}
              className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 p-2 rounded-full"
            >
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Notification Popup */}
            <AnimatePresence>
              {showNotificationPopup && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-20"
                >
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="font-medium text-gray-800">
                      Notifications ({unreadCount})
                    </h3>
                    <button
                      onClick={() => setShowNotificationPopup(false)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                      aria-label="Close"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? "bg-indigo-50" : ""
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start">
                          <div
                            className={`mt-1 mr-3 w-2 h-2 rounded-full flex-shrink-0 ${
                              notification.type === "warning"
                                ? "bg-yellow-500"
                                : notification.type === "complaint"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="text-xs text-indigo-600 font-medium ml-2">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200 text-center">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="hidden md:block text-right">
            <h3 className="text-sm font-semibold text-gray-700">Admin User</h3>
            <p className="text-xs text-gray-400">Super Admin</p>
          </div>
          <button
            onClick={onLogout}
            className="text-gray-500 hover:text-red-600"
            title="Logout"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
