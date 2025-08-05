'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, Calendar, User } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const router = useRouter();

  const mobileMenuRef = useRef(null);
  const servicesRef = useRef(null);
  const resourcesRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close mobile menu when clicking outside
      if (mobileOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileOpen(false);
        setActiveDropdown(null);
      }
      
      // Close desktop dropdowns when clicking outside
      if (!mobileOpen) {
        if (servicesRef.current && !servicesRef.current.contains(event.target)) {
          setActiveDropdown(prev => prev === 'services' ? null : prev);
        }
        if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
          setActiveDropdown(prev => prev === 'resources' ? null : prev);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpen]);

  const toggleDropdown = (type) => {
    // For mobile, we want to toggle the dropdown regardless of current state
    if (mobileOpen) {
      setActiveDropdown(activeDropdown === type ? null : type);
    } 
    // For desktop, we want standard toggle behavior
    else {
      setActiveDropdown(prev => prev === type ? null : type);
    }
  };

  const handleRedirect = (path) => {
    router.push(path);
    setMobileOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header className="fixed w-full z-50 bg-white/90 backdrop-blur-sm py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <button onClick={() => handleRedirect("/")} className="flex items-center">
          <img src="/logo.png" alt="SalonPro Logo" className="h-12 w-auto" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <button onClick={() => handleRedirect("/")} className="text-sm font-medium text-gray-700 hover:text-pink-600">Home</button>
          <button onClick={() => handleRedirect("/about")} className="text-sm font-medium text-gray-700 hover:text-pink-600">About</button>

          <div className="relative" ref={servicesRef}>
            <button 
              onClick={() => toggleDropdown("services")} 
              className="flex items-center text-sm font-medium text-gray-700 hover:text-pink-600"
            >
              Services
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'services' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50 py-1">
                <button onClick={() => handleRedirect("/services/hair")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50">Hair Services</button>
                <button onClick={() => handleRedirect("/services/skin")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50">Skin Treatments</button>
                <button onClick={() => handleRedirect("/services/nails")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50">Nail Services</button>
                <button onClick={() => handleRedirect("/services/spa")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50">Spa Packages</button>
              </div>
            )}
          </div>

          <div className="relative" ref={resourcesRef}>
            <button 
              onClick={() => toggleDropdown("resources")} 
              className="flex items-center text-sm font-medium text-gray-700 hover:text-pink-600"
            >
              Resources
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'resources' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50 py-1">
                <button onClick={() => handleRedirect("/blog")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50">Blog</button>
                <button onClick={() => handleRedirect("/tutorials")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50">Tutorials</button>
              </div>
            )}
          </div>

          <button onClick={() => handleRedirect("/contact")} className="text-sm font-medium text-gray-700 hover:text-pink-600">Contact</button>
        </nav>

        <div className="hidden lg:flex items-center space-x-4">
          <button onClick={() => handleRedirect("/signin")} className="flex items-center text-sm font-medium text-gray-700 hover:text-pink-600">
            <User className="h-4 w-4 mr-2" /> Sign In
          </button>
          <button onClick={() => handleRedirect("/booking")} className="flex items-center bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-full text-sm font-medium">
            <Calendar className="h-4 w-4 mr-2" /> Book Now
          </button>
        </div>

        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          className="lg:hidden text-gray-700 p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200" ref={mobileMenuRef}>
          <div className="px-4 py-3 space-y-3">
            <button onClick={() => handleRedirect("/")} className="block w-full text-left text-sm text-gray-700 hover:text-pink-600 py-2">Home</button>
            <button onClick={() => handleRedirect("/about")} className="block w-full text-left text-sm text-gray-700 hover:text-pink-600 py-2">About</button>

            <div>
              <button 
                onClick={() => toggleDropdown("services")}
                className="flex justify-between items-center w-full text-sm text-gray-700 hover:text-pink-600 py-2"
              >
                <span>Services</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'services' && (
                <div className="pl-4 space-y-2">
                  <button onClick={() => handleRedirect("/services/hair")} className="block w-full text-left text-sm text-gray-600 hover:text-pink-600 py-1.5">Hair Services</button>
                  <button onClick={() => handleRedirect("/services/skin")} className="block w-full text-left text-sm text-gray-600 hover:text-pink-600 py-1.5">Skin Treatments</button>
                  <button onClick={() => handleRedirect("/services/nails")} className="block w-full text-left text-sm text-gray-600 hover:text-pink-600 py-1.5">Nail Services</button>
                  <button onClick={() => handleRedirect("/services/spa")} className="block w-full text-left text-sm text-gray-600 hover:text-pink-600 py-1.5">Spa Packages</button>
                </div>
              )}
            </div>

            <div>
              <button 
                onClick={() => toggleDropdown("resources")}
                className="flex justify-between items-center w-full text-sm text-gray-700 hover:text-pink-600 py-2"
              >
                <span>Resources</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'resources' && (
                <div className="pl-4 space-y-2">
                  <button onClick={() => handleRedirect("/blog")} className="block w-full text-left text-sm text-gray-600 hover:text-pink-600 py-1.5">Blog</button>
                  <button onClick={() => handleRedirect("/tutorials")} className="block w-full text-left text-sm text-gray-600 hover:text-pink-600 py-1.5">Tutorials</button>
                </div>
              )}
            </div>

            <button onClick={() => handleRedirect("/contact")} className="block w-full text-left text-sm text-gray-700 hover:text-pink-600 py-2">Contact</button>

            <div className="pt-2 border-t border-gray-100 mt-2 space-y-3">
              <button onClick={() => handleRedirect("/signin")} className="flex items-center justify-center w-full text-sm text-gray-700 hover:text-pink-600 py-2">
                <User className="h-4 w-4 mr-2" /> Sign In
              </button>
              <button onClick={() => handleRedirect("/booking")} className="block w-full bg-pink-600 hover:bg-pink-700 text-white text-center py-2.5 rounded-lg text-sm font-medium">
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;