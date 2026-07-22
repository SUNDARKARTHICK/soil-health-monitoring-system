# Release Notes — Soil Health Monitoring System v1.0.0

## Overview

A machine-learning web application that predicts soil health from five
parameters (pH, nitrogen, phosphorus, potassium, organic matter), returning
a confidence-scored prediction, risk level, per-parameter analysis, and
fertilizer/crop recommendations. This is a stateless MVP: no accounts, no
database, no external AI dependency — a single request produces a complete
answer.

## Features

- **Prediction workflow**: soil parameter input → Decision Tree prediction
  → confidence score → risk level → per-parameter Green/Yellow/Red analysis
  → natural + chemical fertilizer recommendations → suitable crop
  suggestions → expected yield improvement estimate
- **Explainability**: a feature-importance chart shows which of the five
  parameters most influenced each individual prediction, and a plain-language
  explanation accompanies every result
- **Visualizations**: a parameter-balance radar chart and a feature-importance
  bar chart, both built with Recharts and responsive to viewport size
- **Reports**: one-click PDF report generation (jsPDF) and CSV export,
  entirely client-side — no server round-trip
- **Resilience**: loading skeletons, empty states, and error states on every
  data-bearing view; a 60-second request timeout with a progressive
  "waking up" hint (Render's free tier can take 30-50s to respond after
  being idle); readable validation error messages surfaced from the
  backend's Pydantic errors
- **Responsive, accessible UI**: mobile/tablet/desktop layouts, keyboard
  focus states throughout, a soil-horizon-inspired design system with
  WCAG AA-verified text contrast

## Tech stack

**Frontend**
- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS, Framer Motion, Lucide icons
- Recharts (charts), jsPDF + jspdf-autotable (PDF reports)
- React Hook Form + Zod (form validation)
- TanStack Query (API state management)
- Sonner (toast notifications)

**Backend**
- FastAPI, Pydantic
- scikit-learn (Decision Tree Classifier), pandas, joblib
- No database, no auth, no external API calls — fully self-contained

## Architecture

Stateless request/response between a Next.js frontend and a FastAPI backend:

```
┌─────────────────────┐         ┌──────────────────────┐
│   Next.js Frontend   │  HTTPS  │   FastAPI Backend     │
│   (Vercel)           │ ──────► │   (Render)             │
│                      │  JSON   │                        │
│  - Landing page      │ ◄────── │  - /predict            │
│  - Prediction UI     │         │  - /health              │
│  - PDF/CSV export    │         │  - Decision Tree model  │
└──────────────────────┘         └──────────────────────┘
```

- `backend/config.py` is the single source of truth for ideal parameter
  ranges, shared by both model training and inference-time explanations
- The model trains on a synthetic, class-balanced dataset generated from
  those ideal ranges (see "Known limitations" below), with the training
  pipeline built to swap in a real labeled dataset with zero code changes
- Risk level is computed from how many parameters are out of range, then
  reconciled against the model's own Healthy/Unhealthy prediction so the
  two can never show a contradictory combination to the user
- All chart components are code-split via `next/dynamic` so Recharts
  doesn't inflate the initial page bundle

## Deployment

- **Frontend** → Vercel (root directory `frontend/`, auto-detected Next.js
  build)
- **Backend** → Render (Blueprint deploy via `backend/render.yaml`, retrains
  the model at build time for reproducibility)
- Full step-by-step instructions, environment variable wiring, and
  troubleshooting: see the root `README.md`

## Production audit summary

Before this release was packaged, a full production-readiness pass was
run against the codebase. Real issues found and fixed:

- **Form validation gap**: `z.coerce.number()` silently turned an emptied
  input field into `0` instead of showing a "required" error (`Number("")
  === 0` in JavaScript). Rewritten with `z.preprocess` so empty fields
  correctly fail validation.
- **Contradictory result state**: an input with every parameter sitting
  exactly at the edge of its ideal range could be classified "Unhealthy"
  by the model while independently scoring "Excellent" on risk level — a
  confusing combination. Risk level is now reconciled against the model's
  own prediction so this can't happen.
- **Accessibility — heading hierarchy**: the `/predict` page skipped
  directly from `<h1>` to `<h3>` with no `<h2>`; fixed with a
  visually-hidden heading.
- **Accessibility — contrast**: WCAG contrast ratios were computed (not
  eyeballed) for every color pair in the design system. The risk-level
  badge failed AA for two of its three states (2.82:1 and 3.00:1 against
  the required 4.5:1) — a real, user-facing element showing "Excellent" and
  "Moderate" results. Fixed by switching to dark text on those two
  backgrounds (now 5.71:1 and 5.36:1). Two decorative landing-page text
  instances were fixed the same way.
- **Verified working**: every page and nav link, responsive grid behavior,
  all loading/empty/error states, the 60s timeout and cold-start hint, real
  PDF generation (confirmed valid `%PDF-1.3` output), chart rendering with
  guarded data, zero console errors, zero unused files/dependencies, and a
  full backend integration test (health check, healthy/unhealthy/borderline
  predictions, and three validation-error cases).

**Not verified in this pass** (requires a real browser, not available in
the build environment): actual Lighthouse scores, and manual screen-reader
walkthrough. The static-analysis equivalents (contrast ratios, heading
structure, aria-labels, focus states, bundle sizes) were verified instead;
running Lighthouse against the live Vercel URL after deployment is the
recommended final check.

## Known limitations (by design, for v1)

- **Synthetic training data**: no real labeled soil dataset was available,
  so the model trains on data generated from configured ideal ranges. The
  training pipeline (`backend/model/train.py`) auto-detects and prefers a
  real dataset if one is dropped in at `model/real_soil_data.csv` — see
  `backend/README.md`.
- **No persistence**: predictions aren't saved anywhere; refreshing the
  page loses the result. This is intentional for v1's stateless scope.
- **No authentication**: the app is fully public with no accounts.

## Future improvements (v2)

- Authentication (Clerk, Google login)
- Persistent prediction history (Supabase/Postgres)
- User dashboard: total predictions, healthy/unhealthy ratio over time,
  recent predictions list
- AI-generated recommendations (Gemini) layered on top of the existing
  rule-based engine, which would remain as an automatic fallback
- Real soil dataset integration once one is sourced
- Automated end-to-end testing (Playwright) and real Lighthouse CI checks
  against a deployed preview URL
