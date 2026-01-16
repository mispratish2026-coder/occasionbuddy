"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Order } from "@/types";
import { getUserRole } from "@/lib/auth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, firebaseUser, loading, signOut } = useAuth();
  const { addNotification } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [role, setRole] = useState<string>("user");
  const [supportMessage, setSupportMessage] = useState({
    title: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated (only after loading is complete)
  useEffect(() => {
    if (loading) return; // Don't do anything while loading
    if (!firebaseUser) {
      router.push("/login");
    }
  }, [firebaseUser, loading, router]);

  // Fetch user's role
  useEffect(() => {
    const fetchRole = async () => {
      if (!firebaseUser) return;
      try {
        const userRole = await getUserRole(firebaseUser.uid);
        setRole(userRole);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchRole();
  }, [firebaseUser]);

  // Fetch user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!firebaseUser) return;
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", firebaseUser.uid)
        );
        const snapshot = await getDocs(q);
        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [firebaseUser]);

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firebaseUser || !supportMessage.title || !supportMessage.message) {
      addNotification("⚠️ Please fill in all fields", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      addNotification("📝 Sending your support request...", "info");

      await addDoc(collection(db, "supportMessages"), {
        userId: firebaseUser.uid,
        title: supportMessage.title,
        message: supportMessage.message,
        status: "open",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSupportMessage({ title: "", message: "" });
      setShowSupportForm(false);
      addNotification("✅ Support request sent! We'll get back to you soon.", "success");
    } catch (error) {
      console.error("Error sending support message:", error);
      addNotification("❌ Failed to send support request. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🔐</div>
          <p className="text-gray-600 mb-6">Please log in to view your profile</p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 rounded-xl bg-linear-to-r from-orange-500 to-amber-600 text-white font-bold"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-orange-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-orange-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              href="/"
              className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-600"
            >
              🎉 OccasionBuddy
            </Link>
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-gray-900 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* User Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="text-6xl">👤</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600 mt-1">{user.email}</p>
                <p className="text-sm text-orange-600 font-semibold mt-2">
                  Member since{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar Menu */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex px-6 py-4 text-left font-semibold text-orange-600 hover:bg-orange-50 transition-all items-center gap-3"
                  >
                    👑 Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => setShowSupportForm(!showSupportForm)}
                  className={`w-full px-6 py-4 text-left font-semibold text-gray-900 hover:bg-orange-50 transition-all flex items-center gap-3 ${
                    role === "admin" ? "border-t border-gray-100" : ""
                  }`}
                >
                  💬 Contact Support
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-4 text-left font-semibold text-red-600 hover:bg-red-50 transition-all flex items-center gap-3 border-t border-gray-100"
                >
                  🚪 Logout
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* My Bookings Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  📅 My Bookings
                </h2>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📭</div>
                    <p className="text-gray-600 mb-6">
                      No bookings yet. Start exploring products!
                    </p>
                    <Link
                      href="/"
                      className="inline-block px-6 py-3 rounded-xl bg-linear-to-r from-orange-500 to-amber-600 text-white font-bold hover:shadow-lg transition-all"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border-2 border-orange-100 rounded-xl p-6 hover:bg-orange-50 transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Order #{order.id.slice(0, 8)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              📅 {order.date}
                            </p>
                          </div>
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        {order.note && (
                          <p className="text-sm text-gray-700 mb-3">
                            <span className="font-semibold">Notes:</span> {order.note}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📍 Location:</span>
                          <span className="font-mono">
                            {order.location.latitude.toFixed(4)},
                            {order.location.longitude.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Support Form */}
              {showSupportForm && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    💬 Send Support Message
                  </h2>

                  <form onSubmit={handleSupportSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={supportMessage.title}
                        onChange={(e) =>
                          setSupportMessage({
                            ...supportMessage,
                            title: e.target.value,
                          })
                        }
                        placeholder="e.g., Issue with my order"
                        className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Message
                      </label>
                      <textarea
                        value={supportMessage.message}
                        onChange={(e) =>
                          setSupportMessage({
                            ...supportMessage,
                            message: e.target.value,
                          })
                        }
                        placeholder="Describe your issue or request..."
                        className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 resize-none"
                        rows={5}
                        required
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 rounded-xl bg-linear-to-r from-orange-500 to-amber-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSupportForm(false)}
                        className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
