# ReWear – Community Clothing Exchange Platform

<div align="center">

![Project Status](https://img.shields.io/badge/status-active-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black)
![MongoDB](https://img.shields.io/badge/MongoDB-6.17.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

**A sustainable fashion platform for swapping and redeeming clothes in your community.**

[Features](#-features) • [Installation](#-installation) • [Documentation](#-documentation) • [API Reference](#-api-reference) • [Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Key Components](#-key-components)
- [Usage Guide](#-usage-guide)
- [Admin Features](#-admin-features)
- [Troubleshooting](#-troubleshooting)
- [Team](#-team)

---

## 🎯 Overview

ReWear is a full-stack web application that promotes sustainable fashion by enabling users to exchange clothing items through a point-based redemption system. The platform reduces textile waste and encourages community sharing of fashion items.

### Core Concept

- **Users list items** they want to exchange
- **Admin approves items** before they become available
- **Users earn points** when their items are approved
- **Users redeem items** using points (auto-approved transactions)
- **Complete order history** tracks all purchases and sales

---

## ✨ Features

### 🔐 Authentication & User Management
- Secure JWT-based authentication with access and refresh tokens
- Persistent login sessions with automatic token refresh
- User registration and login with email/password
- Role-based access control (User/Admin)
- User profile management with avatar support

### 🛍️ Item Management
- **Item Listing**: Users can list clothing items with details (title, description, category, size, condition, points value)
- **Image Upload**: Support for item images with fallback handling
- **Admin Approval**: Items require admin approval before becoming visible
- **Points System**: Users earn points equal to item's points value when approved
- **Item Categories**: Organized by clothing types (Tops, Bottoms, Dresses, Shoes, etc.)

### 💰 Points & Redemption System
- **Auto-Approved Orders**: All redemption requests are automatically processed
- **Instant Transactions**: Points deducted from buyer and added to seller immediately
- **Ownership Transfer**: Item ownership transfers automatically upon redemption
- **Points Display**: Real-time points shown in navbar and dashboard
- **Order History**: Complete history of all purchases and sales

### 📊 Dashboard & Analytics
- **User Dashboard**: Overview of listings, points, and recent activity
- **Order History**: Dedicated page with filters (All/Purchases/Sales)
- **Statistics**: Track listings count, points balance, and order statistics
- **Recent Activity**: Timeline of user actions

### 👨‍💼 Admin Panel
- **Item Approval**: Review and approve/reject pending items
- **User Management**: View and manage all users
- **Admin Code System**: Secure admin access with special codes
- **Analytics**: Overview of platform statistics

### 🎨 User Interface
- **Modern Design**: Gradient-based UI with smooth animations
- **Responsive Layout**: Mobile-first design that works on all devices
- **Fixed Navbar**: Always-accessible navigation with user info
- **Loading States**: Proper loading indicators throughout
- **Error Handling**: User-friendly error messages

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3.5** (App Router) - React framework with server-side rendering
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **SWR** - Data fetching and caching
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB 6.17.0** - NoSQL database
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **Zod** - Schema validation

### Development Tools
- **ESLint** - Code linting
- **Turbopack** - Fast bundler for development
- **Node.js** - Runtime environment

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **MongoDB Atlas** account (or local MongoDB instance)
- **Git** for version control

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd rewear
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rewear_db

# JWT Secrets
JWT_ACCESS_SECRET=your-super-secret-access-token-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-min-32-chars

# Admin Code (for admin registration)
ADMIN_CODE=your-admin-secret-code

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Run Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Step 5: Build for Production

```bash
npm run build
npm start
```

---

## ⚙️ Configuration

### MongoDB Setup

1. **Create MongoDB Atlas Account**: Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Cluster**: Set up a free tier cluster
3. **Get Connection String**: Copy your connection string
4. **Whitelist IP**: Add your IP address to the whitelist (or use `0.0.0.0/0` for development)
5. **Update MONGO_URI**: Add database name to connection string: `mongodb+srv://.../rewear_db`

### Test Database Connection

```bash
npm run test:db
```

This will verify your MongoDB connection and show any errors.

### JWT Secrets

Generate secure random strings for JWT secrets (minimum 32 characters):

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📁 Project Structure

```
rewear/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── logout/
│   │   │   ├── me/              # Get current user
│   │   │   └── admin-login/     # Admin authentication
│   │   ├── admin/               # Admin endpoints
│   │   │   ├── approve-item/   # Approve/reject items
│   │   │   └── users/          # User management
│   │   ├── items/              # Item endpoints
│   │   │   ├── route.js        # GET items, PATCH approve
│   │   │   ├── create/         # POST new item
│   │   │   └── [id]/           # GET single item
│   │   ├── swaps/              # Swap/redeem endpoints
│   │   │   └── route.js        # POST redeem, GET orders
│   │   ├── orders/             # Order history
│   │   │   └── route.js        # GET user orders
│   │   └── points/             # Points management
│   ├── admin/                   # Admin pages
│   │   ├── page.js             # Admin dashboard
│   │   └── code/               # Admin code entry
│   ├── dashboard/              # User dashboard
│   │   └── page.js
│   ├── items/                  # Item pages
│   │   ├── page.js             # Browse items
│   │   ├── [id]/               # Item detail
│   │   │   └── page.js
│   │   └── new/                # Add new item
│   │       └── page.js
│   ├── orders/                 # Order history page
│   │   └── page.js
│   ├── login/                  # Login page
│   ├── register/               # Registration page
│   ├── profile/                # User profile
│   ├── layout.js               # Root layout
│   ├── globals.css             # Global styles
│   └── page.js                # Landing page
├── components/                 # React components
│   ├── ui/                     # Reusable UI components
│   │   ├── button.jsx
│   │   ├── input.jsx
│   │   ├── card.jsx
│   │   └── ...
│   ├── Navbar.jsx              # Navigation bar
│   ├── ItemCard.jsx            # Item display card
│   ├── ItemForm.jsx            # Item creation form
│   ├── SwapRequestForm.jsx     # Redeem request form
│   ├── AdminApprovalPanel.jsx  # Admin item approval
│   └── DashboardWidgets.jsx   # Dashboard statistics
├── contexts/                   # React contexts
│   └── UserContext.js          # Global user state
├── hooks/                      # Custom React hooks
│   ├── useUser.js              # User data fetching
│   ├── useAuth.js              # Authentication logic
│   ├── useItems.js             # Items data fetching
│   └── useSwaps.js             # Swaps data fetching
├── lib/                        # Utility libraries
│   ├── db.js                   # Database connection
│   ├── mongodb.js              # MongoDB client setup
│   ├── auth.js                 # Authentication helpers
│   ├── validations.js          # Zod schemas
│   └── utils.js                # General utilities
├── middlewares/                # API middlewares
│   └── withAuth.js             # Authentication middleware
├── models/                     # Data models (Mongoose schemas)
│   ├── User.js
│   ├── Item.js
│   └── SwapRequest.js
├── public/                     # Static assets
│   ├── images/                 # Default images
│   └── uploads/                # User-uploaded images
├── scripts/                    # Utility scripts
│   ├── seed-items.js          # Seed database with items
│   └── test-connection.js      # Test MongoDB connection
├── utils/                      # Helper functions
│   ├── constants.js            # App constants
│   └── helpers.js              # Utility functions
├── .env.local                  # Environment variables (not in git)
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── next.config.mjs             # Next.js configuration
└── README.md                   # This file
```

---

## 🔄 How It Works

### Authentication Flow

1. **Registration**: User creates account with email/password
   - Password is hashed with bcryptjs
   - Access and refresh tokens are generated
   - Tokens stored in HTTP-only cookies

2. **Login**: User authenticates with credentials
   - Credentials validated against database
   - New tokens issued and stored in cookies
   - User context updated globally

3. **Token Refresh**: Automatic token refresh on API calls
   - Refresh token used to get new access token
   - Seamless user experience without re-login

4. **Logout**: Tokens cleared from cookies
   - User context reset
   - Redirected to login page

### Points System

1. **Earning Points**:
   - User lists an item with a points value
   - Admin reviews and approves the item
   - **User receives points equal to item's points value** upon approval
   - Points immediately visible in navbar and dashboard

2. **Spending Points**:
   - User browses available items
   - Clicks "Redeem with Points" on desired item
   - System checks if user has enough points
   - **Auto-approved transaction**:
     - Points deducted from buyer
     - Points added to seller
     - Item ownership transferred
     - Order marked as completed
   - User sees success message and updated points

### Item Lifecycle

1. **Creation**: User fills form with item details
   - Image uploaded to `/public/uploads/`
   - Item saved with status "pending"
   - Requires admin approval if points value > 10

2. **Approval**: Admin reviews item
   - Admin approves item
   - Item status changes to "available"
   - Item becomes visible to all users
   - **User receives points** (equal to item's points value)

3. **Redemption**: User redeems item
   - Transaction auto-approved
   - Item status changes to "redeemed"
   - Ownership transferred to buyer
   - Order recorded in history

### Order Processing

1. **Auto-Approval**: All redemption requests are automatically processed
   - No manual approval needed
   - Instant transaction completion
   - Points transferred immediately

2. **Order History**: Complete record of all transactions
   - Shows both purchases and sales
   - Filterable by type (All/Purchases/Sales)
   - Includes item details, points, dates, and buyer/seller info

---

## 📡 API Reference

### Authentication Endpoints

#### `POST /api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "username": "johndoe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": { ... }
}
```

#### `POST /api/auth/login`
Login with credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... }
}
```

#### `POST /api/auth/logout`
Logout current user.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### `GET /api/auth/me`
Get current authenticated user.

**Response:**
```json
{
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "username": "johndoe",
    "points": 50,
    "role": "user"
  }
}
```

### Item Endpoints

#### `GET /api/items`
Get all items with optional filters.

**Query Parameters:**
- `uploaderId`: Filter by uploader
- `status`: Filter by status (e.g., "pending")

**Response:**
```json
[
  {
    "_id": "...",
    "title": "Vintage Jacket",
    "pointsValue": 25,
    "status": "available",
    ...
  }
]
```

#### `POST /api/items/create`
Create a new item.

**Request Body (FormData):**
- `title`: Item title
- `description`: Item description
- `category`: Item category
- `size`: Item size
- `condition`: Item condition
- `pointsValue`: Points value (number)
- `image`: Image file
- `uploaderId`: User ID

**Response:**
```json
{
  "message": "Item submitted",
  "itemId": "..."
}
```

#### `GET /api/items/[id]`
Get single item by ID.

**Response:**
```json
{
  "_id": "...",
  "title": "Vintage Jacket",
  "pointsValue": 25,
  ...
}
```

#### `PATCH /api/items`
Approve an item (admin only).

**Request Body:**
```json
{
  "itemId": "..."
}
```

**Response:**
```json
{
  "message": "Item approved and made visible"
}
```

### Swap/Order Endpoints

#### `POST /api/swaps`
Create a redeem request (auto-approved).

**Request Body:**
```json
{
  "itemId": "...",
  "requesterId": "...",
  "message": "Optional message"
}
```

**Response:**
```json
{
  "message": "Item redeemed successfully! Points deducted and order completed.",
  "swapId": "...",
  "autoApproved": true
}
```

#### `GET /api/swaps`
Get swap requests for a user.

**Query Parameters:**
- `userId`: User ID to filter by

**Response:**
```json
{
  "swaps": [
    {
      "_id": "...",
      "item": "...",
      "requester": "...",
      "status": "accepted",
      ...
    }
  ]
}
```

#### `GET /api/orders`
Get order history for a user.

**Query Parameters:**
- `userId`: User ID

**Response:**
```json
{
  "orders": [
    {
      "_id": "...",
      "item": { ... },
      "requester": { ... },
      "seller": { ... },
      "isPurchase": true,
      "isSale": false,
      "pointsValue": 25,
      ...
    }
  ]
}
```

### Admin Endpoints

#### `PATCH /api/admin/approve-item`
Approve an item (admin only).

**Request Body:**
```json
{
  "itemId": "..."
}
```

**Response:**
```json
{
  "message": "Item approved"
}
```

#### `GET /api/admin/users`
Get all users (admin only).

**Response:**
```json
[
  {
    "_id": "...",
    "email": "user@example.com",
    "username": "johndoe",
    "points": 50,
    "role": "user"
  }
]
```

---

## 🗄️ Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  username: String,
  name: String,
  role: String ("user" | "admin"),
  points: Number (default: 0),
  avatar: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Items Collection

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  category: String,
  size: String,
  condition: String,
  pointsValue: Number (required),
  image: String (URL),
  uploaderId: ObjectId (ref: User),
  owner: ObjectId (ref: User),
  status: String ("pending" | "available" | "redeemed"),
  isApproved: Boolean (default: false),
  isVisible: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Swap Requests Collection

```javascript
{
  _id: ObjectId,
  item: ObjectId (ref: Item),
  requester: ObjectId (ref: User),
  targetUser: ObjectId (ref: User),
  type: String ("redeem"),
  status: String ("pending" | "accepted" | "rejected"),
  message: String,
  createdAt: Date,
  resolvedAt: Date
}
```

---

## 🧩 Key Components

### `Navbar.jsx`
- Fixed navigation bar with user info
- Shows user points in real-time
- Responsive mobile menu
- Logout functionality

### `ItemCard.jsx`
- Displays item information
- Shows points value and status
- Links to item detail page
- Image with fallback handling

### `SwapRequestForm.jsx`
- Form for redeeming items
- Shows item cost and user points
- Validates sufficient points
- Auto-submits and processes transaction

### `UserContext.js`
- Global user state management
- Uses SWR for data fetching
- Auto-refreshes on focus/reconnect
- Provides user data to all components

### `DashboardWidgets.jsx`
- Statistics display
- Shows listings, points, orders count
- Visual cards with gradients

---

## 📖 Usage Guide

### For Regular Users

1. **Register/Login**: Create an account or login
2. **Browse Items**: Visit `/items` to see available items
3. **List Items**: Go to `/items/new` to add your items
4. **Wait for Approval**: Admin will approve your items
5. **Earn Points**: Receive points when items are approved
6. **Redeem Items**: Use points to redeem items you want
7. **View Orders**: Check `/orders` for purchase/sale history

### For Admins

1. **Admin Login**: Use admin credentials or admin code
2. **Access Admin Panel**: Visit `/admin`
3. **Approve Items**: Review and approve pending items
4. **Manage Users**: View and manage all users
5. **Monitor Platform**: View platform statistics

### Promoting a User to Admin

In MongoDB shell or MongoDB Compass:

```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

---

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error: `querySrv EREFUSED`**
- **Solution**: Whitelist your IP address in MongoDB Atlas
- Go to Network Access → Add IP Address
- Use `0.0.0.0/0` for development (not recommended for production)

**Error: Authentication failed**
- **Solution**: Check your `MONGO_URI` includes correct username/password
- Verify database name is included: `/rewear_db`

### Authentication Issues

**Auto-login as admin**
- **Solution**: Clear browser cookies
- Check that `app/api/auth/me` properly validates tokens
- Ensure refresh tokens are not being reused incorrectly

**Points not updating**
- **Solution**: Check UserContext is refreshing
- Verify `refetchUser()` is called after transactions
- Check browser console for errors

### Build Issues

**Tailwind classes not working**
- **Solution**: Restart dev server
- Clear `.next` cache: `rm -rf .next`
- Check `tailwind.config.js` safelist includes needed classes

**ESLint errors**
- **Solution**: Run `npm run lint` to see errors
- Fix formatting issues
- Check for unescaped entities in JSX

---

## 👥 Team

### Project Members

- **Hassan Mansuri**  
  Email: hassanmansuri570@gmail.com

- **Shraddha Bhisikar**  
  Email: shra.bhisikar@gmail.com

- **Ritika Jain**  
  Email: jainr_1@rknec.edu

- **Harshal Pande**  
  Email: pandeh@rknec.edu

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)

---

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Chat system for users
- [ ] Advanced search and filters
- [ ] Item recommendations
- [ ] Social sharing features
- [ ] Mobile app version
- [ ] Email notifications
- [ ] Rating and review system

---

<div align="center">

**Made with ❤️ for sustainable fashion**

[Report Bug](https://github.com/your-repo/issues) • [Request Feature](https://github.com/your-repo/issues) • [Documentation](#-documentation)

</div>
