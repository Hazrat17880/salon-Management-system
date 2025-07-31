'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-100/30 via-purple-100/20 to-white"></div>
        <div className="container relative mx-auto px-6">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-6"
            >
              <span className="block">Elevate Your Salon Business</span>
              <span className="block bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                With Intelligent Management
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 mb-10 leading-relaxed"
            >
              Our comprehensive, cloud-based solution empowers your salon to deliver exceptional experiences while optimizing operations.
            </motion.p>
            
            <motion.div variants={fadeInUp}>
              <Link
                href="https://app.salonmanagementapp.com/register"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-pink-700 hover:to-purple-700 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
              >
                Start Your Free Trial
                <svg className="ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Definition Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
              Revolutionizing <span className="relative whitespace-nowrap">
                <span className="relative z-10">Salon Operations</span>
                <span className="absolute bottom-0 left-0 h-3 w-full bg-pink-200/60 -rotate-1 -z-0"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Our salon management platform integrates all aspects of your business into one powerful, intuitive system designed for growth and efficiency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision & Future Section */}
      <section className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                Our Purpose & Direction
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto"></div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-pink-100 p-3 rounded-lg mr-5 group-hover:bg-pink-200 transition-colors">
                      <svg className="h-8 w-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    To empower salon owners with intuitive technology that simplifies booking, enhances client relationships, and enables beauty professionals to focus on their craft while growing their business.
                  </p>
                </div>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-purple-100 p-3 rounded-lg mr-5 group-hover:bg-purple-200 transition-colors">
                      <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    To be the most trusted salon management platform, transforming how beauty professionals connect with clients through seamless, technology-driven experiences that drive growth and loyalty.
                  </p>
                </div>
              </motion.div>

              {/* Future Plans */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-5 group-hover:bg-indigo-200 transition-colors">
                      <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Our Roadmap</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    {[
                      "AI-powered booking recommendations",
                      "Integrated loyalty programs",
                      "Advanced staff analytics",
                      "Multi-location support"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-pink-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Sections */}
      <div className="space-y-32 py-24">
        {/* Section 1 - Business Control */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container mx-auto px-6"
        >
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div variants={fadeInUp} className="lg:w-1/2 space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Complete Business Oversight
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Gain unprecedented control with our salon management platform that provides:
              </p>
              <ul className="space-y-3">
                {[
                  "Real-time booking dashboard",
                  "Automated client reminders",
                  "Staff performance tracking",
                  "Revenue analytics"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-pink-100 p-1 rounded-full mr-3">
                      <svg className="h-5 w-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="lg:w-1/2 relative rounded-xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/fe1.webp"
                alt="Salon management dashboard"
                width={600}
                height={400}
                className="w-full h-auto"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 2 - Client Experience */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container mx-auto px-6"
        >
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <motion.div variants={fadeInUp} className="lg:w-1/2 space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Seamless Client Journey
              </h3>
              <p className="text-gray-700 leading-relaxed">
                From first booking to loyal repeat visits, we optimize every touchpoint:
              </p>
              <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-pink-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">
                      Website Booking System
                    </h4>
                    <p className="mt-1 text-gray-600">
                      Clients can easily book appointments 24/7 through your salon's website with our integrated booking widget.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="lg:w-1/2 relative">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="/fe3.webp"
                  alt="Mobile booking interface"
                  width={500}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 3 - Client Management */}
        <section className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="relative">
                <Image
                  src="/fe2.webp"
                  alt="Client management interface"
                  width={300}
                  height={600}
                  className="rounded-lg shadow-xl z-10 relative"
                />
                <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg"></div>
              </div>

              <div className="mt-8 space-y-4 max-w-md">
                {[
                  { name: "Maria Gomez", status: "2 upcoming appointments" },
                  { name: "David Fil", status: "Preferred stylist: Sarah" },
                  { name: "Sue Groves", status: "Last service: Hair Color" }
                ].map((client, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-pink-500"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {client.name}
                        </h4>
                        <p className="text-sm text-gray-500">{client.status}</p>
                      </div>
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Client Relationship Management
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Build lasting relationships with tools designed to understand and serve your clients better:
                </p>
                <ul className="space-y-3">
                  {[
                    "Visit history tracking",
                    "Service preferences",
                    "Automated follow-ups",
                    "Loyalty program integration"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-pink-100 p-1 rounded-full mr-3">
                        <svg className="h-5 w-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Salon?</h2>
            <p className="text-xl text-pink-100 mb-8">
              Join thousands of salons using our platform to streamline operations and grow their business.
            </p>
            <Link
              href="https://app.salonmanagementapp.com/register"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-pink-600 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Start Free Trial
              <svg className="ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}