"""
Unit & Integration Tests for BizPilot AI ML Data Engineering Pipeline.
"""

import os
import sys
import pytest
import pandas as pd

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.data.extract import extract_all_raw_data
from ml.preprocessing.cleaning import clean_sales_data, clean_purchases_data, clean_cashbook_data
from ml.preprocessing.transformations import check_data_leakage
from ml.features.customer_features import build_customer_retention_dataset
from ml.features.financial_features import build_financial_forecasting_dataset
from ml.features.cashflow_features import build_cashflow_forecasting_dataset

TARGET_COMPANY_ID = "6289d24b-b8c8-4dc2-9105-f6399d1302c1"


def test_data_extraction():
    raw_data = extract_all_raw_data(TARGET_COMPANY_ID)
    assert "customers" in raw_data
    assert "sales" in raw_data
    assert "purchases" in raw_data
    assert "cashbook" in raw_data
    assert len(raw_data["customers"]) == 50
    assert len(raw_data["sales"]) == 5559


def test_customer_retention_feature_generation():
    raw_data = extract_all_raw_data(TARGET_COMPANY_ID)
    cleaned_sales = clean_sales_data(raw_data["sales"])
    cust_df, meta = build_customer_retention_dataset(raw_data["customers"], cleaned_sales)
    
    assert len(cust_df) == 50
    assert "churned" in cust_df.columns
    assert "days_since_last_purchase" in cust_df.columns
    assert "total_spend" in cust_df.columns
    assert "average_order_value" in cust_df.columns


def test_financial_forecasting_feature_generation():
    raw_data = extract_all_raw_data(TARGET_COMPANY_ID)
    cleaned_sales = clean_sales_data(raw_data["sales"])
    cleaned_purchases = clean_purchases_data(raw_data["purchases"])
    cleaned_cashbook = clean_cashbook_data(raw_data["cashbook"])
    
    fin_df = build_financial_forecasting_dataset(cleaned_sales, cleaned_purchases, cleaned_cashbook, raw_data["inventory"])
    
    assert len(fin_df) > 0
    assert "revenue" in fin_df.columns
    assert "cogs" in fin_df.columns
    assert "gross_profit" in fin_df.columns
    assert "net_profit" in fin_df.columns
    assert "target_future_profit_next_month" in fin_df.columns


def test_cashflow_forecasting_feature_generation():
    raw_data = extract_all_raw_data(TARGET_COMPANY_ID)
    cleaned_sales = clean_sales_data(raw_data["sales"])
    cleaned_purchases = clean_purchases_data(raw_data["purchases"])
    cleaned_cashbook = clean_cashbook_data(raw_data["cashbook"])
    
    cf_df = build_cashflow_forecasting_dataset(cleaned_cashbook, cleaned_sales, cleaned_purchases)
    
    assert len(cf_df) > 0
    assert "cash_inflow" in cf_df.columns
    assert "cash_outflow" in cf_df.columns
    assert "net_cashflow" in cf_df.columns
    assert "closing_balance" in cf_df.columns
    assert "target_future_closing_cash_next_month" in cf_df.columns


def test_data_leakage_audit():
    raw_data = extract_all_raw_data(TARGET_COMPANY_ID)
    cleaned_sales = clean_sales_data(raw_data["sales"])
    cust_df, meta = build_customer_retention_dataset(raw_data["customers"], cleaned_sales)
    
    feature_cols = [c for c in cust_df.columns if c not in ["customer_id", "company_id", "churned", "first_purchase_date", "last_purchase_date"]]
    audit_results = check_data_leakage(cust_df, feature_cols, "churned")
    
    # Assert every feature passed anti-leakage audit
    assert all(audit_results.values())
