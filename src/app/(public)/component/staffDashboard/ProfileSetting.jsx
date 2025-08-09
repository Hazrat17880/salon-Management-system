import React, { useState } from 'react';

const ProfileSetting = () => {
  const [profileData, setProfileData] = useState({
    salonName: "Beauty Haven Salon",
    address: "123 Main Street",
    city: "New York",
    province: "NY",
    country: "USA",
    postalCode: "10001",
    ownerName: "Sarah Johnson",
    cnicNumber: "12345-6789012-3",
    cnicExpiry: "2025-12-31",
    licenseNumber: "SAL-2020-1234",
    salonPhoneNumber: "(555) 123-4567",
    email: "contact@beautyhavensalon.com",
    daysAvailable: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    openingTime: "09:00",
    closingTime: "19:00",
    bio: "A premium salon offering haircuts, coloring, and spa services since 2010."
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // API call to save data would go here
  };

  const handleDayToggle = (day) => {
    const updatedDays = profileData.daysAvailable.includes(day)
      ? profileData.daysAvailable.filter(d => d !== day)
      : [...profileData.daysAvailable, day];
    
    setProfileData({
      ...profileData,
      daysAvailable: updatedDays
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Salon Profile
      </h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-medium">Salon Information</h3>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Edit Profile
            </button>
          ) : null}
        </div>
        
        <div className="p-4 space-y-6">
          {isEditing ? (
            <>
              {/* Salon Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salon Name
                    </label>
                    <input
                      type="text"
                      value={profileData.salonName}
                      onChange={(e) => setProfileData({...profileData, salonName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salon Description
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  ></textarea>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Address</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Province/State
                    </label>
                    <input
                      type="text"
                      value={profileData.province}
                      onChange={(e) => setProfileData({...profileData, province: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={profileData.country}
                      onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={profileData.postalCode}
                      onChange={(e) => setProfileData({...profileData, postalCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salon Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.salonPhoneNumber}
                      onChange={(e) => setProfileData({...profileData, salonPhoneNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Owner Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      value={profileData.ownerName}
                      onChange={(e) => setProfileData({...profileData, ownerName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNIC Number
                    </label>
                    <input
                      type="text"
                      value={profileData.cnicNumber}
                      onChange={(e) => setProfileData({...profileData, cnicNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNIC Expiry Date
                    </label>
                    <input
                      type="date"
                      value={profileData.cnicExpiry}
                      onChange={(e) => setProfileData({...profileData, cnicExpiry: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Number
                    </label>
                    <input
                      type="text"
                      value={profileData.licenseNumber}
                      onChange={(e) => setProfileData({...profileData, licenseNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Business Hours</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days Available
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <div key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          id={day}
                          checked={profileData.daysAvailable.includes(day)}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opening Time
                    </label>
                    <input
                      type="time"
                      value={profileData.openingTime}
                      onChange={(e) => setProfileData({...profileData, openingTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Closing Time
                    </label>
                    <input
                      type="time"
                      value={profileData.closingTime}
                      onChange={(e) => setProfileData({...profileData, closingTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* View Mode */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Salon Name</p>
                      <p className="text-lg">{profileData.salonName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-lg">{profileData.email}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">Salon Description</p>
                    <p className="text-lg whitespace-pre-line">{profileData.bio}</p>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Address</h4>
                  <div className="space-y-1">
                    <p className="text-lg">{profileData.address}</p>
                    <p className="text-lg">{`${profileData.city}, ${profileData.province}`}</p>
                    <p className="text-lg">{profileData.country} {profileData.postalCode}</p>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Contact</h4>
                  <p className="text-lg">{profileData.salonPhoneNumber}</p>
                </div>

                {/* Owner Information */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Owner Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Owner Name</p>
                      <p className="text-lg">{profileData.ownerName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">CNIC Number</p>
                      <p className="text-lg">{profileData.cnicNumber}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">CNIC Expiry</p>
                      <p className="text-lg">{profileData.cnicExpiry}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">License Number</p>
                      <p className="text-lg">{profileData.licenseNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Business Hours</h4>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Open Days</p>
                    <p className="text-lg">{profileData.daysAvailable.join(', ')}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Opening Time</p>
                      <p className="text-lg">{profileData.openingTime}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Closing Time</p>
                      <p className="text-lg">{profileData.closingTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {isEditing && (
          <div className="p-4 border-t flex justify-end space-x-3">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium text-red-600">Danger Zone</h3>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Delete Salon Profile</p>
              <p className="text-sm text-gray-500">
                Permanently delete your salon profile and all data
              </p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md">
              Delete Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;