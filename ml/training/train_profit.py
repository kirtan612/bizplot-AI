"""
BizPilot AI - Financial Profit Forecasting Model Training & Selection Script
"""

import os
import sys
import json
from datetime import datetime
import pandas as pd
import numpy as np
import joblib

from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

try:
    from xgboost import XGBRegressor
    HAS_XGB = True
except ImportError:
    HAS_XGB = False

try:
    from lightgbm import LGBMRegressor
    HAS_LGB = True
except ImportError:
    HAS_LGB = False


MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/profit"))
os.makedirs(MODELS_DIR, exist_ok=True)
DATASET_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../datasets/financial_forecasting.csv"))


def load_and_preprocess_profit_data():
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Financial Forecasting dataset missing at {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)
    
    # Drop rows where target is NaN (the last row due to target = profit.shift(-1))
    df = df.dropna(subset=['target_future_profit_next_month']).reset_index(drop=True)

    exclude_cols = ['month_start', 'target_future_profit_next_month']
    feature_cols = [c for c in df.columns if c not in exclude_cols]

    X = df[feature_cols].select_dtypes(include=[np.number]).fillna(0.0)
    feature_cols = list(X.columns)
    y = df['target_future_profit_next_month']

    # Strict Chronological Split (NO Random Shuffling for Time-Series)
    n_total = len(df)
    n_train = int(n_total * 0.70)
    n_val = int(n_total * 0.15)
    
    X_train = X.iloc[:n_train]
    y_train = y.iloc[:n_train]

    X_val = X.iloc[n_train:n_train+n_val]
    y_val = y.iloc[n_train:n_train+n_val]

    X_test = X.iloc[n_train+n_val:]
    y_test = y.iloc[n_train+n_val:]

    X_train_val = X.iloc[:n_train+n_val]
    y_train_val = y.iloc[:n_train+n_val]

    dates = df['month_start'].values
    train_dates = (dates[0], dates[n_train-1])
    val_dates = (dates[n_train], dates[n_train+n_val-1])
    test_dates = (dates[n_train+n_val], dates[-1])

    return X_train, X_val, X_test, y_train, y_val, y_test, feature_cols, X_train_val, y_train_val, train_dates, val_dates, test_dates


def evaluate_regressor(model, X_eval, y_eval):
    preds = model.predict(X_eval)
    mae = mean_absolute_error(y_eval, preds)
    rmse = np.sqrt(mean_squared_error(y_eval, preds))
    r2 = r2_score(y_eval, preds) if len(y_eval) > 1 else 0.0
    
    # MAPE calculation avoiding divide by zero
    non_zero = y_eval != 0
    mape = np.mean(np.abs((y_eval[non_zero] - preds[non_zero]) / y_eval[non_zero])) * 100 if np.any(non_zero) else 0.0

    return {
        "mae": round(float(mae), 2),
        "rmse": round(float(rmse), 2),
        "mape_pct": round(float(mape), 2),
        "r2": round(float(r2), 4),
        "sample_count": len(y_eval)
    }


def train_and_select_profit_model():
    print("=" * 80)
    print("      PROBLEM 2: PROFIT FORECASTING (REGRESSION)")
    print("=" * 80)

    (X_train, X_val, X_test, y_train, y_val, y_test, 
     feature_cols, X_train_val, y_train_val, 
     train_dates, val_dates, test_dates) = load_and_preprocess_profit_data()

    print(f"Chronological Split -> Train: {len(X_train)} ({train_dates[0]} to {train_dates[1]})")
    print(f"                    -> Val:   {len(X_val)} ({val_dates[0]} to {val_dates[1]})")
    print(f"                    -> Test:  {len(X_test)} ({test_dates[0]} to {test_dates[1]})")
    print(f"Feature Count: {len(feature_cols)}")

    # Candidate Models
    candidates = {
        "Linear Regression": Pipeline([
            ('scaler', StandardScaler()),
            ('reg', LinearRegression())
        ]),
        "Random Forest Regressor": RandomForestRegressor(n_estimators=100, random_state=42),
    }

    if HAS_XGB:
        candidates["XGBoost Regressor"] = XGBRegressor(n_estimators=100, max_depth=3, random_state=42)
    if HAS_LGB:
        candidates["LightGBM Regressor"] = LGBMRegressor(n_estimators=100, random_state=42, verbose=-1)

    results = {}
    print("\n--- Candidate Models Evaluation on Validation Set ---")
    for name, model in candidates.items():
        model.fit(X_train, y_train)
        metrics = evaluate_regressor(model, X_val, y_val)
        results[name] = {
            "model": model,
            "metrics": metrics
        }
        print(f"  {name:<24} | MAE: INR {metrics['mae']:,.2f} | RMSE: INR {metrics['rmse']:,.2f} | R2: {metrics['r2']:.4f}")

    # Select Best Candidate based on lowest Validation MAE
    best_name = min(results, key=lambda k: results[k]['metrics']['mae'])
    best_candidate = results[best_name]['model']
    print(f"\n[OK] Winner Selected based on Validation MAE: {best_name}")

    # Refit on Train+Val dataset prior to Test set evaluation
    final_model = best_candidate
    final_model.fit(X_train_val, y_train_val)

    # Final Unbiased Evaluation on Untouched Test Set
    final_test_metrics = evaluate_regressor(final_model, X_test, y_test)
    print("\n===================================================================")
    print(f"      FINAL UNTOUCHED TEST SET METRICS ({best_name})")
    print("===================================================================")
    print(f"  MAE (Mean Absolute Error): INR {final_test_metrics['mae']:,.2f}")
    print(f"  RMSE (Root Mean Sq Err):   INR {final_test_metrics['rmse']:,.2f}")
    print(f"  MAPE (% Error):            {final_test_metrics['mape_pct']:.2f}%")
    print(f"  R2 Score:                  {final_test_metrics['r2']:.4f}")
    print("===================================================================")

    # Serialize Model & Save Metadata
    model_path = os.path.join(MODELS_DIR, "profit_model_v1.pkl")
    meta_path = os.path.join(MODELS_DIR, "metadata.json")

    joblib.dump(final_model, model_path)

    metadata = {
        "model_name": "profit_forecasting",
        "version": "1.0",
        "algorithm": best_name,
        "features": feature_cols,
        "target": "target_future_profit_next_month",
        "training_date": datetime.now().isoformat(),
        "dataset_version": "financial_forecasting_v1",
        "validation_metrics": results[best_name]['metrics'],
        "final_test_metrics": final_test_metrics,
        "status": "candidate"
    }

    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"\n  [OK] Saved final model to: {model_path}")
    print(f"  [OK] Saved model metadata to: {meta_path}\n")

    return final_model, metadata, results, X_test, y_test


if __name__ == "__main__":
    train_and_select_profit_model()
