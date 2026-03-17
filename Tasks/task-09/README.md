# Task 09: Soha's Atheneum – Full-Stack Library System

## Overview
**Soha's Atheneum** is a high-performance, full-stack library management ecosystem. It features a sophisticated separation of concerns, utilizing a React-powered 
frontend and a robust Node.js/MongoDB backend to handle complex operations like real-time inventory tracking, member management, and automated fine calculations.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens), bcryptjs |
| HTTP Client | Axios |
| Fonts | Syne, JetBrains Mono |

---

## Features

- **JWT Authentication** — Secure admin login with token-based auth
- **Dashboard** — Live stats with animated counters, ring charts, sparklines, utilization panel, and recent activity feed
- **Books Management** — Add, edit, delete books with category and quantity tracking
- **Members Management** — Register, edit, delete members with department info
- **Issue & Return** — Split-screen layout: issue form on left, live records on right — no tab switching needed
- **Search** — Real-time search across books and members
- **Fines Tracking** — Automatic overdue fine calculation
- **Trending Book** — Most issued book shown on dashboard

---

## Project Structure

```
task-09/
├── Backend/
│   ├── controllers/
│   │   ├── authController.js       # Login logic
│   │   ├── bookController.js       # CRUD for books
│   │   ├── memberController.js     # CRUD for members
│   │   ├── issueController.js      # Issue & return logic
│   │   └── dashboardController.js  # Live stats
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Book.js
│   │   ├── Member.js
│   │   └── Issue.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── memberRoutes.js
│   │   ├── issueRoutes.js
│   │   └── statsRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── .env
│   └── server.js
│
└── Frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Books.jsx
    │   │   ├── Members.jsx
    │   │   ├── IssueReturn.jsx
    │   │   └── Search.jsx
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   └── UI.jsx
    │   ├── context/
    │   │   └── ToastContext.jsx
    │   ├── api.js
    │   ├── App.jsx
    │   └── index.css
    └── index.html
```

---

## How to Run

### 1. Clone / Open the project
```
cd Tasks/task-09
```

### 2. Setup Backend
```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/`:
```env
MONGODB_URI=mongodb://localhost:27017/library
JWT_SECRET=your_secret_key
PORT=5001
```

Start the backend server:
```bash
npm run dev
```
> Server runs on `http://localhost:5001`

### 3. Setup Frontend
```bash
cd Frontend
npm install
npm run dev
```
> App runs on `http://localhost:5173`

---

## Default Login Credentials

```
Username: admin
Password: admin123

```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/books` | Get all books |
| POST | `/api/books` | Add a book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |
| GET | `/api/members` | Get all members |
| POST | `/api/members` | Add a member |
| PUT | `/api/members/:id` | Update a member |
| DELETE | `/api/members/:id` | Delete a member |
| GET | `/api/issues` | Get all issue records |
| POST | `/api/issues/issue` | Issue a book |
| DELETE | `/api/issues/:id` | Delete a record |
| GET | `/api/stats` | Get dashboard stats |

---

## Dashboard Stats Explained

| Stat | Source |
|------|--------|
| Total Books | Count of all books in DB |
| Members | Count of all registered members |
| Available | Books with `quantity > 0` |
| Books Issued | Issues with `status = 'Active'` |
| Overdue | Active issues where `dueDate < today` |
| Fines Collected | Sum of all `fine` fields |
| Trending Book | Most frequently issued book title |

---

## What I Learned

- Building a full REST API with Express.js and connecting it to MongoDB using Mongoose
- JWT-based authentication flow — generating tokens on login and protecting routes with middleware
- React state management across multiple pages using props and context
- Designing a split-screen UI for better user experience (Issue & Return page)
- Fixing real bugs like status enum mismatches between frontend and backend (`'Active'` vs `'Issued'`)
- Creating reusable UI components (Modal, SearchBar, FormGroup, StyledInput)
- Implementing animated SVG ring charts, sparklines, and live counters in React

---

**Author:** **Soha Muzammil** *Intern at Codematics*
