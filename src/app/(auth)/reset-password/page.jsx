"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";

export default function NewPassword() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const token = searchParams.get("token"); // ✅ token from query string
  const router = useRouter();

  const [email, setEmail] = useState(""); // ✅ safe handling
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // ✅ safely get email from localStorage after mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const url =
        role === "user"
          ? "/api/auth/user/reset-password"
          : "/api/auth/salon/reset-password";

      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
    email,
    password: formData.password, // ✅ use 'password' not 'newPassword'
    token, // only include if backend needs it
  }),

      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4 pt-[90px] relative overflow-hidden pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md"
      >
        {!isSuccess ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Create New Password
            </h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password*
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password*
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-500 text-white font-medium rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <FaCheckCircle className="h-10 w-10 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Password Updated!</h3>
            <Link
              href="/users/signin"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
            >
              Back to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
