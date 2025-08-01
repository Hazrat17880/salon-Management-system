"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, Phone, Calendar, User } from "lucide-react";

// Custom hook to detect clicks outside an element
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const router = useRouter();

  // Refs for dropdown elements
  const servicesRef = useRef(null);
  const resourcesRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useClickOutside(servicesRef, () => setServicesOpen(false));
  useClickOutside(resourcesRef, () => setResourcesOpen(false));
  useClickOutside(mobileMenuRef, () => setMobileOpen(false));

  const handleRedirect = (path) => {
    router.push(path);
    setMobileOpen(false);
    setServicesOpen(false);
    setResourcesOpen(false);
  };

  return (
    <header className="fixed w-full z-50 bg-white/90 backdrop-blur-sm py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <button 
          onClick={() => handleRedirect("/")}
          className="flex items-center"
        >
          <img
            src="/logo.png"
            alt="SalonPro Logo"
            className="h-12 w-auto"
          />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <button
            onClick={() => handleRedirect("/")}
            className="text-gray-700 cursor-pointer hover:text-pink-600 font-medium text-sm transition-colors"
          >
            Home
          </button>

          <button
            onClick={() => handleRedirect("/about")}
            className="text-gray-700 cursor-pointer hover:text-pink-600 font-medium text-sm transition-colors"
          >
            About
          </button>

          {/* Services Dropdown */}
          <div className="relative" ref={servicesRef}>
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className="flex items-center cursor-pointer text-gray-700 hover:text-pink-600 font-medium text-sm transition-colors"
            >
              Services
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1">
                <button
                  onClick={() => handleRedirect("/services/hair")}
                  className="w-full text-left cursor-pointer px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 text-sm transition-colors"
                >
                  Hair Services
                </button>
                <button
                  onClick={() => handleRedirect("/services/skin")}
                  className="w-full text-left px-4 cursor-pointer py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 text-sm transition-colors"
                >
                  Skin Treatments
                </button>
                <button
                  onClick={() => handleRedirect("/services/nails")}
                  className="w-full text-left cursor-pointer px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 text-sm transition-colors"
                >
                  Nail Services
                </button>
                <button
                  onClick={() => handleRedirect("/services/spa")}
                  className="w-full text-left cursor-pointer px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 text-sm transition-colors"
                >
                  Spa Packages
                </button>
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div className="relative" ref={resourcesRef}>
            <button
              onClick={() => setResourcesOpen(!resourcesOpen)}
              className="flex items-center cursor-pointer text-gray-700 hover:text-pink-600 font-medium text-sm transition-colors"
            >
              Resources
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
            </button>
            {resourcesOpen && (
              <div className="absolute top-full cursor-pointer left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1">
                <button
                  onClick={() => handleRedirect("/blog")}
                  className="w-full text-left cursor-pointer px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 text-sm transition-colors"
                >
                  Blog
                </button>
                <button
                  onClick={() => handleRedirect("/tutorials")}
                  className="w-full text-left cursor-pointer px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 text-sm transition-colors"
                >
                  Tutorials
                </button>
               
              </div>
            )}
          </div>

          <button
            onClick={() => handleRedirect("/contact")}
            className="text-gray-700 cursor-pointer hover:text-pink-600 font-medium text-sm transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={() => handleRedirect("/signin")}
            className="flex items-center cursor-pointer text-gray-700 hover:text-pink-600 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            <User className="h-4 w-4 mr-2" />
            Sign In
          </button>
          <button
            onClick={() => handleRedirect("/booking")}
            className="flex items-center cursor-pointer bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-gray-700 p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200" ref={mobileMenuRef}>
          <div className="px-4 py-3 space-y-3">
            <button
              onClick={() => handleRedirect("/")}
              className="block w-full cursor-pointer text-left text-gray-700 hover:text-pink-600 font-medium text-sm py-2"
            >
              Home
            </button>

            <button
              onClick={() => handleRedirect("/about")}
              className="block cursor-pointer w-full text-left text-gray-700 hover:text-pink-600 font-medium text-sm py-2"
            >
              About
            </button>

            {/* Mobile Services Dropdown */}
            <div className="pb-2">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="flex items-center cursor-pointer justify-between w-full text-gray-700 hover:text-pink-600 font-medium text-sm py-2"
              >
                <span>Services</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {servicesOpen && (
                <div className="pl-4 mt-1 space-y-2">
                  <button
                    onClick={() => handleRedirect("/services/hair")}
                    className="block cursor-pointer w-full text-left text-gray-600 hover:text-pink-600 text-sm py-1.5"
                  >
                    Hair Services
                  </button>
                  <button
                    onClick={() => handleRedirect("/services/skin")}
                    className="block w-full cursor-pointer text-left text-gray-600 hover:text-pink-600 text-sm py-1.5"
                  >
                    Skin Treatments
                  </button>
                  <button
                    onClick={() => handleRedirect("/services/nails")}
                    className="block w-full cursor-pointer text-left text-gray-600 hover:text-pink-600 text-sm py-1.5"
                  >
                    Nail Services
                  </button>
                  <button
                    onClick={() => handleRedirect("/services/spa")}
                    className="block w-full cursor-pointer text-left text-gray-600 hover:text-pink-600 text-sm py-1.5"
                  >
                    Spa Packages
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Resources Dropdown */}
            <div className="pb-2">
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="flex items-center cursor-pointer justify-between w-full text-gray-700 hover:text-pink-600 font-medium text-sm py-2"
              >
                <span>Resources</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              {resourcesOpen && (
                <div className="pl-4 mt-1 space-y-2">
                  <button
                    onClick={() => handleRedirect("/blog")}
                    className="block w-full text-left cursor-pointer text-gray-600 hover:text-pink-600 text-sm py-1.5"
                  >
                    Blog
                  </button>
                  <button
                    onClick={() => handleRedirect("/tutorials")}
                    className="block w-full text-left cursor-pointer text-gray-600 hover:text-pink-600 text-sm py-1.5"
                  >
                    Tutorials
                  </button>
                 
                </div>
              )}
            </div>

            <button
              onClick={() => handleRedirect("/contact")}
              className="block w-full text-left cursor-pointer text-gray-700 hover:text-pink-600 font-medium text-sm py-2"
            >
              Contact
            </button>

            <div className="pt-2 border-t border-gray-100 mt-2 space-y-3">
              <button
                onClick={() => handleRedirect("/signin")}
                className="flex items-center cursor-pointer justify-center w-full text-gray-700 hover:text-pink-600 font-medium text-sm py-2.5"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </button>
              <button
                onClick={() => handleRedirect("/booking")}
                className="block w-full bg-pink-600 cursor-pointer hover:bg-pink-700 text-white text-center py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
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