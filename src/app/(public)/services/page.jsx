"use client"
import SalonServices from '@/component/home/SalonServices';
import React, { useEffect, useState } from 'react';

const Page = () => {
      const [services, setServices] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
    
      useEffect(() => {
        fetchHomeData();
      }, []);
    
      const fetchHomeData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch('/api/public/services');
          const data = await response.json();
          console.log(data);
          if (data.success) {
            setServices(data.data.services|| []);
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
    return (
      <div className='py-10 md:py-20'>
        <SalonServices services={services} />
        </div>
       
    );
}

export default Page;
