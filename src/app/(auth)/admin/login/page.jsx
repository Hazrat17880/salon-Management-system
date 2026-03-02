"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaExclamationTriangle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getAuthToken, setAuthToken } from "@/lib/cookiesAction";

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          setAuthToken("rememberAdminEmail", formData.email);
        } else {
          setAuthToken("rememberAdminEmail", "");
        }

        toast.success("Login successful! Redirecting...", {
          duration: 1500,
          position: "top-right",
        });

        setTimeout(() => {
          router.push("/admin-dashboard");
        }, 1500);
      } else {
        setError(data.message || "Login failed. Please try again.");
        toast.error(data.message || "Login failed!", {
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection and try again.");
      toast.error("Network error. Please try again.", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const rememberedEmail = getAuthToken("rememberAdminEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 relative overflow-hidden">

      {/* ── Toast notifications ── */}
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
              borderRadius: "10px",
              fontSize: "14px",
            },
            iconTheme: { primary: "#22c55e", secondary: "#fff" },
          },
          error: {
            style: {
              background: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              fontSize: "14px",
            },
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />

      {/* ── Animated background blobs ── */}
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

      {/* ── Login Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl px-8 py-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Admin Dashboard</h2>
          <p className="text-gray-500 text-sm">Salon Management System</p>
        </div>

        {/* Error alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
          >
            <FaExclamationTriangle className="text-red-500 shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@salon.com"
              required
              disabled={isLoading}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-60 disabled:bg-gray-50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength="8"
                disabled={isLoading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10 disabled:opacity-60 disabled:bg-gray-50"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                disabled={isLoading}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              href="/admin/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
              onClick={(e) => isLoading && e.preventDefault()}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </div>
            ) : (
              "Login to Dashboard"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}