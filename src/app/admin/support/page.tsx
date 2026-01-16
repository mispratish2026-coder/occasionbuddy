"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { SupportMessage } from "@/types";
import { showSuccess, showError } from "@/utils/toast";

export default function SupportManagement() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, loading, isAdmin, router]);

  // Fetch support messages
  useEffect(() => {
    const fetchSupportMessages = async () => {
      try {
        const snapshot = await getDocs(collection(db, "supportMessages"));
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SupportMessage[];
        setSupportMessages(messagesData);
      } catch (error) {
        console.error("Error fetching support messages:", error);
        showError("Failed to load support messages");
      }
    };

    if (!loading && isAdmin) {
      fetchSupportMessages();
    }
  }, [loading, isAdmin]);

  const handleStatusUpdate = async (messageId: string, newStatus: string) => {
    if (updatingId === messageId) return;
    
    setUpdatingId(messageId);

    try {
      await updateDoc(doc(db, "supportMessages", messageId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      setSupportMessages(
        supportMessages.map((m) => (m.id === messageId ? { ...m, status: newStatus as any } : m))
      );
      showSuccess(`Ticket status updated to ${newStatus}!`);
    } catch (error: any) {
      console.error("Error updating support message:", error);
      const errorMsg = error.message || "Failed to update ticket status";
      showError(errorMsg);
    } finally {
      setUpdatingId(null);
    }
  };

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
    <div className="min-h-screen bg-linear-to-br from-orange-500 via-orange-400 to-amber-500">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b-4 border-orange-300 shadow-2xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              <Link
                href="/admin"
                className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-red-600"
              >
                👑 Admin Panel
              </Link>
              <div className="flex gap-2">
                <Link
                  href="/admin/products"
                  className="px-4 py-2 rounded-lg hover:bg-orange-200 text-orange-700 font-bold transition-all"
                >
                  🧁 Products
                </Link>
                <Link
                  href="/admin/orders"
                  className="px-4 py-2 rounded-lg hover:bg-orange-200 text-orange-700 font-bold transition-all"
                >
                  📦 Orders
                </Link>
                <Link
                  href="/admin/support"
                  className="px-4 py-2 rounded-lg bg-orange-200 text-orange-700 font-bold transition-all"
                >
                  💬 Support
                </Link>
              </div>
            </div>
            <Link
              href="/"
              className="text-orange-700 hover:text-orange-900 font-bold transition-colors"
            >
              ← Back to App
            </Link>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl animate-bounce">💬</div>
            <div>
              <h1 className="text-6xl font-black text-white drop-shadow-lg">Support Management</h1>
              <p className="text-orange-100 mt-2 text-lg font-semibold">Manage and resolve customer support tickets</p>
            </div>
          </div>
        </div>

        {supportMessages.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-orange-300 p-16 text-center">
            <div className="text-7xl mb-6 animate-bounce">📭</div>
            <h2 className="text-4xl font-bold text-orange-600 mb-3">
              No Support Tickets Yet
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              When customers send support requests, they will appear here. Your support inbox is clear! 🎉
            </p>
            <div className="inline-block px-8 py-3 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-full font-bold text-lg">
              ✨ All Systems Running Smoothly
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-yellow-500 hover:shadow-2xl transition-all">
                <p className="text-orange-600 text-sm font-bold uppercase">Open Tickets</p>
                <p className="text-5xl font-black text-yellow-600 mt-2">
                  {supportMessages.filter(m => m.status === "open").length}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-500 hover:shadow-2xl transition-all">
                <p className="text-orange-600 text-sm font-bold uppercase">Resolved</p>
                <p className="text-5xl font-black text-green-600 mt-2">
                  {supportMessages.filter(m => m.status === "resolved").length}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-red-500 hover:shadow-2xl transition-all">
                <p className="text-orange-600 text-sm font-bold uppercase">Total Tickets</p>
                <p className="text-5xl font-black text-red-600 mt-2">{supportMessages.length}</p>
              </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
              {supportMessages.map((message) => (
                <div
                  key={message.id}
                  className="bg-white rounded-2xl shadow-xl border-4 border-orange-300 hover:border-red-400 hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-8 bg-linear-to-br from-white to-orange-50">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h3 className="text-3xl font-black text-orange-700 group-hover:text-red-600 transition-colors">
                          {message.title}
                        </h3>
                        <p className="text-sm text-orange-600 mt-2 flex items-center gap-2 font-bold">
                          <span>👤 User:</span>
                          <span className="font-mono bg-orange-200 px-3 py-1 rounded-lg text-orange-800">
                            {message.userId?.slice(0, 8)}...
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-6 py-3 rounded-full text-sm font-black whitespace-nowrap ring-2 ${
                            message.status === "open"
                              ? "bg-yellow-200 text-yellow-800 ring-yellow-400"
                              : "bg-green-200 text-green-800 ring-green-400"
                          }`}
                        >
                          {message.status === "open" ? "🔴 Open" : "✅ Resolved"}
                        </span>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="bg-orange-100 rounded-xl p-6 mb-6 border-l-4 border-red-500">
                      <p className="text-gray-800 leading-relaxed text-lg font-medium">{message.message}</p>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-6 border-t-4 border-orange-200">
                      <div>
                        <p className="text-sm text-orange-600 font-bold">
                          📅 {message.createdAt
                            ? typeof message.createdAt === 'string'
                              ? new Date(message.createdAt).toLocaleDateString()
                              : (message.createdAt as any).toDate?.()?.toLocaleDateString?.() || "N/A"
                            : "N/A"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-black text-orange-700">Change Status:</label>
                        <select
                          value={message.status}
                          onChange={(e) => handleStatusUpdate(message.id, e.target.value)}
                          disabled={updatingId === message.id}
                          className="px-5 py-3 border-3 border-orange-400 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white font-bold text-orange-700 transition-all hover:border-red-400 hover:shadow-lg"
                        >
                          <option value="open">🔴 Open</option>
                          <option value="resolved">✅ Resolved</option>
                        </select>
                        {updatingId === message.id && (
                          <span className="text-red-600 font-bold animate-pulse">Updating...</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
