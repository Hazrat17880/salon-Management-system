'use client';
import { useState } from "react";
import { FiMenu, FiBell, FiUser } from "react-icons/fi";

export default function SalonsTopBar({profileData}) {
  // Note: This component doesn't control sidebar state, 
  // since no props passed. 
  // You can add a local toggle or just static bar.


  console.log("your top profile data ",profileData);

  return (
    <header className="w-full bg-white shadow-md border-b border-gray-200 h-16 flex items-center justify-between px-6 lg:px-12">
      {/* Left: Menu button for mobile */}
      <button
        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        aria-label="Toggle menu"
        onClick={() => alert("Sidebar toggle not implemented here")}
      >
        <FiMenu size={24} />
      </button>

      {/* Center: Page title */}
      <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>

      {/* Right: Notifications and User */}
      <div className="flex items-center space-x-4">
        <button
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label="Notifications"
          onClick={() => alert("No notifications")}
        >
          <FiBell size={20} />
        </button>

        <button
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
          aria-label="User menu"
          onClick={() => alert("User menu")}
        >
          <FiUser size={20} />
          <span className="hidden sm:block font-medium text-gray-700">{profileData.owner_name}</span>
        </button>
      </div>
    </header>
  );
}
