"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  User, Mail, Phone, Calendar, MapPin, Lock, 
  Edit2, Check, X, Camera, ShieldCheck, ShieldAlert 
} from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    id: "",
    full_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    gender: "",
    address: "",
    image_url: null,
    is_verified: false,
    created_at: ""
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const router= useRouter();
  const fileInputRef = useRef(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        if(response.status===401){
          localStorage.clear();
          router.push("/user/signin")
        }
        if (data.success) {
          setProfileData(data.data);
        }

      } catch (error) {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

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

const handleProfileUpdate = async () => {
  try {
    const formData = new FormData();
    
    // Append text fields
    formData.append('full_name', profileData.full_name);
    formData.append('email', profileData.email);
    formData.append('gender', profileData.gender);
    formData.append('address', profileData.address);
    
    // Append image file if a new one was selected
    if (fileInputRef.current?.files[0]) {
      formData.append('image', fileInputRef.current.files[0]);
    }

    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      body: formData, // Don't set Content-Type header - the browser will set it automatically
    });

    const data = await response.json();
    if (data.success) {
      toast.success("Profile updated successfully");
      setProfileData(data.data);
      setShowEditModal(false);
      setImagePreview(null);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error("Failed to update profile");
    console.error("Update error:", error);
  }
};

  const handlePasswordUpdate = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const response = await fetch('/api/user/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Password updated successfully");
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: ""
        });
        setShowPasswordModal(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile View */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6" />
            <div>
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <p className="opacity-90">Manage your personal information and security</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Avatar */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="relative h-40 w-40 rounded-full bg-gray-100 mb-4 overflow-hidden border-4 border-white shadow-md">
                {profileData.image ? (
                  <Image
                    src={profileData.image}
                    alt={`${profileData.full_name}'s profile`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-indigo-100">
                    <span className="text-5xl font-bold text-indigo-600">
                      {profileData.full_name?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 w-full">
                <h3 className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  Account Status
                </h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${profileData.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {profileData.is_verified ? (
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      Pending Verification
                    </span>
                  )}
                </div>
                <p className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <Calendar className="w-4 h-4" />
                  Member since {new Date(profileData.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="w-full md:w-2/3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center gap-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ProfileFieldView
                    label="Full Name"
                    value={profileData.full_name}
                    icon={<User className="w-4 h-4 text-gray-400" />}
                  />
                  <ProfileFieldView
                    label="Email"
                    value={profileData.email}
                    icon={<Mail className="w-4 h-4 text-gray-400" />}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ProfileFieldView
                    label="Phone Number"
                    value={profileData.phone_number}
                    icon={<Phone className="w-4 h-4 text-gray-400" />}
                  />
                  <ProfileFieldView
                    label="Date of Birth"
                    value={profileData.date_of_birth}
                    icon={<Calendar className="w-4 h-4 text-gray-400" />}
                  />
                </div>

                <ProfileFieldView
                  label="Gender"
                  value={profileData.gender}
                  icon={<User className="w-4 h-4 text-gray-400" />}
                  capitalize
                />

                <ProfileFieldView
                  label="Address"
                  value={profileData.address}
                  icon={<MapPin className="w-4 h-4 text-gray-400" />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
                <button 
                  onClick={() => {
                    setShowEditModal(false);
                    setImagePreview(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <div className="relative h-40 w-40 rounded-full bg-gray-100 mb-4 overflow-hidden border-4 border-white shadow-md">
                    {imagePreview || profileData.image_url ? (
                      <Image
                        src={imagePreview || profileData.image_url}
                        alt={`${profileData.full_name}'s profile`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-indigo-100">
                        <span className="text-5xl font-bold text-indigo-600">
                          {profileData.full_name?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={triggerFileInput}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    Change Photo
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                <div className="w-full md:w-2/3">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ProfileFieldEdit
                        label="Full Name"
                        name="full_name"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                        icon={<User className="w-4 h-4 text-gray-400" />}
                      />
                      <ProfileFieldEdit
                        label="Email"
                        name="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        type="email"
                        icon={<Mail className="w-4 h-4 text-gray-400" />}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ProfileFieldEdit
                        label="Phone Number"
                        name="phone_number"
                        value={profileData.phone_number}
                        onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                        type="tel"
                        icon={<Phone className="w-4 h-4 text-gray-400" />}
                      />
                      <ProfileFieldEdit
                        label="Date of Birth"
                        name="date_of_birth"
                        value={profileData.date_of_birth}
                        onChange={(e) => setProfileData({...profileData, date_of_birth: e.target.value})}
                        type="date"
                        icon={<Calendar className="w-4 h-4 text-gray-400" />}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <select
                          value={profileData.gender}
                          onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                          className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <ProfileFieldEdit
                      label="Address"
                      name="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      textarea
                      icon={<MapPin className="w-4 h-4 text-gray-400" />}
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        setImagePreview(null);
                      }}
                      className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleProfileUpdate}
                      className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      <Check className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
                <button 
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <ProfileFieldEdit
                  label="Current Password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                  type="password"
                  icon={<Lock className="w-4 h-4 text-gray-400" />}
                />
                <ProfileFieldEdit
                  label="New Password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                  type="password"
                  icon={<Lock className="w-4 h-4 text-gray-400" />}
                />
                <ProfileFieldEdit
                  label="Confirm Password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                  type="password"
                  icon={<Lock className="w-4 h-4 text-gray-400" />}
                />
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handlePasswordUpdate}
                  className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Check className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileFieldView = ({ label, value, icon, capitalize = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">
        {label}
      </label>
      <p className={`flex items-center gap-2 text-gray-900 ${capitalize ? 'capitalize' : ''}`}>
        {icon}
        {value || "Not provided"}
      </p>
    </div>
  );
};

const ProfileFieldEdit = ({ label, name, value, onChange, type = "text", textarea = false, icon }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {textarea ? (
        <div className="relative">
          <div className="absolute top-3 left-3">
            {icon}
          </div>
          <textarea
            id={name}
            name={name}
            value={value || ""}
            onChange={onChange}
            rows={3}
            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
          </div>
          <input
            type={type}
            id={name}
            name={name}
            value={value || ""}
            onChange={onChange}
            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;