"use client";

import { FiBell, FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserTopNav({
  activeTab,
  setMobileMenuOpen,
  mobileMenuOpen,
  unreadNotifications,
  profileData,
}) {
  const router = useRouter();

  const handleNotificationClick = () => {
    router.push("/user-dashboard/notifications");
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-600"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <h2 className="text-xl font-semibold text-gray-800 capitalize">
          {activeTab.replace(/-/g, " ")}
        </h2>
        <div className="flex items-center space-x-4">
          <div
            className="relative cursor-pointer"
            onClick={handleNotificationClick}
          >
            <FiBell size={22} className="text-gray-600" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex bg-white shadow-sm p-4 justify-end items-center">
        <div className="flex items-center space-x-4">
          <div
            className="relative cursor-pointer"
            onClick={handleNotificationClick}
          >
            <FiBell size={22} className="text-gray-600" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </div>

          <div className="flex items-center">
            {profileData.image ? (
              <div className="relative h-8 w-8 rounded-full overflow-hidden">
                <Image
                  src={profileData.image}
                  alt={profileData.name}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                {profileData.name.charAt(0)}
              </div>
            )}
            <span className="ml-2 text-gray-700">{profileData.name}</span>
          </div>
        </div>
      </header>
    </>
  );
}
