"use client"
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUser, FaTags, FaSearch, FaArrowRight, FaRegBookmark, FaRegComment } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Blog = () => {
  // All blog posts data
  const allPosts = [
    {
      id: 1,
      title: "5 Strategies to Boost Your Salon Revenue in 2023",
      excerpt: "Discover proven techniques to increase your salon's profitability and client retention rates in today's competitive market.",
      author: "Sarah Johnson",
      date: "June 15, 2023",
      category: "Business Growth",
      image: "/blogpost.jpg",
      readTime: "8 min read",
      comments: 12,
      content: "Full content for post 1..."
    },
    {
      id: 2,
      title: "The Psychology of Salon Client Retention",
      excerpt: "Understanding client behavior to build long-term relationships and increase lifetime value.",
      author: "Michael Chen",
      date: "May 28, 2023",
      category: "Client Management",
      readTime: "6 min read",
      comments: 8,
      image: "/fe1.webp",
      content: "Full content for post 2..."
    },
    {
      id: 3,
      title: "Essential Salon Hygiene Protocols",
      excerpt: "Maintaining the highest standards of cleanliness in your salon to ensure client safety and satisfaction.",
      author: "Dr. Emily Rodriguez",
      date: "May 15, 2023",
      category: "Operations",
      readTime: "10 min read",
      comments: 15,
      image: "/fe2.webp",
      content: "Full content for post 3..."
    },
    {
      id: 4,
      title: "Social Media Marketing for Salons",
      excerpt: "Leverage Instagram and TikTok to grow your client base with proven content strategies.",
      author: "Jamal Williams",
      date: "April 30, 2023",
      category: "Marketing",
      readTime: "7 min read",
      comments: 5,
      image: "/fe3.webp",
      content: "Full content for post 4..."
    },
    // Additional posts for pagination demo
    {
      id: 5,
      title: "Top Hair Color Trends for 2023",
      excerpt: "Explore the most popular hair color techniques that clients are requesting this year.",
      author: "Lisa Thompson",
      date: "April 22, 2023",
      category: "Trends",
      readTime: "5 min read",
      comments: 7,
      image: "/fe4.webp",
      content: "Full content for post 5..."
    },
    {
      id: 6,
      title: "Building an Effective Salon Team",
      excerpt: "Strategies for hiring, training and retaining top talent in your salon.",
      author: "Robert Martinez",
      date: "April 15, 2023",
      category: "Staff Training",
      readTime: "9 min read",
      comments: 3,
      image: "/fe5.webp",
      content: "Full content for post 6..."
    }
  ];

  const popularCategories = [
    { name: "Business Growth", count: 24 },
    { name: "Marketing", count: 18 },
    { name: "Client Management", count: 15 },
    { name: "Staff Training", count: 12 },
    { name: "Industry Trends", count: 9 },
    { name: "Operations", count: 7 }
  ];

  const popularTags = [
    "Marketing", "Revenue", "Hygiene", "Staff", "Booking", "Products", "Trends", "Loyalty"
  ];

  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(allPosts[0]);
  const postsPerPage = 4;

  // Filter posts based on search and category
  useEffect(() => {
    let result = allPosts;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'All Categories') {
      result = result.filter(post => post.category === selectedCategory);
    }
    
    setFilteredPosts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedCategory]);

  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle read more click
  const handleReadMore = (postId) => {
    // In a real app, this would navigate to a detailed post page
    console.log(`Read more clicked for post ${postId}`);
    alert(`Opening post ${postId}. In a real application, this would navigate to a detailed view.`);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.header 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-16 text-center"
        >
          <motion.div variants={fadeIn} className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
            Industry Insights
          </motion.div>
          <motion.h1 variants={fadeIn} className="text-4xl font-bold text-gray-900 mb-4 font-serif tracking-tight">
            Salon Excellence Blog
          </motion.h1>
          <motion.p variants={fadeIn} className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert advice, industry trends, and business strategies for salon professionals
          </motion.p>
        </motion.header>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <main className="flex-1">
            {/* Search and Filter */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-10"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Search articles..." 
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FaSearch className="absolute left-4 top-4 text-gray-400" />
                </div>
                <select 
                  className="border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option>All Categories</option>
                  {popularCategories.map((cat, index) => (
                    <option key={index}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Featured Post */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              className="mb-16 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="relative h-80 w-full">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-1/2" />
              </div>
              <div className="p-8">
                <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-4">
                  <span className="flex items-center">
                    <FaUser className="mr-2" /> {featuredPost.author}
                  </span>
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-2" /> {featuredPost.date}
                  </span>
                  <span className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{featuredPost.title}</h2>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500 flex items-center">
                      <FaRegComment className="mr-1" /> {featuredPost.comments} comments
                    </span>
                    <span className="text-sm text-gray-500">{featuredPost.readTime}</span>
                  </div>
                  <button 
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium group"
                    onClick={() => handleReadMore(featuredPost.id)}
                  >
                    Read Article
                    <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Recent Posts */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8 mb-12"
            >
              {currentPosts.map((post, index) => (
                <motion.div 
                  key={post.id}
                  variants={fadeIn}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  {/* Image container with background image */}
                  <div 
                    className="h-48 bg-gray-100 bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.image})` }}
                  ></div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-xs text-gray-500 mb-3 gap-3">
                      <span>{post.date}</span>
                      <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-snug">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {post.category}
                      </span>
                      <button 
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        onClick={() => handleReadMore(post.id)}
                      >
                        Read <FaArrowRight className="ml-1 text-xs" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {filteredPosts.length > postsPerPage && (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                variants={fadeIn}
                viewport={{ once: true }}
                className="flex justify-center"
              >
                <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                  <button 
                    className={`px-4 py-2 rounded-l-md border border-gray-300 ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                      key={page}
                      className={`px-4 py-2 border border-gray-300 ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                      onClick={() => paginate(page)}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button 
                    className={`px-4 py-2 rounded-r-md border border-gray-300 ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </nav>
              </motion.div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-8">
            {/* Categories */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-5 pb-3 border-b border-gray-100">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#" 
                    className={`flex justify-between items-center py-2 transition-colors ${selectedCategory === 'All Categories' ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCategory('All Categories');
                    }}
                  >
                    <span>All Categories</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      {allPosts.length}
                    </span>
                  </a>
                </li>
                {popularCategories.map((category, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className={`flex justify-between items-center py-2 transition-colors ${selectedCategory === category.name ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCategory(category.name);
                      }}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white"
            >
              <div className="flex items-center mb-4">
                <FaRegBookmark className="text-blue-200 mr-3" />
                <h3 className="font-semibold text-lg">Weekly Digest</h3>
              </div>
              <p className="text-blue-100 mb-5">Get the latest salon industry insights delivered to your inbox</p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-3 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                />
                <button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 rounded-lg text-sm transition-colors">
                  Subscribe
                </button>
              </div>
            </motion.div>

            {/* Popular Tags */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-5 pb-3 border-b border-gray-100">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      setSearchQuery(tag);
                    }}
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blog;