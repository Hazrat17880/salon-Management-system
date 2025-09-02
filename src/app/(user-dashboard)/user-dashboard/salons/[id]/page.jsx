
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MapPin, Phone, Scissors, X, MessageCircle, AlertTriangle, Star, Edit2, Trash2, Users, Calendar, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteSalon from "@/component/Customer/FavoriteSalon";

export default function SalonDetails() {
  const { id } = useParams();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const [activeTab, setActiveTab] = useState("services"); // Default tab
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState(false);

  const [complaintModal, setComplaintModal] = useState(false);
  const [complaintText, setComplaintText] = useState("");
  const [complaintType, setComplaintType] = useState("");
  
  // Review state
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(5);
  const [userReviews, setUserReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [editingReview, setEditingReview] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const ref = useRef(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res =  await fetch(`/api/user/salons/salon/?id=${id}`);
      if (res.status === 401) {
        localStorage.clear();
        toast.warning("Your session is expired.");
        router.push("/user/signin");
        return;
      }
      const data = await res.json();
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

  // Fetch reviews for this salon
  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/user/review?salon_id=${id}`);
      const data = await res.json();
      if (data.success) {
        setUserReviews(data.data);
        calculateAverageRating(data.data);
        setCurrentUserId(data.userid)
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  // Calculate average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      setAverageRating(0);
      setTotalReviews(0);
      return;
    }
    
    const total = reviews.reduce((sum, review) => sum + review.stars, 0);
    const average = total / reviews.length;
    setAverageRating(average);
    setTotalReviews(reviews.length);
  };

  useEffect(() => {
    if (!id) return;

    fetchData();
    fetchReviews();
  }, [id, router]);

  const scrollToBottom = useCallback(() => {
    ref.current?.scrollIntoView();
  }, []);

  // ---------------- Review Functions ----------------
  const submitReview = async () => {
    if (!reviewTitle.trim() || !reviewText.trim()) {
      toast.error("Please fill in all review fields");
      return;
    }

    try {
      const url = editingReview ? `/api/user/review?id=${editingReview.id}` : "/api/user/review";
      const method = editingReview ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salon_id: salon.id,
          title: reviewTitle,
          review: reviewText,
          stars: reviewStars
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingReview ? "Review updated successfully" : "Review submitted successfully");
        resetReviewForm();
        setReviewModal(false);
        fetchReviews();
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Failed to submit review", error);
      toast.error("Error submitting review");
    }
  };

  // Edit review
  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewTitle(review.title);
    setReviewText(review.review);
    setReviewStars(review.stars);
    setReviewModal(true);
  };

  // Delete review confirmation
  const confirmDeleteReview = (review) => {
    setReviewToDelete(review);
    setDeleteConfirmModal(true);
  };

  // Delete review
  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      const res = await fetch(`/api/user/review?id=${reviewToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Review deleted successfully");
        setDeleteConfirmModal(false);
        setReviewToDelete(null);
        fetchReviews();
      } else {
        toast.error(data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Failed to delete review", error);
      toast.error("Error deleting review");
    }
  };

  // Reset review form
  const resetReviewForm = () => {
    setReviewTitle("");
    setReviewText("");
    setReviewStars(5);
    setEditingReview(null);
  };

  // Render star rating input
  const renderStarInput = () => {
    return (
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setReviewStars(star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-6 h-6 ${
                star <= reviewStars
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Render star display
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // ---------------- Chat Functions ----------------
  const fetchMessages = async () => {
    if (!salon) return;
    try {
      const res = await fetch(`/api/user/chats/chat-from-salon/?salon_id=${salon.id}`);
      const data = await res.json();
      setConversationId(data.conversation_id);
      if (data.success) {
        setMessages(data.data);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Failed to fetch chat messages", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await fetch("/api/user/chats/chat-from-salon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonId: salon.id,
          message: newMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewMessage("");
        fetchMessages();
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Failed to send message");
    }
  };

  // ---------------- Complaint Functions ----------------
  const submitComplaint = async () => {
    if (!complaintText.trim()) {
      toast.error("Please enter your complaint");
      return;
    }
    try {
      const res = await fetch("/api/complaints/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaint_about: "salon",
          description: complaintText,
          salon_id: salon.id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Complaint submitted successfully");
        setComplaintText("");
        setComplaintModal(false);
      } else {
        toast.error(data.message || "Failed to submit complaint");
      }
    } catch (error) {
      console.error("Failed to submit complaint", error);
      toast.error("Error submitting complaint");
    }
  };

  // handle appointment
  const handleBookAppointment = async () => {
    if (!appointmentDate || !appointmentTime) {
      toast.error("Please select both date and time");
      return;
    }

    try {
      const res = await fetch("/api/user/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          salon_id: salon.id,
          service_id: selectedService.id,
          date: appointmentDate,
          time: appointmentTime,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Appointment booked successfully!");
        setAppointmentModal(false);
        setSelectedService(null);
        setAppointmentDate("");
        setAppointmentTime("");
      } else {
        toast.error(data.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Failed to book appointment", error);
      toast.error("Error booking appointment");
    } 
  };

  if (loading) return <div className="p-10 text-center">Loading salon details...</div>;
  if (!salon) return <div className="p-10 text-center text-red-500">Salon not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Salon Header */}
      <motion.div
        className="relative bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative h-80 w-full">
          <img
            src={salon.image || "/default-salon.jpg"}
            alt={salon.salon_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{salon.salon_name}</h1>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <span className="text-sm">
                    {averageRating.toFixed(1)} ({totalReviews} reviews)
                  </span>
                </div>
              </div>
              <FavoriteSalon
                salon={salon}
                favoriteSalons={favorites}
                setFavoriteSalons={setFavorites}
              />
            </div>
            <div className="flex items-center text-white/90 mt-3 gap-4 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin size={18} /> {salon.city}, {salon.country}
              </span>
              <span className="flex items-center gap-1">
                <Phone size={18} /> {salon.phone}
              </span>
            </div>
            <p className="mt-3 text-white/90 line-clamp-2">{salon.description}</p>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4 flex-wrap">
              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                onClick={() => {
                  setChatOpen(!chatOpen);
                  if (!chatOpen) fetchMessages();
                }}
              >
                <MessageCircle size={20} /> {chatOpen ? "Close Chat" : "Chat with Salon"}
              </button>

              <button
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                onClick={() => {
                  resetReviewForm();
                  setReviewModal(true);
                }}
              >
                <Star size={20} /> Write a Review
              </button>

              <button
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
                onClick={() => setComplaintModal(true)}
              >
                <AlertTriangle size={20} /> Complaint
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-1 mb-8">
        <div className="flex space-x-1">
          {[
            { id: "services", label: "Services", icon: Scissors, count: services.length },
            { id: "reviews", label: "Reviews", icon: Star, count: totalReviews },
            { id: "staff", label: "Our Team", icon: Users, count: staff.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-indigo-700 hover:bg-gray-100"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.id 
                  ? "bg-white/20 text-white" 
                  : "bg-gray-200 text-gray-700"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        <AnimatePresence mode="wait">
          {/* Services Tab */}
          {activeTab === "services" && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group border border-gray-100"
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="relative mb-4">
                      <img
                        src={service.image_url || "/default-service.jpg"}
                        alt={service.name}
                        className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        ${service.price}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Scissors size={18} className="text-indigo-600" />
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        ⏱️ {service.duration || "30 min"}
                      </span>
                      <button 
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedService(service);
                          setAppointmentModal(true);
                        }}
                      >
                        Book Now →
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Rating Summary */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                    <div className="flex justify-center gap-0.5 mt-2">
                      {renderStars(Math.round(averageRating))}
                    </div>
                    <div className="text-sm opacity-90 mt-1">{totalReviews} reviews</div>
                  </div>
                  <button
                    onClick={() => {
                      resetReviewForm();
                      setReviewModal(true);
                    }}
                    className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Write a Review
                  </button>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {userReviews.length > 0 ? (
                  userReviews.map((review) => (
                    <motion.div
                      key={review.id}
                      className="bg-white rounded-2xl shadow-md p-6 relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {/* Edit/Delete buttons for user's own reviews */}
                      {currentUserId === review.user_id && (
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 transition"
                            title="Edit Review"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => confirmDeleteReview(review)}
                            className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition"
                            title="Delete Review"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          {review.image ? (
                            <img src={review.image} alt="User" className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <span className="text-indigo-600 font-medium text-lg">
                              {review.full_name ? review.full_name.charAt(0).toUpperCase() : 'U'}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{review.full_name || 'Anonymous'}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-0.5 mb-3">
                            {renderStars(review.stars)}
                          </div>
                          <h5 className="font-semibold text-lg mb-2 text-gray-900">{review.title}</h5>
                          <p className="text-gray-700 leading-relaxed">{review.review}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No reviews yet</h3>
                    <p className="text-gray-500 mb-4">Be the first to share your experience!</p>
                    <button
                      onClick={() => {
                        resetReviewForm();
                        setReviewModal(true);
                      }}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      Write First Review
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Staff Tab */}
          {activeTab === "staff" && (
            <motion.div
              key="staff"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {staff.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {staff.map((staffMember) => (
                    <motion.div
                      key={staffMember.id}
                      className="bg-white rounded-2xl shadow-md p-6 text-center group hover:shadow-xl transition-all duration-300"
                      whileHover={{ y: -5 }}
                    >
                      <div className="relative mb-4">
                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                          {staffMember.image ? (
                            <img 
                              src={staffMember.image} 
                              alt={staffMember.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="text-indigo-600 text-3xl" />
                          )}
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-900">{staffMember.title}</h3>
                      <div className="w-12 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto mb-3"></div>
                      <p className="text-sm text-gray-500">
                        Member since {new Date(staffMember.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No staff members yet</h3>
                  <p className="text-gray-500">Check back later to meet our team!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------- Review Modal ---------------- */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => {
                setReviewModal(false);
                resetReviewForm();
              }}
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold mb-4">
              {editingReview ? "Edit Review" : "Write a Review"}
            </h3>

            {/* Star Rating */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Your Rating</label>
              {renderStarInput()}
              <p className="text-sm text-gray-500">{reviewStars} star{reviewStars !== 1 ? 's' : ''}</p>
            </div>

            {/* Review Title */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Review Title</label>
              <input
                type="text"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Give your review a title"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
              />
            </div>

            {/* Review Text */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Your Review</label>
              <textarea
                            className="w-full border rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Share your experience with this salon..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
              onClick={submitReview}
              disabled={!reviewTitle.trim() || !reviewText.trim()}
            >
              {editingReview ? "Update Review" : "Submit Review"}
            </button>
          </motion.div>
        </div>
      )}

      {/* ---------------- Delete Confirmation Modal ---------------- */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setDeleteConfirmModal(false)}
            >
              <X size={24} />
            </button>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Delete Review</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your review? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                onClick={() => setDeleteConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={handleDeleteReview}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ---------------- Complaint Modal ---------------- */}
      {complaintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setComplaintModal(false)}
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold mb-4">Submit a Complaint</h3>

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

            <textarea
              className="w-full border rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="Write your complaint here..."
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
            />

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

      {/* ---------------- Service Details Modal ---------------- */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
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
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition"
              onClick={() => setAppointmentModal(true)}
            >
              Book Appointment
            </button>
          </motion.div>
        </div>
      )}

      {/* ---------------- Appointment Modal ---------------- */}
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
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4">Book Appointment</h3>
            
            {selectedService && (
              <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-2">Service: {selectedService.name}</h4>
                <p className="text-indigo-600">Price: ${selectedService.price}</p>
                <p className="text-indigo-600">Duration: {selectedService.duration || "30 min"}</p>
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
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 transition"
                onClick={handleBookAppointment}
                disabled={!appointmentDate || !appointmentTime}
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
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <h3 className="text-lg font-semibold">Chat with {salon.salon_name}</h3>
              <button onClick={() => setChatOpen(false)} className="text-white hover:text-gray-200">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2" ref={ref}>
              {messages.length === 0 ? (
                <div className="text-center mt-10 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No messages yet. Say hi! 👋</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl max-w-xs ${
                      msg.sender_type === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white self-end"
                        : "bg-gray-100 text-gray-800 self-start"
                    }`}
                  >
                    {msg.message}
                    <div className={`text-xs mt-1 ${
                      msg.sender_type === "user" ? "text-indigo-100" : "text-gray-500"
                    }`}>
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
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition"
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