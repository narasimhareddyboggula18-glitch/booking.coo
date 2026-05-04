# SportSync — Presidency University Sports Facility Booking

A full-stack sports court booking system for Presidency University students.  
**100% free, verified students only, college hours only.**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Gmail account (for OTP emails — App Password required)

### 1. Start the Backend

```bash
cd server
# Edit .env with your MongoDB URI and Gmail credentials
npm install
node server.js
```
Server runs at **http://localhost:5000**  
MongoDB auto-seeds all 11 sports on first run.

### 2. Start the Frontend

```bash
cd client
npm install
npm run dev
```
App runs at **http://localhost:5173**

---

## 🏗️ Tech Stack

| Layer       | Tech                                    |
|-------------|-----------------------------------------|
| Frontend    | React 18 + Vite + Framer Motion + GSAP  |
| Styling     | Tailwind CSS v4 + Custom CSS            |
| Backend     | Node.js + Express.js                    |
| Database    | MongoDB + Mongoose                      |
| Auth        | JWT (7-day tokens) + OTP email verify   |
| Email       | Nodemailer (Gmail SMTP)                 |

---

## 🏟️ Sports Available

**Outdoor (6):** Cricket · Football · Volleyball · Kabaddi · Kho-Kho · Throw Ball  
**Indoor (5):** Basketball · Table Tennis · Gym · Carrom · Chess

---

## 📋 Business Rules

1. Only `@presidencyuniversity.in` emails can register
2. Email OTP verification required before booking
3. Booking hours: **9:30 AM – 5:00 PM**, Mon–Sat (no Sundays)
4. One slot = 1 hour
5. Max **2 bookings per student per day**
6. Active sports events block **all slots** for that sport
7. Cancellation allowed up to **2 hours before** the slot
8. No past-date bookings

---

## 🔐 Environment Variables (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sportsync
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
```

> **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords

---

## 🛣️ API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register with college email |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/verify-email` | Verify OTP |
| POST | `/api/auth/forgot-password` | Request password reset |
| GET  | `/api/auth/me` | Get current user |

### Sports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sports` | All active sports |
| GET | `/api/sports/:id` | Single sport |
| GET | `/api/sports/cat/:category` | By category |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/bookings/slots?sportId=&date=` | Available slots |
| POST | `/api/bookings` | Create booking |
| GET  | `/api/bookings/my` | My bookings |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking |

### Events (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/events` | All active events |
| POST   | `/api/events` | Create event (admin) |
| DELETE | `/api/events/:id` | Delete event (admin) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Stats |
| GET | `/api/admin/bookings` | All bookings |
| GET | `/api/admin/users` | All users |

---

## 🎨 Design System

- **Primary:** `#1a1a2e` Deep Navy  
- **Highlight:** `#e94560` Coral Red  
- **Success:** `#00b894` Mint Green  
- **Cards:** Glassmorphism (`rgba(255,255,255,0.05)` + `backdrop-filter: blur`)  
- **Fonts:** Outfit (display) + Inter (body)

---

## 📁 Folder Structure

```
sport booking/
├── client/                  React frontend
│   └── src/
│       ├── components/      Navbar, Hero, SportCard, Calendar, TimeSlots…
│       ├── context/         AuthContext, BookingContext
│       └── pages/           Home, Login, Register, Sports, Booking, History, Admin, Profile
└── server/                  Node.js backend
    ├── controllers/         Auth, Sport, Booking, Event, Admin
    ├── models/              User, Sport, Booking, Event
    ├── routes/              All route files
    ├── middleware/           JWT auth guard
    └── utils/               Nodemailer mailer
```

---

## 🚀 Production Deployment

- **Frontend** → [Vercel](https://vercel.com) — connect GitHub repo, set root to `client`
- **Backend** → [Railway](https://railway.app) or [Render](https://render.com) — set root to `server`, add env vars
- **Database** → [MongoDB Atlas](https://mongodb.com/atlas) — update `MONGODB_URI`

---

*Built for Presidency University · SportSync v1.0*
