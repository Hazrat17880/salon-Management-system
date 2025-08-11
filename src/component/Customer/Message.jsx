"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiSend, FiChevronLeft, FiPaperclip, FiChevronDown } from "react-icons/fi";

const MessagesContent = ({ initialMessages = [], salons = [] }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [showSalonDropdown, setShowSalonDropdown] = useState(false);
  const [recipientType, setRecipientType] = useState(""); // 'admin' or 'salon'
  const [selectedSalon, setSelectedSalon] = useState("");

  const handleNewMessage = () => {
    setIsComposing(true);
    setSelectedMessage(null);
    setRecipientType("");
    setSelectedSalon("");
    setRecipient("");
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setIsComposing(false);
    
    if (message.unread) {
      setMessages(messages.map(msg => 
        msg.id === message.id ? {...msg, unread: false} : msg
      ));
    }
  };

  const handleSendMessage = () => {
    if (!newMessageText.trim() || !recipient) return;
    
    const newMsg = {
      id: messages.length + 1,
      salon: recipient,
      message: newMessageText,
      time: "Just now",
      unread: false,
      sender: "You",
    };
    
    setMessages([newMsg, ...messages]);
    setNewMessageText("");
    setRecipient("");
    setIsComposing(false);
    setShowSalonDropdown(false);
    setRecipientType("");
    setSelectedSalon("");
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
    setIsComposing(false);
  };

  const selectSalon = (salonName) => {
    setSelectedSalon(salonName);
    setRecipient(salonName);
    setShowSalonDropdown(false);
  };

  const handleRecipientTypeChange = (type) => {
    setRecipientType(type);
    if (type === "admin") {
      setRecipient("Admin");
      setSelectedSalon("");
    } else {
      setRecipient("");
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6">
        {selectedMessage || isComposing ? (
          <div className="flex items-center">
            <button 
              onClick={handleBackToList}
              className="mr-2 p-1 rounded-full hover:bg-gray-100"
            >
              <FiChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              {isComposing ? "New Message" : selectedMessage?.salon || ""}
            </h3>
          </div>
        ) : (
          <>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-0">
              Messages
            </h3>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNewMessage}
              className="px-3 py-1 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm md:text-base transition-colors"
            >
              New Message
            </motion.button>
          </>
        )}
      </div>
      
      {/* Message List View */}
      {!selectedMessage && !isComposing && (
        <div className="flex-1 overflow-y-auto">
          {messages && messages.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  whileHover={{ y: -2 }}
                  onClick={() => handleMessageClick(message)}
                  className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-all ${
                    message.unread 
                      ? 'border-indigo-300 bg-indigo-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div className="mb-2 md:mb-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 text-sm md:text-base">
                          {message.salon}
                        </h4>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">
                            {message.time}
                          </span>
                          {message.unread && (
                            <span className="inline-block h-2 w-2 rounded-full bg-indigo-600"></span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mt-1 text-sm md:text-base line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-8 text-gray-500">
              <p className="mb-4">No messages found</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNewMessage}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm md:text-base transition-colors"
              >
                Start a Conversation
              </motion.button>
            </div>
          )}
        </div>
      )}

      {/* Message Detail View */}
      {selectedMessage && !isComposing && (
        <div className="flex-1 flex flex-col">
          <div className="border-b pb-4 mb-4">
            <h4 className="font-medium text-gray-900 text-lg">
              {selectedMessage.salon}
            </h4>
            <p className="text-gray-500 text-sm">
              {selectedMessage.time}
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto mb-4 p-2 bg-gray-50 rounded-lg">
            <div className={`p-3 mb-3 rounded-lg max-w-[80%] ${
              selectedMessage.sender === "You" 
                ? 'bg-indigo-100 ml-auto' 
                : 'bg-white mr-auto'
            }`}>
              <p className="text-gray-800">{selectedMessage.message}</p>
            </div>
            
            <div className="p-3 mb-3 rounded-lg max-w-[80%] bg-white">
              <p className="text-gray-800">Thanks for your message! We'll get back to you shortly.</p>
            </div>
          </div>
          
          <div className="flex items-center border-t pt-4">
            <input
              type="text"
              placeholder="Type your reply..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button className="p-2 text-gray-500 hover:text-gray-700 border border-l-0 border-gray-300">
              <FiPaperclip />
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700">
              <FiSend />
            </button>
          </div>
        </div>
      )}

      {/* New Message Composition View */}
      {isComposing && (
        <div className="flex-1 flex flex-col">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Recipient Type:
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-indigo-600"
                  checked={recipientType === "admin"}
                  onChange={() => handleRecipientTypeChange("admin")}
                />
                <span className="ml-2 text-gray-700">Admin Panel</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-indigo-600"
                  checked={recipientType === "salon"}
                  onChange={() => handleRecipientTypeChange("salon")}
                />
                <span className="ml-2 text-gray-700">Salon</span>
              </label>
            </div>
          </div>

          {recipientType === "salon" && (
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Salon:
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowSalonDropdown(!showSalonDropdown)}
                  className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <span>{selectedSalon || "Select a salon"}</span>
                  <FiChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showSalonDropdown ? 'transform rotate-180' : ''}`} />
                </button>
                {showSalonDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200 max-h-60 overflow-auto">
                    {salons.map(salon => (
                      <button
                        key={salon.id}
                        onClick={() => selectSalon(salon.name)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {salon.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex-1 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message:
            </label>
            <textarea
              placeholder="Type your message here..."
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              className="w-full h-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              rows="8"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsComposing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSendMessage}
              disabled={!newMessageText.trim() || !recipient}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${
                (!newMessageText.trim() || !recipient) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Send Message
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesContent;