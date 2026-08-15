"""
BizPilot AI - End-to-End Prediction Demo Script
Runnable via: python -m ml.validation.demo_predictions
Demonstrates all 3 models with real test data predictions and human-readable risk/financial insights.
"""

import os
import sys
import json
import joblib
import pandas as pd
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from ml.explainability.retention_shap import explain_retention_predictions
from ml.explainability.profit_shap import explain_profit_predictions
from ml.explainability.cashflow_shap import explain_cashflow_predictions


def run_prediction_demo():
    print("=" * 80)
    print("           BIZPILOT AI — END-TO-END PREDICTION DEMONSTRATION")
    print("=" * 80)

    # 1. CUSTOMER RETENTION DEMO
    print("\n--- 1. CUSTOMER RETENTION DEMO ---")
    ret_expl = explain_retention_predictions()
    samples = ret_expl.get("sample_explanations", [])
    
    for s in samples[:2]:
        print(f"\nCustomer Code: {s['customer_code']} ({s['customer_name']})")
        print(f"  Churn Probability: {s['churn_probability']*100:.1f}%")
        print(f"  Risk Level:        {s['risk_level']}")
        print(f"  Top Contributing Factors:")
        for factor in s['top_contributing_factors'][:3]:
            print(f"    - {factor['feature']:<30}: {factor['value']:<10} (Impact: {factor['importance']:.4f})")

    # 2. PROFIT FORECAST DEMO
    print("\n\n--- 2. PROFIT FORECAST DEMO ---")
    profit_model = joblib.load(os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/profit/profit_model_v1.pkl")))
    profit_meta = json.load(open(os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/profit/metadata.json"))))
    
    fin_df = pd.read_csv(os.path.abspath(os.path.join(os.path.dirname(__file__), "../datasets/financial_forecasting.csv"))).dropna(subset=['target_future_profit_next_month'])
    feature_cols = profit_meta["features"]
    X_fin = fin_df[feature_cols].select_dtypes(include=[np.number]).fillna(0.0)
    
    latest_fin_row = X_fin.iloc[[-1]]
    latest_month = fin_df.iloc[-1]['month_start']
    actual_next_profit = fin_df.iloc[-1]['target_future_profit_next_month']
    predicted_next_profit = float(profit_model.predict(latest_fin_row)[0])

    print(f"\nCurrent Period: {latest_month}")
    print(f"  Predicted Next Month Profit: INR {predicted_next_profit:,.2f}")
    print(f"  Actual Next Month Profit:    INR {actual_next_profit:,.2f}")
    print(f"  Forecast Error:              INR {abs(actual_next_profit - predicted_next_profit):,.2f}")

    # 3. CASHFLOW FORECAST DEMO
    print("\n\n--- 3. CASHFLOW FORECAST DEMO ---")
    cash_model = joblib.load(os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/cashflow/cashflow_model_v1.pkl")))
    cash_meta = json.load(open(os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/cashflow/metadata.json"))))
    
    cf_df = pd.read_csv(os.path.abspath(os.path.join(os.path.dirname(__file__), "../datasets/cashflow_forecasting.csv"))).dropna(subset=['target_future_closing_cash_next_month'])
    cf_features = cash_meta["features"]
    X_cf = cf_df[cf_features].select_dtypes(include=[np.number]).fillna(0.0)

    latest_cf_row = X_cf.iloc[[-1]]
    latest_cf_month = cf_df.iloc[-1]['month_start']
    current_cash = float(cf_df.iloc[-1]['closing_balance'])
    actual_future_cash = float(cf_df.iloc[-1]['target_future_closing_cash_next_month'])
    predicted_future_cash = float(cash_model.predict(latest_cf_row)[0])
    cash_risk = "HIGH" if predicted_future_cash < 20000000.0 else ("MEDIUM" if predicted_future_cash < 40000000.0 else "LOW")

    print(f"\nCurrent Period: {latest_cf_month}")
    print(f"  Current Cash Balance:        INR {current_cash:,.2f}")
    print(f"  Predicted Future Cash:       INR {predicted_future_cash:,.2f}")
    print(f"  Actual Future Cash:          INR {actual_future_cash:,.2f}")
    print(f"  Liquidity Risk Level:        {cash_risk}")

    print("\n===================================================================")
    print(" END-TO-END PREDICTION DEMONSTRATION COMPLETE")
    print("===================================================================\n")


if __name__ == "__main__":
    run_prediction_demo()
