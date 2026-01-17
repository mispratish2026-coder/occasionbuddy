"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

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
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    category: "cake",
  },
  "mock-2": {
    id: "mock-2",
    title: "Red Velvet Cake",
    price: 1099,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    category: "cake",
  },
  "mock-3": {
    id: "mock-3",
    title: "Balloon Decoration Set",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=400&fit=crop",
    category: "decoration",
  },
  "mock-4": {
    id: "mock-4",
    title: "Party Banner Pack",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=400&fit=crop",
    category: "decoration",
  },
  "mock-5": {
    id: "mock-5",
    title: "Luxury Gift Hamper",
    price: 1499,
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop",
    category: "gift",
  },
  "mock-6": {
    id: "mock-6",
    title: "Personalized Gift Box",
    price: 799,
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop",
    category: "gift",
  },
});

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, firebaseUser, loading } = useAuth();
  const { addNotification } = useNotification();

  const productId = searchParams.get("productId");
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMobileNo, setUserMobileNo] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/login");
    }
  }, [firebaseUser, loading, router]);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!firebaseUser) return;
      try {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || "");
          setUserEmail(userData.email || "");
          setUserMobileNo(userData.mobileNo || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [firebaseUser]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        // Check if it's a mock product
        if (productId.startsWith("mock-")) {
          const mockProducts = getMockProducts();
          const mockProduct = mockProducts[productId];
          if (mockProduct) {
            setProduct(mockProduct);
            return;
          }
        }

        // Otherwise fetch from Firestore
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({
            id: docSnap.id,
            title: data.title || "Product",
            price: Number(data.price) || 0,
            imageUrl: data.imageUrl || "",
            category: data.category || "cake",
          });
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  // Get current location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          addNotification("📍 Location selected successfully!", "success");
        },
        (error) => {
          console.error("Error getting location:", error);
          addNotification("❌ Unable to get your location. Please enable location services.", "error");
        }
      );
    } else {
      addNotification("❌ Geolocation is not supported by your browser.", "error");
    }
  };

  // Handle booking submission
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firebaseUser || !selectedDate || latitude === null || longitude === null) {
      addNotification("⚠️ Please fill in all required fields", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      addNotification("📝 Creating your booking...", "info");

      const orderData = {
        userId: firebaseUser.uid,
        userName,
        userEmail,
        userMobileNo,
        productId: productId || "",
        date: selectedDate,
        location: {
          latitude,
          longitude,
        },
        note: notes,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);

      // Create notification in database
      await addDoc(collection(db, "notifications"), {
        userId: firebaseUser.uid,
        title: "Booking Confirmed! 🎉",
        message: `Your booking for ${product?.title} on ${selectedDate} has been created. Status: Pending confirmation.`,
        read: false,
        createdAt: serverTimestamp(),
      });

      addNotification("✅ Booking created successfully! Redirecting...", "success");
      setBookingSuccess(true);

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Error creating booking:", error);
      addNotification("❌ Failed to create booking. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
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
            <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-600">
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

      {/* Success Message */}
      {bookingSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 m-4 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Booking Created!</h2>
          <p className="text-green-700">Redirecting to home...</p>
        </div>
      )}

      {/* Booking Content */}
      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product Summary */}
            <div className="md:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-lg overflow-hidden">
                {product && (
                  <>
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6 space-y-4">
                      <div>
                        <p className="text-sm text-orange-600 font-semibold uppercase">
                          {product.category}
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 mt-1">
                          {product.title}
                        </h3>
                      </div>
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-600 text-sm mb-2">Price</p>
                        <p className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-600">
                          ₹{product.price}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Booking Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

                <form onSubmit={handleBooking} className="space-y-8">
                  {/* Date Selection */}
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        📅 Select Date
                      </span>
                      <span className="text-sm text-gray-600 mt-1 block">
                        Choose when you want the product to be delivered
                      </span>
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 text-gray-900"
                      required
                    />
                  </div>

                  {/* Location Selection */}
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        📍 Delivery Location
                      </span>
                      <span className="text-sm text-gray-600 mt-1 block">
                        We'll deliver to your GPS coordinates
                      </span>
                    </label>

                    {latitude && longitude ? (
                      <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                        <p className="text-sm font-semibold text-orange-900 mb-2">✅ Location Selected</p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Latitude:</span> {latitude.toFixed(4)}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Longitude:</span> {longitude.toFixed(4)}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                        <p className="text-sm text-gray-600">No location selected yet</p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleGetLocation}
                      className="w-full px-4 py-3 border-2 border-orange-500 text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all"
                    >
                      📍 Use My Current Location
                    </button>
                  </div>

                  {/* Notes */}
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        📝 Special Notes
                      </span>
                      <span className="text-sm text-gray-600 mt-1 block">
                        Any special instructions or preferences? (Optional)
                      </span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g., Gluten-free cake, no nuts, name on cake, etc."
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 text-gray-900 placeholder-gray-400 resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-orange-50 rounded-xl p-6 space-y-3 border-2 border-orange-200">
                    <h3 className="font-bold text-gray-900">Booking Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Product:</span>
                        <span className="font-medium text-gray-900">
                          {product?.title || "Loading..."}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Date:</span>
                        <span className="font-medium text-gray-900">
                          {selectedDate ? new Date(selectedDate).toLocaleDateString() : "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Location:</span>
                        <span className="font-medium text-gray-900">
                          {latitude && longitude ? "Selected ✅" : "Not selected"}
                        </span>
                      </div>
                      <div className="border-t border-orange-200 pt-2 mt-2 flex justify-between">
                        <span className="font-semibold text-gray-900">Total Price:</span>
                        <span className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-600">
                          ₹{product?.price || "0"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 rounded-xl bg-linear-to-r from-orange-500 to-amber-600 text-white font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creating Booking..." : "🎉 Book Now"}
                  </button>

                  {/* Back Link */}
                  <Link
                    href="/"
                    className="block w-full text-center px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                  >
                    ← Back to Home
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
