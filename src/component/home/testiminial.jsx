'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const testimonials = [
  {
    name: 'Tina Sanchez',
    salon: 'Salon de Belleza Magnolia',
    text: 'Thank you for enabling me to make my business healthier and more reliable. A perfect system that helps me keep my salon organised!',
    image: '/usman.jpg',
    rating: 5,
    role: 'Salon Owner'
  },
  {
    name: 'Tiffany Smith',
    salon: 'Bella Hairsalon',
    text: 'The mobile application meets all our needs. I can now manage everything from my pocket. Highly recommended!',
    image: '/usman.jpg',
    rating: 5,
    role: 'Head Stylist'
  },
  {
    name: 'Ellis Walsh',
    salon: 'Cole Barber',
    text: 'A supportive and kind team that goes beyond to answer our queries. Thanks to your representatives!',
    image: '/usman.jpg',
    rating: 4,
    role: 'Barbershop Manager'
  },
  {
    name: 'Nina Kolisnyk',
    salon: "Nina's Nail Bar",
    text: "We've used Salon Management for 6 months. Our employees stay in contact with clients and request service reviews easily.",
    image: '/usman.jpg',
    rating: 5,
    role: 'Nail Technician'
  },
];

const starIcons = {
  1: '★☆☆☆☆',
  2: '★★☆☆☆',
  3: '★★★☆☆',
  4: '★★★★☆',
  5: '★★★★★'
};

export default function TestimonialsSection() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section 
      ref={ref}
      className="bg-gradient-to-b from-pink-50 to-white py-20 px-6 lg:px-10 overflow-hidden"
      id="testimonials"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Trusted by <span className="text-pink-600">Salon Professionals</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Join thousands of salon owners who have transformed their business with our platform
          </motion.p>
        </div>

        <motion.div 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              whileHover={{ y: -5 }}
            >
              {/* Rating */}
              <div className="absolute -top-4 left-4 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <span className="mr-1">{starIcons[t.rating]}</span>
              </div>
              
              {/* Client Image */}
              <div className="flex items-center mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-pink-200">
                  <Image
                    src={t.image}
                    alt={`${t.name} - ${t.salon}`}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>

              {/* Testimonial Text */}
              <div className="relative">
                <svg 
                  className="absolute -top-6 -left-2 w-8 h-8 text-pink-100 opacity-70" 
                  fill="currentColor" 
                  viewBox="0 0 32 32"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-gray-600 italic pl-6">"{t.text}"</p>
              </div>

              {/* Salon Info */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-900">{t.salon}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust indicators */}
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-center items-center gap-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm text-gray-500">Trusted by salons worldwide</p>
          <div className="flex items-center gap-6">
            {['forbes', 'vogue', 'elle', 'cosmo'].map((brand, i) => (
              <div key={i} className="grayscale hover:grayscale-0 transition-all">
                <Image
                  src={`/logo.png`}
                  alt={brand}
                  width={80}
                  height={40}
                  className="h-8 w-auto opacity-70 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}