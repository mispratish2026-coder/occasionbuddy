# 🎉 OccasionBuddy — Event Product Booking App

A premium event product booking platform built with **Next.js + Firebase**. Users can browse cakes, decorations, and gifts, wishlist products, book them, and receive notifications. Admin manages everything.

## 🧱 Tech Stack

- **Frontend**: Next.js 14+ (App Router)
- **Backend**: Firebase
- **Database**: Firestore
- **Authentication**: Firebase Auth (Email/Password)
- **Styling**: Tailwind CSS
- **Storage**: Firebase Storage
- **Hosting**: Vercel (recommended)
- **Language**: TypeScript

## 📁 Project Structure

```
occasionbuddy/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── booking/           # Booking page
│   │   ├── admin/             # Admin dashboard
│   │   └── profile/           # User profile
│   ├── components/
│   │   ├── auth/              # Auth-related components
│   │   └── ui/                # Reusable UI components
│   ├── context/               # React Context (Auth, etc.)
│   ├── lib/
│   │   └── firebase.ts        # Firebase config
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── layout.tsx             # Root layout
├── public/                      # Static assets
├── .env.local.example          # Environment variables template
├── next.config.ts             # Next.js config
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "OccasionBuddy"
3. Enable Firestore Database
4. Enable Authentication (Email/Password)
5. Enable Cloud Storage
6. Copy your Firebase config

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase project details.

### 4. Create Firestore Collections

Create the following collections in Firestore:

```
users/              → User profiles
products/           → Product catalog
orders/             → User bookings
notifications/      → User notifications
supportMessages/    → Support tickets
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 Key Features

### 👤 User Features
- ✅ Sign up & Login
- ✅ Browse products (Cakes, Decorations, Gifts)
- ✅ Wishlist products
- ✅ Book products with date & location
- ✅ Receive real-time notifications
- ✅ Contact support
- ✅ Manage profile

### 👑 Admin Features
- ✅ Manage all products (CRUD)
- ✅ View & update all orders
- ✅ Manage support requests
- ✅ Secure admin panel

## 🎨 UI/UX Design

- Premium, soft animations
- Golden / Dark-Orange / White theme
- Inspired by Urban Company
- Mobile-first responsive
- Celebration/birthday feel

## 🔐 Security

- Firebase Authentication with persistent sessions
- Role-based access control (User/Admin)
- Firestore security rules (coming soon)
- Protected admin routes

## 📦 Database Schema

### Users Collection
```ts
users/{uid} {
  name: string,
  email: string,
  role: "user" | "admin",
  createdAt: timestamp
}
```

### Products Collection
```ts
products/{id} {
  title: string,
  price: number,
  imageUrl: string,
  category: "cake" | "decoration" | "gift",
  createdAt: timestamp
}
```

### Orders Collection
```ts
orders/{id} {
  userId: string,
  productId: string,
  date: string,
  location: { latitude: number, longitude: number },
  note: string,
  status: "pending" | "confirmed" | "completed" | "cancelled",
  createdAt: timestamp
}
```

### Notifications Collection
```ts
notifications/{id} {
  userId: string,
  title: string,
  message: string,
  read: boolean,
  createdAt: timestamp
}
```

## 📝 Development Workflow

1. **Build feature by feature**
2. **One page at a time**
3. **Test as you go**
4. **Keep code clean & maintainable**
5. **No demo logic — production-ready**

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📚 Next Steps

1. ✅ Project structure created
2. ⏳ Create signup & login pages
3. ⏳ Build home page with product grid
4. ⏳ Implement product management (admin)
5. ⏳ Create booking system
6. ⏳ Set up notifications
7. ⏳ Build admin dashboard
8. ⏳ Polish UI & animations
9. ⏳ Deploy to Vercel

## 🤝 Need Help?

Ask me to:
- "Build the signup page"
- "Create product management UI"
- "Implement booking calendar"
- "Set up admin dashboard"
- "Add animations"

## 📜 License

MIT License — Use freely in your projects!

---

**Made with ❤️ for event bookings**
