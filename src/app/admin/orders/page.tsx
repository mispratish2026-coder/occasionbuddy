"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Order } from "@/types";

export default function OrderManagement() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const { addNotification } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, loading, isAdmin, router]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "orders"));
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
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      const statusLabels: Record<string, string> = {
        pending: "Pending",
        confirmed: "Confirmed",
        completed: "Completed",
        cancelled: "Cancelled"
      };
      
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
      });
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
      );
      
      addNotification(`✅ Order status updated to ${statusLabels[newStatus]}!`, "success");
    } catch (error) {
      console.error("Error updating order:", error);
      addNotification("❌ Failed to update order status", "error");
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
                  className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 font-medium transition-all"
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
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to App
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">📦 Order Management</h1>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  User Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Mobile No
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-600">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-mono font-bold text-gray-900">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {order.userName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.userEmail}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.userMobileNo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
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
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusUpdate(order.id, e.target.value)
                        }
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                      >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
