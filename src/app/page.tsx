"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Product } from "@/types";

const getMockProducts = (): Product[] => [
  {
    id: "mock-1",
    title: "Chocolate Dream Cake",
    price: 899,
    category: "cake",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    createdAt: new Date(),
  },
  {
    id: "mock-2",
    title: "Red Velvet Cake",
    price: 1099,
    category: "cake",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    createdAt: new Date(),
  },
  {
    id: "mock-3",
    title: "Balloon Decoration Set",
    price: 499,
    category: "decoration",
    imageUrl: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=400&fit=crop",
    createdAt: new Date(),
  },
  {
    id: "mock-4",
    title: "Party Banner Pack",
    price: 299,
    category: "decoration",
    imageUrl: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=400&fit=crop",
    createdAt: new Date(),
  },
  {
    id: "mock-5",
    title: "Luxury Gift Hamper",
    price: 1499,
    category: "gift",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop",
    createdAt: new Date(),
  },
  {
    id: "mock-6",
    title: "Personalized Gift Box",
    price: 799,
    category: "gift",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop",
    createdAt: new Date(),
  },
];

export default function Home() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ show: boolean; product?: string }>({ show: false });
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from Firestore
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
        
        // If products found, use them; otherwise use mock data
        if (productsData.length > 0) {
          setProducts(productsData);
        } else {
          setProducts(getMockProducts());
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(getMockProducts());
      }
    };

    fetchProducts();
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const handleBooking = (productTitle: string) => {
    setNotification({ show: true, product: productTitle });
    setTimeout(() => {
      setNotification({ show: false });
    }, 3000);
  };

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-orange-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-orange-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-600">
              🎉 OccasionBuddy
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/notifications"
                className="text-2xl hover:scale-110 transition-transform"
              >
                🔔
              </Link>
              <Link
                href="/wishlist"
                className="text-2xl hover:scale-110 transition-transform"
              >
                ❤️
              </Link>
              {user ? (
                <Link
                  href="/profile"
                  className="px-4 py-2 rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white font-medium hover:shadow-lg transition-all"
                >
                  👤
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white font-medium hover:shadow-lg transition-all"
                >
                  👤
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-4000" />
        </div>

        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-5">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&h=900&fit=crop"
            alt="Celebration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-linear-to-r from-orange-100 to-orange-50 border border-orange-300 text-orange-600 text-sm font-semibold backdrop-blur-md">
                ✨ Occasion Means OccasionBuddy
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 leading-tight">
              Perfect Planning
              <span className="block bg-linear-to-r from-orange-500 via-orange-400 to-amber-500 text-transparent bg-clip-text">
                Every Occasion
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
              Your one-stop destination for planning unforgettable events. From birthdays to weddings, we've got you covered with premium cakes, stunning decorations, and thoughtful gifts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button 
                onClick={() => document.querySelector('[id="products"]')?.scrollIntoView({ behavior: 'smooth' })}
                className="group px-10 py-4 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 text-white font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-110 shadow-lg hover:shadow-orange-500/50 relative overflow-hidden"
              >
                <span className="relative z-10">Explore Services</span>
                <div className="absolute inset-0 bg-linear-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              {!user && (
                <Link
                  href="/signup"
                  className="group px-10 py-4 rounded-xl border-2 border-orange-500 text-orange-600 font-bold text-lg hover:bg-orange-50 transition-all backdrop-blur-sm hover:border-orange-600 relative overflow-hidden"
                >
                  <span className="relative z-10">Get Started Free</span>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center pt-12">
              <div className="text-center">
                <p className="text-3xl font-bold bg-linear-to-r from-orange-500 to-amber-500 text-transparent bg-clip-text">500+</p>
                <p className="text-gray-700 text-sm font-medium">Premium Products</p>
              </div>
              <div className="hidden sm:block w-px bg-linear-to-b from-transparent via-orange-400 to-transparent" />
              <div className="text-center">
                <p className="text-3xl font-bold bg-linear-to-r from-amber-500 to-orange-500 text-transparent bg-clip-text">10K+</p>
                <p className="text-gray-700 text-sm font-medium">Happy Customers</p>
              </div>
              <div className="hidden sm:block w-px bg-linear-to-b from-transparent via-orange-500 to-transparent" />
              <div className="text-center">
                <p className="text-3xl font-bold bg-linear-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">24/7</p>
                <p className="text-gray-300 text-sm font-medium">Customer Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-700 text-sm font-medium">Scroll to explore</p>
            <div className="animate-bounce">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-linear-to-b from-orange-50 via-amber-50 to-white" id="products">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why Choose OccasionBuddy?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need to make your celebrations unforgettable
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - Cakes */}
            <div className="group relative bg-linear-to-br from-orange-400 to-orange-500 rounded-2xl p-8 border border-orange-300/50 hover:border-orange-400 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-orange-500/30">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-linear-to-br from-orange-300/0 to-orange-300/0 group-hover:from-orange-300/20 group-hover:to-orange-300/10 transition-all" />
              
              <div className="relative z-10 space-y-4">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300 inline-block">
                  🍰
                </div>
                <h3 className="text-2xl font-bold text-white">Delicious Cakes</h3>
                <p className="text-white/90 leading-relaxed">
                  Fresh, custom-made cakes crafted with premium ingredients. From classic designs to modern creations, we have the perfect cake for your celebration.
                </p>
                <button className="text-white font-semibold text-sm flex items-center gap-2 group/btn hover:text-yellow-100">
                  Explore <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Feature 2 - Decorations */}
            <div className="group relative bg-linear-to-br from-orange-400 to-orange-500 rounded-2xl p-8 border border-orange-300/50 hover:border-orange-400 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-orange-500/30">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-linear-to-br from-orange-300/0 to-orange-300/0 group-hover:from-orange-300/20 group-hover:to-orange-300/10 transition-all" />
              
              <div className="relative z-10 space-y-4">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300 inline-block">
                  🎉
                </div>
                <h3 className="text-2xl font-bold text-white">Stunning Decorations</h3>
                <p className="text-white/90 leading-relaxed">
                  Transform any space with our beautiful decorations. Balloons, banners, lighting, and more—everything to create the perfect ambiance.
                </p>
                <button className="text-white font-semibold text-sm flex items-center gap-2 group/btn hover:text-yellow-100">
                  Explore <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Feature 3 - Gifts */}
            <div className="group relative bg-linear-to-br from-orange-400 to-orange-500 rounded-2xl p-8 border border-orange-300/50 hover:border-orange-400 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-orange-500/30">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-linear-to-br from-orange-300/0 to-orange-300/0 group-hover:from-orange-300/20 group-hover:to-orange-300/10 transition-all" />
              
              <div className="relative z-10 space-y-4">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300 inline-block">
                  🎁
                </div>
                <h3 className="text-2xl font-bold text-white">Perfect Gifts</h3>
                <p className="text-white/90 leading-relaxed">
                  Thoughtfully curated gift hampers and presents for everyone on your list. Show your love with carefully selected, premium gifts.
                </p>
                <button className="text-white font-semibold text-sm flex items-center gap-2 group/btn hover:text-yellow-100">
                  Explore <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Products Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                Our Collections
              </h2>
              <p className="text-lg text-gray-600">
                Handpicked selections for your special moments
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
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
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-4 right-4 text-2xl hover:scale-125 transition-transform"
                    >
                      {wishlist.includes(product.id) ? "❤️" : "🤍"}
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
                        onClick={() => handleBooking(product.title)}
                        className="px-4 py-2 rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white font-semibold hover:shadow-lg transition-all text-sm"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-linear-to-r from-orange-500 to-amber-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Ready to celebrate?
          </h2>
          <p className="text-xl text-orange-50">
            Join thousands of happy customers who trust OccasionBuddy
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 rounded-full bg-white text-orange-600 font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Start Booking Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-gray-800">
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <a href="tel:8240781558" className="block hover:text-white transition-colors mb-2">
                💬 Contact Us
              </a>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Legal</h3>
              <a href="#" className="block hover:text-white transition-colors mb-2">
                📋 Terms
              </a>
              <a href="#" className="block hover:text-white transition-colors">
                🔒 Privacy
              </a>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">About</h3>
              <p className="text-sm">
                Making celebrations memorable since 2024.
              </p>
            </div>
          </div>
          <div className="pt-8 text-center text-sm">
            <p>© 2024 OccasionBuddy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Notification Popup */}
      {notification.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setNotification({ show: false })} />
          
          {/* Notification Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 animate-in fade-in zoom-in-95 duration-300 pointer-events-auto">
            <div className="text-center space-y-4">
              <div className="text-5xl">✨</div>
              <h3 className="text-2xl font-bold text-gray-900">
                Booking Request Sent!
              </h3>
              <p className="text-gray-600">
                Your booking for <span className="font-semibold text-orange-600">{notification.product}</span> has been initiated.
              </p>
              <p className="text-sm text-gray-500">
                Continue to complete your booking details.
              </p>
              <button
                onClick={() => setNotification({ show: false })}
                className="mt-6 px-6 py-2 rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white font-semibold hover:shadow-lg transition-all"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
