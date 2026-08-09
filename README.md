# Content Rewards

Saudi-first creator performance marketing platform.

## Prerequisites

- Node.js 20+
- Docker Desktop (for local Postgres)
- npm

## Setup (from a fresh clone)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Open .env.local and set NEXTAUTH_SECRET:
#   openssl rand -base64 32

# 3. Start Postgres
docker compose up -d

# 4. Run migrations
npx prisma migrate dev

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui v4 |
| Database | PostgreSQL 17 (Docker) |
| ORM | Prisma 7 + `@prisma/adapter-pg` |
| Auth | Auth.js v5 (Credentials / JWT) |
| i18n | next-intl (English + Arabic / RTL) |
| Validation | Zod |

## Database

Port: **5433** (to avoid conflict with other local Postgres instances)

```bash
docker compose up -d          # start
npx prisma migrate dev        # apply migrations
npx prisma studio             # browse data
```

## Locales

Language is stored in the `locale` cookie. Arabic activates RTL automatically via `dir="rtl"` on `<html>`. Toggle via `POST /api/locale` with `{ locale: "ar" | "en" }`.

## Architecture

```
src/
  app/              # Next.js App Router pages + API routes
    api/auth/       # Auth.js handler + register endpoint
    api/locale/     # Locale cookie switcher
    dashboard/      # Role-aware post-login home
    login/
    register/
  components/
    dashboard/      # CreatorHome, BrandHome, AgencyHome, AdminHome
    ui/             # shadcn/ui primitives
  generated/
    prisma/         # Auto-generated Prisma client (do not edit)
  i18n/             # next-intl config
  lib/
    auth.ts         # Auth.js config
    prisma.ts       # Prisma singleton
  middleware.ts     # Route protection
  types/            # next-auth type extensions

messages/           # en.json + ar.json
prisma/
  schema.prisma     # DB schema (6 domain tables + Auth.js tables)
  migrations/       # SQL migration history
```
