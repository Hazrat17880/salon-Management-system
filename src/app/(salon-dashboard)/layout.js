'use client';
import axios from "axios"; // no curly braces needed for default import
import { useState , useEffect } from "react";
import SalonsSideBar from "@/component/common/SalonSideNavBar";
import SalonsTopBar from "@/component/common/SalonTopNav";
import "./../globals.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // also import the CSS
export default function Layout({ children }) {
  const [ profileData , setProfileData ] = useState([]);
  // To sync sidebar open/close between Sidebar and TopBar,
  // you'd normally lift the state up here and pass as props,
  // but as per request no props are used.
  // So this layout just renders Sidebar + TopBar + children.


// get the salon profiile data and then share with the chils 
// Fetch salon profile data
  useEffect(() => {
    fetchProfileData();
  }, []);

 const fetchProfileData = async () => {
    try {
      const res = await fetch('/api/salons/profile', {
        method: 'GET',
        credentials: 'include', // send cookies if needed
      });

      if (res.status === 401) {
        toast.info("Your session has expired.");
        localStorage.clear();
        return;
      }

      const data = await res.json(); // parse JSON
      // console.log("Parsed profile data:", data.data);

      if (data.success) {
        setProfileData(data.data); // store the profile info
      } else {
        toast.error(data.message || 'Failed to fetch profile data');
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.message || 'Failed to fetch profile data');
    }
  };



  


  return (
  
        <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SalonsSideBar profileData={profileData} />
      <div className="flex flex-col flex-1 overflow-auto">
        <SalonsTopBar profileData={profileData}/>
        <main className="flex-1 p-6 overflow-auto">
          {children ?? (
            <div className="text-center text-gray-400 select-none">
              <p>This is the main content area.</p>
              <p>Add your page content here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
   
  );
}
