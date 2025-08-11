"use client";
import { useState, useRef } from "react";
import Image from "next/image";

const ProfileContent = ({ profileData, setProfileData }) => {
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(profileData.image || null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // In a real app, you would upload the image here
    if (imagePreview && imagePreview !== profileData.image) {
      setProfileData({
        ...profileData,
        image: imagePreview // This would be the uploaded URL in production
      });
    }
    setEditing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h3 className="text-lg font-semibold text-gray-800">My Profile</h3>
        {editing ? (
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <button 
              onClick={() => {
                setEditing(false);
                setImagePreview(profileData.image || null);
              }}
              className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm md:text-base"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-3 py-1 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm md:text-base"
            >
              Save
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setEditing(true)}
            className="px-3 py-1 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm md:text-base"
          >
            Edit Profile
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="flex flex-col items-center">
          <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full bg-gray-100 flex items-center justify-center mb-3 md:mb-4 overflow-hidden">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt={`${profileData.name}'s profile`}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="text-3xl md:text-4xl font-bold text-indigo-600">
                {profileData.name.charAt(0)}
              </span>
            )}
          </div>
          {editing && (
            <>
              <button 
                onClick={triggerFileInput}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Change Photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </>
          )}
        </div>
        
        <div className="space-y-3 md:space-y-4">
          <ProfileField 
            label="Full Name" 
            value={profileData.name} 
            editing={editing}
            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
          />
          <ProfileField 
            label="Email" 
            value={profileData.email} 
            editing={editing}
            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
          />
          <ProfileField 
            label="Phone" 
            value={profileData.phone} 
            editing={editing}
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
          />
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
            <p className="text-gray-800">{profileData.joined}</p>
          </div>
        </div>
      </div>
      
      {editing && (
        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
          <h4 className="text-md font-semibold text-gray-800 mb-3 md:mb-4">Change Password</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 md:px-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 md:px-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileField = ({ label, value, editing, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      {editing ? (
        <input 
          type="text" 
          value={value} 
          onChange={onChange}
          className="w-full px-3 py-2 md:px-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      ) : (
        <p className="text-gray-800">{value}</p>
      )}
    </div>
  );
};

export default ProfileContent;