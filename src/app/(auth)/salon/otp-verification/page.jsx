"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft, FaCheckCircle, FaRegClock } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/lib/cookiesAction";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const inputsRef = useRef([]);
  const [email, setEmail] = useState("");
  const [ purpose , setPurpose ] = useState("")
  const router = useRouter();

  // Load saved forgot data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("forgotData");
    if (storedData) {
      const forgotData = JSON.parse(storedData);
      setEmail(forgotData.email || "");
      setPurpose(FormData.purpose)
    
    }
  }, []);

  // Handle OTP input
  const handleChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) newOtp[i] = pasteData[i];
      setOtp(newOtp);
      inputsRef.current[Math.min(pasteData.length, 5)].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.some((d) => d === "")) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const otpCode = otp.join("");
      const response = await fetch("/api/auth/salons/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpCode, email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Verification failed");

      setIsVerified(true);
      purpose ==="forgot" ? router.push("/salon/reset-password") :  
      router.push('/salon-dashboard')
      setAuthToken("salon", "the salon is logined now.");
      toast.success("Your Salon is verified successfully.");
    } catch (err) {
      toast.error(err.message || "An error occurred during verification");
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // Timer for OTP resend
  useEffect(() => {
    if (timeLeft > 0 && !isVerified) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isVerified]);

  // Resend OTP
  const resendOTP = async () => {
    try {
      setTimeLeft(120);
      const response = await fetch("/api/auth/salons/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to resend OTP");
      toast.success("OTP has been resent to your email");
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4 pt-[90px] relative overflow-hidden pb-8">
      {/* Animated backgrounds */}
      <motion.div
        className="absolute h-[600px] w-[600px] bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"
        animate={{ x: [0, 100, 0], y: [0, -50, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute h-[500px] w-[500px] bg-gradient-to-br from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl right-10 bottom-10"
        animate={{ x: [0, -80, 0], y: [0, 60, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", delay: 5 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md"
      >
        {!isVerified ? (
          <>
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">OTP Verification</h2>
              <p className="text-gray-500">We've sent a 6-digit code to your email</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-2xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <div className="text-center text-sm text-gray-500">
                {timeLeft > 0 ? (
                  <div className="flex items-center justify-center gap-1">
                    <FaRegClock className="text-gray-400" />
                    <span>
                      Resend OTP in {Math.floor(timeLeft / 60)}:
                      {String(timeLeft % 60).padStart(2, "0")}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={resendOTP}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition"
                disabled={isLoading || otp.some((digit) => digit === "")}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <Link
                href="/salon/signin"
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline flex items-center justify-center"
              >
                <FaArrowLeft className="mr-1" /> Back to login
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Verification Successful!</h3>
            <p className="text-gray-600 mb-6">
              Your account has been successfully verified. You can now access your salon dashboard.
            </p>
            <Link
              href="/salon-dashboard"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
