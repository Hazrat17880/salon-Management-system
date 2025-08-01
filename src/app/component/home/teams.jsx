'use client';

import Image from 'next/image';
import { FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function TeamPreview() {
  const team = [
    { 
      name: 'Alice Johnson', 
      role: 'Master Stylist', 
      img: '/usman.jpg',
      bio: 'Specializes in color correction and balayage with 10+ years experience.',
      social: {
        instagram: '#',
        twitter: '#',
        linkedin: '#'
      }
    },
    { 
      name: 'Mark Lee', 
      role: 'Spa Director', 
      img: '/staff1.jpeg',
      bio: 'Certified massage therapist with expertise in holistic treatments.',
      social: {
        instagram: '#',
        twitter: '#',
        linkedin: '#'
      }
    },
    { 
      name: 'Sofia Brown', 
      role: 'Beauty Specialist', 
      img: '/staff2.jpeg',
      bio: 'Makeup artist and skincare expert trained in Paris and Milan.',
      social: {
        instagram: '#',
        twitter: '#',
        linkedin: '#'
      }
    },
    { 
      name: 'David Chen', 
      role: 'Barber', 
      img: '/staff3.jpeg',
      bio: 'Traditional and modern barbering techniques for the perfect cut.',
      social: {
        instagram: '#',
        twitter: '#',
        linkedin: '#'
      }
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-pink-100 text-pink-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            Our Professionals
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our <span className="text-pink-600">Expert Team</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Passionate professionals dedicated to making you look and feel your best
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={member.img}
                  alt={member.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white text-sm">{member.bio}</p>
                </div>
              </div>
              
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-pink-600 font-medium mb-3">{member.role}</p>
                
                <div className="flex justify-center space-x-3">
                  <a 
                    href={member.social.instagram} 
                    className="text-gray-400 hover:text-pink-600 transition-colors"
                    aria-label={`${member.name} Instagram`}
                  >
                    <FaInstagram className="w-5 h-5" />
                  </a>
                  <a 
                    href={member.social.twitter} 
                    className="text-gray-400 hover:text-pink-600 transition-colors"
                    aria-label={`${member.name} Twitter`}
                  >
                    <FaTwitter className="w-5 h-5" />
                  </a>
                  <a 
                    href={member.social.linkedin} 
                    className="text-gray-400 hover:text-pink-600 transition-colors"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-pink-600 hover:bg-pink-700 transition-colors">
            Join Our Team
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}