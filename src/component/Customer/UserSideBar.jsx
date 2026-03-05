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
import { removeAuthToken , clearAllAuthData} from "@/lib/cookiesAction"; // Add this import

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
  console.log("your logout is calling at the frontend");
  try {
    // 1️⃣ Call backend first (clears HttpOnly cookies like usertoken)
    await fetch("/api/auth/user/logout", {
      method: "POST",
      credentials: "include", // VERY important for cookies
    });

    // 2️⃣ Clear NextAuth session (OAuth / session-token)
    await signOut({ redirect: false });

    // 3️⃣ Clear all frontend tokens (localStorage + JS cookies)
    clearAllAuthData();

  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    // 4️⃣ Always redirect
    router.replace("/user/signin");
  }
};






//   const confirmLogout = async () => {
//   if (isLoggingOut) return;
  
//   try {
//     setIsLoggingOut(true);
    
//     // Set flag that we're logging out
//     if (typeof window !== 'undefined') {
//       sessionStorage.setItem('justLoggedOut', 'true');
//     }
    
//     // Clear ALL client-side data FIRST
//     if (typeof window !== 'undefined') {
//       // Clear localStorage
//       localStorage.clear();
      
//       // Clear sessionStorage (but keep our flag for a moment)
//       const logoutFlag = sessionStorage.getItem('justLoggedOut');
//       sessionStorage.clear();
//       if (logoutFlag) {
//         sessionStorage.setItem('justLoggedOut', logoutFlag);
//       }
      
//       // Aggressive cookie clearing on client side
//       document.cookie.split(";").forEach(function(c) {
//         const cookieName = c.split('=')[0].trim();
//         document.cookie = cookieName + "=;expires=" + new Date(0).toUTCString() + ";path=/";
//         document.cookie = cookieName + "=;expires=" + new Date(0).toUTCString() + ";path=/;domain=" + window.location.hostname;
//       });
//     }

//     // Call NextAuth signOut
//     await signOut({ redirect: false });
    
//     // Call logout API with improved error handling
//     try {
//       const response = await fetch('/api/auth/logout', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
      
//       // Check if response is OK and has content
//       if (response.ok) {
//         const text = await response.text();
//         if (text) {
//           try {
//             const data = JSON.parse(text);
//             console.log('Logout API response:', data);
//           } catch (parseError) {
//             console.log('Logout API returned non-JSON response:', text);
//           }
//         } else {
//           console.log('Logout API returned empty response but status OK');
//         }
//       } else {
//         console.log('Logout API returned status:', response.status);
//         // Try to get error message if any
//         try {
//           const errorText = await response.text();
//           if (errorText) {
//             console.log('Logout API error:', errorText);
//           }
//         } catch (e) {
//           // Ignore if can't read response
//         }
//       }
//     } catch (fetchError) {
//       console.error('Logout API fetch error:', fetchError);
//       // Continue with logout even if API fails
//     }
    
//     toast.success('Logged out successfully');
    
//     // Force redirect to signin with cache busting
//     window.location.href = '/user/signin?t=' + Date.now();
    
//   } catch (error) {
//     console.error('Logout error:', error);
//     toast.error('Failed to logout');
//     window.location.href = '/user/signin?t=' + Date.now();
//   } finally {
//     setIsLoggingOut(false);
//     setShowLogoutConfirm(false);
//   }
// };
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
<div className="w-full md:w-64 bg-indigo-800 text-white shadow-lg h-full flex flex-col overflow-x-hidden">
        {/* Brand */}
        <div className="p-4 md:p-6 border-b border-indigo-700/50">
          <h1 className="text-xl font-bold tracking-tight">User Dashboard</h1>
        </div>

        {/* Nav links */}
        <nav className="mt-2 flex-1 overflow-y-auto overflow-x-hidden">
          {navLinks.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={idx}
whileHover={{ paddingLeft: 28 }}                whileTap={{ scale: 0.98 }}
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