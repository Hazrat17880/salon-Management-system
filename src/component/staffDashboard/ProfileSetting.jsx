import React, { useState, useEffect } from 'react';
import { 
  FiEdit2, FiClock, FiMapPin, FiPhone, FiMail, 
  FiUser, FiCalendar, FiFileText, FiX, FiCheck 
} from 'react-icons/fi';
import { FaBusinessTime, FaRegCalendarAlt, FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const ProfileSetting = () => {
  const [profileData, setProfileData] = useState({
    salon_name: "",
    owner_name: "",
    email: "",
    phone_number: "",
    street_info: "",
    city: "",
    state: "",
    country: "United States",
    postal_code: "",
    days: "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
    opening_hours: "09:00-18:00",
    description: "",
    profile_image: null,
    id_card: null,
    license: null,
    is_verified: false,
    active: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [idCardFile, setIdCardFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/salons/profile');
      if(res.status === 401) {
        localStorage.clear();
        toast.info("Your session is expired.");
        router.push("/salon/signin");
      }
      const response = await res.json();

      if (response.success) {
        setProfileData(response.data);
        if (response.data.image) {
          setImagePreview(response.data.image);
        }
      } else {
        toast.error(response.message || 'Failed to fetch profile data');
      }
    } catch (error) {
      toast.error(error.response?.message || 'Failed to fetch profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      
      // Add all updatable fields
      Object.keys(profileData).forEach(key => {
        if (key !== 'profile_image' && key !== 'id_card' && key !== 'license') {
          formData.append(key, profileData[key]);
        }
      });

      if (profileImageFile) {
        formData.append('profile_image', profileImageFile);
      }
      if (idCardFile) {
        formData.append('id_card', idCardFile);
      }
      if (licenseFile) {
        formData.append('license', licenseFile);
      }

      const res = await fetch('/api/salons/profile', {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const response = await res.json();
      if (response.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        setProfileImageFile(null);
        setIdCardFile(null);
        setLicenseFile(null);
        fetchProfileData();
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error.response?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayToggle = (day) => {
    const daysArray = profileData.days ? profileData.days.split(',') : [];
    const updatedDays = daysArray.includes(day)
      ? daysArray.filter(d => d !== day)
      : [...daysArray, day];
    
    setProfileData({
      ...profileData,
      days: updatedDays.join(',')
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'profile_image') {
      setProfileImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (type === 'id_card') {
      setIdCardFile(file);
    } else {
      setLicenseFile(file);
    }
  };

  const formatOpeningHours = () => {
    if (!profileData.opening_hours) return "Not set";
    const [open, close] = profileData.opening_hours.split('-');
    return `${open} - ${close}`;
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <motion.div 
        className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Header with Image */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 h-48">
          <div className="absolute -bottom-16 left-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <FaCamera className="text-gray-500 text-3xl" />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer group-hover:opacity-100 transition">
                  <FaCamera className="text-indigo-600" />
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'profile_image')}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          
          <div className="absolute bottom-4 right-8">
            {!isEditing ? (
              <motion.button 
                onClick={() => setIsEditing(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-6 py-2 bg-white text-indigo-600 rounded-lg shadow-md hover:bg-gray-50 transition"
              >
                <FiEdit2 className="mr-2" />
                Edit Profile
              </motion.button>
            ) : (
              <div className="flex space-x-4">
                <motion.button 
                  onClick={() => {
                    setIsEditing(false);
                    setProfileImageFile(null);
                    setIdCardFile(null);
                    setLicenseFile(null);
                    fetchProfileData();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  <FiX className="mr-2" />
                  Cancel
                </motion.button>
                <motion.button 
                  onClick={handleSave}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                  className={`flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-2" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          {/* Salon Name and Verification Status */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{profileData.salon_name}</h1>
              <div className="flex items-center mt-2">
                <div className={`h-3 w-3 rounded-full mr-2 ${profileData.is_verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-gray-600">
                  {profileData.is_verified ? 'Verified Salon' : 'Pending Verification'}
                </span>
              </div>
            </div>
            {profileData.is_verified && (
              <div className="mt-4 md:mt-0 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                <FiCheck className="inline mr-1" />
                Verified Account
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiUser className="mr-2 text-indigo-600" />
                  Salon Information
                </h2>
                
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Salon Name *
                        </label>
                        <input
                          type="text"
                          value={profileData.salon_name}
                          onChange={(e) => setProfileData({...profileData, salon_name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salon Description
                      </label>
                      <textarea
                        value={profileData.description}
                        onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="Tell customers about your salon..."
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Owner Name *
                        </label>
                        <input
                          type="text"
                          value={profileData.owner_name}
                          onChange={(e) => setProfileData({...profileData, owner_name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone_number}
                          onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Owner</p>
                        <p className="text-lg text-gray-800">{profileData.owner_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-lg text-gray-800">{profileData.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-lg text-gray-800">{profileData.phone_number}</p>
                    </div>
                    {profileData.description && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">About</p>
                        <p className="text-gray-800 whitespace-pre-line">{profileData.description}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Address Section */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiMapPin className="mr-2 text-indigo-600" />
                  Address
                </h2>
                
                {isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={profileData.street_info}
                        onChange={(e) => setProfileData({...profileData, street_info: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={profileData.city}
                          onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={profileData.state}
                          onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <select
                          value={profileData.country}
                          onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={profileData.postal_code}
                          onChange={(e) => setProfileData({...profileData, postal_code: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg text-gray-800">{profileData.street_info}</p>
                    <p className="text-lg text-gray-800">{profileData.city}, {profileData.state}</p>
                    <p className="text-lg text-gray-800">{profileData.country} {profileData.postal_code}</p>
                  </div>
                )}
              </motion.div>

              {/* Business Hours */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FaBusinessTime className="mr-2 text-indigo-600" />
                  Business Hours
                </h2>
                
                {isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Days Open
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
                        {daysOfWeek.map(day => (
                          <div key={day} className="flex items-center">
                            <input
                              type="checkbox"
                              id={day}
                              checked={profileData.days?.includes(day)}
                              onChange={() => handleDayToggle(day)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor={day} className="ml-2 block text-sm text-gray-700">
                              {day.substring(0, 3)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opening Hours (e.g., 09:00-18:00) *
                      </label>
                      <select
                        value={profileData.opening_hours}
                        onChange={(e) => setProfileData({...profileData, opening_hours: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                      >
                        <option value="09:00-18:00">9:00 AM - 6:00 PM</option>
                        <option value="10:00-19:00">10:00 AM - 7:00 PM</option>
                        <option value="08:00-17:00">8:00 AM - 5:00 PM</option>
                        <option value="09:00-17:00">9:00 AM - 5:00 PM</option>
                        <option value="10:00-18:00">10:00 AM - 6:00 PM</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Days Open</p>
                      <p className="text-lg text-gray-800">
                        {profileData.days ? profileData.days.split(',').join(', ') : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Opening Hours</p>
                      <p className="text-lg text-gray-800">{formatOpeningHours()}</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Documents Section */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiFileText className="mr-2 text-indigo-600" />
                  Documents
                </h2>
                
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ID Card *
                        </label>
                        <div className="flex items-center">
                          {profileData.id_card && !idCardFile && (
                            <a 
                              href={profileData.id_card} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline mr-4 text-sm"
                            >
                              View Current
                            </a>
                          )}
                          <div className="flex-1">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FiFileText className="mb-3 text-gray-400 text-2xl" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span>
                                </p>
                                <p className="text-xs text-gray-500">
                                  JPG, PNG or PDF (MAX. 5MB)
                                </p>
                              </div>
                              <input
                                type="file"
                                onChange={(e) => handleFileChange(e, 'id_card')}
                                accept="image/*,.pdf"
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business License *
                        </label>
                        <div className="flex items-center">
                          {profileData.license && !licenseFile && (
                            <a 
                              href={profileData.license} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline mr-4 text-sm"
                            >
                              View Current
                            </a>
                          )}
                          <div className="flex-1">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FiFileText className="mb-3 text-gray-400 text-2xl" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span>
                                </p>
                                <p className="text-xs text-gray-500">
                                  JPG, PNG or PDF (MAX. 5MB)
                                </p>
                              </div>
                              <input
                                type="file"
                                onChange={(e) => handleFileChange(e, 'license')}
                                accept="image/*,.pdf"
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">ID Card</p>
                      {profileData.id_card ? (
                        <a 
                          href={profileData.id_card} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-indigo-600 hover:underline"
                        >
                          <FiFileText className="mr-2" />
                          View Document
                        </a>
                      ) : (
                        <p className="text-gray-500">Not uploaded</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Business License</p>
                      {profileData.license ? (
                        <a 
                          href={profileData.license} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-indigo-600 hover:underline"
                        >
                          <FiFileText className="mr-2" />
                          View Document
                        </a>
                      ) : (
                        <p className="text-gray-500">Not uploaded</p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Verification Status and Danger Zone */}
            <div className="space-y-8">
              {/* Verification Status */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiCheck className="mr-2 text-green-600" />
                  Verification Status
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className={`h-4 w-4 rounded-full mr-3 ${profileData.is_verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <p className="text-gray-800">
                      {profileData.is_verified ? 'Your salon is verified' : 'Your salon is pending verification'}
                    </p>
                  </div>
                  
                  {!profileData.is_verified && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Verification usually takes 1-2 business days after document submission.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Danger Zone */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-red-100 p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Deleting your salon account will remove all your data permanently. This action cannot be undone.
                    </p>
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete your salon account? This action cannot be undone.')) {
                          // Handle account deletion
                        }
                      }}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center"
                    >
                      <FiX className="mr-2" />
                      Delete Salon Account
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSetting;