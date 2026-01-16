"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ADMIN_EMAIL = "occasionbuddy2024@gmail.com";
const ADMIN_PASSWORD = "Pratish2006@";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Check credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Set admin authentication flag
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminEmail", ADMIN_EMAIL);
        router.push("/admin");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-orange-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-orange-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              href="/"
              className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-600"
            >
              🎉 OccasionBuddy
            </Link>
          </div>
        </div>
      </nav>

      {/* Admin Login Container */}
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="text-6xl">👑</div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-600">
              Restricted area. Admin credentials required.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  className="w-full px-4 py-3 rounded-lg border-2 border-orange-200 focus:border-orange-500 focus:outline-none transition-colors bg-white text-gray-900"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 rounded-lg border-2 border-orange-200 focus:border-orange-500 focus:outline-none transition-colors bg-white text-gray-900"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700 font-medium text-center">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-linear-to-r from-orange-500 to-amber-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Login to Admin Panel"}
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 space-y-3">
            <p className="text-sm text-blue-900 font-semibold">
              ℹ️ Admin Credentials
            </p>
            <p className="text-xs text-blue-800">
              Use the provided admin email and password to access the admin panel.
            </p>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link
              href="/"
              className="text-orange-600 hover:text-orange-700 font-medium underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
