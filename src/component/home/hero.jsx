"use client"
import React, { useState, useEffect } from 'react';

// Using inline SVGs for modern icons.
const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const servicesTepm = [
  {
    id: 1,
    title: "Expert Hair Styling",
    subtitle: "Reinvent your look with a personalized touch.",
    image: "images/slon.jpg",
    link: "/services/hair"
  },
  {
    id: 2,
    title: "Artistic Nail Care",
    subtitle: "From classic manicures to creative designs.",
    image: "images/slon.jpg",
    link: "/services/nails"
  },
  {
    id: 3,
    title: "Revitalizing Facials",
    subtitle: "Experience a radiant and healthy complexion.",
    image: "images/slon.jpg",
    link: "/services/facials"
  },
  {
    id: 4,
    title: "Relaxing Massage Therapy",
    subtitle: "Unwind and de-stress with our therapeutic massages.",
    image: "images/slon.jpg",
    link: "/services/massage"
  },
];

export default function SalonSlider({ sliders }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ Define services first
  const services = sliders && sliders.length > 0 ? sliders : servicesTepm;

  // ✅ Then safely calculate totalSlides
  const totalSlides = services.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-play the slider
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 7000); // Change slide every 7 seconds
    return () => clearInterval(interval);
  }, [currentSlide, totalSlides]);

  return (
    <section className="pt-24 pb-10 relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-pink-50 text-gray-900 font-sans">
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] rounded-3xl overflow-hidden shadow-2xl">
          {/* Slider container */}
          <div
            className="flex h-full w-full transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {services.map((service, index) => (
              <div key={service.id} className="relative flex-none w-full h-full">
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out"
                  style={{ transform: index === currentSlide ? "scale(1.1)" : "scale(1.0)" }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-8">
                  <div className="text-center bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-xl space-y-4 max-w-2xl">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                      {service.title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 font-medium">
                      {service.description || service.subtitle}
                    </p>
                    <a
                      href={service.link}
                      className="mt-6 inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                    >
                      Explore Service
                      <ChevronRight />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prev/Next buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/50 backdrop-blur-sm text-gray-800 shadow-md hover:bg-white transition-colors duration-300 focus:outline-none"
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/50 backdrop-blur-sm text-gray-800 shadow-md hover:bg-white transition-colors duration-300 focus:outline-none"
            aria-label="Next slide"
          >
            <ChevronRight />
          </button>

          {/* Navigation dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white w-8" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
