# Application Tracker

A lightweight job application tracker built with the Next.js App Router. The app stores every submission in Postgres via Prisma and gives you instant feedback with live counters, rich application cards, and celebratory confetti when a new entry lands.

## Features

- Capture company, role, status, compensation, useful links, and notes in a single form.
- Visual stats header summarises counts for Applied, Interviewing, Offered, and Rejected stages.
- Responsive grid of application cards with semantic icons and external links.
- Server actions powered by Prisma to persist data in PostgreSQL.
- Celebration fireworks when new applications are added successfully.

## Tech Stack

- Next.js 15 (App Router) and React 19
- TypeScript
- Prisma ORM with PostgreSQL
- Tailwind CSS + Lucide icons
- `react-canvas-confetti` for animations

## Getting Started

### Prerequisites

- Node.js 18.18+ and npm
- PostgreSQL database (local or hosted)

Create a `.env` file in the project root with the database URLs used by Prisma:

```
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
```

`POSTGRES_PRISMA_URL` should use a pooled connection string (required on Vercel), while `POSTGRES_URL_NON_POOLING` uses a direct connection for local scripts and Prisma Studio.

### Install dependencies

```bash
npm install
```

### Apply the database schema

With the environment variables in place, push the Prisma schema to your database:

```bash
npx prisma db push
```

If you are deploying to an environment with migrations enabled, replace the command above with `npx prisma migrate deploy`.

### Run the development server

```bash
npm run dev
```

Visit http://localhost:3000 to use the tracker. The page hot-reloads as you edit the source.

## Available Scripts

- `npm run dev` – Start the Next.js development server with Turbopack.
- `npm run build` – Create an optimized production build.
- `npm run start` – Serve the pre-built app.
- `npm run lint` – Run ESLint against the codebase.

## API Overview

The application uses a single App Router route at `app/api/applications/route.ts`.

- `GET /api/applications` returns the list of applications ordered by creation time.
- `POST /api/applications` accepts the form payload, validates the status against the allowed values, and persists the record.

Responses are serialised to a shared `ApplicationRecord` type so both client and server remain in sync.

## Project Structure

- `app/` – App Router entry point and UI composition.
- `app/api/applications/` – REST API handler for CRUD operations.
- `components/` – Reusable UI pieces (form, header counters, application cards).
- `lib/` – Prisma client helper for Node and edge runtimes.
- `prisma/` – Data model definition and migration entry point.
- `shared/` – Shared TypeScript types used by both client and server.

## Deployment

1. Ensure the production database URLs are configured as Vercel environment variables (`POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`).
2. Deploy the project (`vercel --prod` or through the dashboard).
3. Run `npx prisma migrate deploy` as a Vercel post-deploy step (or manually) so the schema is in sync.

Once deployed, the tracker uses the Node.js runtime (`runtime = "nodejs"`) to stay compatible with Prisma's Data Proxy and connection pooling.
