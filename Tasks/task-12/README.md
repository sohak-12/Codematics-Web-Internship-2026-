# Task-12 — Sohafy: Full-Stack E-Commerce Platform

## Overview

A complete e-commerce platform built with React (Frontend) and Node.js/Express (Backend), featuring Firebase Authentication, 
MongoDB database, Redux Toolkit state management, admin dashboard with product CRUD, shopping cart, checkout, order management,
and revenue analytics.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Tailwind CSS, Material UI (MUI) |
| State | Redux Toolkit + React Redux |
| Animations | Framer Motion |
| Charts | Recharts (Revenue Analytics) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | Firebase Auth (Google + Email/Password) + JWT Sessions |
| User Data | Firebase Firestore |
| Security | bcryptjs, JWT (HTTP-only cookies), CORS |
| Icons | Lucide React, React Icons, MUI Icons |
| Notifications | React Toastify, React Hot Toast |
| Deployment | Vercel (Frontend + Backend) |

---

## Project Structure

```
task-12/
├── Frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── logo1.png              # Brand logo variant 1
│   │   ├── logo2.png              # Brand logo variant 2
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── assets/                 # Static images and icons
│   │   ├── firebase/
│   │   │   └── config.js           # Firebase initialization
│   │   ├── navigation/
│   │   │   └── index.js            # React Router configuration
│   │   ├── provider/
│   │   │   └── index.js            # App context provider (cart, auth gate)
│   │   ├── screens/
│   │   │   ├── Landing.js              # Home/Landing page
│   │   │   ├── Authentication.js       # Login page
│   │   │   ├── Authentication.css
│   │   │   ├── Register.js             # Registration page
│   │   │   ├── ResetPassword.js        # Password reset
│   │   │   ├── ItemCatalog.js          # All products page
│   │   │   ├── ItemOverview.js         # Product detail page
│   │   │   ├── CategoryItems.js        # Products by category
│   │   │   ├── SearchResults.js        # Search results page
│   │   │   ├── Basket.js              # Shopping cart page
│   │   │   ├── Checkout.js            # Checkout page
│   │   │   ├── OrderSuccess.js        # Order confirmation
│   │   │   ├── MyOrders.js            # Order history
│   │   │   ├── Dashboard.js           # Admin dashboard layout
│   │   │   ├── DashboardOverview.js   # Admin stats & overview
│   │   │   ├── CategoryManagement.js  # Admin category CRUD
│   │   │   ├── AccountList.js         # Admin user management
│   │   │   ├── AdminOrders.js         # Admin order management
│   │   │   └── RevenueAnalytics.js    # Admin sales charts
│   │   ├── shared/                 # Shared utilities and helpers
│   │   ├── state/
│   │   │   └── accountSlice.js     # Redux slice (user state, role)
│   │   ├── utilities/              # Helper functions
│   │   ├── views/
│   │   │   ├── Navbar.js               # Main navigation bar
│   │   │   ├── SiteFooter.js           # Footer component
│   │   │   ├── HeroBanner.js           # Landing page hero
│   │   │   ├── CategoryGrid.js         # Category cards grid
│   │   │   ├── HorizontalItemSlider.js # Product carousel
│   │   │   ├── VerticalItemCard.js     # Product card component
│   │   │   ├── VerticalItemSlider.js   # Vertical product list
│   │   │   ├── AddItemForm.js          # Admin: add product form
│   │   │   ├── EditItemPanel.js        # Admin: edit product
│   │   │   ├── CategoryItemDisplay.js  # Category product display
│   │   │   ├── ImagePreview.js         # Product image viewer
│   │   │   ├── AuthShowcase.js         # Auth page showcase slider
│   │   │   ├── AuthShowcase.css
│   │   │   ├── AuthGateModal.js        # Auth required modal
│   │   │   ├── BrandLogo.js            # Logo component
│   │   │   └── ThemeSwitcher.js        # Dark/Light toggle
│   │   ├── App.js                  # Root: routing, auth state, layout
│   │   ├── App.css                 # Global styles
│   │   └── index.js                # Entry point with Redux Provider
│   ├── package.json
│   ├── tailwind.config.js
│   ├── seed2.js                    # Frontend-side data seeder
│   └── vercel.json
│
└── Backend/
    ├── api/
    │   └── routes.js               # All API route definitions (17 endpoints)
    ├── database/
    │   └── connection.js           # MongoDB connection with Mongoose
    ├── guards/
    │   └── sessionGuard.js         # JWT session verification middleware
    ├── handlers/
    │   ├── account/
    │   │   ├── registerAccount.js      # User registration
    │   │   ├── loginAccount.js         # User login with JWT
    │   │   ├── getAccountInfo.js       # Get user profile
    │   │   ├── logoutAccount.js        # Clear session
    │   │   ├── fetchAllAccounts.js     # Admin: list all users
    │   │   ├── modifyAccount.js        # Admin: update user roles
    │   │   ├── insertToBasket.js       # Add item to cart
    │   │   ├── viewBasketItems.js      # View cart items
    │   │   ├── countBasketItems.js     # Cart item count
    │   │   ├── modifyBasketItem.js     # Update cart quantity
    │   │   └── removeBasketItem.js     # Remove from cart
    │   └── item/
    │       ├── createItem.js           # Admin: add new product
    │       ├── fetchAllItems.js        # Get all products
    │       ├── modifyItem.js           # Admin: update product
    │       ├── fetchCategorySample.js  # Products grouped by category
    │       ├── fetchItemsByCategory.js # Products in a category
    │       ├── fetchItemDetail.js      # Single product details
    │       ├── searchItems.js          # Search products
    │       └── filterItems.js          # Filter products
    ├── schemas/
    │   ├── accountSchema.js        # User model (name, email, password, role)
    │   ├── itemSchema.js           # Product model (name, price, images, category)
    │   └── basketSchema.js         # Cart model (user, product, quantity)
    ├── seeds/
    │   └── productSeed.js          # Database seeder for sample products
    ├── utils/
    │   └── accessControl.js        # Role-based permission checks
    ├── index.js                    # Express server entry point
    ├── package.json
    └── .env                        # MONGODB_URI, TOKEN_SECRET_KEY, FRONTEND_URL
```

---

## Pages & Features

### Auth Pages (`/login`, `/register`)
- Login page with left panel showcase (animated demo slides) and right panel form
- Email/Password login + Google OAuth sign-in
- Registration page matching login style
- Password reset flow
- Auth gate modal — pops up when unauthenticated user tries a protected action (add to cart, etc.)
- Dark/Light theme toggle on auth pages

### Landing Page (`/`)
- Hero banner with promotional content and call-to-action
- Category grid — visual cards for each product category
- Featured products — horizontal sliders showing products by category
- Vertical product cards with image, price, rating, add-to-cart button

### Product Catalog (`/products`)
- Full product listing with responsive grid layout
- Pagination for large product lists
- Product cards with hover effects and quick actions

### Product Detail (`/product/:id`)
- Product image gallery with zoom/preview
- Product info: name, brand, price, selling price, discount percentage
- Stock availability indicator
- Add to cart button with quantity selector
- Full product description

### Category Browsing (`/category/:name`)
- Products filtered by selected category
- Category-specific product display

### Search (`/search`)
- Real-time product search
- Search results page with query highlighting

### Shopping Cart (`/cart`)
- Cart items list with product images and details
- Quantity increment/decrement controls
- Remove individual items
- Cart subtotal, tax, and total calculation
- Proceed to checkout button
- Cart item count badge in navbar

### Checkout (`/checkout`)
- Order placement with shipping details
- Order summary with pricing breakdown

### Order Success
- Order confirmation page with order details and summary

### My Orders (`/orders`)
- Order history showing all past orders
- Order status tracking

### Admin Dashboard (`/dashboard`)
- **Overview** — Stats cards (total products, users, orders, revenue), recent orders, quick actions
- **Product Management** — Full CRUD: add new products (image upload, category, price, stock), edit existing products, view all products
- **Category Management** — Manage product categories
- **User Management** — View all users, modify roles (promote to admin)
- **Order Management** — View and manage all customer orders
- **Revenue Analytics** — Sales charts and graphs using Recharts

### Theme System
- Dark/Light mode toggle
- CSS variables + Tailwind for theming
- Theme persists across sessions

---

## Frontend Setup

### Prerequisites
- Node.js 18+
- Backend running (local or deployed)
- Firebase Project (Auth + Firestore enabled)

### Install & Run

```bash
cd Frontend
npm install
npm start        # runs on http://localhost:3000
```

### Environment Variables

Create a `.env` file in `Frontend/`:

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project
```

### Build for Production

```bash
npm run build
```

### npm Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start dev server (port 3000) |
| `npm run build` | Production build to `/build` |
| `npm test` | Run tests |

---

## Backend Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### Install & Run

```bash
cd Backend
npm install
npm run dev      # nodemon, port 8080
```

### Environment Variables

Create a `.env` file in `Backend/`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/sohafy
TOKEN_SECRET_KEY=your_jwt_secret
FRONTEND_URL=http://localhost:3000
PORT=8080
```

### npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (dev) |
| `npm start` | Start with node (production) |

---

## API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/signup` | No | Register new account |
| POST | `/api/signin` | No | Login, returns JWT |
| GET | `/api/user-details` | Yes | Get authenticated user info |
| GET | `/api/userLogout` | No | Clear session/logout |

### Admin — User Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/all-user` | Admin | List all users |
| POST | `/api/update-user` | Admin | Modify user role |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload-product` | Admin | Create new product |
| GET | `/api/get-product` | No | Get all products |
| POST | `/api/update-product` | Admin | Update product |
| GET | `/api/get-categoryProduct` | No | Products by category (samples) |
| POST | `/api/category-product` | No | Products in a category |
| POST | `/api/product-details` | No | Single product details |
| GET | `/api/search?q=` | No | Search products |
| POST | `/api/filter-product` | No | Filter products |

### Shopping Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/addtocart` | Yes | Add item to cart |
| GET | `/api/countAddToCartProduct` | Yes | Cart item count |
| GET | `/api/view-card-product` | Yes | View cart items |
| POST | `/api/update-cart-product` | Yes | Update cart quantity |
| POST | `/api/delete-cart-product` | Yes | Remove from cart |

---

## Authentication Flow

1. User opens app → `onAuthStateChanged` checks Firebase auth state
2. Firebase user found → Firestore user doc fetched, dispatched to Redux store
3. User role determined (client/admin) → UI adapts accordingly
4. Backend auth: JWT token stored in HTTP-only cookie on login
5. `sessionGuard` middleware verifies JWT on protected endpoints
6. Admin routes additionally check user role via `accessControl`
7. Logout → Firebase `signOut()` + cookie cleared + Redux state reset

---

## Database Models

### Account Schema
```
name, email, password (hashed), role (client/admin), profilePic, timestamps
```

### Item Schema
```
name, description, price, sellingPrice, category, brand, images[], stock, timestamps
```

### Basket Schema
```
userId (ref), productId (ref), quantity
```

---

## Security Features

| Feature | Implementation |
|---------|---------------|
| JWT Authentication | HTTP-only cookies, session guard middleware |
| Password Hashing | bcryptjs |
| Role-Based Access | Admin vs Client role checks on routes |
| CORS | Whitelist frontend URL only |
| Body Size Limit | `express.json({ limit: "10mb" })` |
| Cookie Security | HTTP-only, secure in production |

---

## 🧠 What I Learned (The Journey)

Building this full-stack e-commerce platform was the most complex project I've tackled. Here are the key challenges I overcame:

- **MongoDB Schema Design** — Designed three interconnected schemas (Account, Item, Basket) with Mongoose, learning about references,
                              population, and aggregation pipelines for category-based product grouping.
  
- **JWT + Firebase Dual Auth** — Implemented a hybrid authentication system where Firebase handles the frontend auth (Google + Email)
                                 and JWT handles backend API protection with HTTP-only cookies. Understanding how these two systems work
                                 together was a major learning milestone.
  
- **Redux Toolkit for State Management** — Learned to manage complex global state (user info, role, cart count) using Redux Toolkit
                                           slices, and how to connect Redux state to React Router for role-based route protection.
  
- **Admin Dashboard Architecture** — Built a complete admin panel with product CRUD, user management, order tracking, and revenue
                                     analytics. Learned how to structure admin vs customer routes and enforce role-based access
                                     control on both frontend and backend.
  
- **Shopping Cart System** — Implemented a full cart system with backend persistence (MongoDB) and frontend state sync, handling
                             edge cases like quantity updates, item removal, and cart count badges.
  
- **Recharts Data Visualization** — Integrated Recharts for revenue analytics, learning how to transform raw order data into meaningful
                                    charts and graphs for the admin dashboard.
  
- **Material UI + Tailwind CSS Hybrid** — Learned to use Material UI components alongside Tailwind CSS utility classes, understanding when
                                          to use each and how to make them work together without conflicts.

---

**Author:** Soha Muzammil — *Intern at Codematics*
