"""
Turns raw model output + raw soil values into the explainable pieces the
frontend displays: per-parameter status, an overall risk level, and a
plain-language explanation. Kept separate from main.py so this logic is
independently testable and reusable if a second endpoint ever needs it.
"""

from config import DISPLAY_LABELS, FEATURE_ORDER, IDEAL_RANGES

# A parameter is "Yellow" if it's outside the ideal range but within this
# fraction of the range's width beyond the boundary; further than that is "Red".
YELLOW_TOLERANCE_FRACTION = 0.25


def parameter_status(value: float, ideal_min: float, ideal_max: float) -> str:
    if ideal_min <= value <= ideal_max:
        return "Green"

    span = ideal_max - ideal_min
    tolerance = span * YELLOW_TOLERANCE_FRACTION
    if (ideal_min - tolerance) <= value <= (ideal_max + tolerance):
        return "Yellow"

    return "Red"


def build_parameter_analysis(values: dict) -> list[dict]:
    """values: dict keyed by FEATURE_ORDER names (pH, nitrogen, phosphorus, potassium, organic_matter)."""
    analysis = []
    for feature in FEATURE_ORDER:
        ideal_min, ideal_max = IDEAL_RANGES[feature]
        value = values[feature]
        analysis.append(
            {
                "parameter": feature,
                "label": DISPLAY_LABELS[feature],
                "value": value,
                "idealMin": ideal_min,
                "idealMax": ideal_max,
                "status": parameter_status(value, ideal_min, ideal_max),
            }
        )
    return analysis


_RISK_ORDER = ["Excellent", "Good", "Moderate", "Poor"]


def compute_risk_level(parameter_analysis: list[dict], soil_health: str) -> str:
    """Risk level is primarily driven by how many parameters are out of
    range, independent of the model's confidence score, so it stays
    meaningful even when the classifier is very confident about a borderline
    sample. It's then reconciled against the model's own prediction so the
    two can never contradict each other in a way that would confuse a user
    (e.g. an 'Unhealthy' prediction paired with an 'Excellent' risk level) --
    this can otherwise happen right at the exact edges of the ideal ranges,
    where the learned tree boundaries and the configured ideal ranges don't
    perfectly line up."""
    red_count = sum(1 for p in parameter_analysis if p["status"] == "Red")
    yellow_count = sum(1 for p in parameter_analysis if p["status"] == "Yellow")

    if red_count == 0 and yellow_count == 0:
        risk_level = "Excellent"
    elif red_count == 0 and yellow_count <= 1:
        risk_level = "Good"
    elif red_count <= 1:
        risk_level = "Moderate"
    else:
        risk_level = "Poor"

    minimum_for_health = {"Healthy": "Excellent", "Unhealthy": "Moderate"}[soil_health]
    if _RISK_ORDER.index(risk_level) < _RISK_ORDER.index(minimum_for_health):
        risk_level = minimum_for_health

    return risk_level


def build_explanation(soil_health: str, parameter_analysis: list[dict], confidence: float) -> str:
    out_of_range = [p for p in parameter_analysis if p["status"] != "Green"]

    if soil_health == "Healthy":
        if not out_of_range:
            return (
                f"All measured parameters fall within healthy ranges, giving the model "
                f"{confidence:.0f}% confidence in this prediction. No corrective action is needed."
            )
        names = ", ".join(p["label"] for p in out_of_range)
        return (
            f"Most parameters are within healthy ranges, which is why the model predicts "
            f"'Healthy' with {confidence:.0f}% confidence, though {names} "
            f"{'is' if len(out_of_range) == 1 else 'are'} borderline and worth monitoring."
        )

    if not out_of_range:
        return (
            f"The model predicts 'Unhealthy' with {confidence:.0f}% confidence based on a "
            f"combination of parameters that, taken together, resembles unhealthy samples "
            f"in training, even though none are dramatically out of range individually."
        )
    names = ", ".join(p["label"] for p in out_of_range)
    return (
        f"The model predicts 'Unhealthy' with {confidence:.0f}% confidence, driven mainly by "
        f"{names} falling outside the healthy range."
    )
