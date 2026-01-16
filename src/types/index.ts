// User types
export interface User {
  uid: string;
  name: string;
  email: string;
  mobileNo: string;
  role: "user" | "admin";
  createdAt: Date;
}

// Product types
export type ProductCategory = "cake" | "decoration" | "gift";

export interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: ProductCategory;
  createdAt: Date;
}

// Order types
export type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userMobileNo: string;
  productId: string;
  date: string;
  location: {
    latitude: number;
    longitude: number;
  };
  note: string;
  status: OrderStatus;
  createdAt: Date;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Support types
export interface SupportMessage {
  id: string;
  userId: string;
  title: string;
  message: string;
  status: "open" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}
