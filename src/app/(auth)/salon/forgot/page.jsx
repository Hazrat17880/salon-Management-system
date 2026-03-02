"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "react-toastify";

export default function SalonForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Salon forgot password endpoint
      const response = await fetch("/api/auth/salons/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        throw new Error(`Invalid server response: ${text.slice(0, 100)}...`);
      }

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      setEmailSent(true);

      localStorage.setItem(
        "forgotData",
        JSON.stringify({ email, purpose: "forgot", role: "salon" })
      );
      toast.success("an OTP has been send to your emial address please verify withing 15 minuts")

      router.push("/salon/otp-verification");
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
        {/* <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            {emailSent ? "Check Your Email" : "Reset Salon Password"}
          </h2>
          <p className="text-gray-500">
            {emailSent
              ? `We've sent a password reset link to your salon account email`
              : `Enter your salon account email to reset password`}
          </p>
        </div> */}

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salon Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="salon@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Reset Salon Password"}
            </motion.button>
          </form>
        ) : (
          <div className="text-center">
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
              <p>We've sent a salon password reset link to:</p>
              <p className="font-medium mt-1">{email}</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Didn't receive the email?{" "}
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
            href="/salon/signin"
            className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            Back to Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
