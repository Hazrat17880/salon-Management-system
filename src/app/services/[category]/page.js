'use client';

import { useParams } from 'next/navigation';
import React from 'react'; // Add this import

import Image from 'next/image';
import { FiScissors, FiDroplet, FiFeather, FiWind } from 'react-icons/fi';
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
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[70vh] w-full overflow-hidden"
      >
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/60 flex items-center justify-center">
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
          </motion.div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Features */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 hover:shadow-xl transition-shadow duration-500"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">
              Service Highlights
            </h2>
            <ul className="space-y-5">
              {service.features.map((feature, index) => (
                <motion.li 
                  key={index} 
                  variants={fadeIn}
                  className="flex items-start group"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                      <svg
                        className="w-4 h-4"
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
                  <p className="ml-4 text-lg text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{feature}</p>
                </motion.li>
              ))}
            </ul>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-medium text-gray-900 mb-3">Investment</h3>
              <p className="text-3xl font-bold text-rose-600">
                {service.priceRange}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                *Prices vary based on service duration and products used
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
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 hover:shadow-xl transition-shadow duration-500"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">
                About Our {service.title}
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-4">
                  Our {service.title.toLowerCase()} services are performed by certified
                  professionals using premium products to ensure exceptional
                  results. Each service begins with a consultation to
                  understand your unique needs and desired outcomes.
                </p>
                <p>
                  We maintain the highest standards of cleanliness and
                  sterilization, with all tools either disposable or properly
                  sanitized between clients. Your comfort and satisfaction are
                  our top priorities.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white overflow-hidden relative"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10"></div>
              <div className="absolute -left-5 -bottom-5 w-24 h-24 rounded-full bg-white/5"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-6 font-serif">Ready to Experience It?</h2>
                <p className="mb-8 text-lg leading-relaxed">
                  Book your {service.title.toLowerCase()} today and discover the
                  difference of our premium services. Our team is ready to welcome you.
                </p>
                <a
                  href="/booking"
                  className="inline-block px-8 py-4 bg-white text-rose-600 rounded-lg font-bold shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  Book Now
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-serif mb-4">
              What Our Clients Say
            </h2>
            <div className="w-20 h-1 bg-rose-500 mx-auto"></div>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "The best hair color I've ever had! The stylist listened to exactly what I wanted and delivered beyond my expectations. The salon atmosphere was so relaxing.",
                author: 'Sarah J.',
                service: 'Hair Coloring',
              },
              {
                quote:
                  'My facial left my skin glowing for weeks. The esthetician took time to analyze my skin and recommended the perfect treatment. Worth every penny!',
                author: 'Michael T.',
                service: 'Custom Facial',
              },
              {
                quote:
                  'The spa day was the perfect gift for our anniversary. From the moment we walked in, we felt transported to a peaceful sanctuary. So relaxing!',
                author: 'Emma & David',
                service: 'Couples Retreat',
              },
            ].map((testimonial, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn}
                whileHover={{ y: -10 }}
                className="bg-gray-800 rounded-2xl p-8 hover:bg-gray-750 transition-all duration-500"
              >
                <div className="text-rose-400 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-6 h-6 inline-block"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="italic text-lg mb-6 leading-relaxed">{testimonial.quote}</p>
                <div>
                  <p className="font-bold text-rose-400">— {testimonial.author}</p>
                  <p className="text-sm text-gray-400 mt-1">{testimonial.service}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif">
              Ready to Transform Your Experience?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Join hundreds of satisfied clients who trust us with their beauty and wellness needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/booking"
                className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Book Your Appointment
              </a>
              <a
                href="/services"
                className="px-8 py-4 bg-white border-2 border-gray-200 hover:border-rose-400 text-gray-800 rounded-lg font-bold shadow-sm transition-all duration-300 transform hover:scale-105"
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