"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

const ComplaintsContent = () => {
  const [formData, setFormData] = useState({
    subject: '',
    appointment: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Complaint submitted:', formData);
      setIsSubmitting(false);
      setFormData({
        subject: '',
        appointment: '',
        details: ''
      });
      // You would typically show a success message here
    }, 1500);
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Submit a Complaint</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base transition"
            placeholder="Brief description of your complaint"
          />
        </div>
        
        <div>
          <label htmlFor="appointment" className="block text-sm font-medium text-gray-700 mb-2">
            Related Appointment
          </label>
          <select
            id="appointment"
            name="appointment"
            value={formData.appointment}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base transition"
          >
            <option value="">Select an appointment</option>
            <option value="1">Haircut at Glamour Studio - June 15</option>
            <option value="2">Manicure at Beauty Lounge - June 18</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
            Complaint Details
          </label>
          <textarea
            id="details"
            name="details"
            rows={5}
            value={formData.details}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base transition"
            placeholder="Please describe your complaint in detail..."
          />
        </div>
        
        <div className="flex justify-end pt-2">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className={`px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm md:text-base font-medium transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Complaint'
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintsContent;