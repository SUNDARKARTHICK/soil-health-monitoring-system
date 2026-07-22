"""
Single source of truth for the soil parameters this system reasons about.

Both model/train.py (training data generation) and services/analysis.py
(inference-time parameter analysis) import from here, so the ranges used to
label training data are guaranteed to match the ranges used to explain
predictions to the user.
"""

# Feature order the model is trained on and expects at inference time.
FEATURE_ORDER = ["pH", "nitrogen", "phosphorus", "potassium", "organic_matter"]

# (ideal_min, ideal_max) per parameter, in the same units the frontend collects:
# pH (0-14 scale), N/P/K (kg/ha), organic matter (%).
IDEAL_RANGES = {
    "pH": (6.0, 7.5),
    "nitrogen": (80, 150),
    "phosphorus": (30, 60),
    "potassium": (80, 120),
    "organic_matter": (2.0, 5.0),
}

DISPLAY_LABELS = {
    "pH": "Soil pH",
    "nitrogen": "Nitrogen (N)",
    "phosphorus": "Phosphorus (P)",
    "potassium": "Potassium (K)",
    "organic_matter": "Organic Matter",
}
