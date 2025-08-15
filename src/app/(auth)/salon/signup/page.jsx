"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight, FaCheck, FaBuilding, FaUser, FaLock, FaPhone, FaMapMarkerAlt, FaClock, FaIdCard, FaFileAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/cookiesAction";

export default function SalonSignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    salon_name: "",
    owner_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    street_info: "",
    city: "",
    state: "",
    country: "United States",
    postal_code: "",
    days: "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
    opening_hours: "09:00-18:00",
    description: "",
    id_card: null,
    license: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);
  };

  const nextStep = () => {
    let isValid = true;
    let errorMessage = "";

    switch (step) {
      case 1:
        if (!formData.salon_name || !formData.owner_name || !formData.email) {
          isValid = false;
          errorMessage = "Please fill in all required fields";
        } else if (!validateEmail(formData.email)) {
          isValid = false;
          errorMessage = "Please enter a valid email address";
        }
        break;
      case 2:
        if (!formData.phone_number || !formData.street_info || !formData.city || !formData.state) {
          isValid = false;
          errorMessage = "Please fill in all required fields";
        } else if (!validatePhone(formData.phone_number)) {
          isValid = false;
          errorMessage = "Please enter a valid phone number";
        }
        break;
      case 3:
        if (!formData.password || !formData.confirmPassword) {
          isValid = false;
          errorMessage = "Please fill in both password fields";
        } else if (formData.password.length < 8) {
          isValid = false;
          errorMessage = "Password must be at least 8 characters";
        } else if (formData.password !== formData.confirmPassword) {
          isValid = false;
          errorMessage = "Passwords do not match";
        }
        break;
      default:
        break;
    }

    if (!isValid) {
      toast.error(errorMessage);
      return;
    }

    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.id_card || !formData.license) {
      toast.error("Please upload both required documents");
      return;
    }
    
    if (!acceptTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    
    setIsLoading(true);
    
    const form = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'id_card' || key === 'license') {
        if (formData[key]) {
          form.append(key, formData[key]);
        }
      } else if (formData[key] !== null && key !== 'confirmPassword') {
        form.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('/api/auth/salons/register', {
        method: 'POST',
        body: form,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Registration successful! Please check your email for verification.');
        router.push('/salon/otp-verification');
      } else {
        toast.error(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    let token = getAuthToken('salon')
    if(token){
      router.push('/salon-dashboard/')
    }
  },[])
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-2 bg-gray-200">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FaBuilding className="text-white text-2xl" />
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold text-gray-800 mb-2"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Salon Registration
            </motion.h2>
            <motion.p 
              className="text-gray-500"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Step {step} of 4
            </motion.p>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salon Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="salon_name"
                        value={formData.salon_name}
                        onChange={handleChange}
                        placeholder="Salon Elegance"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      <FaBuilding className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Owner Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="owner_name"
                        value={formData.owner_name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="contact@salon.com"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 absolute left-3 top-3.5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="+1 555 555 5555"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="street_info"
                        value={formData.street_info}
                        onChange={handleChange}
                        placeholder="123 Beauty Street"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="New York"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="NY"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        placeholder="10001"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Days
                    </label>
                    <select
                      name="days"
                      value={formData.days}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="Monday,Tuesday,Wednesday,Thursday,Friday,Saturday">Monday - Saturday</option>
                      <option value="Monday,Tuesday,Wednesday,Thursday,Friday">Monday - Friday</option>
                      <option value="Tuesday,Wednesday,Thursday,Friday,Saturday">Tuesday - Saturday</option>
                      <option value="Monday,Wednesday,Friday,Saturday">Mon, Wed, Fri, Sat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opening Hours
                    </label>
                    <div className="relative">
                      <select
                        name="opening_hours"
                        value={formData.opening_hours}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                      >
                        <option value="09:00-18:00">9:00 AM - 6:00 PM</option>
                        <option value="10:00-19:00">10:00 AM - 7:00 PM</option>
                        <option value="08:00-17:00">8:00 AM - 5:00 PM</option>
                        <option value="custom">Custom Hours</option>
                      </select>
                      <FaClock className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salon Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Tell us about your salon..."
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Create Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        minLength={8}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Must be at least 8 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Document Verification</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Please upload the required documents for verification. These will be used to verify your business.
                    </p>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Owner ID Card (Front) *
                          <span className="ml-1 text-xs text-gray-500">(Government issued ID)</span>
                        </label>
                        <div className="mt-1 flex items-center">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FaIdCard className="mb-3 text-gray-400 text-2xl" />
                              {formData.id_card ? (
                                <p className="text-sm text-gray-500">{formData.id_card.name}</p>
                              ) : (
                                <>
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    JPG, PNG or PDF (MAX. 5MB)
                                  </p>
                                </>
                              )}
                            </div>
                            <input
                              id="id_card"
                              name="id_card"
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleFileChange}
                              className="hidden"
                              required
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business License *
                          <span className="ml-1 text-xs text-gray-500">(Official business registration)</span>
                        </label>
                        <div className="mt-1 flex items-center">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FaFileAlt className="mb-3 text-gray-400 text-2xl" />
                              {formData.license ? (
                                <p className="text-sm text-gray-500">{formData.license.name}</p>
                              ) : (
                                <>
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    JPG, PNG or PDF (MAX. 5MB)
                                  </p>
                                </>
                              )}
                            </div>
                            <input
                              id="license"
                              name="license"
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleFileChange}
                              className="hidden"
                              required
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start pt-2">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={() => setAcceptTerms(!acceptTerms)}
                        required
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-gray-600">
                        I agree to the{' '}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  <FaChevronLeft className="mr-2" />
                  Back
                </motion.button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Next
                  <FaChevronRight className="ml-2" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <FaCheck className="ml-2" />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/salon/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}