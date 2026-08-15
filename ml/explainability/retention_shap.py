"""
BizPilot AI - Customer Retention Explainability & Feature Importance Module
"""

import os
import joblib
import json
import pandas as pd
import numpy as np

try:
    import shap
    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False

MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/retention/retention_model_v1.pkl"))
META_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/retention/metadata.json"))
DATASET_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../datasets/customer_retention.csv"))


def explain_retention_predictions(top_n: int = 3) -> dict:
    """
    Computes global feature importances and individual sample explanations for Customer Retention.
    """
    if not os.path.exists(MODEL_PATH) or not os.path.exists(META_PATH):
        raise FileNotFoundError("Retention model artifact or metadata missing.")

    model = joblib.load(MODEL_PATH)
    with open(META_PATH, "r", encoding="utf-8") as f:
        meta = json.load(f)

    df = pd.read_csv(DATASET_PATH)
    feature_cols = meta["features"]
    X = df[feature_cols].select_dtypes(include=[np.number]).fillna(0.0)

    # Calculate global feature importances
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
    elif hasattr(model, "named_steps") and hasattr(model.named_steps.get('clf'), "feature_importances_"):
        importances = model.named_steps['clf'].feature_importances_
    elif hasattr(model, "named_steps") and hasattr(model.named_steps.get('clf'), "coef_"):
        importances = np.abs(model.named_steps['clf'].coef_[0])
    else:
        importances = np.ones(len(feature_cols)) / len(feature_cols)

    importance_df = pd.DataFrame({
        "feature": feature_cols,
        "importance": importances
    }).sort_values(by="importance", ascending=False).reset_index(drop=True)

    print("--- CUSTOMER RETENTION GLOBAL FEATURE IMPORTANCE ---")
    for idx, row in importance_df.head(5).iterrows():
        print(f"  {idx+1}. {row['feature']:<30} Importance: {row['importance']:.4f}")

    # Generate sample individual predictions with top factors
    sample_indices = [0, min(5, len(df)-1), min(12, len(df)-1)]
    sample_explanations = []

    for idx in sample_indices:
        cust_row = df.iloc[idx]
        sample_X = X.iloc[[idx]]
        prob = float(model.predict_proba(sample_X)[0, 1]) if hasattr(model, "predict_proba") else float(model.predict(sample_X)[0])
        pred_label = 1 if prob >= 0.5 else 0
        risk_level = "HIGH" if prob >= 0.5 else ("MEDIUM" if prob >= 0.25 else "LOW")

        # Top contributing factors for this customer based on feature deviations and model importance
        top_features = []
        for feat, imp in zip(importance_df['feature'].head(4), importance_df['importance'].head(4)):
            val = float(cust_row.get(feat, 0.0))
            top_features.append({"feature": feat, "value": val, "importance": round(imp, 4)})

        sample_explanations.append({
            "customer_code": str(cust_row.get('customer_code', f'CUST-{idx+1}')),
            "customer_name": str(cust_row.get('customer_name', 'Unknown')),
            "churn_probability": round(prob, 4),
            "predicted_churn": pred_label,
            "risk_level": risk_level,
            "top_contributing_factors": top_features
        })

    return {
        "global_importance": importance_df.to_dict(orient="records"),
        "sample_explanations": sample_explanations
    }


if __name__ == "__main__":
    explain_retention_predictions()
