# Soil Health Monitoring — Frontend

Next.js 15 (App Router) + React 19 + TypeScript. A stateless client for the
FastAPI backend — no auth, no database, no server-side persistence. Every
prediction is a single request/response round trip.

## 1. Install

```bash
cd frontend
npm install
cp .env.example .env.local
```

## 2. Configure

Edit `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000   # or your deployed Render URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or your deployed Vercel URL
```

## 3. Run

Make sure the backend is running first (see `../backend/README.md`), then:

```bash
npm run dev
```

Open http://localhost:3000.

## 4. What's here

| Page | What it does |
|---|---|
| `/` | Landing page |
| `/predict` | The whole product: input form → prediction → charts → recommendations → PDF/CSV export |
| `/about` | Project background |

There is intentionally no login, no history, and no dashboard in this
version — see the root README for what's planned for V2.

## 5. Architecture

- `lib/api-client.ts` — the only place that talks to the backend. Has a
  60s timeout to tolerate Render's free-tier cold starts, and surfaces
  FastAPI/Pydantic validation errors as readable messages.
- `hooks/use-prediction.ts` — wraps the API call in a TanStack Query
  mutation (loading/error/success states, toast notifications on
  success/failure).
- `components/prediction/` — input form (React Hook Form + Zod), result
  card, radar chart, feature-importance chart, recommendation panel.
- `lib/pdf-report.ts` / `lib/csv-export.ts` — client-side report generation,
  no server round-trip needed.
- Chart components are dynamically imported (`next/dynamic`, `ssr: false`)
  so Recharts doesn't bloat the initial page load.

## 6. Build

```bash
npm run build
```
