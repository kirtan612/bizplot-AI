"""
BizPilot AI - Financial Forecasting Feature Engineering Module
Builds monthly financial series, profit drivers, lags, and rolling metrics.
"""

import pandas as pd
import numpy as np
from ml.preprocessing.transformations import add_time_lags_and_rolling


def build_financial_forecasting_dataset(
    sales_df: pd.DataFrame, 
    purchases_df: pd.DataFrame, 
    cashbook_df: pd.DataFrame,
    inventory_df: pd.DataFrame
) -> pd.DataFrame:
    """
    Builds monthly financial performance dataset with profit drivers and temporal lag features.
    """
    # 1. Monthly Revenue & Volume from Sales
    sales_monthly = sales_df.groupby('month_start').agg(
        revenue=('invoice_amount', 'sum'),
        sales_taxable_value=('taxable_value', 'sum'),
        sales_weight_kg=('total_weight_kg', 'sum'),
        sales_order_count=('invoice_number', 'nunique'),
        active_customer_count=('customer_id', 'nunique')
    ).reset_index()

    # 2. Monthly Purchases & Purchasing Cost
    purchases_monthly = purchases_df.groupby('month_start').agg(
        purchase_cost=('invoice_amount', 'sum'),
        purchases_taxable_value=('taxable_value', 'sum'),
        purchases_weight_kg=('total_weight_kg', 'sum'),
        purchases_order_count=('invoice_number', 'nunique')
    ).reset_index()

    # 3. Monthly Operating Expenses from Cashbook Payment Vouchers
    cashbook_payments = cashbook_df[cashbook_df['transaction_type'] == 'Payment']
    cashbook_monthly = cashbook_payments.groupby('month_start').agg(
        operating_expenses=('amount', 'sum'),
        cash_outflow_count=('entry_id', 'count')
    ).reset_index()

    # Merge monthly aggregations on month_start
    fin_df = pd.merge(sales_monthly, purchases_monthly, on='month_start', how='outer')
    fin_df = pd.merge(fin_df, cashbook_monthly, on='month_start', how='outer')
    fin_df = fin_df.sort_values(by='month_start').fillna(0.0)

    # Calculate COGS & Profit metrics
    # COGS = Estimated cost of sales based on purchase cost per kg or weighted cost
    fin_df['avg_purchase_unit_cost'] = np.where(
        fin_df['purchases_weight_kg'] > 0,
        fin_df['purchases_taxable_value'] / fin_df['purchases_weight_kg'],
        60.0 # Default benchmark
    )
    
    fin_df['cogs'] = (fin_df['sales_weight_kg'] * fin_df['avg_purchase_unit_cost']).round(2)
    fin_df['gross_profit'] = (fin_df['revenue'] - fin_df['cogs']).round(2)
    fin_df['gross_margin_pct'] = np.where(
        fin_df['revenue'] > 0,
        ((fin_df['gross_profit'] / fin_df['revenue']) * 100).round(2),
        0.0
    )
    fin_df['operating_profit'] = (fin_df['gross_profit'] - fin_df['operating_expenses']).round(2)
    fin_df['net_profit'] = fin_df['operating_profit'] # Base operating net profit

    # MoM Growth Rates
    fin_df['revenue_growth_pct'] = fin_df['revenue'].pct_change().fillna(0.0).round(4) * 100
    fin_df['cogs_growth_pct'] = fin_df['cogs'].pct_change().fillna(0.0).round(4) * 100
    fin_df['profit_growth_pct'] = fin_df['net_profit'].pct_change().fillna(0.0).round(4) * 100

    # Lags & Rolling Features for Revenue & Net Profit
    fin_df = add_time_lags_and_rolling(
        fin_df, 
        group_col=None, 
        value_cols=['revenue', 'cogs', 'operating_expenses', 'net_profit'], 
        time_col='month_start',
        lags=[1, 2, 3],
        windows=[3, 6]
    )

    # Future Profit Target (Target for Next Month: t+1)
    fin_df['target_future_profit_next_month'] = fin_df['net_profit'].shift(-1)

    return fin_df
