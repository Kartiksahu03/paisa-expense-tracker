<!-- ══════════════════════ BANNER ══════════════════════ -->
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00C853,50:14B8A6,100:6366F1&height=200&section=header&text=Paisa&fontSize=72&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=AI-Powered%20Expense%20Tracker&descAlignY=60&descSize=22" width="100%"/>

<a href="https://paisa-expense-tracker.vercel.app">
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=14B8A6&center=true&vCenter=true&width=650&lines=Track+your+money+by+just+talking+to+it.;%22spent+250+on+lunch%22+%E2%86%92+logged+automatically.;AI+advice+grounded+in+YOUR+real+data.;Voice+%2B+NLP+%2B+real-time+analytics." alt="Typing SVG" />
</a>

<br/><br/>

<a href="https://paisa-expense-tracker.vercel.app"><img src="https://img.shields.io/badge/🚀_LIVE_DEMO-00C853?style=for-the-badge&logoColor=white" height="34"/></a>
&nbsp;
<a href="https://github.com/Kartiksahu03/paisa-expense-tracker"><img src="https://img.shields.io/badge/⭐_SOURCE_CODE-181717?style=for-the-badge&logo=github&logoColor=white" height="34"/></a>
&nbsp;
<a href="https://kartik-s-portfolio-tau.vercel.app"><img src="https://img.shields.io/badge/🌐_PORTFOLIO-6366F1?style=for-the-badge&logoColor=white" height="34"/></a>

<br/><br/>

<img src="https://img.shields.io/badge/MERN-00C853?style=flat-square&logoColor=white"/>
<img src="https://img.shields.io/badge/Groq_LLaMA_3.3-FF6F00?style=flat-square&logo=meta&logoColor=white"/>
<img src="https://img.shields.io/badge/Web_Speech_API-4285F4?style=flat-square&logo=googlechrome&logoColor=white"/>
<img src="https://img.shields.io/github/last-commit/Kartiksahu03/paisa-expense-tracker?style=flat-square&color=14B8A6"/>

</div>

<br/>

> [!NOTE]
> The backend runs on Render's free tier and sleeps after inactivity — **first load may take ~30–50 seconds** to wake up. ☕

<!-- ══════════════════════ DIVIDER ══════════════════════ -->
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%"/>

## 🎯 What is Paisa?

**Paisa** lets you log expenses by *talking* — type or speak "spent 250 on lunch at dominos" and an LLM parses the amount, category, and direction automatically. Then it gives you saving advice grounded in **your actual spending**, not generic tips. All in ₹, on one clean dashboard.

<br/>

<!-- ══════════════════════ FEATURES ══════════════════════ -->
<div align="center">

## ✨ Features

</div>

<table>
<tr>
<td width="50%" valign="top">

### 🗣️ Natural-Language & Voice
- Type plain sentences → auto-parsed transactions
- 🎙️ Tap the mic and speak (Web Speech API)
- Hands-free logging

</td>
<td width="50%" valign="top">

### 🧠 Grounded AI Assistant
- Ask *"how can I save this month?"*
- Answers built on **your real data**
- Smart income-vs-expense detection (SIP = outflow)

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📊 Real-Time Analytics
- Income-vs-expense trends & category breakdowns
- Daily spending charts + savings gauges
- Powered by Recharts

</td>
<td width="50%" valign="top">

### 🎯 Budgets & Export
- Monthly caps with alerts at 50% / 80% / 100%
- 📁 CSV export of income or expense history
- 🔐 JWT auth + bcrypt-hashed passwords

</td>
</tr>
</table>

<!-- ══════════════════════ DIVIDER ══════════════════════ -->
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%"/>

<!-- ══════════════════════ TECH STACK ══════════════════════ -->
<div align="center">

## 🛠️ Tech Stack

<img src="https://skillicons.dev/icons?i=react,redux,tailwind,nodejs,express,mongodb,vite,vercel&theme=dark" />

<br/><br/>

| Layer | Technologies |
|:---:|:---|
| **Frontend** | React (Vite) · Redux Toolkit · Tailwind CSS · Framer Motion · Recharts · Web Speech API · Axios |
| **Backend** | Node.js · Express · MongoDB (Mongoose) · JWT · bcrypt |
| **AI** | Groq API (LLaMA 3.3) — structured JSON extraction & grounded chat |
| **Deploy** | Vercel · Render · MongoDB Atlas |

</div>

<!-- ══════════════════════ AI FLOW ══════════════════════ -->
## 🧠 How the AI Works

```mermaid
flowchart LR
    A[🗣️ 'spent 250 on lunch'] --> B[🎯 Groq LLM<br/>strict JSON schema]
    B --> C[✅ Validated in code<br/>type · amount · category]
    C --> D[(💾 MongoDB)]
    D --> E[📊 Financial snapshot<br/>totals · categories · budget]
    E --> F[💬 Grounded AI advice]
    style A fill:#00C853,color:#fff
    style B fill:#FF6F00,color:#fff
    style F fill:#6366F1,color:#fff
```

> Every AI feature is grounded in real data — transaction text hits a strict JSON schema with a fixed category allow-list and few-shot examples, validated before touching the DB. The assistant rebuilds a live financial snapshot on each question so it reasons over your actual numbers.

<!-- ══════════════════════ QUICKSTART ══════════════════════ -->
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%"/>

## 🚀 Quick Start

<details>
<summary><b>📦 Click to expand setup instructions</b></summary>

<br/>

**Prerequisites:** Node.js 18+ · [MongoDB Atlas](https://www.mongodb.com/atlas) · [Groq API key](https://console.groq.com/keys)

```bash
# 1. Clone
git clone https://github.com/Kartiksahu03/paisa-expense-tracker.git
cd paisa-expense-tracker

# 2. Backend
cd server
npm install
cp .env.example .env
npm run dev
```

`server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=any_long_random_string
JWT_EXPIRES_IN=7d
GROQ_API_KEY=your_groq_key
CLIENT_URL=http://localhost:5173
```

```bash
# 3. Frontend (new terminal)
cd client
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm run dev
```

Open `http://localhost:5173` and sign up. 🎉

</details>

<!-- ══════════════════════ ROADMAP ══════════════════════ -->
## 🗺️ Roadmap

- [ ] 📨 SMS / email auto-capture using the same LLM parser
- [ ] 🍪 httpOnly cookie auth with refresh-token rotation
- [ ] 🔔 Push notifications for budget thresholds
- [ ] 🧪 Automated test suite

<!-- ══════════════════════ FOOTER ══════════════════════ -->
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%"/>

<div align="center">

## 👤 Built by Kartik Sahu

Full-Stack Developer · MERN + AI Integration

<a href="https://kartik-s-portfolio-tau.vercel.app"><img src="https://img.shields.io/badge/Portfolio-6366F1?style=for-the-badge&logo=vercel&logoColor=white"/></a>
<a href="https://github.com/Kartiksahu03"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/></a>
<a href="https://linkedin.com/in/kartik-sahu03"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"/></a>
<a href="mailto:kartik.sahu3311@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white"/></a>

<br/><br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366F1,50:14B8A6,100:00C853&height=100&section=footer" width="100%"/>

</div>
