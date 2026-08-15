"""
BizPilot AI - Cashflow Risk & Forecasting Explainability Module
"""

import os
import joblib
import json
import pandas as pd
import numpy as np

MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/cashflow/cashflow_model_v1.pkl"))
META_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/cashflow/metadata.json"))
DATASET_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../datasets/cashflow_forecasting.csv"))


def explain_cashflow_predictions() -> dict:
    """
    Computes global feature importances and liquidity risk drivers for Cashflow Forecasting.
    """
    if not os.path.exists(MODEL_PATH) or not os.path.exists(META_PATH):
        raise FileNotFoundError("Cashflow model artifact or metadata missing.")

    model = joblib.load(MODEL_PATH)
    with open(META_PATH, "r", encoding="utf-8") as f:
        meta = json.load(f)

    df = pd.read_csv(DATASET_PATH).dropna(subset=['target_future_closing_cash_next_month'])
    feature_cols = meta["features"]
    X = df[feature_cols].select_dtypes(include=[np.number]).fillna(0.0)

    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
    elif hasattr(model, "named_steps") and hasattr(model.named_steps.get('reg'), "feature_importances_"):
        importances = model.named_steps['reg'].feature_importances_
    elif hasattr(model, "named_steps") and hasattr(model.named_steps.get('reg'), "coef_"):
        importances = np.abs(model.named_steps['reg'].coef_)
    else:
        importances = np.ones(len(feature_cols)) / len(feature_cols)

    importance_df = pd.DataFrame({
        "feature": feature_cols,
        "importance": importances
    }).sort_values(by="importance", ascending=False).reset_index(drop=True)

    print("--- CASHFLOW MODEL-IMPORTANT DRIVERS ---")
    for idx, row in importance_df.head(5).iterrows():
        print(f"  {idx+1}. {row['feature']:<35} Importance: {row['importance']:.4f}")

    return {
        "global_importance": importance_df.to_dict(orient="records")
    }


if __name__ == "__main__":
    explain_cashflow_predictions()
