"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    // Check if user is admin based on Firestore role
    if (!loading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              <Link
                href="/admin"
                className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-600"
              >
                👑 Admin Panel
              </Link>
              <div className="flex gap-6">
                <Link
                  href="/admin/products"
                  className="px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 font-medium transition-all"
                >
                  🧁 Products
                </Link>
                <Link
                  href="/admin/orders"
                  className="px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 font-medium transition-all"
                >
                  📦 Orders
                </Link>
                <Link
                  href="/admin/support"
                  className="px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 font-medium transition-all"
                >
                  💬 Support
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Back to App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back, Admin! 👑
          </h1>
          <p className="text-gray-600">
            Manage all products, orders, and support tickets from here.
          </p>
        </div>

        {/* Admin Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Products Management */}
          <Link
            href="/admin/products"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-5xl mb-4">🧁</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Product Management
            </h2>
            <p className="text-gray-600 mb-4">
              Add, edit, and delete products from the catalog
            </p>
            <button className="px-4 py-2 rounded-lg bg-orange-100 text-orange-600 font-semibold hover:bg-orange-200 transition-all">
              Manage Products →
            </button>
          </Link>

          {/* Orders Management */}
          <Link
            href="/admin/orders"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Management
            </h2>
            <p className="text-gray-600 mb-4">
              View and update all customer bookings and orders
            </p>
            <button className="px-4 py-2 rounded-lg bg-blue-100 text-blue-600 font-semibold hover:bg-blue-200 transition-all">
              View Orders →
            </button>
          </Link>

          {/* Support Management */}
          <Link
            href="/admin/support"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-5xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Support Requests
            </h2>
            <p className="text-gray-600 mb-4">
              Handle and respond to customer support messages
            </p>
            <button className="px-4 py-2 rounded-lg bg-green-100 text-green-600 font-semibold hover:bg-green-200 transition-all">
              View Messages →
            </button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">12</div>
              <p className="text-gray-600">Total Products</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24</div>
              <p className="text-gray-600">Pending Orders</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">156</div>
              <p className="text-gray-600">Completed Orders</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">8</div>
              <p className="text-gray-600">Support Tickets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
