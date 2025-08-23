"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

export default function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ✅ Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // ✅ Fetch all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/salons/chats");
        if (res.status === 401) {
          localStorage.clear();
          toast.info("Your session has expired.");
          return;
        }
        const data = await res.json();
        if (data.success) setConversations(data.data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        toast.error("Failed to load conversations.");
      }
    };
    fetchConversations();
  }, []);

  // ✅ Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId) => {
    try {
      const res = await fetch(`/api/salons/chats/messages?conversation_id=${conversationId}`);
      const data = await res.json();
      if (data.success) setMessages(data.data);
      scrollToBottom();
    } catch (err) {
      console.error("Error fetching messages:", err);
      toast.error("Failed to load messages.");
    }
  }, [scrollToBottom]);

  // ✅ Select a conversation
  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    fetchMessages(conv.conversation_id);
  };

  // ✅ Send new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    setLoading(true);

    try {
      const res = await fetch("/api/salons/chats/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: selectedConversation.conversation_id,
          message: newMessage,
          userId: selectedConversation.user_id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewMessage("");
        fetchMessages(selectedConversation.conversation_id);
      } else {
        toast.error("Failed to send message.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a conversation
  const deleteConversation = async () => {

    try {
      const res = await fetch(`/api/salons/chats/messages/?conversation_id=${selectedConversation.conversation_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res);
      const data = await res.json();
      console.log(data, 'the data is');
      if (data.success) {
        toast.success("Conversation deleted successfully!");
        // Remove the deleted conversation from state
        fetchMessages(selectedConversation.conversation_id)
        setSelectedConversation(false)

      } else {
        toast.error("Failed to delete conversation: " + data.message);
      }
    } catch (error) {
      toast.error("Something went wrong while deleting the conversation.");
    }
  };


  // ✅ Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="flex h-[85vh] rounded-2xl overflow-hidden shadow-lg border bg-white">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r bg-gray-50 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" /> Conversations
        </h2>

        {conversations.length === 0 ? (
          <p className="text-gray-500 text-center">No conversations found</p>
        ) : (
          conversations.map((conv) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              key={conv.conversation_id}
              onClick={() => handleSelectConversation(conv)}
              className={`flex items-center gap-3 cursor-pointer p-3 mb-2 rounded-xl shadow-sm transition ${selectedConversation?.conversation_id === conv.conversation_id
                ? "bg-blue-100 border border-blue-400"
                : "bg-white hover:bg-gray-100"
                }`}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
                <Image
                  src={conv.salon_image || conv.user_image || "/default-avatar.png"}
                  alt={conv.salon_name || conv.user_name || "Conversation"}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {conv.salon_name || conv.user_name}
                </p>
                {/* <p className="text-xs text-gray-500 truncate">
                  Last: {conv.last_message || "No messages yet"}
                </p> */}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Chat Section */}
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedConversation.salon_name || selectedConversation.user_name}
              </h3>
              <button onClick={deleteConversation} className="text-red-500 hover:text-red-700 flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">No messages yet</p>
              ) : (
                messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[70%] p-3 rounded-xl ${msg.sender_type === "salon"
                      ? "ml-auto bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    {msg.message}
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="p-3 border-t bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-1 disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
