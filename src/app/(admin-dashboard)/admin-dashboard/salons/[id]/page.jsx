"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MapPin, Phone, Scissors, X, MessageCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import FavoriteSalon from "@/component/Customer/FavoriteSalon";

export default function SalonDetails() {
  const { id } = useParams();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
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
const ref = useRef(false)
  const router = useRouter();
const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/salons/salon/?id=${id}`);
        if (res.status === 401) {
          localStorage.clear();
          toast.warning("Your session is expired.");
          router.push("/admin/signin");
          return;
        }
        const data = await res.json();
        if (data.success) {
          setSalon(data.data.salon);
          setServices(data.data.services);
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
  // ---------------- Chat Functions ----------------




  if (loading) return <div className="p-10 text-center">Loading salon details...</div>;
  if (!salon) return <div className="p-10 text-center text-red-500">Salon not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Salon Header */}
      <motion.div
        className="relative bg-white rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <img
          src={salon.image || "/default-salon.jpg"}
          alt={salon.salon_name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{salon.salon_name}</h1>
           
          </div>
          <div className="flex items-center text-gray-600 mt-2 gap-4">
            <span className="flex items-center gap-1">
              <MapPin size={18} /> {salon.city}, {salon.country}
            </span>
            <span className="flex items-center gap-1">
              <Phone size={18} /> {salon.phone}
            </span>
          </div>
          <p className="mt-4 text-gray-700">{salon.description}</p>

        
        </div>
      </motion.div>

      {/* ---------------- Complaint Modal ---------------- */}
      {complaintModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <motion.div
      className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        onClick={() => setComplaintModal(false)}
      >
        <X size={24} />
      </button>

      {/* Title */}
      <h3 className="text-xl font-bold mb-4">Submit a Complaint</h3>

      {/* Complaint Type Selector */}
      <label className="block mb-2 text-gray-700 font-medium">Complaint About</label>
      <select
        className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-red-500 focus:outline-none"
        value={complaintType}
        onChange={(e) => setComplaintType(e.target.value)}
      >
        <option value="">-- Select an option --</option>
        <option value="salon">Salon</option>
        <option value="services">Services</option>
      </select>

      {/* Complaint Text */}
      <textarea
        className="w-full border rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-red-500 focus:outline-none"
        placeholder="Write your complaint here..."
        value={complaintText}
        onChange={(e) => setComplaintText(e.target.value)}
      />

      {/* Submit Button */}
      <button
        className="w-full mt-4 bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
        onClick={submitComplaint}
        disabled={!complaintType || !complaintText.trim()}
      >
        Submit Complaint
      </button>
    </motion.div>
  </div>
)}


      {/* ---------------- Services ---------------- */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Our Services</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service) => (
          <motion.div
            key={service.id}
            className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 cursor-pointer hover:shadow-lg"
            whileHover={{ scale: 1.03 }}
            onClick={() => setSelectedService(service)}
          >
            <img
              src={service.image_url || "/default-service.jpg"}
              alt={service.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Scissors size={18} /> {service.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{service.description}</p>
              <div className="mt-2 flex gap-4 items-center text-gray-700 font-medium">
                <span>Price: ${service.price}</span>
                <span>Time: {service.duration || "30 min"}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ---------------- Service Details Modal ---------------- */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <motion.div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedService(null)}
            >
              <X size={24} />
            </button>
            <img
              src={selectedService.image_url || "/default-service.jpg"}
              alt={selectedService.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">{selectedService.name}</h3>
            <p className="text-gray-600 mb-2">{selectedService.description}</p>
            <p className="font-medium mb-1">Price: ${selectedService.price}</p>
            <p className="font-medium mb-4">
              Duration: {selectedService.duration || "30 min"}
            </p>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
              onClick={() => setAppointmentModal(true)}
            >
              Book Appointment
            </button>
          </motion.div>
        </div>
      )}

      {/* ---------------- Appointment Modal ---------------- */}
      {appointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <motion.div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setAppointmentModal(false)}
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4">Book Appointment</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border rounded-lg p-2"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
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
                className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                onClick={() => {
                  // TODO: Implement handleBookAppointment
                  setAppointmentModal(false);
                  toast.success("Appointment booked!");
                }}
              >
                Confirm Appointment
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ---------------- Chat Modal ---------------- */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <motion.div
            className="bg-white w-full md:w-96 h-full flex flex-col shadow-xl relative"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Chat with {salon.salon_name}</h3>
              <button onClick={() => setChatOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2" ref={ref}>
              {messages.length === 0 ? (
                <p className="text-gray-400 text-center mt-10">No messages yet. Say hi! 👋</p>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-2 rounded max-w-xs ${
                      msg.sender_type === "user"
                        ? "bg-blue-500 text-white self-end"
                        : "bg-gray-200 text-black self-start"
                    }`}
                  >
                    {msg.message}
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
