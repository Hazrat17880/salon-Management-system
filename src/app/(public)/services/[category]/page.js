"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FiScissors,
  FiDroplet,
  FiFeather,
  FiWind,
  FiClock,
  FiStar,
  FiAward,
  FiMapPin,
  FiDollarSign,
  FiX,
  FiCalendar,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import { getAuthToken } from "@/lib/cookiesAction";

// Icon mapping for service categories
const categoryIcons = {
  hair: <FiScissors className="w-8 h-8" />,
  skin: <FiDroplet className="w-8 h-8" />,
  nails: <FiFeather className="w-8 h-8" />,
  spa: <FiWind className="w-8 h-8" />,
  default: <FiScissors className="w-8 h-8" />,
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Booking Modal Component
const BookingModal = ({ isOpen, onClose, service, salonId, onSubmit }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Generate time slots (every 30 minutes from 9 AM to 6 PM)
  const timeSlots = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeString);
    }
  }

  useEffect(() => {
    if (isOpen) {
      // Set today's date as default when modal opens
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      setSelectedDate(formattedDate);
      setSelectedTime("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        salon_id: salonId,
        service_id: service.id,
        date: selectedDate,
        time: selectedTime
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">{service.title}</h3>
            <div className="flex justify-between text-sm text-gray-600">
              <span>${service.final_price}</span>
              <span>{service.duration_minutes} minutes</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      selectedTime === time
                        ? 'bg-rose-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default function ServiceCategoryPage() {
  const { category } = useParams();
  const router = useRouter();
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logined, setLogined] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Check authentication status
  useEffect(() => {
    let token = getAuthToken('user')
    console.log(token, 'the token data is now');
    if(token){
      setLogined(true)
    }
  }, []);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/public/services/service/?id=${category}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch service data');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setServiceData(data.data);
        } else {
          throw new Error(data.message || 'Failed to load service data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [category]);

  // Handle booking submission
  const handleBookAppointment = async (bookingData) => {
    const token = getAuthToken('user');
    
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch('/api/user/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });

    if(response.status ===401){
     return router.push("/user/signin")
    }
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Booking failed");
    }

    return result;
  };

  // Handle booking click - redirect to login if not authenticated
  const handleBookingClick = (e, serviceId) => {
    if (!logined) {
      e.preventDefault();
      // Store the intended destination before redirecting to login
      localStorage.setItem('redirectAfterLogin', `/booking?serviceId=${serviceId}`);
      router.push('/user/signin');
    } else {
      e.preventDefault();
      setShowBookingModal(true);
    }
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    // Store the current page as the redirect destination
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    router.push('/user/signin');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !serviceData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24"
      >
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-4">
          <h1 className="text-3xl font-bold text-rose-500 mb-4">Error</h1>
          <p className="text-lg text-gray-600 mb-6">
            {error || "Service not found"}
          </p>
          <Link
            href="/services"
            className="inline-block px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Browse Our Services
          </Link>
        </div>
      </motion.div>
    );
  }

  const { service, related_services, reviews, salon_stats } = serviceData;
  const categoryIcon = categoryIcons[category] || categoryIcons.default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        service={service}
        salonId={service.salon_id}
        onSubmit={handleBookAppointment}
      />
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[80vh] w-full overflow-hidden"
      >
        <Image
          src={service.image_url || "/images/salon.jpg"}
          alt={service.title}
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/70 flex items-center justify-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center px-4 max-w-4xl"
          >
            <motion.div
              variants={fadeIn}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30"
            >
              {React.cloneElement(categoryIcon, {
                className: "w-10 h-10 text-white",
              })}
            </motion.div>
            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif tracking-tight"
            >
              {service.title}
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            >
              {service.description}
            </motion.p>
            <motion.div
              variants={fadeIn}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <FiClock className="text-white mr-2" />
                <span className="text-white text-sm font-medium">
                  {service.duration_minutes} minutes
                </span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <FiDollarSign className="text-white mr-2" />
                <span className="text-white text-sm font-medium">
                  ${service.final_price}
                </span>
              </div>
              {!logined && (
                <div className="flex items-center bg-rose-500/80 backdrop-blur-sm px-4 py-2 rounded-full">
                  <FiStar className="text-white mr-2" />
                  <span className="text-white text-sm font-medium">
                    Login to Book
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Service Details */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-500 border border-gray-100"
          >
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 mr-4">
                {React.cloneElement(categoryIcon, { className: "w-6 h-6" })}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 font-serif">
                Service Details
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                <p className="text-lg font-medium text-gray-900 capitalize">
                  {service.main_category} • {service.sub_category}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p className="text-gray-700">{service.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Price</h3>
                  <div className="flex items-center">
                    {service.discount > 0 ? (
                      <>
                        <p className="text-2xl font-bold text-gray-900">${service.final_price}</p>
                        <p className="ml-2 text-sm text-gray-500 line-through">${service.price}</p>
                        <span className="ml-2 text-sm bg-rose-100 text-rose-800 px-2 py-1 rounded-full">
                          {service.discount}% off
                        </span>
                      </>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">${service.price}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
                  <p className="text-lg font-medium text-gray-900">
                    {service.duration_minutes} minutes
                  </p>
                </div>
              </div>
              
              {service.available_times && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Available Times</h3>
                  <p className="text-gray-700">
                    {service.available_times.start} - {service.available_times.end}
                  </p>
                </div>
              )}
              
              {service.special_days && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Special Days</h3>
                  <p className="text-gray-700">{service.special_days}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Salon Information & Booking */}
          <div className="space-y-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-500 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">
                {service.salon_name}
              </h2>
              
              <div className="flex items-start mb-4">
                <FiMapPin className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                <p className="text-gray-700">{service.salon_contact.address}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Contact</h3>
                <p className="text-gray-700">{service.salon_contact.phone}</p>
                <p className="text-gray-700">{service.salon_contact.email}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Operating Hours</h3>
                <p className="text-gray-700">{service.salon_hours.days}</p>
                <p className="text-gray-700">{service.salon_hours.opening_hours}</p>
              </div>
              
              <div className="flex items-center mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center">
                  <span className="text-rose-500 mr-1">♥</span>
                  <span className="font-medium">{salon_stats.total_favorites}</span>
                  <span className="text-gray-500 ml-1">favorites</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl p-8 text-white overflow-hidden relative"
            >
              <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/5"></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-rose-500/10"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-rose-500/20 rounded-lg flex items-center justify-center text-rose-400 mr-4">
                    <FiStar className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold font-serif">
                    {logined ? 'Ready to Book?' : 'Login to Book'}
                  </h2>
                </div>
                <p className="mb-8 text-gray-300 leading-relaxed">
                  {logined 
                    ? `Reserve your ${service.title} at ${service.salon_name} today and experience premium service.`
                    : 'Please login to book this service and access all our features.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {logined ? (
                    <>
                      <button
                        onClick={(e) => handleBookingClick(e, service.id)}
                        className="flex-1 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium text-center shadow-lg transition-all duration-300 hover:shadow-xl"
                      >
                        Book Now
                      </button>
                      <Link
                        href="/contact"
                        className="flex-1 px-6 py-3 bg-transparent border border-gray-600 hover:border-rose-400 text-white rounded-lg font-medium text-center transition-all duration-300 hover:shadow-lg"
                      >
                        Ask Questions
                      </Link>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleLoginRedirect}
                        className="flex-1 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium text-center shadow-lg transition-all duration-300 hover:shadow-xl"
                      >
                        Login to Book
                      </button>
                      <Link
                        href="/user/register"
                        className="flex-1 px-6 py-3 bg-transparent border border-gray-600 hover:border-rose-400 text-white rounded-lg font-medium text-center transition-all duration-300 hover:shadow-lg"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Related Services */}
      {related_services && related_services.length > 0 && (
        <div className="bg-white py-16 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold font-serif mb-4 text-gray-900">
                Related Services
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore other services offered by {service.salon_name}
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related_services.map((relatedService) => (
                <motion.div
                  key={relatedService.id}
                  variants={fadeIn}
                  whileHover={{ y: -5 }}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-500 border border-gray-100"
                >
                  <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={relatedService.image_url || "/images/service-placeholder.jpg"}
                      alt={relatedService.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{relatedService.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{relatedService.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-gray-900">
                      ${relatedService.final_price}
                      {relatedService.discount > 0 && (
                        <span className="ml-2 text-sm text-rose-600">{relatedService.discount}% off</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{relatedService.duration_minutes} min</span>
                  </div>
                  <Link href={`/services/${relatedService.id}`}
                    className="block mt-4 text-rose-600 hover:text-rose-700 font-medium text-sm cursor-pointer"
                  >
                    View details →
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {reviews && reviews.length > 0 && (
        <div className="bg-gray-50 py-16 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
            <div className="grid md:grid-cols-2 gap-8">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  variants={fadeIn}
                  className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-500 border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold mr-3">
                      {review.user_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{review.user_name}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < review.stars ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-2">{review.title}</h3>
                  <p className="text-gray-700 mb-4">{review.review}</p>
                  
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
              Experience the Difference
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join our community of satisfied clients who trust us with their beauty and wellness needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {logined ? (
                <button
                  onClick={(e) => handleBookingClick(e, service.id)}
                  className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  Book Your Appointment
                </button>
              ) : (
                <button
                  onClick={handleLoginRedirect}
                  className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  Login to Book Appointment
                </button>
              )}
              <Link
                href="/services"
                className="px-8 py-4 bg-transparent border-2 border-white/20 hover:border-rose-400 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
              >
                Explore All Services
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}