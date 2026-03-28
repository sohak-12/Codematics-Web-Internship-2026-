# Task-13 — Preplyx: AI-Powered Interview Preparation Platform

## Overview

A full-stack AI interview preparation platform built with Next.js 16 (Frontend) and Node.js/Express (Backend). Features real-time voice 
interviews via Vapi AI, AI-powered feedback generation via Google Gemini 1.5 Flash, Supabase Authentication & Database with Row Level 
Security, and an ultra-premium glassmorphism UI with animated 3D robot mascot, confetti celebrations, and downloadable reports.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16.2.1, React 18, TypeScript, App Router |
| Styling | Tailwind CSS 3.4, CSS Variables, Glassmorphism |
| Animations | Framer Motion 11, CSS Keyframes |
| Backend | Node.js, Express.js, Helmet |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Auth | Supabase Auth (Email/Password + Google OAuth) |
| Voice AI | Vapi AI SDK (@vapi-ai/web) — Real-time voice interviews |
| AI Feedback | Google Gemini 1.5 Flash API — Interview analysis |
| Charts | Recharts (Performance graphs) |
| Report Export | html2canvas-pro (PNG screenshot download) |
| Notifications | Sonner (Toast notifications) |
| Icons | Lucide React |
| Deployment | Vercel (Frontend + Backend) |

---

## Project Structure

```
task-13/
├── Frontend/
│   ├── public/
│   │   ├── Favicon.png
│   │   └── icon.png
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx      # Login page (split-panel design)
│   │   │   │   └── signup/page.tsx     # Signup page
│   │   │   ├── admin/page.tsx          # Admin panel
│   │   │   ├── dashboard/page.tsx      # Premium dashboard with Robot3D
│   │   │   ├── feedback/[id]/page.tsx  # Feedback report with data sanitizer
│   │   │   ├── interview/[category]/   # Live voice interview page
│   │   │   ├── global-error.tsx        # Global error boundary
│   │   │   ├── globals.css             # CSS variables, glass effects, animations
│   │   │   ├── layout.tsx              # Root layout with providers
│   │   │   └── page.tsx                # Landing/home page
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx          # Styled button
│   │   │   │   ├── Input.tsx           # Styled input
│   │   │   │   ├── Robot3D.tsx         # Pure SVG animated 3D robot mascot
│   │   │   │   └── ScoreRing.tsx       # Animated SVG score ring with glow
│   │   │   ├── AuthShowcase.tsx        # 4-slide rotating demo showcase
│   │   │   ├── CategoryCard.tsx        # Interview category card
│   │   │   ├── FeedbackReport.tsx      # Ultra-premium feedback report
│   │   │   ├── InterviewScreen.tsx     # Live interview UI with voice controls
│   │   │   └── Navbar.tsx              # Navigation (hidden on auth pages)
│   │   ├── constants/
│   │   │   └── categories.ts           # 13 interview categories
│   │   ├── hooks/
│   │   │   ├── useAuth.ts             # Auth hook (signIn, signUp, Google, signOut)
│   │   │   ├── useTheme.ts            # Theme toggle hook
│   │   │   └── useVapiInterview.ts    # Vapi voice interview hook
│   │   └── lib/
│   │       ├── supabase-client.ts     # Supabase browser client
│   │       ├── supabase-server.ts     # Supabase server client (SSR)
│   │       └── vapi.ts               # Vapi SDK init + error suppression
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── vercel.json
│
├── Backend/
│   ├── config/
│   │   └── supabase.js             # Supabase server client
│   ├── controllers/
│   │   ├── feedbackController.js   # Gemini AI feedback generation + storage
│   │   └── interviewController.js  # Interview CRUD operations
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT auth verification
│   ├── routes/
│   │   ├── feedbackRoutes.js       # POST /api/feedback, GET /api/feedback/:id
│   │   ├── interviewRoutes.js      # Interview API routes
│   │   └── health.js               # Health check endpoint
│   ├── server.js                   # Express server (Helmet, CORS, JSON limit)
│   ├── package.json
│   ├── vercel.json
│   └── .env                        # SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY
│
├── supabase/
│   └── schema.sql                  # Database schema + RLS policies
│
└── README.md
```

---

## Pages & Features

### Login Page (`/login`)
- Split-panel layout (left showcase + right form)
- **Left Panel:** AuthShowcase component — browser frame window with 4 rotating demo slides (scores, transcript, categories, feedback),
                  mesh grid background, glowing orbs (purple, pink, cyan), floating particles, Robot3D mascot
- **Right Panel:** Email/password form, sign in button with loading state, compact Google sign-in button, link to signup, theme toggle
- Navbar hidden on auth pages

### Signup Page (`/signup`)
- Matches login page layout and style
- Name, email, password fields
- Compact Google sign-up button
- Success message: "Account created! You can now sign in."
- Error handling for duplicate emails and disabled providers

### Dashboard (`/dashboard`)
- **3D Robot Mascot** — Pure SVG animated robot with gradient body, glowing cyan eyes (blink every 3s), pulsing antenna, animated mouth,
                        waving arms, floating hover animation
- **Animated Stats Cards** — Total interviews, average score, best score, streak count with counting animations from 0
- **Performance Graph** — Recharts line/area chart showing score history over time
- **Interview History** — List of past interviews with grade badges (S+/S/A/B/C/D), scores, dates
- **Streak Badge** — Fire icon with current practice streak
- **Quick Start Categories** — 13 category cards to start new interview instantly
- **Floating Orbs** — Ambient animated background elements

### Interview Page (`/interview/[category]`)
- Real-time voice interview powered by Vapi AI SDK
- AI interviewer asks questions based on selected category
- User responds via microphone — speech-to-text processing
- Interview transcript captured in real-time (question + answer pairs)
- Status tracking: idle → connecting → active → ended
- Voice activity visualization
- End interview button
- 13 categories: Frontend, Backend, Full Stack, Technical, HR, Behavioral, System Design, React, Next.js, JavaScript, DSA, DevOps,
                 AI Engineer

### Feedback Report (`/feedback/[id]`)
- **Confetti Celebration** — 40 animated particles burst on load
- **Floating Orbs** — 4 ambient orbs with different colors
- **Hero Section** — Trophy icon, animated grade badge, category tag, date
- **Grade System** — S+ (Legendary), S (Outstanding), A (Excellent), B (Good), C (Needs Work), D (Keep Practicing)
- **Overall Score Ring** — Large animated SVG ring (140px) with glow halo and counting animation
- **Sub-Score Rings** — 4 smaller rings for Communication, Technical, Confidence, Problem Solving
- **Detailed Breakdown** — Progress bars with shimmer effect for each category
- **AI Summary** — Premium quote card with sparkle icon
- **Strengths Card** — Green-themed glass card with numbered items
- **Weaknesses Card** — Red-themed glass card with growth-focused framing
- **Suggestions Card** — Amber-themed glass card with actionable tips
- **Save Report** — Downloads entire report as PNG at 2x resolution via html2canvas-pro
- **NaN-Safe** — All scores sanitized with `Number.isFinite()` checks and generous fallbacks (7-9)

### Theme System
- Full dark/light theme via CSS variables
- Glass effects, gradient borders, glow buttons adapt to theme
- Theme persists in localStorage
- Smooth transitions

---

## Frontend Setup

### Prerequisites
- Node.js 18+
- Backend running (local or deployed)
- Supabase Project (Auth + Database)
- Vapi AI Account

### Install & Run

```bash
cd Frontend
npm install
npm run dev      # runs on http://localhost:3000
```

### Environment Variables

Create a `.env.local` file in `Frontend/`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Build for Production

```bash
npm run build
```

### npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server (port 3000) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Backend Setup

### Prerequisites
- Node.js 18+
- Supabase Project
- Google Gemini API Key

### Install & Run

```bash
cd Backend
npm install
npm run dev      # nodemon, port 5000
```

### Environment Variables

Create a `.env` file in `Backend/`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:3000
PORT=5000
```

### npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (dev) |
| `npm start` | Start with node (production) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/feedback` | Generate AI feedback (Gemini) and save interview |
| GET | `/api/feedback/:id` | Get interview feedback by ID |
| GET | `/api/interviews` | Get user's interview history |
| GET | `/api/interviews/:id` | Get single interview details |

**Create Feedback Request (POST /api/feedback):**
```json
{
  "category": "frontend",
  "transcript": [
    { "question": "What is React?", "answer": "React is a JavaScript library..." }
  ],
  "userId": "uuid-of-user"
}
```

**Feedback Response:**
```json
{
  "interviewId": "uuid",
  "feedback": {
    "overallScore": 8,
    "communication": 9,
    "technicalKnowledge": 8,
    "confidence": 8,
    "problemSolving": 7,
    "strengths": ["Strong React knowledge", "Clear communication"],
    "weaknesses": ["Could elaborate more on system design"],
    "suggestions": ["Practice more mock interviews"],
    "summary": "Great effort! You showed solid potential..."
  }
}
```

---

## Database Schema

### interviews

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated unique ID |
| user_id | UUID (FK → auth.users) | Owner of the interview |
| category | TEXT | Interview category |
| score | INTEGER | Overall score (1-10) |
| feedback | JSONB | Full feedback object from Gemini |
| created_at | TIMESTAMPTZ | Timestamp |

### interview_transcripts

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated unique ID |
| interview_id | UUID (FK → interviews) | Parent interview |
| question | TEXT | AI interviewer's question |
| answer | TEXT | User's spoken answer |
| created_at | TIMESTAMPTZ | Timestamp |

### Row Level Security Policies

| Policy | Table | Rule |
|--------|-------|------|
| Users can read own interviews | interviews | `auth.uid() = user_id` |
| Users can insert own interviews | interviews | `auth.uid() = user_id` |
| Users can read own transcripts | interview_transcripts | `interview_id` belongs to user |
| Users can insert own transcripts | interview_transcripts | `interview_id` belongs to user |

---

## Authentication Flow

1. User opens app → Supabase checks session via `@supabase/ssr`
2. Not logged in → Redirected to `/login`
3. User signs in with Email/Password or Google OAuth
4. Supabase returns session → stored in cookies (SSR-compatible)
5. Auth state listener updates `useAuth` hook
6. Protected pages check `user` state, redirect if null
7. Sign out → Supabase `signOut()`, redirect to `/login`

---

## AI Feedback Pipeline

1. User completes voice interview → transcript (Q&A pairs) captured by Vapi
2. Frontend sends `{ category, transcript, userId }` to `POST /api/feedback`
3. Backend formats transcript and sends to Google Gemini 1.5 Flash
4. Gemini prompt: encouraging coach persona, generous scoring (7-10), positive framing
5. Gemini returns structured JSON feedback
6. Backend stores interview + feedback in Supabase `interviews` table
7. Backend stores transcript entries in `interview_transcripts` table
8. Frontend redirects to `/feedback/[id]` → fetches and displays report
9. Frontend sanitizes all scores (handles inconsistent Gemini key names, NaN fallbacks)

---

## Security Features

| Feature | Implementation |
|---------|---------------|
| Supabase Auth | Email/Password + Google OAuth |
| Row Level Security | Users can only access their own data |
| Helmet | Secure HTTP headers on backend |
| CORS | Whitelist frontend URL only |
| Body Size Limit | `express.json({ limit: "10kb" })` |
| Service Role Key | Backend-only, never exposed to frontend |
| TypeScript | Strict type checking, zero errors |

---

## 🧠 What I Learned (The Journey)

Building this AI-powered interview platform was the most technically challenging and rewarding project of my entire course. Here are the 
key challenges I overcame:

- **Voice AI Integration (Vapi)** — Integrated real-time voice AI for conducting interviews, learning how to handle WebRTC connections,
                                    speech-to-text processing, and graceful error handling for edge cases like "Meeting has ended" errors
                                    that required console error suppression.

- **Google Gemini API for Structured Output** — Learned to prompt-engineer Gemini 1.5 Flash to return consistent JSON feedback, and built
                                                a comprehensive sanitizer to handle inconsistent key names (`overallScore` vs `overall_score`
                                                vs `score`) that Gemini sometimes returns despite explicit instructions.

- **Supabase Row Level Security** — Implemented PostgreSQL RLS policies ensuring users can only access their own interviews and transcripts.
                                    Understanding how `auth.uid()` works in RLS policies and how to write sub-query policies for related
                                    tables was a major learning milestone.

- **Next.js 16 App Router with TypeScript** — Built the entire frontend with Next.js App Router, server/client components, dynamic routes
-                                             (`[id]`, `[category]`), route groups (`(auth)`), and maintained zero TypeScript errors throughout
-                                             development.

- **Pure SVG Animation (Robot3D)** — Created a fully animated 3D robot mascot using only SVG and CSS — no external 3D libraries. Learned SVG
-                                    gradients, clip paths, and CSS keyframe animations for blinking eyes, waving arms, and floating hover effects.

- **html2canvas for Report Export** — Implemented report download as PNG using html2canvas-pro, learning how to handle CSS variables,
                                      glassmorphism effects, and dark/light themes in canvas rendering at 2x resolution.

- **NaN-Safe Rendering** — Discovered that AI APIs can return unpredictable data formats. Built defensive rendering throughout the entire
                           feedback pipeline using `Number.isFinite()` checks, multiple key name fallbacks, and encouraging default values
                           instead of showing broken UI.

- **Premium UI/UX Design** — Pushed my CSS skills to the limit with glassmorphism, animated confetti, floating orbs, gradient borders,
                             glowing score rings, shimmer effects, and a complete grade system (S+/S/A/B/C/D) — all while maintaining
                             dark/light theme compatibility.

---

**Author:** Soha Muzammil — *Intern at Codematics*
