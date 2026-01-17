"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
}

const getMockProducts = (): Record<string, Product> => ({
  "mock-1": {
    id: "mock-1",
    title: "Chocolate Dream Cake",
    price: 899,
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    category: "cake",
  },
  "mock-2": {
    id: "mock-2",
    title: "Red Velvet Cake",
    price: 1099,
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    category: "cake",
  },
  "mock-3": {
    id: "mock-3",
    title: "Balloon Decoration Set",
    price: 499,
    imageUrl:
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=400&fit=crop",
    category: "decoration",
  },
});

export default function BookingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { firebaseUser, loading } = useAuth();
  const { addNotification } = useNotification();

  const productId = searchParams.get("productId");

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMobileNo, setUserMobileNo] = useState("");

  /* 🔐 Redirect if not logged in */
  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/login");
    }
  }, [firebaseUser, loading, router]);

  /* 👤 Load user data */
  useEffect(() => {
    if (!firebaseUser) return;

    const loadUser = async () => {
      const snap = await getDoc(doc(db, "users", firebaseUser.uid));
      if (snap.exists()) {
        const data = snap.data();
        setUserName(data.name || "");
        setUserEmail(data.email || "");
        setUserMobileNo(data.mobileNo || "");
      }
    };

    loadUser();
  }, [firebaseUser]);

  /* 🛒 Load product */
  useEffect(() => {
    if (!productId) return;

    if (productId.startsWith("mock-")) {
      setProduct(getMockProducts()[productId]);
      return;
    }

    const loadProduct = async () => {
      const snap = await getDoc(doc(db, "products", productId));
      if (snap.exists()) {
        const data = snap.data();
        setProduct({
          id: snap.id,
          title: data.title,
          price: Number(data.price),
          imageUrl: data.imageUrl,
          category: data.category,
        });
      }
    };

    loadProduct();
  }, [productId]);

  /* 📍 Location */
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLatitude(pos.coords.latitude);
      setLongitude(pos.coords.longitude);
      addNotification("📍 Location selected", "success");
    });
  };

  /* ✅ Submit booking */
  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firebaseUser || !selectedDate || !latitude || !longitude) {
      addNotification("Fill all required fields", "warning");
      return;
    }

    setIsSubmitting(true);

    await addDoc(collection(db, "orders"), {
      userId: firebaseUser.uid,
      userName,
      userEmail,
      userMobileNo,
      productId,
      date: selectedDate,
      location: { latitude, longitude },
      note: notes,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    addNotification("🎉 Booking created!", "success");
    router.push("/");
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!firebaseUser) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Complete Booking</h1>

      <form onSubmit={submitBooking} className="space-y-4">
        <input
          type="date"
          required
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <button
          type="button"
          onClick={getLocation}
          className="w-full border p-3 rounded"
        >
          Use Current Location
        </button>

        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <button
          disabled={isSubmitting}
          className="w-full bg-orange-500 text-white p-3 rounded font-bold"
        >
          {isSubmitting ? "Booking..." : "Book Now"}
        </button>

        <Link href="/" className="block text-center underline">
          Back to Home
        </Link>
      </form>
    </div>
  );
}
