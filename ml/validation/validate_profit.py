"""
BizPilot AI - Financial Profit Model Validation Script
"""

import os
import sys
import json
import joblib
import pandas as pd
import numpy as np

from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from ml.explainability.profit_shap import explain_profit_predictions

MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/profit/profit_model_v1.pkl"))
META_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/profit/metadata.json"))
DATASET_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../datasets/financial_forecasting.csv"))


def validate_profit_model() -> dict:
    print("=" * 70)
    print("      PROFIT FORECAST MODEL VALIDATION")
    print("=" * 70)

    checks = {
        "model_file_exists": False,
        "metadata_file_exists": False,
        "model_loaded": False,
        "prediction_works": False,
        "zero_nans": False,
        "plausible_range": False,
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

    # Load dataset and reproduce exact untouched test set (last 4 months)
    df = pd.read_csv(DATASET_PATH).dropna(subset=['target_future_profit_next_month']).reset_index(drop=True)
    exclude_cols = ['month_start', 'target_future_profit_next_month']
    feature_cols = [c for c in df.columns if c not in exclude_cols]

    X = df[feature_cols].select_dtypes(include=[np.number]).fillna(0.0)
    y = df['target_future_profit_next_month']

    n_total = len(df)
    n_train = int(n_total * 0.70)
    n_val = int(n_total * 0.15)
    
    X_test = X.iloc[n_train+n_val:]
    y_test = y.iloc[n_train+n_val:]
    test_months = df['month_start'].iloc[n_train+n_val:].values

    try:
        preds = model.predict(X_test)
        checks["prediction_works"] = True
    except Exception as e:
        print(f"FAIL: Error during model prediction: {e}")
        return {"status": "FAIL", "reason": str(e), "checks": checks}

    # Check NaNs / Inf
    if not (np.isnan(preds).any() or np.isinf(preds).any()):
        checks["zero_nans"] = True

    # Plausible business range check (e.g. predictions within reasonable bounds)
    if (preds > -50000000.0).all() and (preds < 100000000.0).all():
        checks["plausible_range"] = True

    # Metrics
    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds) if len(y_test) > 1 else 0.0
    non_zero = y_test != 0
    mape = np.mean(np.abs((y_test[non_zero] - preds[non_zero]) / y_test[non_zero])) * 100 if np.any(non_zero) else 0.0

    checks["metrics_calculated"] = True

    try:
        expl_res = explain_profit_predictions()
        checks["explainability_works"] = True
    except Exception as e:
        expl_res = {}

    all_passed = all(checks.values())
    status_str = "PASS" if all_passed else "FAIL"

    print(f"\nModel: {meta.get('algorithm', 'Regressor')}")
    print(f"Version: {meta.get('version', '1.0')}")
    print(f"Test Samples: {len(X_test)}")
    print(f"MAE: INR {mae:,.2f} | RMSE: INR {rmse:,.2f} | MAPE: {mape:.2f}% | R2: {r2:.4f}")

    # Sample Output
    sample_month = test_months[0]
    sample_actual = y_test.iloc[0]
    sample_pred = preds[0]
    sample_abs_err = abs(sample_actual - sample_pred)

    print("\nSample Forecast:")
    print(f"  Period: {sample_month}")
    print(f"  Actual Profit:    INR {sample_actual:,.2f}")
    print(f"  Predicted Profit: INR {sample_pred:,.2f}")
    print(f"  Absolute Error:   INR {sample_abs_err:,.2f}")
    print(f"STATUS: {status_str}\n")

    return {
        "status": status_str,
        "algorithm": meta.get('algorithm', 'Regressor'),
        "version": meta.get('version', '1.0'),
        "test_samples": len(X_test),
        "mae": round(float(mae), 2),
        "rmse": round(float(rmse), 2),
        "mape_pct": round(float(mape), 2),
        "r2": round(float(r2), 4),
        "checks": checks
    }


if __name__ == "__main__":
    validate_profit_model()
