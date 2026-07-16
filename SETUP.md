# Paisa — AI Expense Tracker (MERN + Groq)

A clean, mobile-first expense tracker. Add transactions in plain language
("spent 250 on lunch"), the AI categorizes them, shows monthly insights +
saving tips, and warns you when you cross your budget. Everything in ₹.

Stack: **MongoDB · Express · React (Vite) · Node · Redux Toolkit · Tailwind ·
Framer Motion · Groq (LLaMA 3.3)**. Same structure as FrHelp: `features/*Slice.js`
+ `*Api.js`, JWT `authMiddleware`, `ProtectedRoute`, a `services/` layer for the
external API (Groq here).

---

## 0. What you need first (get these 3 keys)

1. **MongoDB Atlas** (free) → a connection string.
   Sign up at mongodb.com/atlas → create a free cluster → `Connect` →
   `Drivers` → copy the URI.
2. **Groq API key** (free) → for the AI.
   Get it at https://console.groq.com/keys
3. **A JWT secret** — just a long random string. Generate one by running:
   ```
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

---

## 1. Backend setup (`server/`)

```bash
cd server
npm install
```

Create the `.env` file:
```bash
cp .env.example .env
```

Open `.env` and fill in your values:

| Variable | What to put |
|---|---|
| `PORT` | `5000` (leave as is) |
| `MONGO_URI` | your MongoDB Atlas string. Replace `<username>`, `<password>`, keep `/paisa` as the db name |
| `JWT_SECRET` | the random string you generated above |
| `JWT_EXPIRES_IN` | `7d` (leave as is) |
| `GROQ_API_KEY` | your Groq key (starts with `gsk_`) |
| `CLIENT_URL` | `http://localhost:5173` for local. Later: your Vercel URL |

Run it:
```bash
npm run dev
```
You should see `Server running on port 5000` and `MongoDB connected`.

---

## 2. Frontend setup (`client/`)

Open a **second terminal**:
```bash
cd client
npm install
cp .env.example .env
```

Open `client/.env` and set:
| Variable | What to put |
|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` for local. Later: `https://your-backend.onrender.com/api` |

Run it:
```bash
npm run dev
```
Open the URL it prints (usually `http://localhost:5173`).

---

## 3. Try it

1. Go to the landing page → **Get started** → create an account.
2. On the dashboard, use the bar at the bottom: type
   `spent 250 on lunch at dominos` and hit **+**.
   The AI parses it into amount + category and it appears instantly.
3. Type `got 45000 salary` → it logs as income.
4. Click **Edit** on the budget bar, set e.g. `25000` → the bar and alerts update.
5. The green **AI insight** card summarizes your month with a saving tip.

---

## 4. How the AI is wired (so you can explain it in interviews)

- `server/services/aiService.js` holds the two Groq calls:
  - `parseTransaction(text)` → sends your line to LLaMA 3.3 with
    `response_format: json_object`, gets back `{type, amount, category, note}`.
    There are guard rails so a bad category falls back to `Other`.
  - `generateInsight(summary)` → sends monthly totals, gets back a 2-sentence
    coach message.
- `POST /api/ai/add` → parses **and** creates the transaction in one call.
- `GET /api/ai/insight` → builds this-month vs last-month totals and asks the AI
  for the summary.

**Key point:** the same `parseTransaction` function is exactly what you'd later
point at bank-SMS or email text for auto-capture (Phase 2). You're not throwing
work away — you're building the AI core with the easiest input first.

---

## 5. Deploy (when ready)

**Backend → Render:** New Web Service → connect the repo → root dir `server`
→ build `npm install` → start `npm start` → add all the `.env` vars in Render's
Environment tab. Set `CLIENT_URL` to your Vercel URL.

**Frontend → Vercel:** Import repo → root dir `client` → framework Vite →
add `VITE_API_URL` = your Render backend URL + `/api`.

(Deploy the backend first so you have its URL for the frontend's env.)

---

## Folder map

```
server/
  server.js                 app entry, mounts routes
  config/db.js              mongo connection
  models/                   User, Transaction, Budget
  controllers/              auth, transaction, budget, ai
  routes/                   one file per domain
  middlewares/              JWT protect + error handler
  services/aiService.js     Groq calls (parse + insight)
  utils/                    token gen, category list

client/src/
  app/store.js              redux store
  features/                 auth / transactions / budget / ai  (slice + api each)
  components/               dashboard, transactions, ai, common
  pages/                    Landing, Login, Register, Dashboard
  services/axios.js         base API + JWT interceptor
  routes/ProtectedRoute.jsx auth guard
  utils/formatCurrency.js   ₹ formatting
```

---

## API reference (all except register/login need the `Authorization: Bearer` header)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | create account |
| POST | `/api/auth/login` | log in |
| GET | `/api/transactions` | list (optional `?month=YYYY-MM`) |
| POST | `/api/transactions` | manual add |
| DELETE | `/api/transactions/:id` | delete |
| GET | `/api/transactions/summary` | balances, saving rate, category split, 6-month series |
| GET | `/api/budget` | limit + used + alert |
| PUT | `/api/budget` | set limit |
| POST | `/api/ai/add` | natural-language add |
| GET | `/api/ai/insight` | monthly AI summary + tip |

---

## What changed in this version (v2)

**Desktop-first + responsive.** The app now has a real website layout: a left
sidebar on desktop that collapses to a top bar + bottom tab nav on mobile.
Charts and cards reflow from multi-column (desktop) to stacked (mobile).

**Clear income vs expense.** Click "Add transaction" → the Manual tab has an
explicit Expense / Income toggle, an amount field, and a category dropdown. No
more guessing. The AI tab is still there for quick natural-language entry.

**Smarter AI direction.** The AI now knows SIP / mutual funds / investments are
money going OUT (an "Investment" expense), not income. So "20000 in SIP" logs
correctly as an outflow.

**Voice commands.** In the Add modal's "AI / Voice" tab, tap the mic and speak
("add 20 rupees to paan partner"). It transcribes via your browser and the AI
logs it. Note: voice uses the browser Web Speech API — works in Chrome/Edge on
desktop and Android. Safari/iOS support is limited. You must allow mic access.

**Analytics dashboard.** The dashboard now shows an Income-vs-Expense bar chart
(6 months) and a spending-by-category donut, plus stat cards, AI insight, and
budget bar. A separate Transactions page lists everything with in/out filters.

### Update the landing page links
Open `client/src/pages/Landing.jsx` and edit the constants at the top
(`GITHUB_URL`, `LIVE_URL`, `BUILDER`, `PORTFOLIO_URL`) with your real values
once you deploy.

### One new dependency note
The charts use `recharts`, which is already listed in `client/package.json`.
If you added files manually, run `npm install` again in `client/` so recharts
is present.

---

## What changed in this version (v3)

**Fuller sidebar / more pages.** The sidebar now has Dashboard, Income, Expenses,
and Profile (plus Support and Logout), each a real page — no more empty feeling.
On mobile these become a bottom tab bar.

**AI Assistant (chat).** A floating button (bottom-right) opens a chat where you
can ask things like "How can I save more this month?" or "Why did my expenses go
up?". It answers using your *real* numbers (this month's income, expenses, top
categories, budget). Backed by `POST /api/ai/chat`, which builds your financial
snapshot server-side and sends it to Groq as grounding context. You can type or
use the mic.

**Income & Expenses pages** (from your reference screenshots): each has its own
Add button, a daily-trend area chart for the month, a transaction list, and CSV
export. The Expenses page also shows the category donut.

**Dashboard extras:** Income / Spent / Savings semicircle gauges and a daily
expense-trend chart, echoing the reference layout — on your dark theme.

**CSV export.** Export buttons on the Income and Expenses pages download a `.csv`
of those transactions (client-side, no server needed).

**Handier adding.** Add is reachable from the sidebar, the mobile top bar, and a
dedicated Add button on each Income/Expenses page (pre-set to the right type).

### New endpoint
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/ai/chat` | Conversational assistant grounded in your real data |
