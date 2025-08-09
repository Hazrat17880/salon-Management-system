'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from 'next/image';

// Import icons for a better UI
import { 
  FiSearch, 
  FiStar, 
  FiMapPin, 
  FiClock, 
  FiChevronLeft, 
  FiCheck, 
  FiHeart, 
  FiUpload, 
  FiCalendar,
  FiCreditCard,
  FiX
} from "react-icons/fi";

const SalonsContent = () => {
  // Flow states
  const [flowStep, setFlowStep] = useState("salons"); // salons -> services -> slots -> payment -> confirmation
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [favoriteSalons, setFavoriteSalons] = useState([]); // New state for favorite salon IDs
  
  // State for the custom alert message
  const [alertMessage, setAlertMessage] = useState(null);

  // Sample data (updated with images)
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
    },
    {
      id: 3,
      name: "Chic Cuts",
      rating: 4.9,
      address: "789 Hair St, City Center",
      services: [
        { id: 301, name: "Haircut", duration: 30, price: 45 },
        { id: 302, name: "Beard Trim", duration: 20, price: 20 },
      ],
      distance: "0.8 miles",
      image: "/salon3.jpg",
      slots: {
        "2023-11-15": ["11:00", "12:30", "14:00", "16:00"],
        "2023-11-16": ["10:00", "11:00", "15:00", "17:00"],
        "2023-11-17": ["09:00", "10:00", "13:00"]
      }
    }
  ];

  // Logic to toggle a salon's favorite status
  const handleToggleFavorite = (salonId) => {
    setFavoriteSalons(prevFavorites =>
      prevFavorites.includes(salonId)
        ? prevFavorites.filter(id => id !== salonId)
        : [...prevFavorites, salonId]
    );
  };

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

  const handleCustomAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000); // Alert disappears after 3 seconds
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 font-sans">
      <div className="max-w-6xl mx-auto px-4">
        {/* Custom Alert Message */}
        <AnimatePresence>
          {alertMessage && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2"
            >
              <FiX className="h-5 w-5" />
              <span>{alertMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={flowStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {flowStep === "salons" && (
              <SalonList 
                salons={salons} 
                onSelect={handleSalonSelect} 
                favoriteSalons={favoriteSalons}
                onToggleFavorite={handleToggleFavorite}
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
                onSubmit={handlePaymentSubmit}
                onBack={handleBack}
                showAlert={handleCustomAlert}
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Salon List Component with Favorites filter
const SalonList = ({ salons, onSelect, favoriteSalons, onToggleFavorite }) => {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSalons = salons.filter(salon => {
    const isFavorite = favoriteSalons.includes(salon.id);
    const matchesSearch = salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          salon.address.toLowerCase().includes(searchQuery.toLowerCase());
    return (!showFavoritesOnly || isFavorite) && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Find Salons Near You</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-auto flex-grow">
            <input 
              type="text" 
              placeholder="Search for salons, services..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl pl-12 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 shadow-sm
                       ${showFavoritesOnly 
                         ? "bg-indigo-600 text-white" 
                         : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"}`
            }
          >
            <FiHeart className={`h-5 w-5 ${showFavoritesOnly ? "fill-current" : "stroke-current"}`} />
            <span>{showFavoritesOnly ? "Showing Favorites" : "View Favorites"}</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSalons.length > 0 ? filteredSalons.map(salon => (
          <motion.div 
            key={salon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group relative"
          >
            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(salon.id);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm z-10 transition-colors duration-200"
              aria-label="Toggle favorite"
            >
              <FiHeart
                className={`h-6 w-6 transition-all ${
                  favoriteSalons.includes(salon.id)
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400 hover:text-red-500 hover:fill-red-500"
                }`}
              />
            </button>

            {/* Main card content, click to select salon */}
            <div onClick={() => onSelect(salon)} className="cursor-pointer">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <Image
                  src={salon.image}
                  alt={salon.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 flex items-center bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                  <FiMapPin className="text-indigo-600 mr-1" />
                  <span>{salon.distance}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-xl text-gray-800">{salon.name}</h4>
                  <div className="flex items-center bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                    <FiStar className="mr-1 fill-current text-yellow-400 stroke-yellow-400" />
                    <span>{salon.rating}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-3">{salon.address}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {salon.services.slice(0, 3).map((service, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                      {service.name}
                    </span>
                  ))}
                  {salon.services.length > 3 && (
                    <span className="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                      +{salon.services.length - 3} more
                    </span>
                  )}
                </div>
                
                <button className="w-full py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-md">
                  Book Now
                </button>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 text-gray-500">
            <FiX className="mx-auto h-16 w-16 mb-4" />
            <h3 className="text-2xl font-semibold">No Salons Found</h3>
            <p className="mt-2">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Service Selection Component
const ServiceSelection = ({ salon, onSelect, onBack }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-4"
        >
          <FiChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{salon.name}</h1>
          <p className="text-gray-600 flex items-center text-sm">
            <FiMapPin className="mr-1" /> {salon.address}
          </p>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-800 mb-6">Select a Service</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {salon.services.map(service => (
          <motion.div 
            key={service.id}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-50 p-6 border border-gray-200 rounded-2xl hover:border-indigo-400 transition-all cursor-pointer"
            onClick={() => onSelect(service)}
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold text-lg text-gray-800">{service.name}</h3>
              <span className="font-bold text-indigo-600 text-lg">${service.price}</span>
            </div>
            <p className="text-sm text-gray-500 flex items-center">
              <FiClock className="inline mr-2" /> {service.duration} minutes
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Slot Selection Component
const SlotSelection = ({ salon, service, onSelect, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(Object.keys(salon.slots)[0]);
  
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-4"
        >
          <FiChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{salon.name}</h1>
          <p className="text-gray-600 text-sm">{service.name} (${service.price})</p>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-800 mb-6">Select Date & Time</h2>
      
      <div className="flex space-x-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {Object.keys(salon.slots).map(date => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`flex-shrink-0 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-colors duration-200
              ${selectedDate === date 
                ? "bg-indigo-600 text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`
            }
          >
            <FiCalendar className="inline mr-2" />
            {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {salon.slots[selectedDate]?.map(time => (
          <motion.button
            key={time}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(selectedDate, time)}
            className="py-3 px-4 text-sm font-medium border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
          >
            {time}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Payment Step Component
const PaymentStep = ({ salon, service, slot, onSubmit, onBack, showAlert }) => {
  const [receiptFile, setReceiptFile] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!receiptFile || !transactionId) {
      showAlert('Please upload your receipt and enter transaction ID');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit();
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-4"
        >
          <FiChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payment & Confirmation</h1>
          <p className="text-gray-600 text-sm">Upload your payment receipt to confirm your booking.</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-xl text-gray-800 mb-4">Payment Details</h3>
            
            <div className="space-y-4">
              {/* Bank Details Section */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="text-lg font-medium text-blue-800 mb-3 flex items-center">
                  <FiCreditCard className="mr-2" /> Bank Transfer
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
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
                </div>
              </div>

              {/* Mobile Money Section */}
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <h4 className="text-lg font-medium text-purple-800 mb-3 flex items-center">
                  <FiClock className="mr-2" /> Mobile Money
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-600">MTN Mobile Money</p>
                    <p className="text-gray-800 font-semibold">0244123456</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vodafone Cash</p>
                    <p className="text-gray-800 font-semibold">0200123456</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Transaction ID
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter your transaction reference number"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Receipt
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
                <div className="space-y-1 text-center">
                  {receiptFile ? (
                    <div className="flex flex-col items-center">
                      <FiCheck className="mx-auto h-12 w-12 text-green-500" />
                      <p className="text-sm text-gray-600 mt-2 font-medium">
                        {receiptFile.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => setReceiptFile(null)}
                        className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
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
                          className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
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
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 bg-indigo-600 text-white rounded-xl font-medium flex items-center justify-center transition-colors shadow-lg
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'}`
              }
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
          </form>
        </div>
        
        {/* Appointment Summary Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="font-bold text-xl text-gray-800 mb-4">Appointment Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Salon</span>
              <span className="font-semibold text-gray-900">{salon.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Service</span>
              <span className="font-semibold text-gray-900">{service.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date</span>
              <span className="font-semibold text-gray-900">
                {new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Time</span>
              <span className="font-semibold text-gray-900">{slot.time}</span>
            </div>
            <div className="border-t border-dashed border-gray-200 my-4"></div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Price</span>
              <span className="font-medium text-gray-800">${service.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium text-gray-800">$2.50</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span className="text-gray-800">Total</span>
              <span className="text-indigo-600">${(service.price + 2.50).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirmation Step Component
const ConfirmationStep = ({ salon, service, slot, onComplete }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-2xl mx-auto p-10 text-center">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6"
      >
        <FiCheck className="h-10 w-10 text-green-600" />
      </motion.div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Appointment Confirmed!</h1>
      <p className="text-gray-600 mb-8">Your booking has been successfully placed and is pending verification.</p>
      
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 text-left">
        <h2 className="font-bold text-xl text-gray-800 mb-4">Appointment Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Salon</span>
            <span className="font-medium text-gray-900">{salon.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service</span>
            <span className="font-medium text-gray-900">{service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time</span>
            <span className="font-medium text-gray-900 text-right">
              {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              <br />
              {slot.time}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Paid</span>
            <span className="font-bold text-indigo-600">${(service.price + 2.50).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors font-medium">
          Add to Calendar
        </button>
        <button 
          onClick={onComplete}
          className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors font-medium shadow-md"
        >
          Book Another Service
        </button>
      </div>
    </div>
  );
};

export default SalonsContent;
