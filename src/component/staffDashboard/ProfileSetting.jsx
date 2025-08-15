import React, { useState, useEffect } from 'react';
import { FiEdit2, FiClock, FiMapPin, FiPhone, FiMail, FiUser, FiCalendar, FiFileText } from 'react-icons/fi';
import { FaBusinessTime, FaRegCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProfileSetting = () => {
  const [profileData, setProfileData] = useState({
    salon_name: "",
    owner_name: "",
    email: "",
    phone_number: "",
    street_info: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    days: "",
    opening_hours: "",
    description: "",
    id_card: null,
    license: null,
    is_verified: false,
    active: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [idCardFile, setIdCardFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/salons/profile');
      const response = await res.json()
      console.log(response, 'the response data is');

      if (response.success) {
        setProfileData(response.data);
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
      formData.append('salon_name', profileData.salon_name);
      formData.append('owner_name', profileData.owner_name);
      formData.append('phone_number', profileData.phone_number);
      formData.append('street_info', profileData.street_info);
      formData.append('city', profileData.city);
      formData.append('state', profileData.state);
      formData.append('country', profileData.country);
      formData.append('postal_code', profileData.postal_code);
      formData.append('days', profileData.days);
      formData.append('opening_hours', profileData.opening_hours);
      formData.append('description', profileData.description);
    formData.append('id_card', profileData.id_card)
    formData.append('license', profileData.license)
      if (idCardFile) {
        formData.append('id_card', idCardFile);
      }
      
      if (licenseFile) {
        formData.append('license', licenseFile);
      }

      const res = await fetch('/api/salons/profile', formData, {
         method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      const response = await res.json();
      if (response.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
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
    if (type === 'id_card') {
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Salon Profile
          </h2>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
            >
              <FiEdit2 className="mr-2" />
              Edit Profile
            </button>
          ) : null}
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-800">Salon Information</h3>
          </div>
          
          <div className="p-6 space-y-8">
            {isEditing ? (
              <>
                {/* Salon Basic Information */}
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-800 flex items-center">
                    <FiUser className="mr-2" />
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salon Name
                      </label>
                      <input
                        type="text"
                        value={profileData.salon_name}
                        onChange={(e) => setProfileData({...profileData, salon_name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
                    ></textarea>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-800 flex items-center">
                    <FiMapPin className="mr-2" />
                    Address
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={profileData.street_info}
                      onChange={(e) => setProfileData({...profileData, street_info: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={profileData.state}
                        onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={profileData.country}
                        onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
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

                {/* Contact Information */}
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-800 flex items-center">
                    <FiPhone className="mr-2" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone_number}
                        onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Owner Information */}
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-800 flex items-center">
                    <FiUser className="mr-2" />
                    Owner Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Owner Name
                      </label>
                      <input
                        type="text"
                        value={profileData.owner_name}
                        onChange={(e) => setProfileData({...profileData, owner_name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-800 flex items-center">
                    <FiFileText className="mr-2" />
                    Documents
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ID Card
                      </label>
                      <div className="flex items-center">
                        {profileData.id_card && !idCardFile && (
                          <a 
                            href={profileData.id_card} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline mr-4"
                          >
                            View Current
                          </a>
                        )}
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'id_card')}
                          accept="image/*,.pdf"
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business License
                      </label>
                      <div className="flex items-center">
                        {profileData.license && !licenseFile && (
                          <a 
                            href={profileData.license} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline mr-4"
                          >
                            View Current
                          </a>
                        )}
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'license')}
                          accept="image/*,.pdf"
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-800 flex items-center">
                    <FaBusinessTime className="mr-2" />
                    Business Hours
                  </h4>
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
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opening Hours (e.g., 09:00-18:00)
                      </label>
                      <input
                        type="text"
                        value={profileData.opening_hours}
                        onChange={(e) => setProfileData({...profileData, opening_hours: e.target.value})}
                        placeholder="09:00-18:00"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <FiUser className="mr-2" />
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Salon Name</p>
                        <p className="text-lg text-gray-900">{profileData.salon_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
                        <p className="text-lg text-gray-900">{profileData.email}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                      <p className="text-lg text-gray-900 whitespace-pre-line">{profileData.description}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <FiMapPin className="mr-2" />
                      Address
                    </h4>
                    <div className="space-y-2">
                      <p className="text-lg text-gray-900">{profileData.street_info}</p>
                      <p className="text-lg text-gray-900">{`${profileData.city}, ${profileData.state}`}</p>
                      <p className="text-lg text-gray-900">{profileData.country} {profileData.postal_code}</p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <FiPhone className="mr-2" />
                      Contact
                    </h4>
                    <p className="text-lg text-gray-900">{profileData.phone_number}</p>
                  </div>

                  {/* Owner Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <FiUser className="mr-2" />
                      Owner Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Owner Name</p>
                        <p className="text-lg text-gray-900">{profileData.owner_name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <FiFileText className="mr-2" />
                      Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">ID Card</p>
                        {profileData.id_card ? (
                          <a 
                            href={profileData.id_card} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                          >
                            View Document
                          </a>
                        ) : (
                          <p className="text-gray-500">Not uploaded</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Business License</p>
                        {profileData.license ? (
                          <a 
                            href={profileData.license} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                          >
                            View Document
                          </a>
                        ) : (
                          <p className="text-gray-500">Not uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <FaBusinessTime className="mr-2" />
                      Business Hours
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Days Open</p>
                        <p className="text-lg text-gray-900">
                          {profileData.days ? profileData.days.split(',').join(', ') : 'Not set'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Opening Hours</p>
                        <p className="text-lg text-gray-900">{formatOpeningHours()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                      Verification Status
                    </h4>
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full mr-2 ${profileData.is_verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <p className="text-lg text-gray-900">
                        {profileData.is_verified ? 'Verified' : 'Pending Verification'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {isEditing && (
            <div className="p-6 border-t flex justify-end space-x-4 bg-gray-50">
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setIdCardFile(null);
                  setLicenseFile(null);
                  fetchProfileData();
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
                disabled={isLoading}
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
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b bg-red-50">
            <h3 className="text-xl font-semibold text-red-600">Danger Zone</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div>
                <p className="font-medium text-gray-800">Delete Salon Account</p>
                <p className="text-sm text-gray-500 mt-1">
                  Permanently delete your salon account and all associated data. This action cannot be undone.
                </p>
              </div>
              <button 
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your salon account? This action cannot be undone.')) {
                    // Handle account deletion
                  }
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;