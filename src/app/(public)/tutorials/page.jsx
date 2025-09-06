"use client"
import React, { useState } from 'react';
import { FaPlay, FaClock, FaSearch, FaFilter, FaBook } from 'react-icons/fa';

const Tutorials = () => {
  const tutorialCategories = [
    {
      id: 1,
      title: "Getting Started",
      icon: <FaPlay className="text-blue-500" />,
      tutorials: [
        {
          id: 101,
          title: "System Setup Guide",
          description: "Step-by-step instructions to set up your salon management system",
          duration: "15 min",
          level: "Beginner"
        },
        {
          id: 102,
          title: "Staff Onboarding",
          description: "How to add and manage your salon staff members",
          duration: "10 min",
          level: "Beginner"
        }
      ]
    },
    {
      id: 2,
      title: "Advanced Features",
      icon: <FaBook className="text-green-500" />,
      tutorials: [
        {
          id: 201,
          title: "Inventory Management",
          description: "Complete guide to managing salon products and supplies",
          duration: "25 min",
          level: "Intermediate"
        },
        {
          id: 202,
          title: "Reporting & Analytics",
          description: "How to generate and interpret business reports",
          duration: "30 min",
          level: "Advanced"
        }
      ]
    }
  ];

  const videoTutorials = [
    {
      id: 301,
      title: "Booking System Walkthrough",
      duration: "8:45",
      videoId: "dQw4w9WgXcQ", // Example YouTube video ID
      thumbnail: "/tut.jpg"
    },
    {
      id: 302,
      title: "Client Management Demo",
      duration: "12:30",
      videoId: "dQw4w9WgXcQ", // Example YouTube video ID
      thumbnail: "/tut1.jpg"
    },
    {
      id: 303,
      title: "Inventory Management Tutorial",
      duration: "15:20",
      videoId: "dQw4w9WgXcQ", // Example YouTube video ID
      thumbnail: "/tut2.jpg"
    },
    {
      id: 304,
      title: "Reporting Features Overview",
      duration: "18:10",
      videoId: "dQw4w9WgXcQ", // Example YouTube video ID
      thumbnail: "/tut3.jpg"
    }
  ];

  // State for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [activeVideo, setActiveVideo] = useState(null);

  // Filter tutorials based on search and category
  const filteredTutorials = tutorialCategories.map(category => {
    // Filter tutorials within each category
    const filteredCategoryTutorials = category.tutorials.filter(tutorial => {
      const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || category.title === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    return {
      ...category,
      tutorials: filteredCategoryTutorials
    };
  }).filter(category => category.tutorials.length > 0); // Only show categories with tutorials

  // Filter videos based on search
  const filteredVideos = videoTutorials.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle video play
  const handlePlayVideo = (videoId) => {
    setActiveVideo(videoId);
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-32">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Salon Management Tutorials</h1>
        <p className="text-gray-600">Learn how to maximize your salon management system</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <main className="flex-1">
          {/* Search Section */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search tutorials..." 
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="mt-3 flex items-center">
              <FaFilter className="text-gray-500 mr-2" />
              <select 
                className="border rounded px-3 py-1 text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>All Categories</option>
                <option>Getting Started</option>
                <option>Advanced Features</option>
                <option>Video Tutorials</option>
              </select>
            </div>
          </div>

          {/* Tutorial Categories */}
          {filteredTutorials.map(category => (
            <section key={category.id} className="mb-10">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                {category.icon}
                <span className="ml-2">{category.title}</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {category.tutorials.map(tutorial => (
                  <div key={tutorial.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-lg mb-2">{tutorial.title}</h3>
                    <p className="text-gray-600 mb-3">{tutorial.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 flex items-center">
                        <FaClock className="mr-1" /> {tutorial.duration}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{tutorial.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Video Tutorials Section */}
          {(selectedCategory === 'All Categories' || selectedCategory === 'Video Tutorials') && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Video Tutorials</h2>
              
              {/* Active Video Player */}
              {activeVideo && (
                <div className="mb-6 bg-black rounded-lg overflow-hidden">
                  <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${activeVideo}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
              
              {/* Video Thumbnails */}
              <div className="grid md:grid-cols-2 gap-4">
                {filteredVideos.map(video => (
                  <div 
                    key={video.id} 
                    className="bg-white rounded-lg overflow-hidden shadow cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handlePlayVideo(video.videoId)}
                  >
                    <div className="relative">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 rounded-full p-3">
                          <FaPlay className="text-blue-500" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{video.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredVideos.length === 0 && (
                <p className="text-gray-500 text-center py-4">No video tutorials found matching your search.</p>
              )}
            </section>
          )}
        </main>

        <aside className="md:w-64">
          <div className="bg-white p-4 rounded-lg shadow-md sticky top-4">
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">System Requirements</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Troubleshooting Guide</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Keyboard Shortcuts</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Mobile App Setup</a></li>
            </ul>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    className={`text-left w-full ${selectedCategory === 'All Categories' ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`}
                    onClick={() => setSelectedCategory('All Categories')}
                  >
                    All Categories
                  </button>
                </li>
                <li>
                  <button 
                    className={`text-left w-full ${selectedCategory === 'Getting Started' ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`}
                    onClick={() => setSelectedCategory('Getting Started')}
                  >
                    Getting Started
                  </button>
                </li>
                <li>
                  <button 
                    className={`text-left w-full ${selectedCategory === 'Advanced Features' ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`}
                    onClick={() => setSelectedCategory('Advanced Features')}
                  >
                    Advanced Features
                  </button>
                </li>
                <li>
                  <button 
                    className={`text-left w-full ${selectedCategory === 'Video Tutorials' ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`}
                    onClick={() => setSelectedCategory('Video Tutorials')}
                  >
                    Video Tutorials
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Tutorials;