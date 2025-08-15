'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { 
  FiSearch, 
  FiStar, 
  FiMapPin, 
  FiClock, 
  FiChevronLeft, 
  FiCheck, 
  FiHeart, 
  FiCalendar,
  FiX
} from "react-icons/fi";

const SalonsContent = () => {
  // Flow states
  const [flowStep, setFlowStep] = useState("salons");
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [favoriteSalons, setFavoriteSalons] = useState([]);
  const [salons, setSalons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);

  // Fetch salons data
  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const response = await fetch('/api/user/salons');
        const data = await response.json();
        setSalons(data);
      } catch (error) {
        console.error('Error fetching salons:', error);
        setAlertMessage('Failed to load salons');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/user/salons/favorite');
        const data = await response.json();
        setFavoriteSalons(data?.map(fav => fav.salon_id));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchSalons();
    fetchFavorites();
  }, []);

  // Toggle favorite status
  const handleToggleFavorite = async (salonId) => {
    try {
      const isFavorite = favoriteSalons.includes(salonId);
      
      const response = await fetch('/api/user/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ salonId })
      });
      
      if (response.ok) {
        setFavoriteSalons(prev => 
          isFavorite 
            ? prev.filter(id => id !== salonId)
            : [...prev, salonId]
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setAlertMessage('Failed to update favorite');
    }
  };

  const handleSalonSelect = async (salon) => {
    try {
      // Fetch services for this salon
      const response = await fetch(`/api/user/salons/${salon.id}/services`);
      const services = await response.json();
      
      setSelectedSalon({
        ...salon,
        services
      });
      setFlowStep("services");
    } catch (error) {
      console.error('Error fetching services:', error);
      setAlertMessage('Failed to load services');
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setFlowStep("slots");
  };

  const handleSlotSelect = async (date, time) => {
    try {
      setSelectedSlot({ date, time });
      
      // Create appointment
      const response = await fetch('/api/user/appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          salon_id: selectedSalon.id,
          services_id: selectedService.id,
          date,
          time
        })
      });

      if (response.ok) {
        setFlowStep("confirmation");
      } else {
        throw new Error('Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      setAlertMessage('Failed to book appointment');
    }
  };

  const handleBack = () => {
    if (flowStep === "services") setFlowStep("salons");
    if (flowStep === "slots") setFlowStep("services");
  };

  const handleCustomAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 font-sans">
      <div className="max-w-6xl mx-auto px-4">
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

// Salon List Component
const SalonList = ({ salons, onSelect, favoriteSalons, onToggleFavorite }) => {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSalons = salons && salons.length>0? salons?.filter(salon => {
    const isFavorite = favoriteSalons.includes(salon.id);
    const matchesSearch = salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         salon.address.toLowerCase().includes(searchQuery.toLowerCase());
    return (!showFavoritesOnly || isFavorite) && matchesSearch;
  }):null;

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
        {filteredSalons?.length > 0 ? filteredSalons.map(salon => (
          <motion.div 
            key={salon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group relative"
          >
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

            <div onClick={() => onSelect(salon)} className="cursor-pointer">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <Image
                  src={salon.image || '/salon-default.jpg'}
                  alt={salon.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 flex items-center bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                  <FiMapPin className="text-indigo-600 mr-1" />
                  <span>{salon.distance || 'Nearby'}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-xl text-gray-800">{salon.name}</h4>
                  <div className="flex items-center bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                    <FiStar className="mr-1 fill-current text-yellow-400 stroke-yellow-400" />
                    <span>{salon.rating || '4.5'}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-3">{salon.address}</p>
                
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
const SlotSelection = ({ salon, service, onSelect, onBack, showAlert }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState({});
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);

  // Fetch available slots when component mounts
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch(`/api/salons/${salon.id}/slots`);
        const data = await response.json();
        setAvailableSlots(data);
        
        // Set the first available date as default
        const dates = Object.keys(data);
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
        showAlert('Failed to load available slots');
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [salon.id, showAlert]);

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
      
      {isLoadingSlots ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <div className="flex space-x-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {Object.keys(availableSlots).map(date => (
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
          
          {selectedDate && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {availableSlots[selectedDate]?.map(time => (
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
          )}
        </>
      )}
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
      <p className="text-gray-600 mb-8">Your booking has been successfully placed.</p>
      
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
            <span className="text-gray-600">Total</span>
            <span className="font-bold text-indigo-600">${service.price}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-3">
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