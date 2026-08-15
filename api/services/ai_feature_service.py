"""
BizPilot AI - Feature Consistency & Extraction Service.

Reuses exact Phase 2 / Phase 3 feature generation pipelines to prevent training-serving skew.
Extracts live multi-tenant business data from PostgreSQL for company_id and prepares
model-input feature vectors matching Phase 3 definitions.
"""

import os
from uuid import UUID
from typing import Tuple, Dict, Any, Optional
import pandas as pd
import numpy as np

from ml.data.extract import (
    extract_customers, extract_sales, extract_purchases, 
    extract_cashbook, extract_inventory_snapshots as extract_inventory
)
from ml.preprocessing.cleaning import (
    clean_sales_data, clean_purchases_data, clean_cashbook_data
)
from ml.preprocessing.encoders import encode_categorical_features
from ml.features.customer_features import build_customer_retention_dataset
from ml.features.financial_features import build_financial_forecasting_dataset
from ml.features.cashflow_features import build_cashflow_forecasting_dataset


def generate_customer_retention_features(company_id: UUID) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Extracts raw customer and sales data for company_id, cleans dates/fields,
    and runs build_customer_retention_dataset & encode_customer_categoricals.

    Returns:
        (raw_merged_df, encoded_feature_matrix_df)
    """
    company_id_str = str(company_id)
    customers_df = extract_customers(company_id_str)
    sales_df = extract_sales(company_id_str)

    if customers_df.empty or sales_df.empty:
        return pd.DataFrame(), pd.DataFrame()

    sales_df = clean_sales_data(sales_df)
    cust_features_df, _ = build_customer_retention_dataset(customers_df, sales_df)
    encoded_df = encode_categorical_features(cust_features_df)

    return cust_features_df, encoded_df


def generate_financial_forecasting_features(company_id: UUID) -> pd.DataFrame:
    """
    Extracts sales, purchases, cashbook, inventory data for company_id,
    and builds monthly financial performance dataset with lag/rolling features.
    """
    company_id_str = str(company_id)
    sales_df = extract_sales(company_id_str)
    purchases_df = extract_purchases(company_id_str)
    cashbook_df = extract_cashbook(company_id_str)
    inventory_df = extract_inventory(company_id_str)

    if sales_df.empty:
        return pd.DataFrame()

    sales_df = clean_sales_data(sales_df)
    purchases_df = clean_purchases_data(purchases_df)
    cashbook_df = clean_cashbook_data(cashbook_df)

    fin_df = build_financial_forecasting_dataset(
        sales_df=sales_df,
        purchases_df=purchases_df,
        cashbook_df=cashbook_df,
        inventory_df=inventory_df
    )
    return fin_df


def generate_cashflow_forecasting_features(company_id: UUID) -> pd.DataFrame:
    """
    Extracts cashbook, sales, purchases data for company_id,
    and builds monthly cashflow series with liquidity, burn rate, and lag features.
    """
    company_id_str = str(company_id)
    cashbook_df = extract_cashbook(company_id_str)
    sales_df = extract_sales(company_id_str)
    purchases_df = extract_purchases(company_id_str)

    if cashbook_df.empty:
        return pd.DataFrame()

    cashbook_df = clean_cashbook_data(cashbook_df)
    sales_df = clean_sales_data(sales_df)
    purchases_df = clean_purchases_data(purchases_df)

    cf_df = build_cashflow_forecasting_dataset(
        cashbook_df=cashbook_df,
        sales_df=sales_df,
        purchases_df=purchases_df
    )
    return cf_df
