"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Product } from "@/types";

const getMockProducts = (): Record<string, Product> => ({
  "mock-1": {
    id: "mock-1",
    title: "Chocolate Dream Cake",
    price: 899,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    category: "cake",
    createdAt: new Date(),
  },
  "mock-2": {
    id: "mock-2",
    title: "Red Velvet Cake",
    price: 1099,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    category: "cake",
    createdAt: new Date(),
  },
  "mock-3": {
    id: "mock-3",
    title: "Balloon Decoration Set",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=400&fit=crop",
    category: "decoration",
    createdAt: new Date(),
  },
  "mock-4": {
    id: "mock-4",
    title: "Party Banner Pack",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=400&fit=crop",
    category: "decoration",
    createdAt: new Date(),
  },
  "mock-5": {
    id: "mock-5",
    title: "Luxury Gift Hamper",
    price: 1499,
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop",
    category: "gift",
    createdAt: new Date(),
  },
  "mock-6": {
    id: "mock-6",
    title: "Personalized Gift Box",
    price: 799,
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop",
    category: "gift",
    createdAt: new Date(),
  },
});

export default function WishlistPage() {
  const router = useRouter();
  const { user, firebaseUser, loading } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const productsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          price: doc.data().price,
          imageUrl: doc.data().imageUrl,
          category: doc.data().category,
          createdAt: doc.data().createdAt,
        })) as Product[];

        if (productsData.length > 0) {
          setProducts(productsData);
        } else {
          const mockProds = Object.values(getMockProducts());
          setProducts(mockProds);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        const mockProds = Object.values(getMockProducts());
        setProducts(mockProds);
      }
    };

    fetchProducts();
  }, []);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const removeFromWishlist = (id: string) => {
    const updated = wishlist.filter((item) => item !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
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

      {/* Wishlist Content */}
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-12">❤️ My Wishlist</h1>

          {wishlistProducts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🤍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">
                Add products to your wishlist to save them for later
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 rounded-xl bg-linear-to-r from-orange-500 to-amber-600 text-white font-bold hover:shadow-lg transition-all"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="group rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-4 right-4 text-2xl hover:scale-125 transition-transform"
                    >
                      ❤️
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-orange-600 font-semibold uppercase">
                        {product.category}
                      </p>
                      <h3 className="text-xl font-bold text-gray-900">
                        {product.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-600">
                        ₹{product.price}
                      </span>
                      <Link
                        href={`/booking?productId=${product.id}`}
                        className="px-4 py-2 rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white font-semibold hover:shadow-lg transition-all text-sm"
                      >
                        Book Now
                      </Link>
                    </div>
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
