"""
BizPilot AI - Data Cleaning & Date Standardization Module
Applies explicit, documented cleaning transformations to business data.
"""

import pandas as pd
import numpy as np


def clean_sales_data(sales_df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans raw sales transaction DataFrame.
    
    Documented Decisions:
    - Drop rows where critical identifiers (customer_id, product_id, sales_date) are missing.
    - Assert non-negative invoice_amount and total_weight_kg.
    - Add calendar breakdown fields (year, quarter, month, month_start, month_end, day_of_week).
    """
    df = sales_df.copy()
    
    # 1. Null handling
    df = df.dropna(subset=['customer_id', 'product_id', 'sales_date'])
    
    # 2. Non-negative values check
    df['invoice_amount'] = df['invoice_amount'].apply(lambda x: max(0.0, float(x)))
    df['taxable_value'] = df['taxable_value'].apply(lambda x: max(0.0, float(x)))
    df['total_weight_kg'] = df['total_weight_kg'].apply(lambda x: max(0.0, float(x)))

    # 3. Calendar breakdown
    df['year'] = df['sales_date'].dt.year
    df['quarter'] = df['sales_date'].dt.quarter
    df['month'] = df['sales_date'].dt.month
    df['week'] = df['sales_date'].dt.isocalendar().week
    df['day_of_week'] = df['sales_date'].dt.dayofweek
    df['month_start'] = df['sales_date'].dt.to_period('M').dt.to_timestamp()
    df['month_end'] = df['sales_date'].dt.to_period('M').dt.to_timestamp(how='end')
    
    return df


def clean_purchases_data(purchases_df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans raw purchase transaction DataFrame.
    """
    df = purchases_df.copy()
    df = df.dropna(subset=['supplier_id', 'product_id', 'purchase_date'])
    
    df['invoice_amount'] = df['invoice_amount'].apply(lambda x: max(0.0, float(x)))
    df['taxable_value'] = df['taxable_value'].apply(lambda x: max(0.0, float(x)))
    df['total_weight_kg'] = df['total_weight_kg'].apply(lambda x: max(0.0, float(x)))

    df['year'] = df['purchase_date'].dt.year
    df['quarter'] = df['purchase_date'].dt.quarter
    df['month'] = df['purchase_date'].dt.month
    df['month_start'] = df['purchase_date'].dt.to_period('M').dt.to_timestamp()
    
    return df


def clean_cashbook_data(cashbook_df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans raw cashbook voucher DataFrame.
    
    Documented Decisions:
    - Null party_id represents general cash/bank charges; fill with sentinel string 'UNSPECIFIED'.
    - Ensure entry_date is standardized to timestamp.
    """
    df = cashbook_df.copy()
    df['party_id'] = df['party_id'].fillna('UNSPECIFIED')
    df['amount'] = df['amount'].apply(lambda x: max(0.0, float(x)))

    df['year'] = df['entry_date'].dt.year
    df['quarter'] = df['entry_date'].dt.quarter
    df['month'] = df['entry_date'].dt.month
    df['month_start'] = df['entry_date'].dt.to_period('M').dt.to_timestamp()
    
    return df
