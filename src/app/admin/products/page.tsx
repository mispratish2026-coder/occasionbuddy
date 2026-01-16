"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Product } from "@/types";

export default function ProductManagement() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: 0,
    imageUrl: "",
    category: "cake" as "cake" | "decoration" | "gift",
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, loading, isAdmin, router]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const productsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.title || !newProduct.price || !newProduct.imageUrl) {
      alert("Please fill in all fields including image URL");
      return;
    }

    // Validate URL
    try {
      new URL(newProduct.imageUrl);
    } catch {
      alert("Invalid image URL. Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsUploading(true);

    try {
      console.log("Adding product to Firestore...");
      console.log("Image URL:", newProduct.imageUrl);
      
      // Add product to Firestore with image URL
      const productData = {
        title: newProduct.title,
        name: newProduct.title,
        price: Number(newProduct.price),
        imageUrl: newProduct.imageUrl,
        category: newProduct.category,
        createdAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(collection(db, "products"), productData);
      console.log("✅ Product added with ID:", docRef.id);

      // Reset form
      setNewProduct({
        title: "",
        price: 0,
        imageUrl: "",
        category: "cake",
      });
      setShowForm(false);

      // Refresh products list
      const snapshot = await getDocs(collection(db, "products"));
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);

      alert("✅ Product added successfully!");
      
    } catch (error: any) {
      console.error("❌ Error:", error);
      console.error("Error message:", error?.message);
      
      let userMessage = "Failed to add product: ";
      userMessage += error?.message || "Unknown error occurred.";
      
      alert(userMessage);
      
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
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
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 border-b border-purple-500/20 backdrop-blur-md">
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
                  className="px-4 py-2 rounded-lg bg-linear-to-r from-orange-500/20 to-amber-600/20 text-orange-400 font-medium transition-all border border-orange-500/30"
                >
                  🧁 Products
                </Link>
                <Link
                  href="/admin/orders"
                  className="px-4 py-2 rounded-lg hover:bg-purple-500/20 text-gray-300 font-medium transition-all hover:text-purple-300 border border-transparent hover:border-purple-500/30"
                >
                  📦 Orders
                </Link>
                <Link
                  href="/admin/support"
                  className="px-4 py-2 rounded-lg hover:bg-purple-500/20 text-gray-300 font-medium transition-all hover:text-purple-300 border border-transparent hover:border-purple-500/30"
                >
                  💬 Support
                </Link>
              </div>
            </div>
            <Link
              href="/"
              className="text-gray-400 hover:text-white font-medium transition-colors"
            >
              ← Back to App
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">🧁 Product Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 rounded-lg bg-linear-to-r from-orange-500 to-amber-600 text-white font-bold hover:shadow-lg transition-all"
          >
            {showForm ? "Cancel" : "+ Add New Product"}
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <div className="bg-slate-800 rounded-2xl shadow-lg p-8 mb-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Title"
                  value={newProduct.title}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, title: e.target.value })
                  }
                  className="px-4 py-3 border-2 border-orange-500/30 bg-slate-700 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:border-orange-500"
                  required
                  disabled={isUploading}
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={newProduct.price || ""}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : 0;
                    setNewProduct({ ...newProduct, price: value });
                  }}
                  className="px-4 py-3 border-2 border-orange-500/30 bg-slate-700 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:border-orange-500"
                  required
                  disabled={isUploading}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">
                  Product Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={newProduct.imageUrl}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, imageUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-orange-500/30 bg-slate-700 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:border-orange-500"
                  required
                  disabled={isUploading}
                />
                {newProduct.imageUrl && (
                  <div className="flex items-center gap-3 mt-3">
                    <img
                      src={newProduct.imageUrl}
                      alt="Preview"
                      className="w-20 h-20 rounded-lg object-cover border-2 border-orange-500/30"
                      onError={() => alert("Invalid image URL. Image could not be loaded.")}
                    />
                    <p className="text-sm text-green-400 font-medium">✓ Image preview loaded</p>
                  </div>
                )}
              </div>
              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    category: e.target.value as "cake" | "decoration" | "gift",
                  })
                }
                className="w-full px-4 py-3 border-2 border-orange-500/30 bg-slate-700 text-white rounded-xl focus:outline-none focus:border-orange-500"
                disabled={isUploading}
              >
                <option value="cake">🍰 Cake</option>
                <option value="decoration">🎉 Decoration</option>
                <option value="gift">🎁 Gift</option>
              </select>
              <button
                type="submit"
                disabled={isUploading}
                className="w-full px-6 py-3 rounded-lg bg-linear-to-r from-orange-500 to-amber-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "⏳ Uploading..." : "✅ Add Product"}
              </button>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-purple-500/20">
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-purple-500/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    No products yet. Add your first product!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-700 hover:bg-slate-700/50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {product.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-orange-400">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 font-bold hover:bg-red-600/40 transition-all border border-red-500/30"
                      >
                        Delete
                      </button>
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
