"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";

export default function FavoriteSalon({ favoriteSalons, salon, setFavoriteSalons }) {
  const [fav, setFav] = useState(false);

  // Initialize favorite status
  useEffect(() => {
    const isFav = favoriteSalons.some(f => Number(f.salon_id) === Number(salon.id));
    setFav(isFav);
  }, [favoriteSalons, salon.id]);

  // Toggle favorite
  const toggleFavorite = async () => {
    try {
      const res = await fetch("/api/user/salons/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salonId: salon.id }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.data.isFavorite) {
          setFavoriteSalons(prev => [...prev, { salon_id: salon.id }]);
          setFav(true);
          toast.success("Salon added to favorites ❤️");
        } else {
          setFavoriteSalons(prev => prev.filter(f => Number(f.salon_id) !== Number(salon.id)));
          setFav(false);
          toast.info("Salon removed from favorites 💔");
        }
      } else {
        toast.error(data.message || "Failed to update favorite");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating favorite");
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm z-10 transition-colors duration-200"
      aria-label="Toggle favorite"
    >
      <Heart
        size={24}
        className={`cursor-pointer ${fav ? "fill-red-500 text-red-500" : "text-gray-400"}`}
      />
    </button>
  );
}
