# Beestar — Telegram Tap-to-Earn Mini App

A [Telegram Mini App](https://core.telegram.org/bots/webapps) built with **Next.js 14** (App Router). Players tap to earn points, upgrade boosters, buy cards/skins, complete tasks, refer friends, and connect a TON wallet — a "tap-to-earn" (Notcoin/Hamster-Kombat style) game that runs inside Telegram.

> The app is designed to run **inside the Telegram client**, where it receives the user's identity and launch parameters. It also runs in a normal browser for local development (Telegram-only features degrade gracefully).

---

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Next.js 14 (App Router, Server Actions, Route Handlers) |
| Language | TypeScript, React 18 |
| Database | MongoDB via **Prisma** |
| Cache | **Redis** (ioredis) — best-effort, app falls back to the DB on failure |
| State | Zustand (client stores) + TanStack Query (server data) |
| Telegram | `@telegram-apps/sdk`, `@twa-dev/sdk`, `telegram-web-app.js` |
| Wallet | TON Connect (`@tonconnect/ui-react`) |
| Styling | Tailwind CSS, Radix UI, Framer Motion, `vaul` drawers |
| Media | Cloudinary (`next-cloudinary`) |
| Analytics/Ads | PostHog, Adexium / RichAds |

---

## Prerequisites

- **Node.js 24.x** (Vercel requires 24.x; earlier versions are deprecated)
- A **MongoDB** database (e.g. MongoDB Atlas) — Prisma uses a replica-set connection string
- A **Redis** instance (optional for local dev — the app runs without it, just without caching)
- A **Telegram bot** with a configured Mini App (for the full in-Telegram experience)

---

## Environment variables

Create a `.env` file in the project root:

```dotenv
# Database (MongoDB, required)
DATABASE_URL="mongodb+srv://<user>:<pass>@<cluster>/<db>"

# Redis (optional — caching is skipped gracefully if unreachable)
REDIS_URL="redis://default:<pass>@<host>:<port>"

# Telegram bot (server-side)
TELEGRAM_BOT_TOKEN="123456:ABC..."      # used by task-join verification
TELEGRAM_BOT_API_KEY="123456:ABC..."    # used by message/broadcast actions

# Cloudinary (task image uploads)
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# PostHog analytics (client)
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"

# Local points storage key (client)
NEXT_PUBLIC_TAPPED_POINTS_KEYWORD="points"
```

> ⚠️ **Never commit real credentials.** Make sure `.env` is git-ignored and rotate anything that has been committed.

---

## Getting started

```bash
# 1. Install dependencies (also runs `prisma generate` via postinstall)
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build (`next build`) — runs type-checking + lint |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `postinstall` | `prisma generate` (runs automatically after install) |

### Prisma

The schema lives in `prisma/schema.prisma` (MongoDB). After changing it:

```bash
npx prisma generate     # regenerate the client
npx prisma db push      # sync the schema to MongoDB
```

Key models: `User`, `Card` / `UserCard`, `Skins` / `UserSkin`, `Tasks` / `TasksCompletion`, `YouTube` / `YouTubeCompletion`, `Bonuster`, `DailyBoosters`, `Leagues`, `Achievement*`, plus Auth.js models (`Account`, `Session`, …).

---

## Running inside Telegram

A plain browser loads the UI, but anything that needs Telegram's injected context (user identity, back button, TON wallet, ads) only works inside the Telegram client. To test the real flow:

1. Expose your local server with a tunnel:
   ```bash
   npx ngrok http 3000
   ```
2. In [@BotFather](https://t.me/BotFather), set your bot's Mini App URL to the tunnel URL.
3. Open the Mini App from your bot in Telegram.

The user id and launch params are read from the Telegram launch data; in a browser you can simulate them with query params, e.g. `http://localhost:3000/?id=12345&userName=Arun`.

---

## Architecture notes

- **`AuthProvider`** (`src/providers/AuthProvider.tsx`) resolves the Telegram user id from multiple sources — the URL `?id=`, `@telegram-apps/sdk` launch params, and `window.Telegram.WebApp.initDataUnsafe` — with a short retry, then authenticates or creates the account. The resolved id is written to the URL so the rest of the app can read it.
- **`src/lib/telegramUser.ts`** centralises that resolution (`resolveTelegramUser`, `getCurrentUserId`) so every component derives the id the same way.
- **`LoadingScreenProvider`** shows a splash until the user config is loaded, then renders the app.
- **`src/lib/redis.ts`** wraps ioredis so Redis is strictly a cache: on connection failure, commands no-op and callers fall back to MongoDB (no hangs, no error spam).
- **Server logic** lives in `src/actions/*` (Server Actions) and `src/app/api/*` (Route Handlers).
- **Client state** is split across Zustand stores in `src/store/*` (points, boosters, user, tasks, …).

---

## Project structure

```
src/
├── app/            # App Router pages + /api route handlers
├── actions/        # Server Actions (auth, points, tasks, skins, user, …)
├── components/     # UI (HeroSection, navigation, tasks, market, …)
├── providers/      # Auth, LoadingScreen, TonConnect, ReactQuery, PostHog
├── hooks/          # Data hooks, mutations, points config
├── store/          # Zustand stores
├── lib/            # prisma, redis, telegramUser, utils
└── services/       # axios helpers
prisma/schema.prisma
```

---

## Deployment (Vercel)

1. Import the repo into Vercel.
2. Set **Node.js Version → 24.x** in Project Settings → Build & Deployment.
3. Add all environment variables from the section above.
4. Push to `main` — Vercel builds with `npm run build` and deploys.

The build runs `prisma generate` (via `postinstall`) and full type-checking, so a type error will fail the build.

---

## Troubleshooting

- **"Unable to retrieve launch parameters … opened your app outside Telegram"** — a Telegram SDK call ran outside Telegram. These are guarded, but if you add a new one, wrap it in `try/catch` or gate it on `resolveTelegramUser()`.
- **Stuck on the loading screen** — the splash is dismissed once the user config loads. Check the browser/eruda console for the auth and config logs.
- **Redis `ECONNRESET` / max retries** — your `REDIS_URL` is unreachable. The app still works (cache disabled); point it at a live instance to restore caching.
- **Build fails with `Module not found`** — a new file wasn't committed. Ensure `git status` is clean before pushing.
