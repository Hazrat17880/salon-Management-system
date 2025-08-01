'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import { FiScissors, FiDroplet, FiFeather, FiWind, FiClock, FiStar, FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';

const servicesData = {
  hair: {
    title: 'Hair Artistry',
    description:
      'Transform your look with our expert stylists. From precision cuts to vibrant coloring and luxurious treatments, we create hair that turns heads.',
    icon: <FiScissors className="w-8 h-8" />,
    image: '/hair.jpg',
    features: [
      'Precision haircuts',
      'Balayage & highlights',
      'Keratin treatments',
      'Scalp therapies',
      'Bridal styling',
    ],
    priceRange: '$50 - $300',
    duration: '1-3 hours',
    expertise: 'Certified Master Stylists',
  },
  skin: {
    title: 'Skin Rejuvenation',
    description:
      "Reveal your most radiant skin with our advanced treatments. Our estheticians customize each service to your skin's unique needs.",
    icon: <FiDroplet className="w-8 h-8" />,
    image: '/skin.jpg',
    features: [
      'Custom facials',
      'Chemical peels',
      'Microdermabrasion',
      'LED light therapy',
      'Anti-aging treatments',
    ],
    priceRange: '$75 - $250',
    duration: '45-90 minutes',
    expertise: 'Licensed Estheticians',
  },
  nails: {
    title: 'Nail Couture',
    description:
      'Pamper your hands and feet with our luxury nail services. From classic manicures to intricate nail art, we pay attention to every detail.',
    icon: <FiFeather className="w-8 h-8" />,
    image: '/nail.jpg',
    features: [
      'Gel manicures',
      'Spa pedicures',
      'Dip powder nails',
      'Nail extensions',
      'Custom nail art',
    ],
    priceRange: '$30 - $150',
    duration: '30-90 minutes',
    expertise: 'Nail Art Specialists',
  },
  spa: {
    title: 'Spa Sanctuary',
    description:
      'Escape to tranquility with our indulgent spa packages. Each experience is designed to relax, rejuvenate and restore balance.',
    icon: <FiWind className="w-8 h-8" />,
    image: '/spa.jpg',
    features: [
      'Hot stone massage',
      'Aromatherapy sessions',
      'Body wraps',
      'Couples packages',
      'Full-day retreats',
    ],
    priceRange: '$100 - $500',
    duration: '1-6 hours',
    expertise: 'Certified Therapists',
  },
};

const fadeIn = {
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

export default function ServiceCategoryPage() {
  const { category } = useParams();
  const service = servicesData[category];

  if (!service) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 "
      >
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-4">
          <h1 className="text-3xl font-bold text-rose-500 mb-4">404</h1>
          <p className="text-lg text-gray-600 mb-6">
            The service category you're looking for doesn't exist.
          </p>
          <a
            href="/services"
            className="inline-block px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Browse Our Services
          </a>
        </div>
      </motion.div>
    );
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24"> {/* Added pt-24 for top padding */}      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[80vh] w-full overflow-hidden"
      >
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/70 flex items-center justify-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center px-4 max-w-4xl"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
              {React.cloneElement(service.icon, { className: "w-10 h-10 text-white" })}
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif tracking-tight">
              {service.title}
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {service.description}
            </motion.p>
            <motion.div variants={fadeIn} className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <FiClock className="text-white mr-2" />
                <span className="text-white text-sm font-medium">{service.duration}</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <FiAward className="text-white mr-2" />
                <span className="text-white text-sm font-medium">{service.expertise}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Features */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-500 border border-gray-100"
          >
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 mr-4">
                {React.cloneElement(service.icon, { className: "w-6 h-6" })}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 font-serif">
                Service Highlights
              </h2>
            </div>
            
            <ul className="space-y-4">
              {service.features.map((feature, index) => (
                <motion.li 
                  key={index} 
                  variants={fadeIn}
                  className="flex items-start group"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-4 text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{feature}</p>
                </motion.li>
              ))}
            </ul>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Investment</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {service.priceRange}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
                  <p className="text-lg font-medium text-gray-900">
                    {service.duration}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                *Prices may vary based on service customization
              </p>
            </div>
          </motion.div>

          {/* Booking & Info */}
          <div className="space-y-8">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-500 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">
                About Our {service.title}
              </h2>
              <div className="prose text-gray-600 space-y-4">
                <p>
                  Our {service.title.toLowerCase()} services are performed by {service.expertise.toLowerCase()} using premium products to ensure exceptional results. Each service begins with a consultation to understand your unique needs and desired outcomes.
                </p>
                <p>
                  We maintain the highest standards of cleanliness and sterilization, with all tools either disposable or properly sanitized between clients. Your comfort and satisfaction are our top priorities.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl p-8 text-white overflow-hidden relative"
            >
              <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/5"></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-rose-500/10"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-rose-500/20 rounded-lg flex items-center justify-center text-rose-400 mr-4">
                    <FiStar className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold font-serif">Ready to Experience It?</h2>
                </div>
                <p className="mb-8 text-gray-300 leading-relaxed">
                  Book your {service.title.toLowerCase()} today and discover the difference of our premium services. Our team is ready to welcome you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/booking"
                    className="flex-1 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium text-center shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    Book Now
                  </a>
                  <a
                    href="/contact"
                    className="flex-1 px-6 py-3 bg-transparent border border-gray-600 hover:border-rose-400 text-white rounded-lg font-medium text-center transition-all duration-300 hover:shadow-lg"
                  >
                    Ask Questions
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold font-serif mb-4 text-gray-900">
              Client Experiences
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our clients say about their experiences.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "The best hair color I've ever had! The stylist listened to exactly what I wanted and delivered beyond my expectations.",
                author: 'Sarah J.',
                service: 'Hair Coloring',
                rating: 5,
              },
              {
                quote:
                  'My facial left my skin glowing for weeks. The esthetician took time to analyze my skin and recommended the perfect treatment.',
                author: 'Michael T.',
                service: 'Custom Facial',
                rating: 5,
              },
              {
                quote:
                  'The spa day was the perfect gift for our anniversary. From the moment we walked in, we felt transported to a peaceful sanctuary.',
                author: 'Emma & David',
                service: 'Couples Retreat',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-8 hover:shadow-lg transition-all duration-500 border border-gray-100"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold mr-3">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.service}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
              Experience the Difference
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join our community of satisfied clients who trust us with their beauty and wellness needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/booking"
                className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                Book Your Appointment
              </a>
              <a
                href="/services"
                className="px-8 py-4 bg-transparent border-2 border-white/20 hover:border-rose-400 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
              >
                Explore All Services
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}