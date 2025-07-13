# ReWear – Community Clothing Exchange

A sustainable fashion platform for swapping and redeeming clothes in your community.

_Built with Next.js, MongoDB, and TailwindCSS._

![Project Status](https://img.shields.io/badge/status-active-brightgreen)

## Tech Stack

- **Next.js (App Router)**
- **MongoDB**
- **TailwindCSS**
- **Custom Authentication** (no Firebase)

## Objective

Build a web app that allows users to exchange clothing through direct swaps or a point-based redemption system. It promotes sustainable fashion and reduces textile waste.

_Users can swap items directly or use points to redeem items from others._

## Core Features

- Persistent login with secure authentication (access & refresh tokens)
- Unified creamy gradient theme and modern UI throughout the app
- Admin panel for managing users, listings, and orders
- Robust image handling and fallback for missing images
- Responsive design and mobile-first layout
- Real-time swap status updates
- User Registration & Login (email/password)
- Landing Page with featured items, categories, and CTAs
- Item Listings with filters and search
- Product Detail Page with swap/redeem actions
- Add New Item Form
- User Dashboard with profile, listings, and purchases
- Admin Panel to approve/reject items and manage users

## 🗃️ MongoDB Collections

- `User`: stores user info, role, points
- `Item`: item listings with metadata
- `SwapRequest`: tracks swap/redeem requests

## ⚙️ Requirements

- Modular, reusable components (e.g., `ItemCard`, `UserCard`)
- API routes or server actions for auth, CRUD, and real-time updates
- Route protection via middleware
- Form validation using Zod or Yup
- ESLint-configured code
- Minimal network calls and optimized queries
- Responsive UI with Tailwind
- Use WebSockets or polling for live updates (swap status)

## 📁 Updated Directory Structure

```
harrypeter07-rewear/
├── public/
│   └── images/          # Static assets (default avatars, banners, etc.)
├── app/
│   ├── layout.js
│   ├── globals.css
│   ├── page.js          # Landing Page
│   ├── login/
│   │   └── page.js
│   ├── register/
│   │   └── page.js
│   ├── dashboard/
│   │   └── page.js
│   ├── items/
│   │   ├── page.js              # Browse Items
│   │   ├── [id]/page.js         # Item Detail Page
│   │   └── new/page.js          # Add Item
│   ├── admin/
│   │   └── page.js
│   └── api/
│       ├── auth/                # login, register handlers
│       ├── users/
│       ├── items/
│       └── swaps/
├── lib/
│   ├── db.js                   # MongoDB client
│   ├── auth.js                 # Auth middleware
│   └── validations.js          # Zod/Yup validators
├── models/
│   ├── User.js
│   ├── Item.js
│   └── SwapRequest.js
├── components/
│   ├── Navbar.jsx
│   ├── ItemCard.jsx
│   ├── ItemForm.jsx
│   ├── UserCard.jsx
│   └── DashboardWidgets.jsx
├── utils/
│   ├── constants.js
│   └── helpers.js
├── hooks/
│   └── useAuth.js
├── middlewares/
│   └── withAuth.js
├── eslint.config.mjs
├── next.config.mjs
├── jsconfig.json
└── package.json
```

## Team Members

- **Hassan Mansuri**  
  hassanmansuri570@gmail.com
- **Shraddha Bhisikar**  
  shra.bhisikar@gmail.com
- **Ritika Jain**  
  jainr_1@rknec.edu
- **Harshal Pande**  
  pandeh@rknec.edu

# Promote a User to Admin

To make a user an admin, run the following in your MongoDB shell (replace the email with the user's email):

```
db.users.updateOne({ email: "user@example.com" }, { $set: { role: "admin" } })
```

After this, the user can log in as admin and access admin features.
