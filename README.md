<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-5.19-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Claude_AI-Anthropic-F5A623?style=for-the-badge&logo=anthropic" alt="Claude AI" />
</p>

# 🛡️ RevenueShield

### AI-Powered Payment Failure Intelligence & Revenue Recovery Platform

> **RevenueShield** is a full-stack SaaS dashboard that uses **artificial intelligence** to detect, analyze, and recover failed payment transactions in real-time. It transforms revenue leakage into actionable recovery strategies — helping merchants recover up to **₹2.4M+ in lost revenue**.

---

## ✨ Key Features

### 🧠 AI-Powered Intelligence
- **AI Copilot** — Conversational AI assistant powered by Claude (Anthropic) that provides real-time revenue insights, answers merchant queries with live database context, and renders Markdown-formatted analysis with tables, charts, and actionable recommendations
- **Smart Recovery Engine** — AI-driven recommendations (Retry, Switch Method, Send Link, Escalate) with confidence scoring for every failed transaction
- **Anomaly Detection** — Automated identification of unusual failure patterns across payment methods and banks

### 📊 Executive Dashboard
- **Revenue Overview** — Real-time KPIs: Total Revenue at Risk, Recoverable Revenue, AI Success Rate, Active Recovery Campaigns
- **Interactive Charts** — Recharts-powered visualizations with custom glassmorphic tooltips (Revenue Trend, Payment Methods, Failure Categories, Recovery Funnel)
- **Dark/Light Mode** — Premium theme system with Executive Gold & Obsidian design language

### 💳 Transaction Intelligence
- **Transaction Explorer** — Filterable, searchable transaction table with status badges, recovery probability indicators, and one-click recovery actions
- **Payment Recovery Center** — Dedicated recovery pipeline with AI-recommended actions and real-time success tracking
- **Revenue Intelligence** — Deep analytics on failure patterns by bank, payment method, and customer tier

### 🔬 Advanced Tools
- **Payment Simulator** — Test recovery strategies with configurable parameters (amount, method, bank, failure reason) before deploying to production
- **Analytics Dashboard** — Comprehensive charts: Revenue Trend, Method Distribution, Category Breakdown, Daily Patterns
- **Audit Log** — Complete compliance trail of all AI decisions, merchant approvals, and recovery outcomes
- **Alerts & Notifications** — Real-time anomaly alerts with read/unread management

### 🏢 Multi-Tenant Architecture
- **Organization Switching** — Seamless context switching between merchant organizations
- **Role-Based Access** — Admin, Analyst, and Viewer roles with scoped permissions
- **Demo Sandbox Mode** — Pre-seeded data sandbox for safe exploration

### 🎨 Premium Design
- **Executive Gold & Obsidian** theme with gradient accents and ambient glows
- **Framer Motion** animations with spring physics and layout transitions
- **Fully Responsive** — Desktop, tablet, and mobile optimized layouts
- **Glassmorphism** — Frosted glass effects on cards, tooltips, and overlays

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.3 |
| **Styling** | Tailwind CSS 3.4 + Custom Design System |
| **UI Components** | Custom-built (no component library dependency) |
| **Animations** | Framer Motion 11 |
| **Charts** | Recharts 2.12 |
| **Database** | SQLite via Prisma ORM 5.19 |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs |
| **AI Engine** | Anthropic Claude API |
| **Theme** | next-themes (Dark/Light) |
| **Icons** | Lucide React |

---

## 📂 Project Structure

```
RevenueShield/
├── prisma/
│   ├── schema.prisma          # Database schema (6 models)
│   ├── seed.ts                # Demo data seeder
│   └── dev.db                 # SQLite database (auto-generated)
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/         # Login page (Executive Gold theme)
│   │   │   └── signup/        # Signup page (Executive Gold theme)
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx       # Overview dashboard with KPIs & charts
│   │   │   ├── analytics/     # Analytics deep-dive
│   │   │   ├── alerts/        # Notification center
│   │   │   ├── audit-log/     # Compliance audit trail
│   │   │   ├── copilot/       # AI Copilot chat interface
│   │   │   ├── payment-recovery/  # Recovery pipeline
│   │   │   ├── revenue-intelligence/  # Revenue analytics
│   │   │   ├── settings/      # App settings & preferences
│   │   │   ├── simulator/     # Payment failure simulator
│   │   │   └── transactions/  # Transaction explorer
│   │   ├── api/
│   │   │   ├── auth/          # Login, Signup, Logout, Session
│   │   │   ├── alerts/        # Notifications CRUD
│   │   │   ├── analytics/     # Analytics data endpoints
│   │   │   ├── audit-log/     # Audit log queries
│   │   │   ├── copilot/       # AI Copilot backend (Claude API)
│   │   │   ├── dashboard/     # Dashboard stats aggregation
│   │   │   ├── organizations/ # Org management & demo reset
│   │   │   ├── revenue-intelligence/  # Revenue data
│   │   │   ├── simulator/     # Simulation engine
│   │   │   └── transactions/  # Transaction CRUD & actions
│   │   ├── landing/           # Public marketing landing page
│   │   ├── globals.css        # Global styles & design tokens
│   │   └── layout.tsx         # Root layout with providers
│   ├── components/
│   │   ├── common/            # Shared components (Logo, etc.)
│   │   ├── layout/            # AppHeader, AppSidebar
│   │   ├── providers/         # Auth, Theme, Dropdown providers
│   │   └── ui/                # Reusable UI primitives
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utilities (Prisma client, auth helpers)
├── public/                    # Static assets
├── .env.example               # Environment variable template
├── package.json               # Dependencies & scripts
├── tailwind.config.js         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **Anthropic API Key** (optional — for AI Copilot features)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/RevenueShield.git
cd RevenueShield

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your Anthropic API key (optional)

# 4. Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# 5. Seed the database with demo data
npm run seed

# 6. Start the development server
npm run dev
```

The app will be running at **http://localhost:3000**

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@revenueshield.com` | `admin123` |

---

## 📊 Database Schema

RevenueShield uses **6 core models** to power its intelligence engine:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Organization   │────▶│      User       │     │   Transaction   │
│                 │     │                 │     │                 │
│ • name          │     │ • name          │     │ • amount        │
│ • sandboxMode   │     │ • email         │     │ • paymentMethod │
│                 │────▶│ • role          │     │ • failureReason │
│                 │     └─────────────────┘     │ • status        │
│                 │────▶│ • recoveryProb  │     │ • aiAction      │
│                 │     └─────────────────────▶ └────────┬────────┘
│                 │                                      │
│                 │────▶ AuditLogEntry ◀─────────────────┘
│                 │────▶ Anomaly                         │
│                 │────▶ Notification      RecoveryAction ◀┘
└─────────────────┘
```

| Model | Purpose |
|-------|---------|
| **Organization** | Multi-tenant merchant accounts |
| **User** | Authentication & role management |
| **Transaction** | Failed payment records with AI analysis |
| **RecoveryAction** | AI-recommended recovery steps |
| **AuditLogEntry** | Compliance & decision audit trail |
| **Anomaly** | Detected failure pattern anomalies |
| **Notification** | Real-time alerts & system messages |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Authenticate user & return JWT |
| `POST` | `/api/auth/signup` | Register new user & organization |
| `POST` | `/api/auth/logout` | Clear session |
| `GET` | `/api/auth/me` | Get current user session |
| `GET` | `/api/dashboard/stats` | Dashboard KPIs & chart data |
| `GET` | `/api/transactions` | List transactions (filterable) |
| `POST` | `/api/transactions/:id/action` | Execute recovery action |
| `GET` | `/api/analytics` | Analytics aggregations |
| `GET` | `/api/revenue-intelligence` | Revenue breakdown data |
| `POST` | `/api/copilot` | AI Copilot conversation |
| `POST` | `/api/simulator` | Run payment simulation |
| `GET` | `/api/audit-log` | Audit trail entries |
| `GET/POST` | `/api/alerts` | Notifications CRUD |
| `GET` | `/api/organizations` | List user organizations |
| `POST` | `/api/organizations/reset-demo` | Reset demo sandbox data |

---

## 🎨 Design System

RevenueShield uses a custom **Executive Gold & Obsidian** design system:

| Token | Value | Usage |
|-------|-------|-------|
| **Gold Primary** | `#E8B563` | Accents, active states, CTAs |
| **Gold Secondary** | `#D4A574` | Gradients, hover states |
| **Obsidian** | `#0A0A0A` | Dark backgrounds |
| **Surface** | `#0E0E0E` / `#111111` | Cards, panels |
| **Text Primary** | `#F5F0E8` | Main text (dark mode) |
| **Text Muted** | `#8A8A8A` | Secondary text |
| **Emerald** | `#10B981` | Success states |
| **Rose** | `#F43F5E` | Error / danger states |

---

## 🧪 Available Scripts

```bash
npm run dev            # Start development server
npm run build          # Production build
npm run start          # Start production server
npm run lint           # Run ESLint
npm run seed           # Seed database with demo data
npm run prisma:generate  # Generate Prisma client
npm run prisma:push    # Push schema to database
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Rajeev Singh**

---

<p align="center">
  <strong>Built with ❤️ using Next.js, Prisma, and Claude AI</strong>
</p>
