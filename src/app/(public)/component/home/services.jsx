'use client';

import Link from 'next/link';
import {
  CalendarCheck,
  Users,
  Clock,
  Package,
  Mail,
  BarChart
} from 'lucide-react';

const features = [
  {
    title: 'Intuitive Booking System',
    description: 'Clients can book appointments 24/7 with real-time availability and instant confirmations.',
    icon: CalendarCheck,
    color: 'bg-pink-100 text-pink-600',
  },
  {
    title: 'Client Management',
    description: 'Store client details, preferences, and history for personalized service every visit.',
    icon: Users,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Staff Scheduling',
    description: 'Easily manage staff schedules, time-off requests, and commission tracking.',
    icon: Clock,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Inventory Tracking',
    description: 'Automatically track product usage and get low-stock alerts for your salon.',
    icon: Package,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Marketing Tools',
    description: 'Send promotions, birthday offers, and re-engagement campaigns to clients.',
    icon: Mail,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Get insights into your business performance with easy-to-understand reports.',
    icon: BarChart,
    color: 'bg-indigo-100 text-indigo-600',
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to <span className="text-pink-600">Run Your Salon</span>
          </h2>
          <p className="text-lg text-gray-600">
            All-in-one software to streamline operations, improve client satisfaction, and grow your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link 
                  href="/features" 
                  className="inline-flex items-center text-pink-600 font-medium hover:text-pink-700 transition-colors"
                >
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/signin">
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-pink-600 hover:bg-pink-700 transition">
              Try it For Free
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
