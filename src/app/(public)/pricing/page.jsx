// src/app/pricing/page.jsx
'use client';

import { motion } from 'framer-motion';

export default function PricingPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4 pt-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block mb-4 px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium tracking-wide">
            Simple & Transparent
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Pricing Designed for <br className="hidden md:block" />
            <span className="relative inline-block">
              <span className="relative z-10">Salon Success</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-green-200/60 z-0"></span>
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Professional-grade tools at <span className="font-semibold text-green-600">zero cost</span>. 
            No trials, no hidden fees—just everything you need to grow.
          </p>
        </motion.div>

        {/* Pricing Card & Features */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Premium Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
            <div className="absolute top-6 right-6 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
              Most Popular
            </div>

            <div className="p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Free Forever Plan</h2>
                <p className="text-gray-600 mb-6">
                  Full access to essential salon management tools.
                </p>
                <div className="flex items-end mb-4">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-500 ml-2">/forever</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {[
                  "Unlimited appointments & clients",
                  "Staff scheduling & roles",
                  "Automated SMS/email reminders",
                  "Client history & profiles",
                  "Real-time calendar sync",
                  "Mobile-optimized dashboard",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/signup"
                className="block w-full text-center px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Get Started — No Credit Card Needed
              </motion.a>
            </div>
          </motion.div>

          {/* Value Propositions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:border-green-200 transition-all duration-200">
              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-lg mr-5">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Built for Growth</h3>
                  <p className="text-gray-600">
                    Scale effortlessly as your business expands. Our platform grows with you.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:border-green-200 transition-all duration-200">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-5">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Security</h3>
                  <p className="text-gray-600">
                    Enterprise-grade encryption keeps your business and client data protected.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:border-green-200 transition-all duration-200">
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-lg mr-5">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Future-Ready</h3>
                  <p className="text-gray-600">
                    Optional premium add-ons available later (analytics, custom branding, etc.).
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 pt-10 border-t border-gray-200"
        >
          <p className="text-center text-gray-500 text-sm mb-6">TRUSTED BY SALONS WORLDWIDE</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-70">
            {["SalonChain", "EliteCuts", "BellaBeauty", "TheLuxeBar", "TrimStudio"].map((logo, i) => (
              <div key={i} className="text-lg font-medium text-gray-700">{logo}</div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}