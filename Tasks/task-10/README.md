# Task 10: Sohanix Wealth

## Overview

A full-stack personal finance management application built with React (Frontend) and Node.js/Express (Backend), deployed on Vercel with MongoDB Atlas.

---

## Quick Links

- **Live Demo:** https://sohaatheneum.vercel.app
- **Backend API:** https://soha-atheneum.vercel.app/api

---

## Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | React 18, React Router v6, Framer Motion        |
| Charts     | Recharts                                        |
| Icons      | Lucide React                                    |
| HTTP       | Axios                                           |
| Backend    | Node.js, Express.js                             |
| Database   | MongoDB Atlas (Mongoose)                        |
| Auth       | JSON Web Tokens (JWT)                           |
| Security   | Helmet, CORS whitelist, CSRF header enforcement |
| Deployment | Vercel (both Frontend & Backend)                |

---

## Project Structure

```
task-10/
├── Frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── Favicon.png
│   │   ├── Images1.png          # Sidebar logo
│   │   └── Images2.png          # Auth page logo
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth.js          # Login / Register / Forgot Password
│   │   │   ├── Dashboard.js     # Financial overview + charts
│   │   │   ├── Transactions.js  # Transaction CRUD + analytics
│   │   │   └── Budgets.js       # Budget management + insights
│   │   ├── components/
│   │   │   ├── Header.js        # Page header with theme toggle
│   │   │   ├── Modal.js         # Reusable modal wrapper
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── PremiumLoader.js
│   │   │   ├── SignOutModal.js
│   │   │   ├── FinancialOverview.js
│   │   │   ├── SpendingTrendChart.js
│   │   │   ├── CategoryAnalysis.js
│   │   │   ├── TransactionList.js
│   │   │   ├── TransactionForm.js
│   │   │   ├── TransactionAnalytics.js
│   │   │   ├── BudgetCard.js
│   │   │   ├── BudgetForm.js
│   │   │   ├── BudgetAnalytics.js
│   │   │   ├── BudgetProgressSection.js
│   │   │   ├── AuthShowcase.js  # Left panel slider on auth page
│   │   │   └── MobileShowcase.js
│   │   ├── hooks/
│   │   │   ├── useTheme.js      # Dark/light mode toggle
│   │   │   ├── useToast.js      # Toast notification system
│   │   │   ├── useDebounce.js   # Search debounce
│   │   │   ├── useUndoRedo.js   # Undo/redo command history
│   │   │   └── useMonthNavigation.js
│   │   ├── utils/
│   │   │   ├── api.js           # Axios instance + all API calls
│   │   │   └── helpers.js       # formatCurrency, getCategoryLabel
│   │   ├── styles/index.css
│   │   └── App.js               # Router, auth state, AppShell
│   ├── package.json
│   └── vercel.json
│
└── Backend/
    ├── config/
    │   └── db.js                # MongoDB connection
    ├── controllers/
    │   ├── authController.js
    │   ├── budgetController.js
    │   ├── statsController.js
    │   └── categoriesController.js
    ├── middleware/
    │   └── authMiddleware.js    # JWT verification (header-only)
    ├── models/
    │   ├── Transaction.js
    │   ├── Budget.js
    │   ├── Categories.js
    │   └── Log.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── transactionRoutes.js
    │   ├── budgetRoutes.js
    │   ├── categories.js
    │   └── health.js
    ├── server.js                # Express app entry point
    ├── package.json
    ├── vercel.json
    ├── .env.example
    └── .gitignore
```

---

## Pages & Features

### Auth Page (`/login`)
- Login, Register, and Forgot Password — all in one animated page
- Left panel: animated showcase slider with stats (Uptime, Users, Encryption)
- Right panel: 3D tilt card form with Framer Motion transitions
- Floating particle background animation
- Token stored in `localStorage` on successful login
- "Back to Logbook" button navigates to main portfolio

### Dashboard (`/dashboard`)
- Current month transactions fetched automatically
- **FinancialOverview** — total income, expenses, net balance cards
- **SpendingTrendChart** — area chart of daily spending (Recharts)
- **CategoryAnalysis** — breakdown by category
- Dark/light theme toggle via `useTheme` hook

### Transactions (`/transactions`)
- Full CRUD — Add, Edit, Delete transactions
- **Undo/Redo** support via `useCommandHistory` hook
- **Search** with 300ms debounce (`useDebounce`)
- **Filters** — by category and date range (This Month / Last 3 Months / All Time)
- **CSV Export** — downloads all transactions as `.csv`
- **TransactionAnalytics** — daily area chart + category bar chart
- Pagination — 20 transactions per page
- Summary cards: Total Spent, Count, Average, Top Category

### Budgets (`/budgets`)
- Set monthly budget limits per category
- **BudgetCard** — shows spent vs limit with progress bar
- **BudgetAnalytics** — velocity chart (actual vs ideal daily spend) + variance bar chart
- Summary cards: Total Budget, Total Spent, Utilization %, Remaining
- Add / Edit / Delete budgets via modal

---

## Frontend Setup

### Prerequisites
- Node.js 18+
- Backend running (local or deployed)

### Install & Run

```bash
cd Frontend
npm install
npm start        # runs on http://localhost:3000
```

### Environment Variable

Create a `.env` file in `Frontend/`:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

For production, set this to your deployed Backend URL.

### Build for Production

```bash
npm run build
```

### npm Scripts

| Script          | Description                  |
| --------------- | ---------------------------- |
| `npm start`     | Start dev server (port 3000) |
| `npm run build` | Production build to `/build` |
| `npm test`      | Run tests                    |

---

## Backend Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### Install & Run

```bash
cd Backend
npm install
cp .env.example .env    # fill in your values
npm run dev             # nodemon, port 5000
```

### Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/sohanix
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:3000
```

### npm Scripts

| Script        | Description                  |
| ------------- | ---------------------------- |
| `npm run dev` | Start with nodemon (dev)     |
| `npm start`   | Start with node (production) |
| `npm test`    | Run Jest tests               |

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint           | Auth | Description              |
| ------ | ------------------ | ---- | ------------------------ |
| POST   | `/register`        | No   | Create new account       |
| POST   | `/login`           | No   | Login, returns JWT token |
| POST   | `/forgot-password` | No   | Send password reset link |

**Login Request:**
```json
{ "email": "user@example.com", "password": "yourpassword" }
```
**Login Response:**
```json
{
  "success": true,
  "data": { "token": "<jwt>", "user": { "_id": "...", "username": "...", "email": "..." } }
}
```

---

### Transactions — `/api/transactions` (Protected)

| Method | Endpoint  | Description                         |
| ------ | --------- | ----------------------------------- |
| GET    | `/`       | Get all transactions (with filters) |
| POST   | `/`       | Create transaction                  |
| GET    | `/stats`  | Aggregated stats by category        |
| GET    | `/:id`    | Get single transaction              |
| PUT    | `/:id`    | Update transaction                  |
| DELETE | `/:id`    | Delete transaction                  |

**Query Filters (GET /):**
```
?startDate=2025-01-01&endDate=2025-01-31&category=food
```

**Create Transaction Body:**
```json
{
  "title": "Grocery Shopping",
  "amount": 2500,
  "category": "food",
  "date": "2025-07-15",
  "notes": "Weekly groceries"
}
```

---

### Budgets — `/api/budgets` (Protected)

| Method | Endpoint         | Description               |
| ------ | ---------------- | ------------------------- |
| GET    | `/`              | Get all budgets           |
| POST   | `/`              | Create budget             |
| GET    | `/current-month` | Get current month budgets |
| GET    | `/:id`           | Get single budget         |
| PUT    | `/:id`           | Update budget             |
| DELETE | `/:id`           | Delete budget             |

**Create Budget Body:**
```json
{ "category": "food", "monthlyLimit": 15000 }
```

---

### Other Endpoints

| Method | Endpoint          | Auth | Description         |
| ------ | ----------------- | ---- | ------------------- |
| GET    | `/api/categories` | Yes  | Get all categories  |
| GET    | `/api/stats`      | Yes  | Dashboard stats     |
| GET    | `/api/health`     | No   | Server health check |

---

## Authentication Flow

1. User logs in → Backend returns JWT (expires in 30 days)
2. Frontend stores token in `localStorage`
3. Every API request attaches `Authorization: Bearer <token>` header via Axios interceptor
4. On 401 response → interceptor clears storage and fires `unauthorized` event → App redirects to `/login`
5. On window focus → App re-checks `localStorage` for token validity

---

## Security Features

| Feature                 | Implementation                                               |
| ----------------------- | ------------------------------------------------------------ |
| JWT Authentication      | Header-only (`Authorization: Bearer`), cookies/query rejected |
| CSRF Protection         | `Content-Type: application/json` enforced on mutating requests |
| Helmet                  | Sets secure HTTP headers                                     |
| CORS Whitelist          | Only `CLIENT_URL` allowed                                    |
| Body Size Limit         | `express.json({ limit: "10kb" })`                            |
| Password Hashing        | bcryptjs                                                     |
| Scoped Package Name     | `@sohanix/wealth-server` (prevents npm dependency confusion) |
| Email Enumeration Guard | Forgot password returns same message regardless of email     |

---

## Vercel Deployment

### Backend

1. Push `Backend/` to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Set root directory to `Backend`
4. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (your Frontend Vercel URL)
   - `NODE_ENV=production`
5. Deploy — Vercel uses `vercel.json` to route all traffic to `server.js`

**Backend `vercel.json`:**
```json
{
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

### Frontend

1. Push `Frontend/` to GitHub
2. Import repo in Vercel, set root directory to `Frontend`
3. Add environment variable:
   - `REACT_APP_API_BASE_URL=https://your-backend.vercel.app/api`
4. Deploy — Vercel uses `vercel.json` to handle SPA routing (all routes → `index.html`)

**Frontend `vercel.json`:**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

> **MongoDB Atlas**: Make sure Network Access is set to `0.0.0.0/0` to allow Vercel's dynamic IPs.

---

## Categories

Both Frontend and Backend use the same fixed category list:

`food` · `transport` · `entertainment` · `utilities` · `healthcare` · `shopping` · `other`

---

## What I Learned (The Journey)

Building this full-stack application was a massive learning curve. Here are the key technical challenges I overcame:

- **Serverless Deployment Mastery** — Learned how to deploy a MERN app on Vercel using `vercel.json` and how to handle serverless function routing.

- **Debugging CORS & Preflight Requests** — Encountered and fixed complex CORS policy errors by configuring dynamic origins and manual headers in Express.

- **Cloud Database Security** — Learned to manage MongoDB Atlas Network Access (IP Whitelisting) and secure connection strings via Environment Variables.

- **Case Sensitivity in Production** — Realized that while Windows is case-insensitive, Linux-based hosting (Vercel) is not. Fixed critical deployment crashes caused by incorrect file naming (e.g., `IssueController.js` vs `issueController.js`).

- **Performance Optimization** — Implemented `useDebounce` for search and `useMemo` for heavy financial calculations to keep the dashboard snappy.

- **State Persistence** — Mastered the use of `localStorage` combined with Axios Interceptors to keep users logged in across page refreshes.

---

**Author:** Soha Muzammil — *Intern at Codematics*
