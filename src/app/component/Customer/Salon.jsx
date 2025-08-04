"use client";
import { motion } from "framer-motion";
import { useState } from "react";

import { FiSearch, FiStar, FiMapPin, FiClock, FiCalendar, FiCreditCard,FiUpload, FiCheck, FiChevronLeft, FiX } from "react-icons/fi";

const SalonsContent = () => {
  // Flow states
  const [flowStep, setFlowStep] = useState("salons"); // salons -> services -> slots -> payment -> confirmation
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Sample data
  const salons = [
    {
      id: 1,
      name: "Glamour Studio",
      rating: 4.8,
      address: "123 Beauty St, Downtown",
      services: [
        { id: 101, name: "Haircut", duration: 30, price: 35 },
        { id: 102, name: "Hair Coloring", duration: 120, price: 85 },
        { id: 103, name: "Styling", duration: 45, price: 40 }
      ],
      distance: "0.5 miles",
      image: "/salon1.jpg",
      slots: {
        "2023-11-15": ["09:00", "10:30", "14:00", "15:30"],
        "2023-11-16": ["10:00", "11:30", "13:00", "16:30"],
        "2023-11-17": ["09:30", "11:00", "14:30", "17:00"]
      }
    },
    {
      id: 2,
      name: "Beauty Lounge",
      rating: 4.5,
      address: "456 Style Ave, Uptown",
      services: [
        { id: 201, name: "Manicure", duration: 45, price: 25 },
        { id: 202, name: "Pedicure", duration: 60, price: 35 },
        { id: 203, name: "Waxing", duration: 30, price: 40 }
      ],
      distance: "1.2 miles",
      image: "/salon2.jpg",
      slots: {
        "2023-11-15": ["10:00", "12:00", "15:00"],
        "2023-11-16": ["09:00", "11:00", "14:00"],
        "2023-11-17": ["10:30", "13:00", "16:00"]
      }
    }
  ];

  const handleSalonSelect = (salon) => {
    setSelectedSalon(salon);
    setFlowStep("services");
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setFlowStep("slots");
  };

  const handleSlotSelect = (date, time) => {
    setSelectedSlot({ date, time });
    setFlowStep("payment");
  };

  const handlePaymentSubmit = () => {
    setFlowStep("confirmation");
  };

  const handleBack = () => {
    if (flowStep === "services") setFlowStep("salons");
    if (flowStep === "slots") setFlowStep("services");
    if (flowStep === "payment") setFlowStep("slots");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {flowStep === "salons" && (
        <SalonList 
          salons={salons} 
          onSelect={handleSalonSelect} 
        />
      )}

      {flowStep === "services" && selectedSalon && (
        <ServiceSelection 
          salon={selectedSalon} 
          onSelect={handleServiceSelect}
          onBack={handleBack}
        />
      )}

      {flowStep === "slots" && selectedSalon && selectedService && (
        <SlotSelection 
          salon={selectedSalon}
          service={selectedService}
          onSelect={handleSlotSelect}
          onBack={handleBack}
        />
      )}

      {flowStep === "payment" && selectedSalon && selectedService && selectedSlot && (
        <PaymentStep 
          salon={selectedSalon}
          service={selectedService}
          slot={selectedSlot}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onSubmit={handlePaymentSubmit}
          onBack={handleBack}
        />
      )}

      {flowStep === "confirmation" && selectedSalon && selectedService && selectedSlot && (
        <ConfirmationStep 
          salon={selectedSalon}
          service={selectedService}
          slot={selectedSlot}
          onComplete={() => setFlowStep("salons")}
        />
      )}
    </div>
  );
};

// Salon List Component
const SalonList = ({ salons, onSelect }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Find Salons Near You</h1>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for salons, services..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg pl-10 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <FiSearch className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {salons.map(salon => (
          <motion.div 
            key={salon.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
            onClick={() => onSelect(salon)}
          >
            <div className="h-48 bg-gray-200 flex items-center justify-center relative">
              <span className="text-gray-400">Salon Image</span>
              <div className="absolute bottom-2 right-2 flex items-center bg-white/90 px-2 py-1 rounded-full text-sm">
                <FiMapPin className="text-indigo-600 mr-1" />
                <span>{salon.distance}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-lg">{salon.name}</h4>
                <div className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">
                  <FiStar className="mr-1" />
                  <span>{salon.rating}</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-3">{salon.address}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {salon.services.slice(0, 3).map((service, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {service.name}
                  </span>
                ))}
                {salon.services.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    +{salon.services.length - 3} more
                  </span>
                )}
              </div>
              
              <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Book Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Service Selection Component
const ServiceSelection = ({ salon, onSelect, onBack }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-1 rounded-full hover:bg-gray-100"
          >
            <FiChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{salon.name}</h1>
            <p className="text-gray-600 flex items-center">
              <FiMapPin className="mr-1" /> {salon.address}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select a Service</h2>
        <div className="space-y-4">
          {salon.services.map(service => (
            <motion.div 
              key={service.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 cursor-pointer"
              onClick={() => onSelect(service)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-800">{service.name}</h3>
                <span className="font-semibold text-indigo-600">${service.price}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                <FiClock className="inline mr-1" /> {service.duration} minutes
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Slot Selection Component
const SlotSelection = ({ salon, service, onSelect, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(Object.keys(salon.slots)[0]);
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-1 rounded-full hover:bg-gray-100"
          >
            <FiChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{salon.name}</h1>
            <p className="text-gray-600">{service.name} (${service.price})</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Date & Time</h2>
        
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {Object.keys(salon.slots).map(date => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedDate === date 
                  ? "bg-indigo-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {salon.slots[selectedDate]?.map(time => (
            <button
              key={time}
              onClick={() => onSelect(selectedDate, time)}
              className="py-2 px-3 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition"
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Payment Step Component
const PaymentStep = ({ salon, service, slot, onSubmit, onBack }) => {
  const [receiptFile, setReceiptFile] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const handleSubmit = () => {
    if (!receiptFile || !transactionId) {
      alert('Please upload your receipt and enter transaction ID');
      return;
    }
    setIsSubmitting(true);
    onSubmit();
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-1 rounded-full hover:bg-gray-100"
          >
            <FiChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Payment Receipt</h1>
            <p className="text-gray-600">Upload your payment confirmation</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Payment Details</h3>
              
              <div className="space-y-4">
                {/* Bank Details Section */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="text-lg font-medium text-gray-800 mb-3">Bank Transfer Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Bank Name</p>
                      <p className="text-gray-800 font-semibold">ABC Bank</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Account Name</p>
                      <p className="text-gray-800 font-semibold">Salon Services Ltd</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Account Number</p>
                      <p className="text-gray-800 font-semibold">1234567890</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Branch Code</p>
                      <p className="text-gray-800 font-semibold">XYZ123</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-600">Reference/Note</p>
                      <p className="text-gray-800 font-semibold">Your name or booking ID</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Money Section */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="text-lg font-medium text-gray-800 mb-3">Mobile Money Options</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">MTN Mobile Money</p>
                      <p className="text-gray-800 font-semibold">0244123456</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Vodafone Cash</p>
                      <p className="text-gray-800 font-semibold">0200123456</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-600">Reference/Note</p>
                      <p className="text-gray-800 font-semibold">Your name or booking ID</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction ID/Reference Number
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter your transaction reference"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Receipt (Image/PDF)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      {receiptFile ? (
                        <div className="flex flex-col items-center">
                          <FiCheck className="mx-auto h-12 w-12 text-green-500" />
                          <p className="text-sm text-gray-600 mt-2">
                            {receiptFile.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => setReceiptFile(null)}
                            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                          >
                            Change file
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-center">
                            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                          </div>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                                accept="image/*,.pdf"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, PDF up to 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Payment Instructions</h4>
                  <ul className="text-xs text-blue-700 space-y-1 list-disc pl-5">
                    <li>Make payment to our bank account or mobile money number</li>
                    <li>Use your name or booking ID as reference</li>
                    <li>Take a screenshot or photo of your payment confirmation</li>
                    <li>Upload the image or PDF receipt above</li>
                    <li>Enter your transaction reference number</li>
                    <li>Your appointment will be confirmed after verification</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Appointment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salon</span>
                  <span className="font-medium">{salon.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="font-medium">
                    {new Date(slot.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                    <br />
                    {slot.time}
                  </span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Price</span>
                  <span className="font-medium">${service.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$2.50</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-gray-800 font-semibold">Total</span>
                  <span className="text-indigo-600 font-bold">${service.price + 2.50}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <FiCheck className="mr-2" /> Submit Receipt
                </>
              )}
            </button>
            
            <p className="text-xs text-gray-500 text-center">
              Your appointment will be confirmed after payment verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirmation Step Component
const ConfirmationStep = ({ salon, service, slot, onComplete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-2xl mx-auto">
      <div className="p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <FiCheck className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Appointment Confirmed!</h1>
        <p className="text-gray-600 mb-6">Your booking has been successfully placed</p>
        
        <div className="border border-gray-200 rounded-lg p-6 mb-6 text-left">
          <h2 className="font-semibold text-gray-800 mb-4">Appointment Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Salon</span>
              <span className="font-medium">{salon.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service</span>
              <span className="font-medium">{service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-medium">
                {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                <br />
                {slot.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium">{service.duration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Paid</span>
              <span className="font-medium text-indigo-600">${service.price + 2.50}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Add to Calendar
          </button>
          <button 
            onClick={onComplete}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Book Another Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalonsContent;