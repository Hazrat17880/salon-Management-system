'use client';
import { useState, useEffect, Suspense } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaCheck, FaClock, FaMapMarkerAlt, FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getAuthToken } from '@/lib/cookiesAction';
import { useParams, useRouter } from 'next/navigation';

const SalonBookingPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [salonData, setSalonData] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('services');
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appointmentModal, setAppointmentModal] = useState(false);

  // Check authentication status
  useEffect(() => {
    const token = getAuthToken('user');
    setIsLoggedIn(!!token);
  }, []);

  // Fetch salon data from API
  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        setLoading(true);
        const token = getAuthToken('user');
        
        const response = await fetch(`/api/public/salon/?id=${id}`, {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {}
        });

        if (!response.ok) {
          throw new Error('Failed to fetch salon data');
        }

        const data = await response.json();
        
        if (data.success) {
          setSalonData(data.data);
          setIsFavorite(data.data.favorite && data.data.favorite.length > 0);
        } else {
          throw new Error(data.message || 'Failed to load salon data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSalonData();
    }
  }, [id]);

  // Toggle favorite status
  const toggleFavorite = async () => {
    try {
      const token = getAuthToken('user');
      
      if (!token) {
        // Redirect to login if not authenticated
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        router.push('/user/signin');
        return;
      }

      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          salon_id: id,
          action: isFavorite ? 'remove' : 'add'
        })
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Handle service click - check authentication
  const handleServiceClick = (service) => {
    if (!isLoggedIn) {
      // Store the intended destination before redirecting to login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      router.push('/user/signin');
      return;
    }
    
    setSelectedService(service);
    setAppointmentModal(true);
  };

  // Handle booking submission
  const handleBookAppointment = async () => {
    setIsLoading(true);
    try {
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
        body: JSON.stringify({
          salon_id: id,
          service_id: selectedService.id,
          date: appointmentDate,
          time: appointmentTime
        })
      });

      if (response.status === 401) {
        router.push("/user/signin");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed");
      }

      // Close modal and reset state on success
      setAppointmentModal(false);
      setSelectedService(null);
      setAppointmentDate('');
      setAppointmentTime('');
      
      // Show success message
      alert("Appointment booked successfully!");
      
      return result;
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.message || "Failed to book appointment");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading salon details...</p>
        </div>
      </div>
    );
  }

  if (error || !salonData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-4">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-lg text-gray-600 mb-6">
            {error || "Salon not found"}
          </p>
          <Link
            href="/salons"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300"
          >
            Browse Salons
          </Link>
        </div>
      </div>
    );
  }

  const { salon, services, staff } = salonData;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Appointment Booking Modal */}
      {appointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setAppointmentModal(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <h3 className="text-xl font-bold mb-4">Book Appointment</h3>
            
            {selectedService && (
              <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-2">Service: {selectedService.name}</h4>
                <p className="text-indigo-600">Price: ${selectedService.final_price || selectedService.price}</p>
                <p className="text-indigo-600">Duration: {selectedService.duration_minutes} min</p>
              </div>
            )}
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border rounded-lg p-2"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Time</label>
                <input
                  type="time"
                  className="w-full border rounded-lg p-2"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                />
              </div>
              <button
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50"
                onClick={handleBookAppointment}
                disabled={!appointmentDate || !appointmentTime || isLoading}
              >
                {isLoading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Salon Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-full md:w-1/3 h-64 rounded-xl overflow-hidden">
              <Image 
                src={salon.image || "/images/salon-placeholder.jpg"} 
                alt={"salon image"}
                fill
                className="object-cover"
              />
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              >
                {isFavorite ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FaRegHeart className="text-gray-600 text-xl" />
                )}
              </button>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{salon.name}</h1>
                  <div className="flex items-center mt-2 text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-red-400" />
                    <span>{salon.city}, {salon.country}</span>
                  </div>
                </div>
                <div className="flex items-center bg-indigo-50 px-3 py-1 rounded-full">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="font-medium">{salon.rating || 4.5}</span>
                  <span className="text-gray-500 ml-1">({salon.review_count || 0})</span>
                </div>
              </div>
              
              <p className="mt-4 text-gray-600">{salon.description || "Premium salon services"}</p>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Opening Hours</h4>
                  <p className="font-medium">9:00 AM - 8:00 PM</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact</h4>
                  <p className="font-medium">{salon.phone || salon.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
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
          </nav>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Available Services</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map(service => (
                <motion.div 
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-5 border border-gray-200 rounded-xl transition-all hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mr-4">
                        <img src={service.image_url} className='h-12 w-12'/>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{service.name}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FaClock className="mr-1" />
                          <span>{service.duration_minutes} min</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-indigo-600">${service.final_price || service.price}</span>
                  </div>
                  
                  <button
                    onClick={() => handleServiceClick(service)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Book Appointment
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Our Professional Staff</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {staff.map((person, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <Image 
                      src={person.image || "/images/staff-placeholder.jpg"}
                      alt={person.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-gray-800">{person.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{person.role || "Beauty Specialist"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

     
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading salon details...</p>
        </div>
      </div>
    }>
      <SalonBookingPage />
    </Suspense>
  );
}