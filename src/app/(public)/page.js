import React from "react";
import HeroSection from "./component/home/hero";
import ServicesSection from "./component/home/services";
import BookingSteps from "./component/home/booking";
import TeamPreview from "./component/home/teams";
import NewsletterCTA from "./component/home/newLetter";
import Footer from "./component/common/Footer";
import Navbar from "./component/common/NavBar";
import WhyChooseUs from "./component/home/WhyChooseus";
import HowItWorks from "./component/home/Howitswork";
import Testimonials from "./component/home/testiminial";
import StatsSection from "./component/home/StatSection";
import PricingSection from "./component/home/Pricing";
import FAQSection from "./component/home/FAQ";
import SalonBookingSystem from "./component/home/SalonSection";
import SalonList from "./component/home/SalonSection";
import SalonServices from "./component/home/SalonServices";

const HomePage = () => {
  return (
    <div className="bg-white">
     
      <HeroSection />
      <SalonServices/>
      <StatsSection />
      <SalonList/>

      {/* <PricingSection /> */}
      <FAQSection />
      <ServicesSection />
      <WhyChooseUs />
      <HowItWorks />
      {/* <TeamPreview /> */}
      <Testimonials />
      <NewsletterCTA />
      
    </div>
  );
};

export default HomePage;