"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MapPin, Phone, Scissors, X, MessageCircle, AlertTriangle, Users, Clock, User, Calendar, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function SalonDetails() {
  const { id } = useParams();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [activeTab, setActiveTab] = useState("services");
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState(false);

  const [complaintModal, setComplaintModal] = useState(false);
  const [complaintText, setComplaintText] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const ref = useRef(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/salons/salon/?id=${id}`);
      if (res.status === 401) {
        localStorage.clear();
        toast.warning("Your session is expired.");
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      console.log("your salone services are here :",data);

      if (data.success) {
        setSalon(data.data.salon);
        setServices(data.data.services);
        setStaff(data.data.staff || []);
        setFavorites(data.data.favorite);
      } else {
        toast.error(data.message || "Failed to load salon details");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching salon details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id, router]);

  const scrollToBottom = useCallback(() => {
    ref.current?.scrollIntoView();
  }, []);

  const submitComplaint = async () => {
    try {
      // Implement complaint submission logic here
      toast.success("Complaint submitted successfully");
      setComplaintModal(false);
      setComplaintText("");
      setComplaintType("");
    } catch (error) {
      toast.error("Failed to submit complaint");
    }
  };

  const sendMessage = async () => {
    try {
      // Implement message sending logic here
      if (newMessage.trim()) {
        const tempMessage = {
          id: Date.now(),
          message: newMessage,
          sender_type: "user",
          created_at: new Date()
        };
        setMessages([...messages, tempMessage]);
        setNewMessage("");
        scrollToBottom();
        
        // Simulate response after a delay
        setTimeout(() => {
          const responseMessage = {
            id: Date.now() + 1,
            message: "Thank you for your message. How can we help you?",
            sender_type: "salon",
            created_at: new Date()
          };
          setMessages(prev => [...prev, responseMessage]);
          scrollToBottom();
        }, 1000);
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleBookAppointment = async () => {
    try {
      // Implement appointment booking logic here
      toast.success("Appointment booked successfully!");
      setAppointmentModal(false);
      setAppointmentDate("");
      setAppointmentTime("");
    } catch (error) {
      toast.error("Failed to book appointment");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (!salon) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold mt-4">Salon not found</h2>
        <p className="text-gray-500 mt-2">The salon you're looking for doesn't exist.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Salon Header */}
      <motion.div
        className="relative bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative h-64 md:h-80">
          <img
            src={salon.image || "/default-salon.jpg"}
            alt={salon.salon_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Salon+Image";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{salon.salon_name}</h1>
              <div className="flex items-center text-gray-600 mt-2 gap-4 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin size={18} /> {salon.city}, {salon.country}
                </span>
               <span className="flex items-center gap-1">
  <Clock size={18} /> {salon.opening_hours}
</span>
               
              </div>
            </div>
            
        
          </div>
          
          <p className="mt-4 text-gray-700 leading-relaxed">{salon.description}</p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab("services")}
          className={`px-6 py-4 font-medium text-lg transition-colors ${
            activeTab === "services"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span className="flex items-center gap-2">
            <Scissors size={20} /> Services
          </span>
        </button>
        <button
          onClick={() => setActiveTab("staff")}
          className={`px-6 py-4 font-medium text-lg transition-colors ${
            activeTab === "staff"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span className="flex items-center gap-2">
            <Users size={20} /> Our Team
          </span>
        </button>
      </div>

      {/* Services Tab */}
      {activeTab === "services" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Our Services</h2>
          {services.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Scissors className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No services available yet</p>
              <p className="text-gray-400 mt-2">Check back later for our service offerings</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100"
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={service.image_url || "/default-service.jpg"}
                      alt={service.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Service";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-semibold">View Details</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-bold text-xl">${service.price}</span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock size={16} /> {service.duration || "30 min"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Staff Tab */}
      {activeTab === "staff" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Our Professional Team</h2>
          {staff.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No staff members available yet</p>
              <p className="text-gray-400 mt-2">Our team information will be available soon</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {staff.map((staffMember) => (
                <motion.div
                  key={staffMember.id}
                  className="bg-white rounded-2xl shadow-md p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100"
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedStaff(staffMember)}
                >
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-blue-100">
                    <img
                      src={staffMember.image || "/default-avatar.jpg"}
                      alt={staffMember.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150/3B82F6/FFFFFF?text=Staff";
                      }}
                    />
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{staffMember.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">Professional Stylist</p>
                  
                  <div className="text-xs text-gray-400">
                    Member since {new Date(staffMember.created_at).toLocaleDateString()}
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <span className="inline-flex items-center gap-1 text-sm text-blue-600">
                      <Star size={14} className="text-yellow-400" /> 4.9
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="relative">
              <img
                src={selectedService.image_url || "/default-service.jpg"}
                alt={selectedService.name}
                className="w-full h-48 object-cover"
              />
              <button
                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition"
                onClick={() => setSelectedService(null)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">{selectedService.name}</h3>
              <p className="text-gray-600 mb-4">{selectedService.description}</p>
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-blue-600 font-bold text-2xl">${selectedService.price}</span>
                  <span className="text-sm text-gray-500 ml-2">+ taxes</span>
                </div>
                <span className="text-gray-500 flex items-center gap-1">
                  <Clock size={18} /> {selectedService.duration || "30 min"}
                </span>
              </div>
              
             
            </div>
          </motion.div>
        </div>
      )}

      {/* Staff Details Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="p-6 text-center">
              <button
                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition"
                onClick={() => setSelectedStaff(null)}
              >
                <X size={20} />
              </button>
              
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-blue-100">
                <img
                  src={selectedStaff.image || "/default-avatar.jpg"}
                  alt={selectedStaff.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="text-2xl font-bold mb-2 text-gray-900">{selectedStaff.title}</h3>
              <p className="text-blue-600 font-medium mb-4">Senior Stylist</p>
              
              <div className="mb-6">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star size={18} className="text-yellow-400" />
                  <Star size={18} className="text-yellow-400" />
                  <Star size={18} className="text-yellow-400" />
                  <Star size={18} className="text-yellow-400" />
                  <Star size={18} className="text-yellow-400" />
                  <span className="text-gray-600 ml-2">4.9 (87 reviews)</span>
                </div>
                
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Specializes in haircuts and coloring</p>
                  <p>5+ years of experience</p>
                </div>
              </div>
              
              <div className="text-left text-sm text-gray-500 border-t pt-4">
                <p className="flex justify-between">
                  <span>Member since:</span>
                  <span className="text-gray-700">{new Date(selectedStaff.created_at).toLocaleDateString()}</span>
                </p>
                {selectedStaff.updated_at && (
                  <p className="flex justify-between mt-2">
                    <span>Last updated:</span>
                    <span className="text-gray-700">{new Date(selectedStaff.updated_at).toLocaleDateString()}</span>
                  </p>
                )}
              </div>
              
              <button
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
                onClick={() => {
                  setSelectedStaff(null);
                  setActiveTab("services");
                }}
              >
                View Available Services
              </button>
            </div>
          </motion.div>
        </div>
      )}

    

     
  
    </div>
  );
}