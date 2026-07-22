import os
from datetime import datetime, timezone
from pathlib import Path

import joblib
import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from config import FEATURE_ORDER
from schemas import HealthCheckResponse, PredictionResponse, SoilInputRequest
from services.analysis import build_explanation, build_parameter_analysis, compute_risk_level
from services.recommendations import get_recommendations

load_dotenv()

MODEL_PATH = Path(__file__).resolve().parent / "model" / "soil_health_model.pkl"

app = FastAPI(
    title="Soil Health Monitoring API",
    description="Predicts soil health from pH, N, P, K, and organic matter, with fertilizer and crop recommendations.",
    version="1.0.0",
)

# In production, set FRONTEND_URL to your deployed Vercel domain; falling back
# to "*" keeps local development frictionless without hardcoding localhost.
frontend_url = os.getenv("FRONTEND_URL", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url] if frontend_url != "*" else ["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

_model = None


@app.on_event("startup")
def load_model():
    global _model
    if not MODEL_PATH.exists():
        raise RuntimeError(
            f"Model file not found at {MODEL_PATH}. Run `python model/train.py` first."
        )
    _model = joblib.load(MODEL_PATH)


@app.get("/health", response_model=HealthCheckResponse)
def health_check():
    return {"status": "ok", "modelLoaded": _model is not None}


@app.post("/predict", response_model=PredictionResponse)
def predict(input_data: SoilInputRequest):
    if _model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded yet.")

    values = {
        "pH": input_data.pH,
        "nitrogen": input_data.nitrogen,
        "phosphorus": input_data.phosphorus,
        "potassium": input_data.potassium,
        "organic_matter": input_data.organicMatter,
    }

    X_new = pd.DataFrame([[values[f] for f in FEATURE_ORDER]], columns=FEATURE_ORDER)

    soil_health = _model.predict(X_new)[0]
    probabilities = _model.predict_proba(X_new)[0]
    confidence = round(float(max(probabilities)) * 100, 1)

    parameter_analysis = build_parameter_analysis(values)
    risk_level = compute_risk_level(parameter_analysis, soil_health)
    explanation = build_explanation(soil_health, parameter_analysis, confidence)
    recommendations = get_recommendations(values)

    feature_importance = [
        {"feature": feature, "importance": round(float(importance), 4)}
        for feature, importance in zip(FEATURE_ORDER, _model.feature_importances_)
    ]
    feature_importance.sort(key=lambda item: item["importance"], reverse=True)

    return {
        "soilHealth": soil_health,
        "confidence": confidence,
        "riskLevel": risk_level,
        "explanation": explanation,
        "parameterAnalysis": parameter_analysis,
        "recommendations": recommendations,
        "featureImportance": feature_importance,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
