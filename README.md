# FAWZ — فوز

**Prize Draw Loyalty Platform · Frontend**

FAWZ is a transaction-driven prize draw engagement platform built on top of the SuperQi digital wallet in Iraq. Every qualifying SuperQi spending transaction generates cryptographic entry numbers (Fawz Numbers) for the consumer and the merchant, entered into weekly and monthly prize draws broadcast live on Al Rabiaa TV. Cash prizes are credited directly to winners' SuperQi wallets within 60 seconds of draw completion.

> ⚠️ This repository contains the **web frontend only**, running on **mock data**. It is not connected to a live backend.

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool & dev server
- **Zustand** — state management
- **React Query (TanStack)** — server state & caching
- **React Hook Form** + **Zod** — form handling & validation
- **i18n** — Arabic (RTL) + English support
- **Vitest** — unit & integration testing
- **ESLint** + **Prettier** — linting & formatting

---

## Getting Started

### Prerequisites

- Node.js `>=18`
- npm `>=9`

### Install & Run

```bash
# Clone the repo
git clone https://github.com/batoulf-dev/FAWZ-web.git
cd FAWZ-web

# Install dependencies
npm install

# Start dev server
npm run dev
```

App runs at `http://localhost:5173`

### Other Commands

```bash
npm run build       # Production build
npm run preview     # Preview production build locally
npm run lint        # Run ESLint
npm run test        # Run tests
npm run typecheck   # TypeScript check (no emit)
```

---

## Project Structure

```
src/
├── app/              # App root, providers
├── config/           # Query client, env config
├── core/             # Theme, API client, storage, i18n, utils, types
├── features/         # Feature modules (auth, draws, challenges, referrals, etc.)
├── shared/           # Reusable components, hooks, layouts
├── stores/           # Global Zustand stores
└── routes/           # App routing
```

---

## Features (MVP)

| Module | Description |
|---|---|
| Entry Generation | Fawz Number generation per qualifying transaction |
| Draw Management | Weekly & monthly draw scheduling, live digit broadcast |
| Challenge System | Onboarding, Weekly Spark streak, monthly rotating challenges |
| Referral System | Golden Ticket referral links with fraud validation |
| Merchant Dashboard | Merchant eligibility tracking and shared entry view |
| Prize & Payout | Wallet credit execution, jackpot rollover, prize history |
| Fraud & Compliance | Rules-based fraud flagging and review queue |
| Admin Operations | Draw controls, winner export, audit log, system config |
| Notifications | Push notification preferences and in-app notification center |
| User Account | Fawz profile, home screen, winner social share |

---

## Status

Currently in active development. UI is implemented with mock data. Backend integration is pending.
