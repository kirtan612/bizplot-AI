"""
BizPilot AI - Customer Retention Model Validation Script
"""

import os
import sys
import json
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, confusion_matrix
)

# Ensure root directory on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from ml.explainability.retention_shap import explain_retention_predictions

MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/retention/retention_model_v1.pkl"))
META_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/retention/metadata.json"))
DATASET_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../datasets/customer_retention.csv"))


def validate_retention_model() -> dict:
    print("=" * 70)
    print("      CUSTOMER RETENTION MODEL VALIDATION")
    print("=" * 70)

    checks = {
        "model_file_exists": False,
        "metadata_file_exists": False,
        "model_loaded": False,
        "prediction_works": False,
        "zero_nans": False,
        "valid_probabilities": False,
        "metrics_calculated": False,
        "explainability_works": False
    }

    if os.path.exists(MODEL_PATH):
        checks["model_file_exists"] = True
    if os.path.exists(META_PATH):
        checks["metadata_file_exists"] = True

    if not (checks["model_file_exists"] and checks["metadata_file_exists"]):
        print("FAIL: Model artifact or metadata missing.")
        return {"status": "FAIL", "reason": "Artifact missing", "checks": checks}

    try:
        model = joblib.load(MODEL_PATH)
        with open(META_PATH, "r", encoding="utf-8") as f:
            meta = json.load(f)
        checks["model_loaded"] = True
    except Exception as e:
        print(f"FAIL: Error loading model: {e}")
        return {"status": "FAIL", "reason": str(e), "checks": checks}

    # Load dataset and reproduce exact untouched test set
    df = pd.read_csv(DATASET_PATH)
    exclude_cols = ['customer_id', 'company_id', 'customer_code', 'customer_name', 
                    'city', 'state', 'pincode', 'payment_behavior_tier', 'customer_type',
                    'first_purchase_date', 'last_purchase_date', 'onboarding_date', 'churned']
    feature_cols = [c for c in df.columns if c not in exclude_cols]
    
    X = df[feature_cols].select_dtypes(include=[np.number]).fillna(0.0)
    y = df['churned']

    # Stratified Train/Val/Test Split (70/15/15)
    X_train_val, X_test, y_train_val, y_test = train_test_split(
        X, y, test_size=0.15, stratify=y, random_state=42
    )

    try:
        preds = model.predict(X_test)
        probs = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else preds
        checks["prediction_works"] = True
    except Exception as e:
        print(f"FAIL: Error during model prediction: {e}")
        return {"status": "FAIL", "reason": str(e), "checks": checks}

    # NaN / Inf Check
    if not (np.isnan(preds).any() or np.isinf(preds).any() or np.isnan(probs).any() or np.isinf(probs).any()):
        checks["zero_nans"] = True

    # Probability bounds check (0.0 <= prob <= 1.0)
    if (probs >= 0.0).all() and (probs <= 1.0).all():
        checks["valid_probabilities"] = True

    # Metrics
    f1 = f1_score(y_test, preds, zero_division=0)
    rec = recall_score(y_test, preds, zero_division=0)
    prec = precision_score(y_test, preds, zero_division=0)
    try:
        roc_auc = roc_auc_score(y_test, probs)
    except ValueError:
        roc_auc = 0.5
    try:
        pr_auc = average_precision_score(y_test, probs)
    except ValueError:
        pr_auc = 0.0

    checks["metrics_calculated"] = True

    # Explainability Check
    try:
        expl_res = explain_retention_predictions()
        checks["explainability_works"] = True
    except Exception as e:
        expl_res = {}

    all_passed = all(checks.values())
    status_str = "PASS" if all_passed else "FAIL"

    print(f"\nModel: {meta.get('algorithm', 'Classifier')}")
    print(f"Version: {meta.get('version', '1.0')}")
    print(f"Test Samples: {len(X_test)}")
    print(f"F1 Score: {f1:.4f} | Recall: {rec:.4f} | Precision: {prec:.4f} | ROC-AUC: {roc_auc:.4f} | PR-AUC: {pr_auc:.4f}")
    print(f"NaN Check: {checks['zero_nans']} | Valid Probs: {checks['valid_probabilities']}")
    
    # Sample Prediction Output
    sample_idx = 0
    sample_code = df.iloc[sample_idx].get('customer_code', 'C1024')
    sample_actual = y_test.iloc[sample_idx]
    sample_pred = preds[sample_idx]
    sample_prob = probs[sample_idx]

    print("\nSample Prediction:")
    print(f"  Customer: {sample_code}")
    print(f"  Actual: {sample_actual} | Predicted: {sample_pred}")
    print(f"  Probability: {sample_prob*100:.1f}%")
    print(f"STATUS: {status_str}\n")

    return {
        "status": status_str,
        "algorithm": meta.get('algorithm', 'Classifier'),
        "version": meta.get('version', '1.0'),
        "test_samples": len(X_test),
        "f1": round(float(f1), 4),
        "recall": round(float(rec), 4),
        "precision": round(float(prec), 4),
        "roc_auc": round(float(roc_auc), 4),
        "pr_auc": round(float(pr_auc), 4),
        "checks": checks
    }


if __name__ == "__main__":
    validate_retention_model()
