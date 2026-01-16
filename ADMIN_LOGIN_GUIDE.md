# 👑 Admin Panel Hardcoded Login

## Quick Start

The admin panel now uses **hardcoded credentials** for secure access. No need to modify Firebase!

### Admin Credentials:
```
Email: occasionbuddy2024@gmail.com
Password: Pratish2006@
```

## How to Access Admin Panel

### 1. Go to Admin Login Page
- Visit: `http://localhost:3000/admin/login`
- Or click "👑 Admin Panel" link (if you have it bookmarked)

### 2. Enter Admin Credentials
- Email: `occasionbuddy2024@gmail.com`
- Password: `Pratish2006@`
- Click **"Login to Admin Panel"**

### 3. Access Dashboard
After successful login, you'll see the admin dashboard with full access to:
- 🧁 **Products Management** - Add, view, delete products
- 📦 **Orders Management** - View and update booking status
- 💬 **Support Management** - Handle customer support tickets

## Admin Features

### 🧁 Products Page
- **View all products** in a table
- **Add new products** with title, price, category, image URL
- **Delete products** instantly
- Products sync automatically to home page

**Example Product:**
- Title: Chocolate Dream Cake
- Price: 899
- Category: Cake
- Image URL: https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400

### 📦 Orders Page
- View all customer bookings
- See booking details: customer name, product, date, location, notes
- Update order status:
  - 🟡 **Pending** - Initial state
  - 🔵 **Confirmed** - Order confirmed
  - 🟢 **Completed** - Order delivered
  - 🔴 **Cancelled** - Order cancelled

### 💬 Support Page
- View customer support tickets
- Track ticket status
- Respond to customer concerns

## Navigation

Once logged in, you have access to:
- **👑 Admin Panel** - Main dashboard
- **🧁 Products** - Product management
- **📦 Orders** - Order management
- **💬 Support** - Support tickets
- **← Back to App** - Return to main app
- **🚪 Logout** - Log out from admin panel

## Important Notes

⚠️ **Session Storage:**
- Admin login is stored in browser's localStorage
- The authentication persists until you explicitly logout
- Clearing browser data will clear the admin session

⚠️ **Security:**
- These credentials are hardcoded for development
- Only you should know these credentials
- For production, implement proper OAuth/authentication

⚠️ **Features:**
- Admin panel is completely separate from user authentication
- You can be logged in as both a regular user AND admin
- Users cannot access admin panel without correct credentials

## Troubleshooting

### "Invalid email or password"
- Check spelling of email: `occasionbuddy2024@gmail.com`
- Check spelling of password: `Pratish2006@`
- Make sure Caps Lock is OFF (password is case-sensitive)

### Redirected to login page
- Admin session has expired
- Clear browser cache and try again
- Log in again with correct credentials

### Can't see products I added
- Make sure Firestore security rules are published (see main README)
- Check that you're connected to Firebase
- Try refreshing the page

## File Structure

```
/src/app/admin/
├── login/
│   └── page.tsx           # Admin hardcoded login page
├── page.tsx               # Admin dashboard overview
├── products/
│   └── page.tsx          # Product management
├── orders/
│   └── page.tsx          # Order management
└── support/
    └── page.tsx          # Support ticket management
```

## Testing Workflow

1. **Log in as Admin**
   - Go to `/admin/login`
   - Enter credentials
   - See dashboard

2. **Add a Product**
   - Click "🧁 Products"
   - Click "➕ Add New Product"
   - Fill in details
   - Click "Add Product"

3. **See it on Home Page**
   - Go back to `/` (home)
   - Product appears in grid

4. **Create a Booking** (as regular user)
   - Log out of admin
   - Browse products
   - Click "Book Now"
   - Fill booking form
   - Submit

5. **Manage Order** (as admin)
   - Log in to admin with credentials
   - Go to "📦 Orders"
   - Find your booking
   - Update status
   - See changes reflected

## Quick Commands

- **Open Admin Login:** `http://localhost:3000/admin/login`
- **Open Admin Panel:** `http://localhost:3000/admin` (if logged in)
- **Open Products:** `http://localhost:3000/admin/products`
- **Open Orders:** `http://localhost:3000/admin/orders`
- **Open Support:** `http://localhost:3000/admin/support`

---

**🎉 You're ready to manage OccasionBuddy!**
