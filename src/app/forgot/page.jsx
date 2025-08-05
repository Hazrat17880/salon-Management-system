"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ForgotPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);

  // Get role from URL params (default to client)
  const userType = searchParams.get("role") || "client";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // API endpoint based on user type
      const endpoint = userType === "salon" 
        ? "/api/auth/salon/forgot-password" 
        : "/api/auth/client/forgot-password";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset link");
      }

      setEmailSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden pt-16">
      {/* Background animations */}
      <motion.div 
        className="absolute h-[600px] w-[600px] bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute h-[500px] w-[500px] bg-gradient-to-br from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl right-10 bottom-10"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 5
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            {emailSent ? "Check Your Email" : `Reset ${userType === "salon" ? "Salon" : "Client"} Password`}
          </h2>
          <p className="text-gray-500">
            {emailSent 
              ? `We've sent a password reset link to your ${userType} account email` 
              : `Enter your ${userType} account email to reset password`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {userType === "salon" ? "Salon Email" : "Client Email"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={userType === "salon" ? "salon@example.com" : "client@example.com"}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                `Reset ${userType === "salon" ? "Salon" : "Client"} Password`
              )}
            </motion.button>
          </form>
        ) : (
          <div className="text-center">
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
              <p>We've sent a {userType} password reset link to:</p>
              <p className="font-medium mt-1">{email}</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={() => {
                  setEmailSent(false);
                  setError(null);
                }}
                className="text-indigo-600 hover:underline"
              >
                try again
              </button>
            </p>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <Link 
            href={`/signin`} 
            className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            Back to  Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}