"use client"
import React, { useState, useEffect } from "react";
import HeroSection from "../../component/home/hero";
import ServicesSection from "../../component/home/services";
import BookingSteps from "../../component/home/booking";
import TeamPreview from "../../component/home/teams";
import NewsletterCTA from "../../component/home/newLetter";
import Footer from "../../component/common/Footer";
import Navbar from "../../component/common/NavBar";
import WhyChooseUs from "../../component/home/WhyChooseus";
import HowItWorks from "../../component/home/Howitswork";
import Testimonials from "../../component/home/testiminial";
import StatsSection from "../../component/home/StatSection";
import PricingSection from "../../component/home/Pricing";
import FAQSection from "../../component/home/FAQ";
import SalonBookingSystem from "../../component/home/SalonSection";
import SalonList from "../../component/home/SalonSection";
import SalonServices from "../../component/home/SalonServices";
import { Loader2 } from "lucide-react";

const HomePage = () => {
  const [homeData, setHomeData] = useState({
    salons: [],
    services: [],
    sliders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/public/home');
      const data = await response.json();
      
      if (data.success) {
        setHomeData({
          salons: data.salons || [],
          services: data.services || [],
          sliders: data.sliders || []
        });
      } else {
        setError(data.message || 'Failed to fetch home data');
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
      setError('Failed to load content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">⚠️ {error}</div>
          <button
            onClick={fetchHomeData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Pass sliders data to HeroSection */}
      <HeroSection sliders={homeData.sliders} />
      
      {/* Pass services data to SalonServices */}
      <SalonServices services={homeData.services} />
      
      <StatsSection />
      
      {/* Pass salons data to SalonList */}
      <SalonList salons={homeData.salons} />

      {/* <PricingSection /> */}
      <FAQSection />
      
      {/* Pass services data to ServicesSection */}
      <ServicesSection services={homeData.services} />
      
      <WhyChooseUs />
      <HowItWorks />
      {/* <TeamPreview /> */}
      {/* <Testimonials /> */}
      <NewsletterCTA />
    </div>
  );
};

export default HomePage;