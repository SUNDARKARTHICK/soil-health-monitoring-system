"""
Deterministic, rule-based fertilizer and crop recommendations. This is the
whole recommendation engine for V1 -- no external AI call, no API key, no
network dependency, which keeps this MVP fully self-contained and free to run.
"""

from config import IDEAL_RANGES


def get_recommendations(values: dict) -> dict:
    ph = values["pH"]
    n = values["nitrogen"]
    p = values["phosphorus"]
    k = values["potassium"]
    om = values["organic_matter"]

    natural: list[str] = []
    artificial: list[str] = []
    organic: list[str] = []
    suitable_crops: list[str] = []

    ph_min, ph_max = IDEAL_RANGES["pH"]
    n_min, n_max = IDEAL_RANGES["nitrogen"]
    p_min, _ = IDEAL_RANGES["phosphorus"]
    k_min, k_max = IDEAL_RANGES["potassium"]
    om_min, _ = IDEAL_RANGES["organic_matter"]

    if ph < ph_min:
        natural.append("Apply lime, compost, or wood ash to raise pH")
        artificial.append("Use agricultural lime (CaCO3)")
    elif ph > ph_max:
        natural.append("Add organic matter such as compost or peat moss")
        artificial.append("Apply sulfur-based amendments to lower pH")

    if n < n_min:
        natural.append("Use compost, green manure, or cow dung")
        artificial.append("Apply urea or ammonium nitrate")
    elif n > n_max:
        natural.append("Rotate with legumes to draw down excess nitrogen")
        artificial.append("Reduce nitrogen fertilizer application")

    if p < p_min:
        natural.append("Add bone meal or rock phosphate")
        artificial.append("Apply single superphosphate (SSP) or DAP")

    if k < k_min:
        natural.append("Add banana peel compost or wood ash")
        artificial.append("Apply muriate of potash (MOP)")
    elif k > k_max:
        natural.append("Use balanced compost rather than potash-heavy amendments")

    if om < om_min:
        organic.append("Incorporate cover crops to build organic matter")
        organic.append("Add well-rotted farmyard manure between seasons")
    else:
        organic.append("Maintain organic matter with periodic compost top-dressing")

    organic.append("Practice crop rotation to maintain long-term nutrient balance")

    if ph_min <= ph <= ph_max:
        suitable_crops.extend(["Wheat", "Maize", "Soybean"])
    elif ph < ph_min:
        suitable_crops.extend(["Potato", "Tea", "Blueberry"])
    else:
        suitable_crops.extend(["Barley", "Alfalfa", "Sugar beet"])

    out_of_range_count = sum(
        [
            not (ph_min <= ph <= ph_max),
            not (n_min <= n <= n_max),
            k < k_min or k > k_max,
            p < p_min,
            om < om_min,
        ]
    )
    if out_of_range_count == 0:
        yield_improvement = "Minimal upside expected; soil is already in a healthy range"
    elif out_of_range_count <= 2:
        yield_improvement = "10-20% with consistent amendment over one growing season"
    else:
        yield_improvement = "20-35% achievable but likely requires more than one season"

    return {
        "natural": natural or ["No natural amendments needed at this time"],
        "artificial": artificial or ["No chemical fertilizer needed at this time"],
        "organic": organic,
        "suitableCrops": suitable_crops,
        "expectedYieldImprovement": yield_improvement,
        "source": "rule-based",
    }
