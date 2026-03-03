"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import {
  FiUser, FiCalendar, FiMessageSquare,
  FiSettings, FiLogOut, FiHome,
} from "react-icons/fi";
import { FaCut } from "react-icons/fa";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { signOut } from "next-auth/react"; // Add this import
import { toast } from "react-toastify"; // Add this import
import { removeAuthToken } from "@/lib/cookiesAction"; // Add this import

// ─── Portal Logout Modal ──────────────────────────────────────────────────────
function LogoutModal({ onCancel, onConfirm }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 24 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="fixed z-[10000] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-red-400 to-rose-500" />
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <FiLogOut className="text-red-500 w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Sign Out</h3>
                <p className="text-sm text-gray-400">You'll be redirected to login</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Are you sure you want to log out from your account? Any unsaved changes may be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <FiLogOut className="w-4 h-4" />
                Yes, Sign Out
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </>,
    document.body
  );
}

// ─── UserSidebar ──────────────────────────────────────────────────────────────
export default function UserSidebar({ unreadNotifications, messages, setMobileMenuOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
const confirmLogout = async () => {
  if (isLoggingOut) return;
  
  try {
    setIsLoggingOut(true);
    
    // Clear everything from localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
      });
    }

    // Call NextAuth signOut
    await signOut({ redirect: false });
    
    // Call logout API - but don't wait for it
    fetch('/api/auth/logout', {
      method: 'POST',
    }).catch(err => console.log('Background logout error:', err));
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Small delay to ensure toast is shown
    setTimeout(() => {
      router.push('/user/signin');
      router.refresh();
    }, 100);
    
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Failed to logout');
    
    setTimeout(() => {
      router.push('/user/signin');
    }, 100);
    
  } finally {
    setIsLoggingOut(false);
    setShowLogoutConfirm(false);
  }
};
  const navLinks = [
    { label: "Dashboard",    icon: <FiHome size={20} />,          href: "/user-dashboard" },
    { label: "My Profile",   icon: <FiUser size={20} />,          href: "/user-dashboard/profile" },
    { label: "Appointments", icon: <FiCalendar size={20} />,      href: "/user-dashboard/appointments" },
    { label: "Find Salons",  icon: <FaCut size={20} />,           href: "/user-dashboard/salons" },
    { label: "Messages",     icon: <FiMessageSquare size={20} />, href: "/user-dashboard/messages" },
    { label: "Complaints",   icon: <FiSettings size={20} />,      href: "/user-dashboard/complaints" },
  ];

  // Get unread message count
  const unreadMessageCount = messages?.filter(m => m.unread).length || 0;

  return (
    <>
      {/* Portal modal — injected into document.body, fully outside sidebar DOM */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <LogoutModal
            onCancel={() => setShowLogoutConfirm(false)}
            onConfirm={confirmLogout}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="w-full md:w-64 bg-indigo-800 text-white shadow-lg h-full flex flex-col">

        {/* Brand */}
        <div className="p-4 md:p-6 border-b border-indigo-700/50">
          <h1 className="text-xl font-bold tracking-tight">User Dashboard</h1>
        </div>

        {/* Nav links */}
        <nav className="mt-2 flex-1 overflow-y-auto">
          {navLinks.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={idx}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  router.push(item.href);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center px-4 py-3 md:px-6 cursor-pointer transition-colors
                  ${isActive
                    ? "bg-indigo-700 border-r-4 border-indigo-300"
                    : "hover:bg-indigo-700/50"
                  }`}
              >
                <span className={`mr-3 ${isActive ? "text-white" : "text-indigo-300"}`}>
                  {item.icon}
                </span>
                <span className={`font-medium text-sm ${isActive ? "text-white" : "text-indigo-100"}`}>
                  {item.label}
                </span>
                {item.label === "Messages" && unreadMessageCount > 0 && (
                  <span className="ml-auto bg-rose-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {unreadMessageCount}
                  </span>
                )}
              </motion.div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-indigo-700/50">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            disabled={isLoggingOut}
            className={`flex items-center w-full p-3 text-indigo-200 hover:text-white hover:bg-indigo-700 rounded-xl transition-colors group ${
              isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FiLogOut size={18} className="mr-3 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium text-sm">
              {isLoggingOut ? 'Signing out...' : 'Sign Out'}
            </span>
          </button>
        </div>

      </div>
    </>
  );
}