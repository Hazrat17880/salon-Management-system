"use client";
import { motion } from 'framer-motion';

const NotificationsContent = ({ notifications, markAsRead, markAllAsRead }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className="flex items-center">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">Notifications</h3>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
          className={`text-indigo-600 hover:text-indigo-800 text-sm md:text-base font-medium transition ${
            unreadCount === 0 ? 'opacity-50 cursor-default' : ''
          }`}
        >
          Mark All as Read
        </motion.button>
      </div>
      
      <div className="space-y-3 md:space-y-4">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <motion.div
              key={notification.id}
              whileHover={{ y: -2 }}
              onClick={() => !notification.read && markAsRead(notification.id)}
              className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-all ${
                !notification.read 
                  ? 'border-indigo-300 bg-indigo-50 hover:bg-indigo-100' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div className="flex items-start">
                  {!notification.read && (
                    <div className="mt-1 mr-2 w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0"></div>
                  )}
                  <p className={`text-sm md:text-base ${
                    notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'
                  }`}>
                    {notification.message}
                  </p>
                </div>
                <span className="text-xs text-gray-500 mt-1 md:mt-0 md:ml-4 whitespace-nowrap">
                  {notification.time}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No notifications available
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsContent;