'use client';

import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import Image from 'next/image';

export default function ContactPage() {
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

            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
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
                  className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Let us know how we can assist you..."
                  required
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-md transition-all flex items-center justify-center"
              >
                <span>Send Message</span>
                <FiSend className="ml-2" />
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
      icon={<FiMail className="text-primary w-5 h-5" />} 
      title="Email Us" 
      text="support@glamsalon.com" 
    />
    
    <ContactInfo 
      icon={<FiPhone className="text-primary w-5 h-5" />} 
      title="Call Us" 
      text="+92 300 1234567" 
    />
    
    <ContactInfo 
      icon={<FiMapPin className="text-primary w-5 h-5" />} 
      title="Visit Us" 
      text="Plot 456, Gulberg III, Lahore, Pakistan" 
    />
    
    <ContactInfo 
      icon={<FiClock className="text-primary w-5 h-5" />} 
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
