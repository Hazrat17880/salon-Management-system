"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaStar, FaCalendarAlt, FaClock, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { GiHairStrands, GiBeard } from 'react-icons/gi';
import { MdFaceRetouchingNatural, MdOutlineSpa } from 'react-icons/md';
import { BiSolidOffer } from 'react-icons/bi';
import { RiScissorsFill } from 'react-icons/ri';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Booking = () => {
  // States
  const [salons, setSalons] = useState([]);
  const [filteredSalons, setFilteredSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookingStep, setBookingStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Sample data
  useEffect(() => {
    setTimeout(() => {
      const sampleSalons = [
        {
          id: 1,
          name: "Glamour Luxe Salon",
          address: "123 Beauty Street, Manhattan",
          rating: 4.8,
          distance: "0.5 miles",
          image: "/salon1.jpg",
          services: [
            { id: 101, name: "Signature Haircut", duration: "45 min", price: 65, category: "hair" },
            { id: 102, name: "Premium Hair Color", duration: "2.5 hours", price: 150, category: "hair" },
            { id: 103, name: "Deluxe Manicure", duration: "60 min", price: 45, category: "nails" }
          ],
          availableDates: getAvailableDates(3),
          availableTimes: ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"]
        },
        {
          id: 2,
          name: "Urban Gents Barbershop",
          address: "456 Trendy Avenue, Brooklyn",
          rating: 4.7,
          distance: "1.2 miles",
          image: "/salon2.jpg",
          services: [
            { id: 201, name: "Executive Beard Trim", duration: "30 min", price: 35, category: "beard" },
            { id: 202, name: "Royal Hot Towel Shave", duration: "45 min", price: 55, category: "beard" }
          ],
          availableDates: getAvailableDates(2),
          availableTimes: ["10:00", "11:30", "13:00", "15:00", "16:30"]
        },
        {
          id: 3,
          name: "Serenity Spa & Salon",
          address: "789 Wellness Boulevard, Queens",
          rating: 4.9,
          distance: "2.3 miles",
          image: "/salon3.jpg",
          services: [
            { id: 301, name: "Deep Tissue Massage", duration: "60 min", price: 110, category: "spa" },
            { id: 302, name: "Rejuvenating Facial", duration: "50 min", price: 85, category: "face" },
            { id: 303, name: "Full Body Wax", duration: "75 min", price: 75, category: "waxing" }
          ],
          availableDates: getAvailableDates(4),
          availableTimes: ["09:30", "11:00", "13:30", "15:00", "16:30"]
        }
      ];
      setSalons(sampleSalons);
      setFilteredSalons(sampleSalons);
      setIsLoading(false);
    }, 800);
  }, []);

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

  // Filter salons
  useEffect(() => {
    let results = salons;
    if (searchTerm) {
      results = results.filter(salon => 
        salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salon.services.some(service => 
          service.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
    if (selectedCategory !== 'all') {
      results = results.filter(salon => 
        salon.services.some(service => service.category === selectedCategory)
  )}
    setFilteredSalons(results);
  }, [searchTerm, selectedCategory, salons]);

  // Handlers
  const handleSelectSalon = (salon) => {
    setSelectedSalon(salon);
    setBookingStep(2);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setBookingStep(3);
  };

  const handleDateTimeSelection = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setBookingStep(4);
  };

  const handleConfirmBooking = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log({
        salon: selectedSalon.name,
        service: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        receipt: receiptFile,
        transactionRef
      });
      setIsLoading(false);
      setBookingStep(5);
    }, 1500);
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
      case 'waxing': return <BiSolidOffer className={`${iconClass} text-red-400`} />;
      default: return <GiHairStrands className={`${iconClass} text-gray-400`} />;
    }
  };

  // Format date display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Render booking steps
  const renderStep = () => {
    switch(bookingStep) {
      case 1: // Select Salon
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-800">Find Your Perfect Salon</h2>
            <p className="text-gray-500 mb-6">Browse our curated selection of premium salons</p>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search salons or services..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select 
                className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="hair">Hair Services</option>
                <option value="beard">Beard Services</option>
                <option value="face">Facial Treatments</option>
                <option value="nails">Nail Services</option>
                <option value="spa">Spa Services</option>
                <option value="waxing">Waxing</option>
              </select>
            </div>
            
            {/* Salon List */}
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredSalons.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4 text-5xl">✂️</div>
                <h3 className="text-xl font-medium text-gray-600">No salons found</h3>
                <p className="text-gray-500">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSalons.map(salon => (
                  <motion.div 
                    key={salon.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                    onClick={() => handleSelectSalon(salon)}
                  >
                    <div className="relative h-48 w-full">
                      <Image 
                        src={salon.image}
                        alt={salon.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-opacity opacity-90 hover:opacity-100"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center shadow-sm">
                        <FaStar className="text-yellow-500 mr-1" />
                        <span className="font-medium text-sm">{salon.rating}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-xl mb-1 text-gray-800">{salon.name}</h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <FaMapMarkerAlt className="mr-2 text-red-400" />
                        <span className="text-sm">{salon.address}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {salon.services.slice(0, 3).map(service => (
                          <span key={service.id} className="text-xs px-3 py-1 bg-gray-100 rounded-full flex items-center">
                            {getCategoryIcon(service.category)}
                            {service.name}
                          </span>
                        ))}
                        {salon.services.length > 3 && (
                          <span className="text-xs px-3 py-1 bg-gray-100 rounded-full">
                            +{salon.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        );
      
      case 2: // Select Service
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <button 
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 group"
              onClick={() => setBookingStep(1)}
            >
              <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to salons
            </button>
            
            <div className="flex items-start mb-8">
              <div className="relative h-20 w-20 min-w-[5rem] rounded-xl overflow-hidden border border-gray-200">
                <Image 
                  src={selectedSalon.image}
                  alt={selectedSalon.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedSalon.name}</h2>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2 text-red-400" />
                  <span>{selectedSalon.address}</span>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Available Services</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {selectedSalon.services.map(service => (
                <motion.div 
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-5 border rounded-xl cursor-pointer transition-all ${selectedService?.id === service.id ? 
                    'border-indigo-500 bg-indigo-50 shadow-md' : 
                    'border-gray-200 hover:border-indigo-300'}`}
                  onClick={() => handleSelectService(service)}
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
            
            {selectedService && (
              <div className="flex justify-end mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-md transition"
                  onClick={() => setBookingStep(3)}
                >
                  Next: Select Date & Time
                </motion.button>
              </div>
            )}
          </motion.div>
        );
      
      case 3: // Select Date & Time
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <button 
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 group"
              onClick={() => setBookingStep(2)}
            >
              <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to services
            </button>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your Appointment</h2>
              <div className="bg-indigo-50 p-4 rounded-xl inline-flex items-center">
                <div className="bg-white p-2 rounded-lg mr-3">
                  {getCategoryIcon(selectedService.category)}
                </div>
                <div>
                  <span className="font-medium text-gray-800">{selectedService.name}</span>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-3">${selectedService.price}</span>
                    <FaClock className="mr-1" />
                    <span>{selectedService.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Date</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedSalon.availableDates.map(date => (
                    <motion.button
                      key={date}
                      whileHover={{ y: -2 }}
                      className={`py-4 border rounded-xl text-center transition-all ${selectedDate === date ? 
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Times</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedSalon.availableTimes.map(time => (
                      <motion.button
                        key={time}
                        whileHover={{ y: -2 }}
                        className={`py-4 border rounded-xl text-center transition-all ${selectedTime === time ? 
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
            
            {selectedDate && selectedTime && (
              <div className="flex justify-end mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-md transition"
                  onClick={() => setBookingStep(4)}
                >
                  Continue to Payment
                </motion.button>
              </div>
            )}
          </motion.div>
        );
      
      case 4: // Payment
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <button 
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 group"
              onClick={() => setBookingStep(3)}
            >
              <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to date & time
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Booking</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Salon:</span>
                      <span className="font-medium text-gray-800">{selectedSalon.name}</span>
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
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
                  
                  {/* Salon Payment Information */}
                  <div className="mb-6 p-5 bg-indigo-50 rounded-xl border border-indigo-100">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Salon Bank Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Bank Name:</p>
                        <p className="font-medium text-gray-800">BeautyBank International</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Account Name:</p>
                        <p className="font-medium text-gray-800">{selectedSalon.name}</p>
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
              
              {/* Order Summary */}
              <div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
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
                      By confirming, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Cancellation Policy</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 5: // Confirmation
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
          >
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-green-600 text-4xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Booking Confirmed!</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Your appointment at <span className="font-medium">{selectedSalon.name}</span> has been successfully booked.
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
                  <span className="font-medium text-gray-800">{selectedSalon.name}</span>
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
                  setSelectedSalon(null);
                  setSelectedService(null);
                  setSelectedDate('');
                  setSelectedTime('');
                  setBookingStep(1);
                }}
              >
                Book Another Appointment
              </motion.button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-xl transition">
                View Booking Details
              </button>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xl font-bold text-gray-800">SalonPro</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Booking Progress Stepper */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12 max-w-4xl mx-auto"
        >
          <div className="flex justify-between relative before:absolute before:top-4 before:left-0 before:right-0 before:h-1.5 before:bg-gray-200 before:rounded-full before:z-0">
            {[1, 2, 3, 4, 5].map(step => (
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
                  {step === 1 && 'Choose Salon'}
                  {step === 2 && 'Select Service'}
                  {step === 3 && 'Date & Time'}
                  {step === 4 && 'Payment'}
                  {step === 5 && 'Confirmation'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Booking Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-6xl mx-auto">
          {renderStep()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SalonPro</h3>
              <p className="text-gray-400">Premium salon booking platform for professionals and clients</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Salons</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} SalonPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Booking;