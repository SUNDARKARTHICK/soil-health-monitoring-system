# Soil Health Monitoring — Backend

FastAPI service that loads a trained Decision Tree model and serves
predictions, confidence scores, parameter analysis, feature importance, and
rule-based fertilizer/crop recommendations. Fully stateless — no database,
no auth, no external API calls. Every request is self-contained.

## 1. Local setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python model/train.py         # generates model/soil_health_model.pkl
```

## 2. Run

```bash
uvicorn main:app --reload --port 8000
```

Visit http://127.0.0.1:8000/docs for interactive API docs (Swagger UI, built
in to FastAPI, no extra setup).

## 3. Endpoints

**GET /health**
```json
{ "status": "ok", "modelLoaded": true }
```

**POST /predict**
```json
{
  "pH": 6.8,
  "nitrogen": 110,
  "phosphorus": 45,
  "potassium": 100,
  "organicMatter": 3.5
}
```
Returns soil health, confidence, risk level, explanation, per-parameter
analysis, recommendations, and feature importance. See `schemas.py` for the
full response shape.

## 4. Retraining the model

The model is trained on a synthetic dataset generated from the ideal ranges
in `config.py` (not the original project's 8-row dataset, which was too
small to generalize or produce meaningful feature importance). This is a
placeholder until a real labeled dataset is available.

**To swap in a real dataset:** drop a CSV at `model/real_soil_data.csv` with
these columns (case-sensitive):

```
pH, nitrogen, phosphorus, potassium, organic_matter, SoilHealth
```

where `SoilHealth` is the string `"Healthy"` or `"Unhealthy"`. `train.py`
detects this file automatically and trains on it instead of synthetic data —
no other code changes needed. A reasonable place to source one: Kaggle has
several public soil-fertility / crop-recommendation datasets with pH, N, P, K
readings; you'll likely need to derive a binary `SoilHealth` label from
whatever target column they provide (e.g. threshold a fertility index, or
re-map an existing multi-class label into Healthy/Unhealthy).

Either way, regenerate the model with:

```bash
python model/train.py
```

This prints accuracy, a classification report, and feature importances so
you can sanity-check the result before deploying — and if you change
`IDEAL_RANGES` in `config.py`, run this again since the ideal ranges are also
what the synthetic data generator uses to produce labels.

## 5. Deploying to Render

1. Push this `backend/` folder to a GitHub repo (or a subfolder of your monorepo)
2. In Render, **New → Blueprint**, point it at the repo — `render.yaml` in
   this folder configures the service automatically
3. Set the `FRONTEND_URL` environment variable in the Render dashboard to
   your deployed Vercel URL, e.g. `https://your-app.vercel.app`
   (without this, CORS defaults to `*`, which works but is looser than
   needed once you have a real frontend domain)
4. Render's free tier spins down after inactivity — the first request after
   idle will take ~30-50 seconds to wake up. This is expected on the free
   tier and not a bug.

## 6. Architecture notes

- `config.py` is the single source of truth for ideal parameter ranges and
  feature order — both `model/train.py` and `services/analysis.py` import
  from it, so training labels and inference-time explanations can't drift
  apart.
- `services/analysis.py` computes risk level primarily from how many
  parameters are out of range, not from the model's raw confidence score —
  this keeps "risk level" meaningful even when the classifier is very
  confident about a borderline sample. It's then reconciled against the
  model's own Healthy/Unhealthy prediction so the two can never contradict
  each other (e.g. an "Unhealthy" prediction paired with an "Excellent" risk
  level, which could otherwise happen right at the exact edges of the ideal
  ranges where the learned tree boundaries and configured ranges don't
  perfectly line up — caught during a production audit and fixed by
  clamping risk level to at least "Moderate" whenever the model says
  Unhealthy).
- `services/recommendations.py` is fully rule-based for V1: deterministic,
  free, and has no external dependency to fail. An AI-generated variant
  (Gemini) is deferred to V2 alongside auth and a database.
