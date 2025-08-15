"use client";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuthToken, setAuthToken } from "@/lib/cookiesAction";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleForgotPassword = () => {
    router.push(`/forgot?role=salon`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // API endpoint based on user type
      const endpoint = "/api/auth/salons/login" 
       

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Redirect based on user type
    
        toast.success("You are logined successfully.")
          setAuthToken('salon', 'token') // it is just use only to control the access the login page
        router.push("/salon-dashboard");
    
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
 useEffect(()=>{
    let token = getAuthToken('salon')
    if(token){
      router.push('/salon-dashboard/')
    }
  },[])
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden pt-24">
      {/* Animated background elements */}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Welcome Back</h2>
          <p className="text-gray-500">Sign in to your account</p>
          
          {/* User Type Selector */}
          <div className="flex justify-center mt-4 mb-6">
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <Link href={"/user/signin"}
                type="button"
               
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                 "text-gray-600 hover:text-gray-800"
                }`}
              >
                I'm a Client
              </Link>
              <Link href={"/salon/signin"}
                type="button"
               
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  "bg-white shadow-sm text-indigo-600" 
                   
                }`}
              >
                Salon Owner
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <button 
                onClick={handleForgotPassword}
                className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in as Salon
              </div>
            ) : (
              `Sign In as Salon`
            )}
          </motion.button>
        </form>

      
        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link 
            href={"/salon/signup"} 
            className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            Sign up as {"Salon"}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}