'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SalonList = ({ salons = [] }) => {
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  // Process API data to match expected format
  const processedSalons = salons.map(salon => ({
    id: salon.id,
    name: salon.salon_name,
    image: salon.image || '/default-salon.jpg',
    location: `${salon.city}, ${salon.state}`,
    gender: 'unisex', // Default since API doesn't have gender field
    services: ['Hair Cutting', 'Facial', 'Manicure'], // Placeholder - you might want to get actual services
    rating: salon.avg_rating || 4.0,
    total_reviews: salon.total_reviews || 0,
    total_favorites: salon.total_favorites || 0,
    description: salon.description,
    owner_name: salon.owner_name,
    opening_hours: salon.opening_hours,
    days: salon.days
  }));

  // Extract unique services from all salons (placeholder - you might want to get actual services from API)
  const uniqueServices = [
    'Hair Cutting',
    'Facial',
    'Manicure',
    'Pedicure',
    'Beard Trim',
    'Hair Coloring',
    'Massage',
    'Makeup'
  ];

  const filteredSalons = processedSalons.filter((salon) => {
    const genderMatch =
      !selectedGender ||
      salon.gender === selectedGender ||
      salon.gender === 'unisex';
    const serviceMatch =
      !selectedService || salon.services.includes(selectedService);

    return genderMatch && serviceMatch;
  });

  const showMoreSalons = () => {
    setVisibleCount(prevCount => prevCount + 3);
  };

  const resetVisibleCount = () => {
    setVisibleCount(6);
  };

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {/* Header with title and filters in same row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Browse Salons</h2>
          <p className="text-gray-600 mt-1">Find the perfect salon for your needs</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Gender Filter */}
          <div className="relative">
            <select
              value={selectedGender}
              onChange={(e) => {
                setSelectedGender(e.target.value);
                resetVisibleCount();
              }}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>

          {/* Service Filter */}
          <div className="relative">
            <select
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
                resetVisibleCount();
              }}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Services</option>
              {uniqueServices.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Salon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSalons.slice(0, visibleCount).map((salon) => (
          <Link href={`/salons/${salon.id}`} key={salon.id} className="group">
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
              <div className="relative overflow-hidden h-48">
                <img
                  src={salon.image}
                  alt={salon.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {salon.rating}
                </div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold">
                  {salon.total_reviews} reviews
                </div>
              </div>
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{salon.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                    {salon.gender}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{salon.location}</span>
                </div>

                {salon.owner_name && (
                  <div className="flex items-center text-gray-600 mb-3">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Owner: {salon.owner_name}</span>
                  </div>
                )}
                
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {salon.services.slice(0, 3).map((service) => (
                      <span key={service} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        {service}
                      </span>
                    ))}
                    {salon.services.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        +{salon.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {salon.opening_hours && (
                  <div className="mt-3 flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>{salon.opening_hours}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Show More Button */}
      {filteredSalons.length > visibleCount && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={showMoreSalons}
            className="flex items-center px-6 py-3 bg-white border border-indigo-100 text-indigo-600 font-medium rounded-full shadow-sm hover:shadow-md hover:bg-indigo-50 transition-all duration-300"
          >
            Show More Salons
            <svg 
              className="w-4 h-4 ml-2 transition-transform duration-300 hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>
      )}

      {filteredSalons.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No salons found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your filters to find what you're looking for.</p>
        </div>
      )}
    </section>
  );
};

export default SalonList;