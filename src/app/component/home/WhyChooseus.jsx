'use client';

import { useEffect } from 'react';
import Glide from '@glidejs/glide';

const benefits = [
  {
    icon: 'fas fa-calendar-check',
    title: 'Smart Appointment Booking',
    desc: 'Clients can easily book, reschedule, or cancel appointments with real-time availability and instant confirmations.',
  },
  {
    icon: 'fas fa-history',
    title: 'Booking History & Reminders',
    desc: 'Customers and staff can access appointment history and receive timely SMS/email reminders to reduce no-shows.',
  },
  {
    icon: 'fas fa-user-cog',
    title: 'Client Profile Management',
    desc: 'Each client has a dedicated profile for service preferences, contact info, and visit records.',
  },
  {
    icon: 'fas fa-tools',
    title: 'Salon Staff Panel',
    desc: 'Salon employees manage appointments, services, and client messages through a user-friendly dashboard.',
  },
  {
    icon: 'fas fa-user-shield',
    title: 'Admin Control Panel',
    desc: 'Main admin oversees all salon branches, manages users, reviews analytics, and configures platform settings.',
  },
  {
    icon: 'fas fa-box-open',
    title: 'Inventory & Product Tracking',
    desc: 'Easily track salon products, manage stock levels, and automate low-stock alerts.',
  },
  {
    icon: 'fas fa-comments',
    title: 'Complaints & Messaging',
    desc: 'Clients can send complaints or suggestions; staff/admins can respond directly in-app.',
  },
  {
    icon: 'fas fa-chart-bar',
    title: 'Performance Insights',
    desc: 'Visual dashboards track appointment volume, staff performance, and customer satisfaction trends.',
  },
  {
    icon: 'fas fa-lock',
    title: 'Security & Data Protection',
    desc: 'We use encrypted protocols to ensure client data and transactions are 100% secure.',
  },
];

export default function WhyChooseUs() {
  useEffect(() => {
    new Glide('.glide-benefits', {
      type: 'carousel',
      perView: 3,
      gap: 24,
      autoplay: 4500,
      hoverpause: true,
      animationDuration: 800,
      breakpoints: {
        1024: { perView: 2 },
        640: { perView: 1 },
      },
    }).mount();
  }, []);

  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-900" id="why-choose-us">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-12 animate-fade-in">
          Why Choose Our Salon System
        </h2>

        <div className="glide-benefits">
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides">
              {benefits.map((item, i) => (
                <li
                  key={i}
                  className="glide__slide bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-all hover:shadow-xl hover:scale-[1.02]"
                >
                  <div className="text-pink-500 text-4xl mb-4">
                    <i className={item.icon}></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="glide__arrows mt-6 flex justify-center gap-4"
            data-glide-el="controls"
          >
            <button
              className="glide__arrow glide__arrow--left px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition"
              data-glide-dir="<"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="glide__arrow glide__arrow--right px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition"
              data-glide-dir=">"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
