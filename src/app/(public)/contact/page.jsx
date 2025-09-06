'use client';

import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiLoader } from 'react-icons/fi';
import Image from 'next/image';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    try {
      const response = await fetch('/api/public/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({ success: true, message: 'Message sent successfully!' });
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        setSubmitStatus({ success: false, message: data.message || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ success: false, message: 'An error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-32 py-5">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 md:p-10 lg:p-12"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Book a Consultation</h1>
              <p className="text-gray-600">
                Have questions about our salon services or want to schedule a visit?
                Drop us a message — our friendly team will get back to you within a few hours.
              </p>
            </div>

            {/* Status Message */}
            {submitStatus.message && (
              <div className={`mb-4 p-3 rounded-lg ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submitStatus.message}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="e.g., Sarah Khan"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Let us know how we can assist you..."
                  required
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-lg shadow-md transition-all flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <FiSend className="ml-2" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative bg-gray-100 flex flex-col"
          >
            {/* Image */}
            <div className="h-1/2 w-full relative">
              <Image
                src="/contact.jpg"
                alt="Salon receptionist talking to client"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Info Block */}
            <div className="bg-white p-6 md:p-10 lg:p-12 w-full max-w-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <ContactInfo 
                  icon={<FiMail className="text-emerald-600 w-5 h-5" />} 
                  title="Email Us" 
                  text="support@glamsalon.com" 
                />
                
                <ContactInfo 
                  icon={<FiPhone className="text-emerald-600 w-5 h-5" />} 
                  title="Call Us" 
                  text="+92 300 1234567" 
                />
                
                <ContactInfo 
                  icon={<FiMapPin className="text-emerald-600 w-5 h-5" />} 
                  title="Visit Us" 
                  text="Plot 456, Gulberg III, Lahore, Pakistan" 
                />
                
                <ContactInfo 
                  icon={<FiClock className="text-emerald-600 w-5 h-5" />} 
                  title="Working Hours" 
                  text="Mon–Sat: 10:00 AM – 8:00 PM" 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ContactInfo({ icon, title, text }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
}