'use client';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaCheck, FaClock, FaMapMarkerAlt, FaSearch, FaStar } from 'react-icons/fa';
import { GiBeard, GiHairStrands } from 'react-icons/gi';
import { MdFaceRetouchingNatural, MdOutlineSpa } from 'react-icons/md';
import { RiScissorsFill } from 'react-icons/ri';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const SalonBookingPage = ({ params }) => {
  const salonId = params.id;
  
  // Sample salon data (in a real app, this would come from your backend)
  const sampleSalon = {
    id: salonId,
    name: "Glamour Luxe Salon",
    address: "123 Beauty Street, Manhattan, NY",
    rating: 4.8,
    reviews: 124,
    distance: "0.5 miles",
    image: "/salon1.jpg",
    about: "Premium salon offering cutting-edge hair services, luxurious facials, and professional nail care in a relaxing environment.",
    services: [
      { id: 101, name: "Signature Haircut", duration: "45 min", price: 65, category: "hair" },
      { id: 102, name: "Premium Hair Color", duration: "2.5 hours", price: 150, category: "hair" },
      { id: 103, name: "Deluxe Manicure", duration: "60 min", price: 45, category: "nails" },
      { id: 104, name: "Rejuvenating Facial", duration: "50 min", price: 85, category: "face" },
      { id: 105, name: "Hot Stone Massage", duration: "60 min", price: 110, category: "spa" }
    ],
    availableDates: getAvailableDates(7),
    openHours: {
      weekdays: "9:00 AM - 8:00 PM",
      weekends: "10:00 AM - 6:00 PM"
    },
    staff: [
      { name: "Sarah Johnson", role: "Senior Stylist", image: "/stylist1.jpg" },
      { name: "Michael Chen", role: "Color Specialist", image: "/stylist2.jpg" },
      { name: "Emma Rodriguez", role: "Nail Technician", image: "/stylist3.jpg" }
    ]
  };

  // State management
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [bookingStep, setBookingStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('services');

  // Generate available time slots based on selected date
  const availableTimes = selectedDate 
    ? ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00", "18:30"]
    : [];

  // Format date display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Service category icons
  const getCategoryIcon = (category) => {
    const iconClass = "text-xl mr-2";
    switch(category) {
      case 'hair': return <GiHairStrands className={`${iconClass} text-purple-500`} />;
      case 'beard': return <GiBeard className={`${iconClass} text-amber-600`} />;
      case 'face': return <MdFaceRetouchingNatural className={`${iconClass} text-blue-400`} />;
      case 'spa': return <MdOutlineSpa className={`${iconClass} text-green-500`} />;
      case 'nails': return <RiScissorsFill className={`${iconClass} text-pink-500`} />;
      default: return <GiHairStrands className={`${iconClass} text-gray-400`} />;
    }
  };

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setBookingStep(4);
    }, 1500);
  };

  // Render current step
  const renderStep = () => {
    switch(bookingStep) {
      case 1: // Salon Overview & Service Selection
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Salon Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-1/3 h-64 rounded-xl overflow-hidden">
                  <Image 
                    src={sampleSalon.image} 
                    alt={sampleSalon.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{sampleSalon.name}</h1>
                      <div className="flex items-center mt-2 text-gray-600">
                        <FaMapMarkerAlt className="mr-2 text-red-400" />
                        <span>{sampleSalon.address}</span>
                      </div>
                    </div>
                    <div className="flex items-center bg-indigo-50 px-3 py-1 rounded-full">
                      <FaStar className="text-yellow-500 mr-1" />
                      <span className="font-medium">{sampleSalon.rating}</span>
                      <span className="text-gray-500 ml-1">({sampleSalon.reviews})</span>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-gray-600">{sampleSalon.about}</p>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Weekdays</h4>
                      <p className="font-medium">{sampleSalon.openHours.weekdays}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Weekends</h4>
                      <p className="font-medium">{sampleSalon.openHours.weekends}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('services')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'services' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Services
                </button>
                <button
                  onClick={() => setActiveTab('staff')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'staff' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Our Staff
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Reviews
                </button>
              </nav>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Available Services</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {sampleSalon.services.map(service => (
                    <motion.div 
                      key={service.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-5 border rounded-xl cursor-pointer transition-all ${selectedService?.id === service.id ? 
                        'border-indigo-500 bg-indigo-50 shadow-md' : 
                        'border-gray-200 hover:border-indigo-300'}`}
                      onClick={() => {
                        setSelectedService(service);
                        setBookingStep(2);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="mt-1">
                            {getCategoryIcon(service.category)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{service.name}</h4>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <FaClock className="mr-1" />
                              <span>{service.duration}</span>
                            </div>
                          </div>
                        </div>
                        <span className="font-bold text-indigo-600">${service.price}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'staff' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Our Professional Staff</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {sampleSalon.staff.map((person, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                        <Image 
                          src={person.image}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-bold text-gray-800">{person.name}</h3>
                      <p className="text-sm text-gray-600">{person.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map(review => (
                    <div key={review} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center mb-3">
                        <div className="flex items-center mr-4">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-500' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">2 weeks ago</span>
                      </div>
                      <h4 className="font-medium text-gray-800 mb-2">Great experience!</h4>
                      <p className="text-gray-600">
                        {review === 1 ? 
                          "Sarah did an amazing job with my haircut. The salon is clean and the staff is very professional." : 
                          review === 2 ? 
                          "Best facial I've ever had. My skin feels incredible and the atmosphere was so relaxing." : 
                          "Michael is a color genius! He understood exactly what I wanted and delivered beyond my expectations."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );
      
      case 2: // Date & Time Selection
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <button 
              className="flex items-center text-indigo-600 hover:text-indigo-800 group"
              onClick={() => setBookingStep(1)}
            >
              <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to services
            </button>
            
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Select Date & Time</h2>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Service Summary */}
                <div className="md:w-1/3">
                  <div className="bg-indigo-50 p-4 rounded-xl">
                    <h3 className="font-medium text-gray-800 mb-3">Service Details</h3>
                    <div className="flex items-start">
                      <div className="mt-1">
                        {getCategoryIcon(selectedService.category)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{selectedService.name}</h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <FaClock className="mr-1" />
                          <span>{selectedService.duration}</span>
                        </div>
                        <div className="mt-2">
                          <span className="font-bold text-indigo-600">${selectedService.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Date & Time Selection */}
                <div className="md:w-2/3 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Select Date</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {sampleSalon.availableDates.map(date => (
                        <motion.button
                          key={date}
                          whileHover={{ y: -2 }}
                          className={`py-3 px-4 border rounded-lg text-center transition-all ${selectedDate === date ? 
                            'border-indigo-500 bg-indigo-50 text-indigo-600 font-medium shadow-sm' : 
                            'border-gray-200 hover:border-indigo-300'}`}
                          onClick={() => setSelectedDate(date)}
                        >
                          {formatDate(date)}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {selectedDate && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Available Times</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {availableTimes.map(time => (
                          <motion.button
                            key={time}
                            whileHover={{ y: -2 }}
                            className={`py-3 px-4 border rounded-lg text-center transition-all ${selectedTime === time ? 
                              'border-indigo-500 bg-indigo-50 text-indigo-600 font-medium shadow-sm' : 
                              'border-gray-200 hover:border-indigo-300'}`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedDate && selectedTime && (
                <div className="flex justify-end mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-md transition"
                    onClick={() => setBookingStep(3)}
                  >
                    Continue to Payment
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        );
      
      case 3: // Payment
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <button 
              className="flex items-center text-indigo-600 hover:text-indigo-800 group"
              onClick={() => setBookingStep(2)}
            >
              <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to date & time
            </button>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Complete Your Booking</h2>
                  
                  {/* Appointment Summary */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Appointment Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between pb-3 border-b border-gray-100">
                        <span className="text-gray-600">Salon:</span>
                        <span className="font-medium text-gray-800">{sampleSalon.name}</span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-gray-100">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium text-gray-800">{selectedService.name}</span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-gray-100">
                        <span className="text-gray-600">Date & Time:</span>
                        <span className="font-medium text-gray-800">
                          {new Date(selectedDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}, {selectedTime}
                        </span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-gray-100">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium text-gray-800">{selectedService.duration}</span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="text-xl font-bold text-indigo-600">${selectedService.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Method */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Method</h3>
                    
                    <div className="mb-6 p-5 bg-indigo-50 rounded-xl border border-indigo-100">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Bank Transfer
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Bank Name:</p>
                          <p className="font-medium text-gray-800">BeautyBank International</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Account Name:</p>
                          <p className="font-medium text-gray-800">{sampleSalon.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Account Number:</p>
                          <p className="font-medium text-gray-800">1234 5678 9012 3456</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Routing Number:</p>
                          <p className="font-medium text-gray-800">987654321</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-gray-600">
                        Please include your name and booking reference in the payment description.
                      </p>
                    </div>
                    
                    {/* Receipt Upload */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Payment Receipt
                      </label>
                      <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                        receiptFile ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300'
                      }`}>
                        <div className="flex flex-col items-center justify-center">
                          {receiptFile ? (
                            <>
                              <svg className="w-12 h-12 text-indigo-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="font-medium text-indigo-600 mb-1">{receiptFile.name}</p>
                              <p className="text-xs text-gray-500 mb-3">
                                {(receiptFile.size / 1024).toFixed(1)} KB
                              </p>
                              <button
                                onClick={() => setReceiptFile(null)}
                                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                              >
                                Change file
                              </button>
                            </>
                          ) : (
                            <>
                              <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, or PDF (Max. 5MB)
                              </p>
                              <input 
                                id="receipt-upload"
                                type="file"
                                className="hidden"
                                accept=".png,.jpg,.jpeg,.pdf"
                                onChange={(e) => setReceiptFile(e.target.files[0])}
                              />
                              <label 
                                htmlFor="receipt-upload"
                                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition"
                              >
                                Select File
                              </label>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Transaction Reference */}
                    <div>
                      <label htmlFor="transaction-ref" className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction Reference
                      </label>
                      <input
                        type="text"
                        id="transaction-ref"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="Enter your payment reference number"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Order Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium text-gray-800">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="font-medium text-gray-800">
                        {formatDate(selectedDate)}, {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-600">Total:</span>
                      <span className="text-xl font-bold text-indigo-600">${selectedService.price}</span>
                    </div>
                    <button 
                      className={`w-full mt-6 py-3 rounded-xl shadow-md transition ${
                        (!receiptFile || !transactionRef || isLoading) ? 
                        'bg-gray-300 cursor-not-allowed' : 
                        'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                      }`}
                      onClick={handleConfirmBooking}
                      disabled={!receiptFile || !transactionRef || isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        'Confirm Booking'
                      )}
                    </button>
                    <p className="text-xs text-gray-500 mt-3">
                      By confirming, you agree to our <Link href="#" className="text-indigo-600 hover:underline">Terms of Service</Link> and <Link href="#" className="text-indigo-600 hover:underline">Cancellation Policy</Link>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 4: // Confirmation
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-green-600 text-4xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Booking Confirmed!</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Your appointment at <span className="font-medium">{sampleSalon.name}</span> has been successfully booked.
              We've sent the details to your email.
            </p>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto mb-8 text-left">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Booking Details
              </h3>
              <div className="space-y-3">
                <p className="flex justify-between">
                  <span className="text-gray-600">Salon:</span>
                  <span className="font-medium text-gray-800">{sampleSalon.name}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium text-gray-800">{selectedService.name}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium text-gray-800">{selectedTime}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-800">{selectedService.duration}</span>
                </p>
                <p className="flex justify-between pt-3 border-t border-gray-100">
                  <span className="text-gray-600">Total Paid:</span>
                  <span className="font-bold text-indigo-600">${selectedService.price}</span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-md transition"
                onClick={() => {
                  setSelectedService(null);
                  setSelectedDate('');
                  setSelectedTime('');
                  setBookingStep(1);
                }}
              >
                Book Another Service
              </motion.button>
              <Link href="/" className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-xl transition text-center">
                Back to Home
              </Link>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
    

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Booking Progress Stepper */}
        {bookingStep < 4 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 max-w-4xl mx-auto"
          >
            <div className="flex justify-between relative before:absolute before:top-4 before:left-0 before:right-0 before:h-1.5 before:bg-gray-200 before:rounded-full before:z-0">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    bookingStep >= step ? 
                    'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 
                    'bg-white border-2 border-gray-300 text-gray-400'
                  }`}>
                    {step}
                  </div>
                  <span className={`text-sm mt-2 font-medium ${
                    bookingStep >= step ? 'text-indigo-600' : 'text-gray-500'
                  }`}>
                    {step === 1 && 'Service'}
                    {step === 2 && 'Date & Time'}
                    {step === 3 && 'Payment'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Booking Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 max-w-6xl mx-auto">
          {renderStep()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>© {new Date().getFullYear()} SalonPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper function to generate sample available dates
function getAvailableDates(days) {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= days; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

export default SalonBookingPage;