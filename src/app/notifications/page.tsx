"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Notification } from "@/types";

export default function NotificationsPage() {
  const router = useRouter();
  const { user, firebaseUser, loading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/login");
    }
  }, [firebaseUser, loading, router]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!firebaseUser) return;
      try {
        const q = query(
          collection(db, "notifications"),
          where("userId", "==", firebaseUser.uid)
        );
        const snapshot = await getDocs(q);
        const notificationsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          userId: doc.data().userId,
          title: doc.data().title,
          message: doc.data().message,
          read: doc.data().read,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Notification[];

        // Sort by newest first
        notificationsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [firebaseUser]);

  const markAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true,
      });
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
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

  if (!firebaseUser) {
    return null;
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

      {/* Notifications Content */}
      <div className="py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-12">🔔 Notifications</h1>

          {notifications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No notifications yet</h2>
              <p className="text-gray-600">
                You'll receive notifications about your bookings here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                  className={`rounded-2xl p-6 cursor-pointer transition-all transform hover:scale-105 ${
                    notification.read
                      ? "bg-gray-50 border-2 border-gray-200"
                      : "bg-orange-50 border-2 border-orange-300 shadow-lg"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="inline-block h-3 w-3 rounded-full bg-orange-500"></span>
                        )}
                      </div>
                      <p className="text-gray-700 mt-2">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-3">
                        {notification.createdAt.toLocaleDateString()}{" "}
                        {notification.createdAt.toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="text-3xl ml-4">
                      {notification.title.includes("Booking")
                        ? "📅"
                        : notification.title.includes("Confirmed")
                        ? "✅"
                        : notification.title.includes("Completed")
                        ? "🎉"
                        : "ℹ️"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
