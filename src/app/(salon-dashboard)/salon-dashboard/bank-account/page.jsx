"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bankAccountStatus, setBankAccountStatus] = useState(null); // Add this state

  useEffect(() => {
    // Check URL parameters FIRST (when returning from Stripe)
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (success === 'connected') {
      toast.success('Stripe account successfully connected! Your account is now ready to receive payments.');
      window.history.replaceState({}, '', '/salon-dashboard/bank-account');
    } else if (error === 'refresh') {
      toast.error('Stripe onboarding was interrupted. Please try again.');
    }
    
    // Then fetch profile data
    fetchProfileData();
  }, []);

  // Function to check bank account status
  const checkBankAccountStatus = async () => {
    if (!profileData?.id) return null;
    
    try {
      const res = await fetch('/api/salons/check-bank-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ salonId: profileData.id })
      });
      
      const response = await res.json();
      console.log("Bank account status API response:", response);
      
      if (response.success) {
        setBankAccountStatus(response.data); // Store in state
        console.log('Bank account status:', response.data);
        
        if (response.data.isConnected) {
          console.log('✅ Bank account is already connected');
          // If the status shows connected but profileData doesn't, refresh profile
          if (!profileData.stripe_onboarded) {
            fetchProfileData();
          }
        }
        return response.data;
      }
    } catch (error) {
      console.error('Error checking bank account:', error);
    }
  };

  // useEffect to check status when profileData loads
  useEffect(() => {
    if (profileData?.id) {
      checkBankAccountStatus();
    }
  }, [profileData?.id]);

  const fetchProfileData = async () => {
    try {
      const res = await fetch('/api/salons/profile', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.status === 401) {
        toast.info("Your session has expired.");
        localStorage.clear();
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.success) {
        setProfileData(data.data);
        console.log("Profile data loaded:", data.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectStripe = async () => {
    if (!profileData?.id) {
      toast.error("Profile data not loaded yet. Please wait...");
      return;
    }

    try {
      const loadingToast = toast.loading("Connecting to Stripe...");

      const res = await fetch("/api/stripe/create-connected-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ salonId: profileData.id }),
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) {
        throw new Error(data.error || "Failed to connect Stripe");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No onboarding URL received");
      }
    } catch (err) {
      console.error("Stripe connect failed:", err);
      toast.error(err.message || "Failed to connect Stripe. Try again!");
    }
  };

  const handleRefreshStatus = async () => {
    const status = await checkBankAccountStatus();
    if (status?.isConnected) {
      toast.success('Bank account is connected and active!');
    } else {
      toast.info('Bank account is not connected');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load profile data</p>
          <button
            onClick={fetchProfileData}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Determine connection status - use bankAccountStatus if available, otherwise use profileData
  const isConnected = bankAccountStatus?.isConnected || 
                     (profileData.stripe_account_id && profileData.stripe_onboarded);
  
  const hasStripeAccount = profileData.stripe_account_id || bankAccountStatus?.stripe_account_id;
  const isFullyOnboarded = isConnected;

  // For debugging
  console.log("UI State:", {
    isConnected,
    hasStripeAccount,
    isFullyOnboarded,
    profileData: {
      stripe_account_id: profileData.stripe_account_id,
      stripe_onboarded: profileData.stripe_onboarded
    },
    bankAccountStatus
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Show connect button ONLY if not connected */}
      {!isConnected ? (
        !hasStripeAccount ? (
          // Case 1: No Stripe account yet
          <>
            <h2 className="text-2xl font-bold mb-4">Connect Your Bank Account</h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              To receive payments from bookings, you need to connect a Stripe account.
              This is where your earnings will be deposited.
            </p>
            <button
              onClick={handleConnectStripe}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Connect Stripe
            </button>
          </>
        ) : (
          // Case 2: Account created but onboarding incomplete
          <div className="text-center">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-xl mb-6">
              <p className="font-bold text-lg mb-2">⚠️ Onboarding Incomplete</p>
              <p className="mb-4">
                Your Stripe account was created but you haven't completed the setup.
                Please finish the onboarding to start receiving payments.
              </p>
              <p className="text-sm mb-4">
                Account ID: {profileData.stripe_account_id || bankAccountStatus?.stripe_account_id}
              </p>
            </div>
            <div className="space-x-4">
              <button
                onClick={handleConnectStripe}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold"
              >
                Complete Onboarding
              </button>
              <button
                onClick={handleRefreshStatus}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-xl font-semibold"
              >
                Check Status
              </button>
            </div>
          </div>
        )
      ) : (
        // Case 3: Fully onboarded - NO CONNECT BUTTON SHOWN HERE
        <div className="text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-8 py-6 rounded-xl mb-6">
            <p className="font-bold text-2xl mb-2">✅ Stripe Connected!</p>
            <p className="mb-4">
              Your Stripe account is fully set up and ready to receive payments.
            </p>
            <p className="text-sm bg-white p-3 rounded-lg">
              Account ID: {profileData.stripe_account_id || bankAccountStatus?.stripe_account_id}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Account Details</h3>
              <p className="text-sm text-gray-600">
                Status: <span className="text-green-600">Active</span>
              </p>
              <p className="text-sm text-gray-600">
                Payouts: Enabled
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Next Steps</h3>
              <p className="text-sm text-gray-600">
                Your salon can now accept online payments from customers.
              </p>
            </div>
          </div>
          
          {/* Optional refresh button */}
          <button
            onClick={handleRefreshStatus}
            className="mt-6 text-indigo-600 hover:text-indigo-800 underline"
          >
            ↻ Refresh Status
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;