"use client"

import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaStar, FaCalendarAlt, FaClock, FaCreditCard, FaCheck } from 'react-icons/fa';
import { GiHairStrands } from 'react-icons/gi';
import { MdFaceRetouchingNatural } from 'react-icons/md';
import { BiMassage } from 'react-icons/bi';

const Booking = () => {
  // States
  const [salons, setSalons] = useState([]);
  const [filteredSalons, setFilteredSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookingStep, setBookingStep] = useState(1); // 1: Select Salon, 2: Select Service, 3: Select Date/Time, 4: Payment, 5: Confirmation
  const [isLoading, setIsLoading] = useState(true);

  // Sample data - replace with API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleSalons = [
        {
          id: 1,
          name: "Glamour Salon",
          address: "123 Beauty St, New York",
          rating: 4.8,
          distance: "0.5 miles",
          image: "/salon1.jpg",
          services: [
            { id: 101, name: "Haircut", duration: "30 min", price: 45, category: "hair" },
            { id: 102, name: "Hair Coloring", duration: "2 hours", price: 120, category: "hair" },
            { id: 103, name: "Manicure", duration: "45 min", price: 35, category: "nails" }
          ],
          availableDates: ["2023-07-20", "2023-07-21", "2023-07-22"],
          availableTimes: ["09:00", "10:00", "11:00", "14:00", "15:00"]
        },
        {
          id: 2,
          name: "Urban Style Barbers",
          address: "456 Trendy Ave, New York",
          rating: 4.5,
          distance: "1.2 miles",
          image: "/salon2.jpg",
          services: [
            { id: 201, name: "Beard Trim", duration: "20 min", price: 25, category: "beard" },
            { id: 202, name: "Hot Towel Shave", duration: "30 min", price: 40, category: "beard" }
          ],
          availableDates: ["2023-07-20", "2023-07-23"],
          availableTimes: ["10:00", "11:00", "13:00", "16:00"]
        },
        {
          id: 3,
          name: "Luxury Spa & Salon",
          address: "789 Relax Rd, New York",
          rating: 4.9,
          distance: "2.0 miles",
          image: "./salon3.jpg",
          services: [
            { id: 301, name: "Deep Tissue Massage", duration: "1 hour", price: 90, category: "spa" },
            { id: 302, name: "Facial Treatment", duration: "45 min", price: 75, category: "face" },
            { id: 303, name: "Full Body Wax", duration: "1 hour", price: 65, category: "waxing" }
          ],
          availableDates: ["2023-07-21", "2023-07-22", "2023-07-24"],
          availableTimes: ["09:00", "11:00", "14:00", "15:00", "17:00"]
        }
      ];
      setSalons(sampleSalons);
      setFilteredSalons(sampleSalons);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter salons based on search and category
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
      );
    }
    
    setFilteredSalons(results);
  }, [searchTerm, selectedCategory, salons]);

  // Handle salon selection
  const handleSelectSalon = (salon) => {
    setSelectedSalon(salon);
    setBookingStep(2);
  };

  // Handle service selection
  const handleSelectService = (service) => {
    setSelectedService(service);
    setBookingStep(3);
  };

  // Handle date/time selection
  const handleDateTimeSelection = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setBookingStep(4);
  };

  // Handle payment and booking confirmation
  const handleConfirmBooking = () => {
    // Here you would typically send the booking data to your backend
    console.log({
      salon: selectedSalon.name,
      service: selectedService.name,
      date: selectedDate,
      time: selectedTime,
      paymentMethod
    });
    setBookingStep(5);
  };

  // Service category icons
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'hair': return <GiHairStrands className="text-purple-500" />;
      case 'face': return <MdFaceRetouchingNatural className="text-blue-500" />;
      case 'spa': return <BiMassage className="text-green-500" />;
      default: return <GiHairStrands className="text-gray-500" />;
    }
  };

  // Render booking steps
  const renderStep = () => {
    switch(bookingStep) {
      case 1: // Select Salon
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Find a Salon</h2>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by salon name or service..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              
              <select 
                className="border rounded-lg px-4 py-2"
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
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredSalons.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No salons found matching your criteria
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSalons.map(salon => (
                  <div 
                    key={salon.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleSelectSalon(salon)}
                  >
                    <img 
                      src={salon.image} 
                      alt={salon.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{salon.name}</h3>
                        <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                          <FaStar className="text-yellow-500 mr-1" />
                          <span>{salon.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 mb-3">
                        <FaMapMarkerAlt className="mr-1 text-red-500" />
                        <span>{salon.address} • {salon.distance}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {salon.services.slice(0, 3).map(service => (
                          <span key={service.id} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            {service.name}
                          </span>
                        ))}
                        {salon.services.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            +{salon.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 2: // Select Service
        return (
          <div className="space-y-6">
            <button 
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
              onClick={() => setBookingStep(1)}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to salons
            </button>
            
            <div className="flex items-center mb-6">
              <img 
                src={selectedSalon.image} 
                alt={selectedSalon.name} 
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h2 className="text-2xl font-bold">{selectedSalon.name}</h2>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-1 text-red-500" />
                  <span>{selectedSalon.address}</span>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold">Select a Service</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {selectedSalon.services.map(service => (
                <div 
                  key={service.id} 
                  className={`p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${selectedService?.id === service.id ? 'border-blue-500 bg-blue-50' : ''}`}
                  onClick={() => handleSelectService(service)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      {getCategoryIcon(service.category)}
                      <h4 className="font-medium ml-2">{service.name}</h4>
                    </div>
                    <span className="font-semibold">${service.price}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaClock className="mr-1" />
                    <span>{service.duration}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedService && (
              <div className="flex justify-end mt-6">
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  onClick={() => setBookingStep(3)}
                >
                  Next: Select Date & Time
                </button>
              </div>
            )}
          </div>
        );
      
      case 3: // Select Date & Time
        return (
          <div className="space-y-6">
            <button 
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
              onClick={() => setBookingStep(2)}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to services
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Select Date & Time</h2>
              <div className="bg-blue-50 p-3 rounded-lg inline-block">
                <span className="font-medium">{selectedService.name}</span> • ${selectedService.price} • {selectedService.duration}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Available Dates</h3>
                <div className="grid grid-cols-3 gap-3">
                  {selectedSalon.availableDates.map(date => (
                    <button
                      key={date}
                      className={`py-3 border rounded-lg ${selectedDate === date ? 'border-blue-500 bg-blue-50 text-blue-600' : 'hover:border-gray-400'}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </button>
                  ))}
                </div>
              </div>
              
              {selectedDate && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Available Times</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedSalon.availableTimes.map(time => (
                      <button
                        key={time}
                        className={`py-3 border rounded-lg ${selectedTime === time ? 'border-blue-500 bg-blue-50 text-blue-600' : 'hover:border-gray-400'}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {selectedDate && selectedTime && (
              <div className="flex justify-end mt-6">
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  onClick={() => setBookingStep(4)}
                >
                  Next: Payment
                </button>
              </div>
            )}
          </div>
        );
      
      // Replace the payment section (case 4) with this updated version:
case 4: // Payment
  return (
    <div className="space-y-6">
      <button 
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        onClick={() => setBookingStep(3)}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to date & time
      </button>
      
      <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Salon:</span>
                <span className="font-medium">{selectedSalon.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{selectedService.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium">
                  {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}, {selectedTime}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{selectedService.duration}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-gray-600">Total:</span>
                <span className="text-xl font-bold">${selectedService.price}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            
            {/* Salon Payment Details */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Salon Bank Details:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Bank Name:</p>
                  <p className="font-medium">BeautyBank International</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Name:</p>
                  <p className="font-medium">{selectedSalon.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Number:</p>
                  <p className="font-medium">1234 5678 9012 3456</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Routing Number:</p>
                  <p className="font-medium">987654321</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Please include your name and booking reference in the payment description.
              </p>
            </div>
            
            {/* Receipt Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center justify-center">
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
                />
                <label 
                  htmlFor="receipt-upload"
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
                >
                  Select File
                </label>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                After making the payment, please upload your receipt here for verification.
              </div>
            </div>
            
            {/* Transaction Reference */}
            <div className="mt-6">
              <label htmlFor="transaction-ref" className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Reference Number
              </label>
              <input
                type="text"
                id="transaction-ref"
                className="w-full p-2 border rounded"
                placeholder="Enter reference number from your payment"
              />
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Booking</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Service:</span>
                <span className="font-medium">${selectedService.price}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Total:</span>
                <span className="font-bold">${selectedService.price}</span>
              </div>
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mt-4"
                onClick={handleConfirmBooking}
              >
                Confirm Booking
              </button>
              <p className="text-xs text-gray-500 mt-2">
                By confirming, you agree to our Terms of Service and Cancellation Policy.
                Your appointment will be confirmed after receipt verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
        return (
          <div className="space-y-6">
            <button 
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
              onClick={() => setBookingStep(3)}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to date & time
            </button>
            
            <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Salon:</span>
                      <span className="font-medium">{selectedSalon.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="font-medium">
                        {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}, {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{selectedService.duration}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-gray-600">Total:</span>
                      <span className="text-xl font-bold">${selectedService.price}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  <div className="space-y-4">
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          checked={paymentMethod === 'card'}
                          onChange={() => {}}
                          className="mr-3"
                        />
                        <FaCreditCard className="text-gray-700 mr-2" />
                        <span>Credit/Debit Card</span>
                      </div>
                      {paymentMethod === 'card' && (
                        <div className="mt-4 space-y-3">
                          <input 
                            type="text" 
                            placeholder="Card Number" 
                            className="w-full p-2 border rounded"
                          />
                          <div className="grid grid-cols-3 gap-3">
                            <input 
                              type="text" 
                              placeholder="MM/YY" 
                              className="p-2 border rounded"
                            />
                            <input 
                              type="text" 
                              placeholder="CVV" 
                              className="p-2 border rounded"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : ''}`}
                      onClick={() => setPaymentMethod('paypal')}
                    >
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          checked={paymentMethod === 'paypal'}
                          onChange={() => {}}
                          className="mr-3"
                        />
                        <img src="/paypal-logo.png" alt="PayPal" className="h-6 mr-2" />
                        <span>PayPal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
                  <h3 className="text-lg font-semibold mb-4">Confirm Booking</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium">${selectedService.price}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Total:</span>
                      <span className="font-bold">${selectedService.price}</span>
                    </div>
                    <button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mt-4"
                      onClick={handleConfirmBooking}
                    >
                      Confirm & Pay
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      By confirming, you agree to our Terms of Service and Cancellation Policy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 5: // Confirmation
        return (
          <div className="text-center py-12 ">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-green-600 text-3xl" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Your appointment at {selectedSalon.name} for {selectedService.name} on {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime} has been confirmed.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mb-8 text-left">
              <h3 className="font-semibold mb-3">Booking Details</h3>
              <div className="space-y-2">
                <p><span className="text-gray-600">Salon:</span> {selectedSalon.name}</p>
                <p><span className="text-gray-600">Service:</span> {selectedService.name}</p>
                <p><span className="text-gray-600">Date & Time:</span> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}, {selectedTime}</p>
                <p><span className="text-gray-600">Duration:</span> {selectedService.duration}</p>
                <p><span className="text-gray-600">Total Paid:</span> ${selectedService.price}</p>
              </div>
            </div>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              onClick={() => {
                // Reset booking flow
                setSelectedSalon(null);
                setSelectedService(null);
                setSelectedDate('');
                setSelectedTime('');
                setBookingStep(1);
              }}
            >
              Book Another Appointment
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-32">
      {/* Booking Progress Stepper */}
      <div className="mb-8">
        <div className="flex justify-between relative before:absolute before:top-4 before:left-0 before:right-0 before:h-1 before:bg-gray-200 before:z-0">
          {[1, 2, 3, 4, 5].map(step => (
            <div key={step} className="flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {step}
              </div>
              <span className={`text-xs mt-2 ${bookingStep >= step ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
                {step === 1 && 'Select Salon'}
                {step === 2 && 'Select Service'}
                {step === 3 && 'Date & Time'}
                {step === 4 && 'Payment'}
                {step === 5 && 'Confirmation'}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Booking Content */}
      {renderStep()}
    </div>
  );
};

export default Booking;