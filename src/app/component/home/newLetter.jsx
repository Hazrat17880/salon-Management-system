'use client';

import { useState } from 'react';
import { FiMail, FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubscribed(true);
      setEmail('');
    }, 1500);
  };

  return (
    <section className="relative bg-gradient-to-r from-pink-600 to-fuchsia-600 py-16 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-500 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-fuchsia-500 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our <span className="text-yellow-200">Beauty Community</span>
          </h2>
          <p className="text-lg text-pink-100 mb-8 max-w-2xl mx-auto">
            Subscribe to receive exclusive offers, styling tips, and early access to new services.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-8 py-6"
            >
              <div className="flex items-center justify-center gap-3">
                <FiSend className="w-6 h-6 text-yellow-200" />
                <p className="text-white font-medium">
                  Thank you for subscribing! Check your email for confirmation.
                </p>
              </div>
            </motion.div>
          ) : (
            <form 
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            >
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <FiMail className="w-5 h-5 text-pink-300" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-300 hover:bg-yellow-200 text-pink-700 font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-pink-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Subscribe Now
                    <FiSend className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-xs text-pink-200 mt-6 opacity-80">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}