# 🎉 Updated Admin Panel - User Login Integration & Image Upload

## What's New

### 1. ✅ Admin Panel Connected to User Login
- Admin access is now tied to **user roles in Firebase**
- No more hardcoded login - uses the same authentication system as regular users
- Set `role: "admin"` in a user's Firestore document to grant admin access

### 2. ✅ Image Upload for Products
- **Upload image files** instead of pasting URLs
- Images automatically uploaded to **Firebase Cloud Storage**
- Download URLs stored in Firestore automatically
- Support for all image formats (JPG, PNG, WebP, etc.)

---

## How to Set Up Admin Access

### Step 1: Create or Use an Existing User Account

Sign up or log in with an account you want to make admin:
```
Email: any@email.com
Password: secure123@
```

### Step 2: Make the User Admin in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **occasionbuddynew**
3. Navigate to **Firestore Database → Collections → users**
4. Find the document with your email
5. Edit the document and add/update: 
   ```
   role: "admin"
   ```
6. Click **Save**

### Step 3: Log In to Access Admin Panel

1. Log in with the user account
2. Go to **Profile** page
3. You'll now see **👑 Admin Panel** link
4. Or go directly to: `http://localhost:3000/admin`

---

## Using Image Upload Feature

### Add Product with Image Upload

1. **Go to Admin Panel → 🧁 Products**
2. Click **"➕ Add New Product"**
3. Fill in the form:
   - **Product Title**: e.g., "Chocolate Dream Cake"
   - **Price**: e.g., 899
   - **Upload Image**: Click "Choose File" and select an image from your computer
   - **Category**: Select Cake/Decoration/Gift
4. Click **"Add Product"** button
5. Image uploads to Firebase Cloud Storage
6. Download URL automatically saved to Firestore

### Image Upload Features:
✅ Drag & drop or click to select image
✅ Shows selected filename
✅ Supports JPG, PNG, WebP, GIF
✅ Automatic upload to Firebase Storage
✅ Images displayed immediately on home page
✅ Error handling with user feedback

---

## Admin Roles - Complete Workflow

### User with Admin Role

```
Users Collection:
{
  uid: "user-123",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",        ← Key field!
  createdAt: "2024-01-15"
}
```

**Can Access:**
- ✅ Admin Dashboard (`/admin`)
- ✅ Product Management (`/admin/products`)
- ✅ Order Management (`/admin/orders`)
- ✅ Support Management (`/admin/support`)
- ✅ See "👑 Admin Panel" link in profile

### Regular User (No Role or role: "user")

```
Users Collection:
{
  uid: "user-456",
  name: "Regular User",
  email: "user@example.com",
  role: "user",         ← Regular user
  createdAt: "2024-01-15"
}
```

**Can Access:**
- ✅ Home page
- ✅ Browse products
- ✅ Create bookings
- ✅ Profile & notifications
- ❌ Admin panel (redirected to home)

---

## Complete Workflow Example

### 1. Create Admin User

```bash
1. Sign up at /signup
   Email: pratish@occasionbuddy.com
   Password: Admin2024@
   
2. Go to Firebase Console
   - Open "users" collection
   - Find your document
   - Add: role: "admin"
   - Save
```

### 2. Add Products with Images

```bash
1. Log in with admin account
2. Go to /admin/products
3. Click "➕ Add New Product"
4. Enter:
   - Title: "Red Velvet Cake"
   - Price: 1099
   - Select image: redvelvet.jpg
   - Category: Cake
5. Click "Add Product"
6. Wait for upload to complete
7. Product appears on home page with your image!
```

### 3. Manage Orders

```bash
1. Regular user books a product
2. Admin sees order in /admin/orders
3. Update status: Pending → Confirmed
4. User gets notification immediately
5. User can see updated status in /admin/orders
```

### 4. Handle Support Tickets

```bash
1. User sends support message from /profile
2. Admin sees message in /admin/support
3. Admin can update ticket status
4. User notified of response
```

---

## File Upload Requirements

- **Accepted Formats**: JPG, PNG, WebP, GIF
- **Max File Size**: Typically 25MB (Firebase default)
- **Recommended Size**: 400x400 pixels or larger
- **Aspect Ratio**: Square images work best for product grid

---

## Firestore Security Rules

Admin operations are protected by security rules:

```javascript
// Products
allow write: if request.auth.uid != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

// Orders
allow read: if request.auth.uid != null && 
            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

// Support
allow read: if request.auth.uid != null && 
            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
```

---

## Troubleshooting

### "Access Denied" or redirected to home

**Solution:** 
- Make sure you set `role: "admin"` in Firebase for your user
- Log out and log back in to refresh the session
- Check that you're editing the correct user document

### Image upload fails

**Solution:**
- Check file size (must be reasonable)
- Ensure file is actually an image (JPG/PNG/etc)
- Check Firebase Storage is enabled in your project
- Check storage rules allow uploads (should be default)

### Products appear without images

**Solution:**
- Upload might still be in progress
- Refresh the page
- Check Firebase Storage bucket for the image file
- Check Firestore document has imageUrl field

### Can't see admin link in profile

**Solution:**
- Log out and log back in
- Make sure role is set to "admin" (case-sensitive)
- Clear browser cache
- Check console for errors (F12)

---

## API Integration Points

### Image Upload to Cloud Storage
```javascript
const storageRef = ref(storage, `products/${Date.now()}-${fileName}`);
await uploadBytes(storageRef, imageFile);
const imageUrl = await getDownloadURL(storageRef);
```

### Save Product to Firestore
```javascript
await addDoc(collection(db, "products"), {
  title, price, imageUrl, category,
  createdAt: serverTimestamp()
});
```

### Check Admin Role
```javascript
const isAdmin = user?.role === "admin";
// Only then show admin panel link
```

---

## Security Best Practices

✅ Admin role set only in Firestore (not in code)
✅ All uploads go through authenticated user
✅ Firestore rules verify admin role server-side
✅ Images stored with unique filenames (timestamp)
✅ No hardcoded credentials

---

## Next Steps

1. **Set yourself as admin** in Firebase Console
2. **Upload a product with an image** to test the feature
3. **Create a booking** as a regular user
4. **Manage the order** as admin
5. **Invite other admins** by setting their role in Firebase

---

**🚀 Your admin panel is now fully integrated with the user system!**

Questions? Check the code in `/src/app/admin/` for details.
