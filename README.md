<div align="center">

# 💰 Paisa — AI-Powered Expense Tracker

**Track your money by just talking to it.**

Log expenses in plain language or by voice, get AI-powered saving advice grounded in your real data, and see your finances at a glance — all in ₹, on one clean dashboard.

[![Live Demo](https://img.shields.io/badge/Live_Demo-000?style=for-the-badge&logo=vercel&logoColor=white)](https://paisa-expense-tracker.vercel.app)
&nbsp;
[![MERN](https://img.shields.io/badge/Stack-MERN-00C853?style=for-the-badge)](#tech-stack)
&nbsp;
[![Groq](https://img.shields.io/badge/AI-Groq_LLaMA_3.3-FF6F00?style=for-the-badge)](#)

</div>

---

## 🔗 Links

- **Live app:** https://paisa-expense-tracker.vercel.app
- **Source code:** https://github.com/Kartiksahu03/paisa-expense-tracker

> ⚠️ The backend runs on Render's free tier, which sleeps after inactivity — the first load may take ~30–50 seconds to wake up.

---

## ✨ Features

- **🗣️ Natural-language entry** — type "spent 250 on lunch at dominos" and the AI parses the amount, category, and direction automatically.
- **🎙️ Voice commands** — tap the mic and speak your transaction; it transcribes and logs hands-free.
- **🧠 Context-aware AI assistant** — ask "how can I save more this month?" and get advice grounded in *your* actual spending data, not generic tips.
- **🔁 Smart income vs. expense detection** — understands financial nuance, e.g. that SIP and investments are money going *out*, not in.
- **📊 Real-time analytics** — income-vs-expense trends, category breakdowns, daily spending charts, and savings gauges.
- **🎯 Budget limits & alerts** — set a monthly cap and get warned at 50%, 80%, and 100%.
- **📁 CSV export** — download your income or expense history anytime.
- **🔐 Secure auth** — JWT authentication with bcrypt-hashed passwords.
- **📱 Fully responsive** — desktop dashboard collapses to a mobile-friendly layout with bottom navigation.

---

## 🛠️ Tech Stack

**Frontend:** React (Vite) · Redux Toolkit · Tailwind CSS · Framer Motion · Recharts · Web Speech API · Axios

**Backend:** Node.js · Express · MongoDB (Mongoose) · JWT · bcrypt

**AI:** Groq API (LLaMA 3.3) — structured JSON extraction & grounded chat

**Deployment:** Vercel (frontend) · Render (backend) · MongoDB Atlas (database)

---

## 🏗️ Architecture

```
paisa/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── app/            # Redux store
│       ├── features/       # auth · transactions · budget · ai (slice + api each)
│       ├── components/     # layout · dashboard · transactions · ai
│       ├── pages/          # Landing · Login · Dashboard · Income · Expenses · Profile
│       ├── services/       # axios instance + JWT interceptors
│       └── hooks/          # useAuth · useVoice
│
└── server/                 # Express + MongoDB API
    ├── models/             # User · Transaction · Budget
    ├── controllers/        # auth · transaction · budget · ai
    ├── routes/             # one router per domain
    ├── middlewares/        # JWT protect · error handler
    └── services/           # aiService.js — all Groq calls
```

The AI logic is isolated in a dedicated service layer, so the LLM provider or prompts can be changed without touching controllers. All routes are JWT-protected and scoped to the authenticated user.

---

## 🚀 Getting Started (Local)

### Prerequisites
- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) connection string
- A free [Groq API key](https://console.groq.com/keys)

### 1. Clone
```bash
git clone https://github.com/Kartiksahu03/paisa-expense-tracker.git
cd paisa-expense-tracker
```

### 2. Backend
```bash
cd server
npm install
cp .env.example .env      # then fill in the values below
npm run dev
```

`server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=any_long_random_string
JWT_EXPIRES_IN=7d
GROQ_API_KEY=your_groq_key
CLIENT_URL=http://localhost:5173
```

### 3. Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

`client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Open the printed URL (usually `http://localhost:5173`) and sign up.

---

## 🤖 How the AI Works

Every AI feature is grounded in real data to stay accurate and avoid hallucination:

- **Entry parsing** — the transaction text is sent to Groq with a strict JSON schema, a fixed category allow-list, and few-shot examples; the response is validated in code before hitting the database.
- **Assistant** — on each question, the backend rebuilds a financial snapshot (monthly totals, top categories, budget) and injects it as context, so the model reasons over the user's actual numbers.

---

## 🗺️ Roadmap

- [ ] SMS / email auto-capture of transactions using the same LLM parser
- [ ] httpOnly cookie auth with refresh-token rotation
- [ ] Push notifications for budget thresholds
- [ ] Automated test suite

---

## 👤 Author

**Kartik Sahu** — Full-Stack Developer
[Portfolio](https://kartik-s-portfolio-tau.vercel.app) · [GitHub](https://github.com/Kartiksahu03) · [LinkedIn](https://linkedin.com/in/kartik-sahu03)

---

<div align="center">
<sub>Built with the MERN stack and Groq AI.</sub>
</div>
