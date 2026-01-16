# 👑 Admin Panel Setup Guide

## Overview
The admin panel is now fully integrated into OccasionBuddy. Admins can manage products, orders, and support tickets.

## How to Access Admin Panel

### 1. **Set Admin Role (One-time Setup)**
First, you need to make your account an admin in Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **"occasionbuddynew"**
3. Navigate to **Firestore Database**
4. Click on **Collections** → **users**
5. Find the document with your email (e.g., `occasionbuddy2024@gmail.com`)
6. Click on it and edit the document
7. Add/update the field: `role: "admin"` (exactly as shown)
8. Click **Save**

### 2. **Access the Admin Panel**

After setting the admin role, you can access the admin panel in two ways:

#### Option A: From Profile Page
1. Log in with your admin account
2. Click the **👤 Profile** button (top right)
3. You'll see a **👑 Admin Panel** button in the sidebar
4. Click it to access the admin dashboard

#### Option B: Direct URL
1. Navigate to: `http://localhost:3000/admin`

## Admin Dashboard Features

### 📊 Admin Overview Page (`/admin`)
- Welcome message showing admin status
- Quick links to all admin features
- Dashboard cards for Products, Orders, and Support

### 🧁 Product Management (`/admin/products`)
**Features:**
- ✅ View all products in a table
- ✅ Add new products with title, price, category, image URL
- ✅ Delete products
- ✅ Manage categories: Cake, Decoration, Gift

**How to Add a Product:**
1. Click **"➕ Add New Product"** button
2. Fill in the form:
   - **Title**: Product name (e.g., "Chocolate Cake")
   - **Price**: Price in rupees (e.g., 899)
   - **Category**: Select from dropdown (Cake/Decoration/Gift)
   - **Image URL**: Paste an image URL from Unsplash or any image hosting
3. Click **"Add Product"**
4. Product appears instantly in the table and on the home page

**How to Delete a Product:**
1. Find the product in the table
2. Click the **"🗑️ Delete"** button
3. Confirm the deletion

### 📦 Order Management (`/admin/orders`)
**Features:**
- ✅ View all user orders
- ✅ See order details: customer name, product, date, location, notes
- ✅ Update order status (Pending → Confirmed → Completed → Cancelled)
- ✅ Track booking progress

**Order Statuses:**
- 🟡 **Pending** - Just received, awaiting confirmation
- 🔵 **Confirmed** - Order confirmed by admin
- 🟢 **Completed** - Order delivered/completed
- 🔴 **Cancelled** - Order cancelled

**How to Update Order Status:**
1. Find the order in the table
2. Click the status dropdown
3. Select a new status
4. Status updates automatically
5. Customer receives a notification about the status change

### 💬 Support Management (`/admin/support`)
**Features:**
- ✅ View all customer support requests
- ✅ Read customer messages and concerns
- ✅ Track request status (Open/In Progress/Resolved)
- ✅ Respond to customers

## Admin Navigation

Once logged in as admin, you'll see:
- **👑 Admin Panel** header in top navigation
- Navigation menu with:
  - 🧁 **Products** - Manage product catalog
  - 📦 **Orders** - Track and manage bookings
  - 💬 **Support** - Handle customer support
- **← Back to App** button to return to main app

## Important Notes

⚠️ **Role-Based Access Control:**
- Only users with `role: "admin"` can access `/admin` pages
- Non-admin users trying to access admin pages will be redirected to home
- Regular users cannot add/delete products or manage orders

⚠️ **Firestore Security Rules:**
- Admin operations are protected by Firestore security rules
- Products can only be modified by admins
- Orders can only be viewed by admins
- Support tickets can only be accessed by admins

## Testing the Admin Panel

1. **Create a test account** or use your existing account
2. **Set role to "admin"** in Firebase Console (see Setup section above)
3. **Log in** with the admin account
4. **Visit `/admin`** or click the admin panel link in profile
5. **Test features:**
   - Add a product with test data
   - View products in the table
   - Check products appear on home page
   - Create a booking as a regular user
   - Update its status as admin
   - View the notification from the booking

## Troubleshooting

### "Access Denied" or Redirect to Home
**Solution:** Make sure you've set `role: "admin"` in Firebase Firestore for your user document

### Products not showing on home page
**Solution:** Make sure you've published the Firestore security rules (see main README)

### Can't see orders
**Solution:** 
1. Make sure orders exist (create a booking first)
2. Check your admin role is set correctly
3. Verify Firestore security rules are published

## File Structure

```
/src/app/admin/
├── page.tsx                 # Admin dashboard overview
├── products/
│   └── page.tsx            # Product management
├── orders/
│   └── page.tsx            # Order management
└── support/
    └── page.tsx            # Support ticket management
```

## Security Considerations

✅ All admin pages check `isAdmin` before displaying content
✅ Firestore security rules restrict admin operations to admins only
✅ Non-authenticated users are redirected to login
✅ Admin role is managed through Firestore database

---

**Ready to manage your OccasionBuddy?** 🚀
