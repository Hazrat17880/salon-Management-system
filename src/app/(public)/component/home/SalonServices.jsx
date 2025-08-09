'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// This is the data structure for individual services.
const services = [
  {
    id: 's1',
    name: 'Classic Haircut',
    description: 'A timeless haircut for a clean, sharp look.',
    price: 30,
    gender: 'unisex',
    category: 'Hair Cutting',
    image: '/salon1.jpg', // Using user-provided image path
    rating: 4.8,
  },
  {
    id: 's2',
    name: 'Full Facial Treatment',
    description: 'A deep-cleansing and revitalizing facial for all skin types.',
    price: 55,
    gender: 'unisex',
    category: 'Facial',
    image: '/salon2.jpg', // Using user-provided image path
    rating: 4.9,
  },
  {
    id: 's3',
    name: 'Gentleman\'s Beard Trim',
    description: 'A professional trim and shape for a perfect beard.',
    price: 20,
    gender: 'male',
    category: 'Beard Trim',
    image: '/salon3.jpg', // Using user-provided image path
    rating: 4.5,
  },
  {
    id: 's4',
    name: 'Acrylic Nail Extensions',
    description: 'Durable and beautiful acrylic extensions for stylish nails.',
    price: 75,
    gender: 'female',
    category: 'Manicure',
    image: '/salon3.jpg', // Using user-provided image path
    rating: 4.7,
  },
  {
    id: 's5',
    name: 'Kids Haircut',
    description: 'A fun and quick haircut for children of all ages.',
    price: 25,
    gender: 'unisex',
    category: 'Hair Cutting',
    image: '/salon2.jpg', // Using user-provided image path
    rating: 4.6,
  },
  {
    id: 's6',
    name: 'Special Occasion Makeup',
    description: 'Professional makeup for weddings, parties, or any special event.',
    price: 90,
    gender: 'female',
    category: 'Makeup',
    image: '/salon1.jpg', // Using user-provided image path
    rating: 5.0,
  },
  {
    id: 's7',
    name: 'Hot Stone Massage',
    description: 'A relaxing massage with heated stones to soothe tired muscles.',
    price: 110,
    gender: 'unisex',
    category: 'Massage',
    image: '/salon3.jpg', // Using user-provided image path
    rating: 4.9,
  },
  {
    id: 's8',
    name: 'Eyebrow Threading',
    description: 'Precision eyebrow threading for a clean and defined shape.',
    price: 15,
    gender: 'female',
    category: 'Threading',
    image: '/salon2.jpg', // Using user-provided image path
    rating: 4.8,
  },
];

// Dynamically generate unique categories and price ranges from the data.
const uniqueServices = Array.from(
  new Set(services.map((service) => service.category))
);
const priceRanges = [
  { label: 'All Prices', min: 0, max: 1000 },
  { label: 'Under $30', min: 0, max: 30 },
  { label: '$30 - $60', min: 30, max: 60 },
  { label: 'Over $60', min: 60, max: 1000 },
];

// SVG icon for the filter button
const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M3.798 2.378A.75.75 0 014.5 2.25h15a.75.75 0 01.708.91l-6.425 14.852a.75.75 0 01-.137.28L8.643 20.94a.75.75 0 01-1.342-.238l-4.14-11.666a.75.75 0 01.64-1.071zm3.842 10.999a.75.75 0 01.32-.47l.95-.568V7.5a.75.75 0 011.5 0v5.303l.95.568a.75.75 0 01-.32.47l-1.9 1.139a.75.75 0 01-.762 0l-1.9-1.139a.75.75 0 01-.32-.47z"
      clipRule="evenodd"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const SalonServices = () => {
  // State to manage the active filters and modal visibility
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtering logic
  const filteredServices = services.filter((service) => {
    const genderMatch =
      selectedGender === 'all' ||
      service.gender === selectedGender ||
      service.gender === 'unisex';
    const categoryMatch =
      selectedCategory === 'all' || service.category === selectedCategory;
    const priceMatch =
      service.price >= selectedPriceRange.min &&
      (selectedPriceRange.max === 1000 || service.price < selectedPriceRange.max);

    return genderMatch && categoryMatch && priceMatch;
  });

  // A helper function to create a button with dynamic styling
  const FilterButton = ({ onClick, label, active }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out ${
        active
          ? 'bg-pink-500 text-white shadow-md'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <section className="py-12 px-4 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Title and Filter Button */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900">Explore Our Services</h2>
            <p className="text-lg text-gray-600 mt-2">Find the perfect beauty or wellness service just for you.</p>
          </div>
          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200"
          >
            <FilterIcon />
            Filter
          </button>
        </div>

        {/* Filter Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            ></div>
            
            {/* Modal Content */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl relative max-w-lg w-full transform scale-100 transition-all duration-300 ease-out">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Filter Services</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Gender Filter */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Gender</h4>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    onClick={() => setSelectedGender('all')}
                    label="All"
                    active={selectedGender === 'all'}
                  />
                  <FilterButton
                    onClick={() => setSelectedGender('male')}
                    label="Male"
                    active={selectedGender === 'male'}
                  />
                  <FilterButton
                    onClick={() => setSelectedGender('female')}
                    label="Female"
                    active={selectedGender === 'female'}
                  />
                </div>
              </div>

              {/* Service Category Filter */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Service Type</h4>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    onClick={() => setSelectedCategory('all')}
                    label="All Services"
                    active={selectedCategory === 'all'}
                  />
                  {uniqueServices.map((service) => (
                    <FilterButton
                      key={service}
                      onClick={() => setSelectedCategory(service)}
                      label={service}
                      active={selectedCategory === service}
                    />
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Price Range</h4>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <FilterButton
                      key={range.label}
                      onClick={() => setSelectedPriceRange(range)}
                      label={range.label}
                      active={selectedPriceRange.label === range.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <Link href={`/services/${service.id}`} key={service.id} className="group">
              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="relative overflow-hidden h-52">
                  <Image
                    src={service.image}
                    alt={service.name}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold shadow">
                    ${service.price}
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{service.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                      {service.gender}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                  
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {service.category}
                    </span>
                    <span className="inline-flex items-center text-yellow-500 text-sm font-semibold">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {service.rating}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No results message */}
        {filteredServices.length === 0 && (
          <div className="text-center py-20">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-900">No services found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters or search for a different service.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SalonServices;
