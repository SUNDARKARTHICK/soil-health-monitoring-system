"""
Trains the soil health Decision Tree classifier and saves it to
model/soil_health_model.pkl.

DATASET: by default this generates a synthetic dataset from the ideal ranges
in config.py, because no real labeled soil dataset was available at build
time. To swap in a real dataset later, drop a CSV at
model/real_soil_data.csv with these columns (case-sensitive):

    pH, nitrogen, phosphorus, potassium, organic_matter, SoilHealth

...where SoilHealth is the string "Healthy" or "Unhealthy". This script
detects that file automatically and trains on it instead of the synthetic
data -- no other code changes needed. See README.md for a fuller explanation
and where to source a real dataset (e.g. Kaggle's soil fertility datasets).

Run this whenever config.IDEAL_RANGES changes, the real dataset changes, or
to regenerate the model:
    python model/train.py
"""

import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report

sys.path.append(str(Path(__file__).resolve().parent.parent))
from config import FEATURE_ORDER, IDEAL_RANGES  # noqa: E402

RANDOM_STATE = 42
N_SAMPLES = 2000
MODEL_PATH = Path(__file__).resolve().parent / "soil_health_model.pkl"
REAL_DATASET_PATH = Path(__file__).resolve().parent / "real_soil_data.csv"

# Sampling ranges are wider than the ideal ranges so the model sees plenty of
# both healthy and unhealthy examples, including edge cases near the boundary.
SAMPLING_RANGES = {
    "pH": (3.5, 9.5),
    "nitrogen": (0, 260),
    "phosphorus": (0, 110),
    "potassium": (0, 220),
    "organic_matter": (0, 8),
}


def _label(df: pd.DataFrame) -> np.ndarray:
    in_range_count = np.zeros(len(df))
    for feature, (ideal_low, ideal_high) in IDEAL_RANGES.items():
        in_range_count += ((df[feature] >= ideal_low) & (df[feature] <= ideal_high)).astype(int)
    # Healthy if at least 4 of 5 parameters are within their ideal range.
    return np.where(in_range_count >= 4, "Healthy", "Unhealthy")


def generate_dataset(n_samples: int, rng: np.random.Generator) -> pd.DataFrame:
    wide_n = int(n_samples * 0.35)
    centered_n = n_samples - wide_n

    # Pool A: wide uniform sampling across the plausible field-value range.
    # This pool is overwhelmingly Unhealthy, since most random combinations
    # of 5 independent parameters won't all land in their ideal band at once.
    wide_data = {
        feature: rng.uniform(low, high, wide_n) for feature, (low, high) in SAMPLING_RANGES.items()
    }
    wide_df = pd.DataFrame(wide_data, columns=FEATURE_ORDER)

    # Pool B: sampled from a normal distribution centered on each parameter's
    # ideal midpoint, so this pool skews Healthy while still producing plenty
    # of near-boundary and occasionally out-of-range examples. Without this,
    # "Healthy" would be a rare class the tree barely learns to recognize.
    centered_data = {}
    for feature, (ideal_low, ideal_high) in IDEAL_RANGES.items():
        mid = (ideal_low + ideal_high) / 2
        # Tight enough that most draws land in-range, wide enough that plenty don't.
        std = (ideal_high - ideal_low) * 0.4
        sampling_low, sampling_high = SAMPLING_RANGES[feature]
        centered_data[feature] = np.clip(
            rng.normal(mid, std, centered_n), sampling_low, sampling_high
        )
    centered_df = pd.DataFrame(centered_data, columns=FEATURE_ORDER)

    df = pd.concat([wide_df, centered_df], ignore_index=True)
    labels = _label(df)

    # Flip 4% of labels at random to simulate real-world measurement noise
    # and avoid a model that's a perfect lookup table for the labeling rule.
    flip_mask = rng.random(len(df)) < 0.04
    labels = np.where(
        flip_mask,
        np.where(labels == "Healthy", "Unhealthy", "Healthy"),
        labels,
    )

    df["SoilHealth"] = labels
    return df.sample(frac=1, random_state=RANDOM_STATE).reset_index(drop=True)


def load_real_dataset(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path)
    required_columns = set(FEATURE_ORDER + ["SoilHealth"])
    missing = required_columns - set(df.columns)
    if missing:
        raise ValueError(
            f"real_soil_data.csv is missing required columns: {sorted(missing)}. "
            f"Expected: {FEATURE_ORDER + ['SoilHealth']}"
        )
    invalid_labels = set(df["SoilHealth"].unique()) - {"Healthy", "Unhealthy"}
    if invalid_labels:
        raise ValueError(
            f"SoilHealth column contains unexpected values: {sorted(invalid_labels)}. "
            f"Expected only 'Healthy' or 'Unhealthy'."
        )
    return df[FEATURE_ORDER + ["SoilHealth"]]


def main():
    rng = np.random.default_rng(RANDOM_STATE)

    if REAL_DATASET_PATH.exists():
        print(f"Found real dataset at {REAL_DATASET_PATH}, training on it instead of synthetic data.\n")
        df = load_real_dataset(REAL_DATASET_PATH)
    else:
        print("No real dataset found at model/real_soil_data.csv -- using synthetic data.")
        print("See the module docstring in this file for how to swap in a real dataset.\n")
        df = generate_dataset(N_SAMPLES, rng)

    print("Class balance:")
    print(df["SoilHealth"].value_counts())
    print()

    X = df[FEATURE_ORDER]
    y = df["SoilHealth"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )

    model = DecisionTreeClassifier(
        max_depth=6,
        min_samples_leaf=15,
        random_state=RANDOM_STATE,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print(f"Test accuracy: {accuracy_score(y_test, y_pred):.3f}")
    print(classification_report(y_test, y_pred))

    print("Feature importances:")
    for feature, importance in zip(FEATURE_ORDER, model.feature_importances_):
        print(f"  {feature}: {importance:.3f}")

    joblib.dump(model, MODEL_PATH)
    print(f"\nModel saved to {MODEL_PATH}")


if __name__ == "__main__":
    main()
