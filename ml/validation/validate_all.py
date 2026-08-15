"""
BizPilot AI - Master Global Model Validation Script
Runnable via: python -m ml.validation.validate_all
"""

import os
import sys

# Ensure root directory on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from ml.validation.validate_retention import validate_retention_model
from ml.validation.validate_profit import validate_profit_model
from ml.validation.validate_cashflow import validate_cashflow_model


def run_global_validation():
    print("=" * 80)
    print("             BIZPILOT AI — GLOBAL MODEL VALIDATION SYSTEM")
    print("=" * 80)

    res_retention = validate_retention_model()
    res_profit = validate_profit_model()
    res_cashflow = validate_cashflow_model()

    ret_ok = (res_retention.get("status") == "PASS")
    prof_ok = (res_profit.get("status") == "PASS")
    cf_ok = (res_cashflow.get("status") == "PASS")
    all_ok = ret_ok and prof_ok and cf_ok

    symbol_ret = "[OK]" if ret_ok else "[FAIL]"
    symbol_prof = "[OK]" if prof_ok else "[FAIL]"
    symbol_cf = "[OK]" if cf_ok else "[FAIL]"

    print("=" * 80)
    print("                 GLOBAL VALIDATION SUMMARY TABLE")
    print("=" * 80)
    print(f"[1] Customer Retention ({res_retention.get('algorithm', 'Model')})")
    print(f"    Model loaded        {symbol_ret}")
    print(f"    Prediction works    {symbol_ret}")
    print(f"    Metrics calculated  {symbol_ret} (F1: {res_retention.get('f1', 0.0):.4f}, Recall: {res_retention.get('recall', 0.0):.4f})")
    print(f"    Explainability      {symbol_ret}")
    print(f"    STATUS: {res_retention.get('status', 'FAIL')}\n")

    print(f"[2] Profit Forecast ({res_profit.get('algorithm', 'Model')})")
    print(f"    Model loaded        {symbol_prof}")
    print(f"    Prediction works    {symbol_prof}")
    print(f"    Metrics calculated  {symbol_prof} (MAE: INR {res_profit.get('mae', 0.0):,.2f}, MAPE: {res_profit.get('mape_pct', 0.0):.2f}%)")
    print(f"    Forecast generated  {symbol_prof}")
    print(f"    STATUS: {res_profit.get('status', 'FAIL')}\n")

    print(f"[3] Cashflow Forecast ({res_cashflow.get('algorithm', 'Model')})")
    print(f"    Model loaded        {symbol_cf}")
    print(f"    Prediction works    {symbol_cf}")
    print(f"    Metrics calculated  {symbol_cf} (MAE: INR {res_cashflow.get('mae', 0.0):,.2f}, MAPE: {res_cashflow.get('mape_pct', 0.0):.2f}%)")
    print(f"    Risk analysis        {symbol_cf}")
    print(f"    STATUS: {res_cashflow.get('status', 'FAIL')}\n")

    print("=" * 80)
    if all_ok:
        print(" FINAL STATUS: ALL MODELS PASS")
    else:
        print(" FINAL STATUS: FAIL — ONE OR MORE MODELS FAILED VALIDATION")
    print("=" * 80 + "\n")

    return all_ok


if __name__ == "__main__":
    success = run_global_validation()
    sys.exit(0 if success else 1)
