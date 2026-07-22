# Soil Health Monitoring System

A machine-learning web app that predicts soil health from pH, nitrogen,
phosphorus, potassium, and organic matter, and returns a confidence score,
risk level, per-parameter analysis, fertilizer recommendations, and
suitable crops.

**V1 architecture: fully stateless.** No login, no database, no external AI
API. One request in, one complete answer out. Authentication and prediction
history are planned for V2 (see [Roadmap](#roadmap)).

See [RELEASE_NOTES.md](./RELEASE_NOTES.md) for what's in this release, the
full tech stack, and what a production audit found/fixed before packaging.

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

## Project structure

```
soil-health-monitoring/
├── frontend/          Next.js 15 app (see frontend/README.md)
├── backend/           FastAPI service (see backend/README.md)
└── .github/workflows/ CI: lint, type-check, build (frontend) + train, smoke-test (backend)
```

## Run it locally

**1. Backend first:**
```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python model/train.py
uvicorn main:app --reload --port 8000
```

**2. Frontend, in a second terminal:**
```bash
cd frontend
npm install
cp .env.example .env.local     # defaults already point at localhost:8000
npm run dev
```

Open http://localhost:3000/predict and run a prediction.

---

## Deploying to production

Deploy the backend first — the frontend needs its URL.

### Backend → Render

1. Push this repository to GitHub.
2. In the [Render dashboard](https://dashboard.render.com), click
   **New → Blueprint**, and point it at your repo. Render will detect
   `backend/render.yaml` automatically and configure the service.
   - If you'd rather set it up manually instead of via Blueprint: **New →
     Web Service**, root directory `backend`, build command
     `pip install -r requirements.txt && python model/train.py`, start
     command `uvicorn main:app --host 0.0.0.0 --port $PORT`.
3. Leave `FRONTEND_URL` unset for now — you'll come back and set it once
   the frontend has a URL (step 4 below).
4. Deploy. Render will give you a URL like
   `https://soil-health-monitoring-api.onrender.com`. Copy it — the
   frontend needs it next.
5. Confirm it's live: `curl https://your-app.onrender.com/health` should
   return `{"status":"ok","modelLoaded":true}`.

**Note on the free tier:** Render's free web services spin down after 15
minutes of inactivity. The first request after idle takes 30-50 seconds to
wake up — this is expected, not a bug. The frontend's API client is already
configured with a 60-second timeout and a friendly "waking up" message to
handle this gracefully.

### Frontend → Vercel

1. In the [Vercel dashboard](https://vercel.com/new), import the same
   GitHub repo.
2. Set the **root directory** to `frontend` (important — Vercel needs to
   know the Next.js app isn't at the repo root).
3. Vercel auto-detects Next.js from `frontend/vercel.json` and
   `package.json`; no build command changes needed.
4. Add environment variables (Project Settings → Environment Variables):
   ```
   NEXT_PUBLIC_API_URL=https://soil-health-monitoring-api.onrender.com
   NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
   ```
   (You'll know your exact Vercel URL after the first deploy — update
   `NEXT_PUBLIC_SITE_URL` and redeploy once you have it, or set your final
   custom domain here if you have one.)
5. Deploy.

### Close the loop: update CORS

Go back to Render, open your backend service's environment variables, and
set:
```
FRONTEND_URL=https://your-project.vercel.app
```
Redeploy the backend. This locks CORS down to your actual frontend origin
instead of the permissive `*` default.

### Verify end-to-end

Visit your Vercel URL, go to `/predict`, fill in the form, submit. If the
backend was idle, expect a 30-50 second wait on the first request (see the
Render note above) — after that it should respond in well under a second.

---

## CI

`.github/workflows/ci.yml` runs on every push/PR to `main`:
- **frontend job**: `npm ci`, lint, `tsc --noEmit`, `next build`
- **backend job**: install deps, run `model/train.py`, smoke-test that the
  FastAPI app imports cleanly

Neither job requires secrets — the frontend build uses placeholder URLs
since production env vars live in Vercel/Render, not GitHub.

## Troubleshooting

**"Couldn't reach the prediction service" on the deployed site**
Almost always one of: `NEXT_PUBLIC_API_URL` isn't set (or is wrong) in
Vercel's project settings, or the Render service is asleep and taking its
usual 30-50s to wake — wait a moment and retry before assuming it's broken.

**CORS error in the browser console**
`FRONTEND_URL` on Render doesn't match your actual Vercel URL exactly
(including `https://`, no trailing slash). Update it and redeploy the
backend.

**Render build fails on `python model/train.py`**
Check the build logs for a scikit-learn/pandas version mismatch — the
pinned versions in `backend/requirements.txt` are known to work together;
if you've changed them, re-test `python model/train.py` locally first.

**Vercel build fails**
Almost always a missing environment variable — `next build` needs
`NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SITE_URL` to be set even if they
point at placeholders during the build step; see Vercel's Project Settings
→ Environment Variables.

**Frontend shows fallback system fonts instead of Fraunces/Inter**
`next/font/google` fetches fonts from Google's CDN at build time; this
fails only in network-restricted environments (e.g. this project was
verified in a sandboxed CI environment with no route to
`fonts.googleapis.com` — that is not a code issue, and will resolve
normally on Vercel or any machine with standard internet access).

## Using a real dataset

The model currently trains on synthetic data generated from the ideal
parameter ranges in `backend/config.py`, because no labeled real-world soil
dataset was available at build time. Swapping one in later requires no code
changes — see `backend/README.md` → "Retraining the model" for the exact
CSV format `train.py` expects.

## Roadmap

**V2** (not in this version):
- Authentication (Clerk, Google login)
- Persistent prediction history (Supabase/Postgres)
- User dashboard (totals, healthy/unhealthy ratio over time, recent predictions)
- AI-generated recommendations (Gemini) layered on top of the existing
  rule-based engine, which would remain as the fallback
