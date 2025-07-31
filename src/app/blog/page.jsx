import React from 'react';
import { FaCalendarAlt, FaUser, FaTags, FaSearch, FaArrowRight } from 'react-icons/fa';

const Blog = () => {
  const featuredPost = {
    id: 1,
    title: "5 Strategies to Boost Your Salon Revenue in 2023",
    excerpt: "Discover proven techniques to increase your salon's profitability and client retention rates.",
    author: "Sarah Johnson",
    date: "June 15, 2023",
    category: "Business Growth",
    image: "/blogpost.jpg",
    readTime: "8 min read"
  };

  const blogPosts = [
    {
      id: 2,
      title: "The Psychology of Salon Client Retention",
      excerpt: "Understanding client behavior to build long-term relationships.",
      author: "Michael Chen",
      date: "May 28, 2023",
      category: "Client Management",
      readTime: "6 min read"
    },
    {
      id: 3,
      title: "Essential Salon Hygiene Protocols",
      excerpt: "Maintaining the highest standards of cleanliness in your salon.",
      author: "Dr. Emily Rodriguez",
      date: "May 15, 2023",
      category: "Operations",
      readTime: "10 min read"
    },
    {
      id: 4,
      title: "Social Media Marketing for Salons",
      excerpt: "Leverage Instagram and TikTok to grow your client base.",
      author: "Jamal Williams",
      date: "April 30, 2023",
      category: "Marketing",
      readTime: "7 min read"
    }
  ];

  const popularCategories = [
    "Business Growth", "Marketing", "Client Management", "Staff Training", "Industry Trends"
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-32">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Salon Management Blog</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Expert advice, industry trends, and business tips for salon professionals
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <main className="flex-1">
          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Search blog posts..." 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <select className="border rounded-lg px-4 py-2">
                <option>All Categories</option>
                {popularCategories.map((cat, index) => (
                  <option key={index}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured Post */}
          <div className="mb-12 bg-white rounded-lg overflow-hidden shadow-lg">
            <img 
              src={featuredPost.image} 
              alt={featuredPost.title} 
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <span className="flex items-center mr-4">
                  <FaUser className="mr-1" /> {featuredPost.author}
                </span>
                <span className="flex items-center mr-4">
                  <FaCalendarAlt className="mr-1" /> {featuredPost.date}
                </span>
                <span className="flex items-center">
                  <FaTags className="mr-1" /> {featuredPost.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-3">{featuredPost.title}</h2>
              <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{featuredPost.readTime}</span>
                <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  Read More <FaArrowRight className="ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {blogPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="flex items-center mr-4">
                      <FaUser className="mr-1" /> {post.author}
                    </span>
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-1" /> {post.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{post.category}</span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 rounded border bg-blue-600 text-white">1</button>
              <button className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-50">2</button>
              <button className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-50">3</button>
              <button className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-50">Next</button>
            </nav>
          </div>
        </main>

        <aside className="md:w-64 space-y-6">
          {/* Categories */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold mb-3">Categories</h3>
            <ul className="space-y-2">
              {popularCategories.map((category, index) => (
                <li key={index}>
                  <a href="#" className="flex justify-between items-center text-blue-600 hover:underline">
                    <span>{category}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">24</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Subscribe to Newsletter</h3>
            <p className="text-sm text-gray-600 mb-3">Get the latest salon industry insights</p>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="w-full px-3 py-2 mb-2 border rounded text-sm"
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm">
              Subscribe
            </button>
          </div>

          {/* Popular Tags */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold mb-3">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {["Marketing", "Revenue", "Hygiene", "Staff", "Booking", "Products", "Trends"].map((tag, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Blog;