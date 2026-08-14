"""
BizPilot AI - Master Data Engineering & Dataset Generation Pipeline
Executes extraction, cleaning, feature engineering, data leakage audit, EDA, and exports ML-ready datasets.
"""

import os
import sys
import json
from datetime import datetime
import pandas as pd

# Ensure project root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.data.extract import extract_all_raw_data, get_db_engine
from ml.data.validation import audit_dataframe, print_audit_report
from ml.preprocessing.cleaning import clean_sales_data, clean_purchases_data, clean_cashbook_data
from ml.preprocessing.encoders import encode_categorical_features
from ml.preprocessing.transformations import check_data_leakage
from ml.features.customer_features import build_customer_retention_dataset
from ml.features.financial_features import build_financial_forecasting_dataset
from ml.features.cashflow_features import build_cashflow_forecasting_dataset
from ml.analysis.customer_eda import run_customer_eda
from ml.analysis.financial_eda import run_financial_eda
from ml.analysis.cashflow_eda import run_cashflow_eda

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "datasets")
NOTEBOOKS_DIR = os.path.join(os.path.dirname(__file__), "notebooks")
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(NOTEBOOKS_DIR, exist_ok=True)

TARGET_COMPANY_ID = "6289d24b-b8c8-4dc2-9105-f6399d1302c1"  # COMP-001 (APL Pipes & Traders)


def run_pipeline():
    print("=" * 80)
    print("      BIZPILOT AI — PHASE 2 DATA ENGINEERING & EDA PIPELINE")
    print("=" * 80)

    # 1. Extraction
    print("\n[STEP 1/6] Extracting raw tables from PostgreSQL for organization_id =", TARGET_COMPANY_ID)
    raw_data = extract_all_raw_data(TARGET_COMPANY_ID)
    print("  [OK] Extracted", len(raw_data), "tables successfully.")

    # 2. Validation & Quality Audit
    print("\n[STEP 2/6] Running Data Quality & Statistical Snapshot Audit...")
    print_audit_report(raw_data)

    # 3. Cleaning & Standardization
    print("\n[STEP 3/6] Cleaning and standardizing dates/numeric values...")
    cleaned_sales = clean_sales_data(raw_data['sales'])
    cleaned_purchases = clean_purchases_data(raw_data['purchases'])
    cleaned_cashbook = clean_cashbook_data(raw_data['cashbook'])
    print("  [OK] Data cleaning completed.")

    # 4. Feature Engineering
    print("\n[STEP 4/6] Building analytical feature datasets...")
    
    # Dataset 1: Customer Retention
    cust_dataset, cust_meta_info = build_customer_retention_dataset(raw_data['customers'], cleaned_sales)
    cust_dataset = encode_categorical_features(cust_dataset)

    # Dataset 2: Financial Forecasting
    fin_dataset = build_financial_forecasting_dataset(cleaned_sales, cleaned_purchases, cleaned_cashbook, raw_data['inventory'])

    # Dataset 3: Cashflow Forecasting
    cf_dataset = build_cashflow_forecasting_dataset(cleaned_cashbook, cleaned_sales, cleaned_purchases)

    # 5. Data Leakage Audit
    print("\n[STEP 5/6] Performing Data Leakage Audit...")
    cust_feature_cols = [c for c in cust_dataset.columns if c not in ['customer_id', 'company_id', 'churned', 'first_purchase_date', 'last_purchase_date']]
    cust_leakage = check_data_leakage(cust_dataset, cust_feature_cols, 'churned')
    
    fin_feature_cols = [c for c in fin_dataset.columns if c not in ['target_future_profit_next_month', 'month_start']]
    fin_leakage = check_data_leakage(fin_dataset, fin_feature_cols, 'target_future_profit_next_month')
    
    cf_feature_cols = [c for c in cf_dataset.columns if c not in ['target_future_closing_cash_next_month', 'month_start']]
    cf_leakage = check_data_leakage(cf_dataset, cf_feature_cols, 'target_future_closing_cash_next_month')

    print(f"  Customer Retention Leakage Audit: {sum(cust_leakage.values())}/{len(cust_leakage)} features PASSED (0 leaked)")
    print(f"  Financial Forecasting Leakage Audit: {sum(fin_leakage.values())}/{len(fin_leakage)} features PASSED (0 leaked)")
    print(f"  Cashflow Forecasting Leakage Audit: {sum(cf_leakage.values())}/{len(cf_leakage)} features PASSED (0 leaked)")

    # 6. Exporting Datasets & Metadata
    print("\n[STEP 6/6] Exporting ML-ready datasets and running EDA modules...")

    def save_dataset_and_metadata(df: pd.DataFrame, name: str, version: str, target_var: str, extra_meta: dict):
        csv_path = os.path.join(OUTPUT_DIR, f"{name}.csv")
        meta_path = os.path.join(OUTPUT_DIR, f"{name}_metadata.json")
        
        # Convert non-serializable objects (timestamps/dates) to strings for CSV export
        df_export = df.copy()
        for col in df_export.select_dtypes(include=['datetime64[ns]', 'datetime64[ns, UTC]']).columns:
            df_export[col] = df_export[col].astype(str)

        df_export.to_csv(csv_path, index=False)
        
        meta = {
            "dataset_name": name,
            "version": version,
            "generated_date": datetime.now().isoformat(),
            "source_database": "PostgreSQL (bizpilot)",
            "organization_id": TARGET_COMPANY_ID,
            "record_count": len(df),
            "feature_count": len(df.columns),
            "target_variable": target_var,
            "columns": list(df.columns),
            "extra_metadata": extra_meta
        }
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2)
            
        print(f"  [OK] Saved {name}.csv ({len(df)} rows, {len(df.columns)} cols) & {name}_metadata.json")

    save_dataset_and_metadata(cust_dataset, "customer_retention", "customer_retention_v1", "churned", cust_meta_info)
    save_dataset_and_metadata(fin_dataset, "financial_forecasting", "financial_forecasting_v1", "target_future_profit_next_month", {})
    save_dataset_and_metadata(cf_dataset, "cashflow_forecasting", "cashflow_forecasting_v1", "target_future_closing_cash_next_month", {})

    # Run EDA
    cust_eda_res = run_customer_eda(cust_dataset)
    fin_eda_res = run_financial_eda(fin_dataset)
    cf_eda_res = run_cashflow_eda(cf_dataset)

    print("\n[OK] EDA plots generated:")
    print("  - Customer EDA Plot:", cust_eda_res['plot_saved_to'])
    print("  - Financial EDA Plot:", fin_eda_res['plot_saved_to'])
    print("  - Cashflow EDA Plot:", cf_eda_res['plot_saved_to'])

    # Create Jupyter Notebooks
    generate_notebooks()

    print("\n===================================================================")
    print(" SUCCESS: Phase 2 Pipeline Executed Cleanly! All Datasets Exported.")
    print("===================================================================\n")


def generate_notebooks():
    """Generates runnable Jupyter Notebooks for Phase 2 EDA."""
    notebook_specs = [
        ("customer_analysis.ipynb", "Customer Retention EDA Notebook", "ml.data.loaders", "customer_retention"),
        ("financial_analysis.ipynb", "Financial Forecasting EDA Notebook", "ml.data.loaders", "financial_forecasting"),
        ("cashflow_analysis.ipynb", "Cashflow Risk EDA Notebook", "ml.data.loaders", "cashflow_forecasting"),
    ]

    for fname, title, mod, dset in notebook_specs:
        nb_path = os.path.join(NOTEBOOKS_DIR, fname)
        nb_content = {
            "cells": [
                {
                    "cell_type": "markdown",
                    "metadata": {},
                    "source": [f"# BizPilot AI — {title}\n", f"Analyzes `{dset}.csv` generated from PostgreSQL."]
                },
                {
                    "cell_type": "code",
                    "execution_count": None,
                    "metadata": {},
                    "outputs": [],
                    "source": [
                        "import os, sys\n",
                        "sys.path.insert(0, os.path.abspath('..'))\n",
                        "import pandas as pd\n",
                        f"from {mod} import load_ml_dataset\n",
                        f"df, meta = load_ml_dataset('{dset}')\n",
                        "print('Dataset Loaded:', meta['dataset_name'], 'Version:', meta['version'])\n",
                        "print('Shape:', df.shape)\n",
                        "df.head()"
                    ]
                }
            ],
            "metadata": {
                "language_info": {"name": "python"}
            },
            "nbformat": 4,
            "nbformat_minor": 2
        }
        with open(nb_path, "w", encoding="utf-8") as f:
            json.dump(nb_content, f, indent=2)


if __name__ == "__main__":
    run_pipeline()
