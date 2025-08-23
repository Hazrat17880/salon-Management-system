'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { 
  FiSearch, 
  FiStar, 
  FiMapPin, 
  FiChevronLeft, 
  FiChevronRight,
  FiHeart, 
  FiX
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import FavoriteSalon from "./FavoriteSalon";
import Link from "next/link";

const SalonsContent = () => {
  const [salons, setSalons] = useState([]);
  const [favoriteSalons, setFavoriteSalons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalSalons: 0,
    salonsPerPage: 10
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch salons data
  const fetchSalons = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/salons?page=${page}&limit=10`);
      if(response.status === 401){
        localStorage.clear();
        toast.info("Your session is expired.")
        router.push("/salon/sigin")
      }
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setSalons(data.data.salons);
        setFavoriteSalons(data.data.favorite.map(fav => fav.id));
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);



  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchSalons(newPage);
    }
  };

  const filteredSalons = salons.filter(salon => {
    const searchLower = searchQuery.toLowerCase();
    return (
      salon.salon_name.toLowerCase().includes(searchLower) ||
      salon.city.toLowerCase().includes(searchLower) ||
      salon.description?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-md">
          <FiX className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">Error Loading Salons</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={() => fetchSalons()} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 font-sans">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white p-6 rounded-3xl shadow-md mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Find Salons Near You</h1>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for salons by name, city or description..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl pl-12 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredSalons.length > 0 ? filteredSalons.map(salon => (
            <motion.div 
              key={salon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group relative"
            >

              <FavoriteSalon salon={salon} favoriteSalons={favoriteSalons} setFavoriteSalons={setFavoriteSalons}/>
         

              <div className="cursor-pointer">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                 {
                  salon.image &&
                  (
                     <img
                    src={salon.image} // Replace with salon.image if available
                    alt={salon.salon_name || 'the image is'}
                    
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  )
                 }
                  <div className="absolute bottom-4 left-4 flex items-center bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                    <FiMapPin className="text-indigo-600 mr-1" />
                    <span>{salon.city}, {salon.state}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-xl text-gray-800">{salon.salon_name}</h4>
                    <div className="flex items-center bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                      <FiStar className="mr-1 fill-current text-yellow-400 stroke-yellow-400" />
                      <span>4.5</span> {/* Replace with actual rating if available */}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {salon.description || 'No description available'}
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    {salon.street_info}, {salon.postal_code}
                  </p>
                  
                  <button className="w-full py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-md">
                  <Link href={`/user-dashboard/salons/${salon.id}`}>
                    View Details
                  </Link>

                  </button>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 text-gray-500">
              <FiX className="mx-auto h-16 w-16 mb-4" />
              <h3 className="text-2xl font-semibold">No Salons Found</h3>
              <p className="mt-2">Try adjusting your search query.</p>
            </div>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 bg-white p-4 rounded-xl shadow-md">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`p-2 rounded-full ${pagination.currentPage === 1 ? 'text-gray-400' : 'text-indigo-600 hover:bg-indigo-50'}`}
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex space-x-2">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      pageNum === pagination.currentPage
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`p-2 rounded-full ${pagination.currentPage === pagination.totalPages ? 'text-gray-400' : 'text-indigo-600 hover:bg-indigo-50'}`}
            >
              <FiChevronRight className="h-5 w-5" />
            </button>

            <span className="text-sm text-gray-500 ml-4">
              Showing {(pagination.currentPage - 1) * pagination.salonsPerPage + 1}-
              {Math.min(pagination.currentPage * pagination.salonsPerPage, pagination.totalSalons)} of {pagination.totalSalons}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalonsContent;