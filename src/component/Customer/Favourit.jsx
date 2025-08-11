"use client";
import { motion } from "framer-motion";

const FavoritesContent = ({ favorites, removeFavorite }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-6">My Favorite Salons</h3>
      
      <div className="space-y-3 md:space-y-4">
        {favorites.length > 0 ? (
          favorites.map(favorite => (
            <motion.div 
              key={favorite.id}
              whileHover={{ y: -2 }}
              className="flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg hover:shadow-sm transition"
            >
              <div>
                <h4 className="text-sm md:text-base font-medium text-gray-900">{favorite.salon}</h4>
                <p className="text-xs md:text-sm text-gray-600">{favorite.service}</p>
                <div className="flex items-center mt-1">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs md:text-sm text-gray-700">{favorite.rating}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-xs md:text-sm text-gray-500">Last visited: {favorite.lastVisited}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-2 py-1 md:px-3 text-xs md:text-sm bg-indigo-600 text-white rounded md:rounded-lg hover:bg-indigo-700">
                  Book Again
                </button>
                <button 
                  onClick={() => removeFavorite(favorite.id)}
                  className="px-2 py-1 md:px-3 text-xs md:text-sm bg-gray-200 text-gray-700 rounded md:rounded-lg hover:bg-gray-300"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-6 md:py-8 text-gray-500">
            You haven't added any salons to favorites yet
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesContent;