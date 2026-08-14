"""
BizPilot AI - Cashflow Risk & Forecasting Feature Engineering Module
Builds monthly cashflow series, liquidity metrics, burn rate, volatility, and lags.
"""

import pandas as pd
import numpy as np
from ml.preprocessing.transformations import add_time_lags_and_rolling


def build_cashflow_forecasting_dataset(
    cashbook_df: pd.DataFrame, 
    sales_df: pd.DataFrame, 
    purchases_df: pd.DataFrame
) -> pd.DataFrame:
    """
    Builds monthly cashflow performance dataset with liquidity features and temporal lags.
    """
    # 1. Cash Inflows (Receipts) & Outflows (Payments) per month
    inflows = cashbook_df[cashbook_df['transaction_type'] == 'Receipt'].groupby('month_start')['amount'].sum().reset_index().rename(columns={'amount': 'cash_inflow'})
    outflows = cashbook_df[cashbook_df['transaction_type'] == 'Payment'].groupby('month_start')['amount'].sum().reset_index().rename(columns={'amount': 'cash_outflow'})

    # 2. Opening & Closing Cash Balance per month
    opening_balances = cashbook_df.sort_values(by=['entry_date', 'created_at']).groupby('month_start')['opening_balance'].first().reset_index()
    closing_balances = cashbook_df.sort_values(by=['entry_date', 'created_at']).groupby('month_start')['closing_balance'].last().reset_index()

    # Merge cashbook monthly metrics
    cf_df = pd.merge(inflows, outflows, on='month_start', how='outer')
    cf_df = pd.merge(cf_df, opening_balances, on='month_start', how='outer')
    cf_df = pd.merge(cf_df, closing_balances, on='month_start', how='outer')
    cf_df = cf_df.sort_values(by='month_start').fillna(0.0)

    cf_df['net_cashflow'] = (cf_df['cash_inflow'] - cf_df['cash_outflow']).round(2)

    # 3. Monthly Accounts Receivable (Pending Sales Invoices) & Accounts Payable (Pending Purchase Bills)
    ar_monthly = sales_df[sales_df['payment_status'].isin(['Pending', 'Overdue'])].groupby('month_start')['invoice_amount'].sum().reset_index().rename(columns={'invoice_amount': 'accounts_receivable'})
    ap_monthly = purchases_df[purchases_df['payment_status'].isin(['Pending', 'Overdue'])].groupby('month_start')['invoice_amount'].sum().reset_index().rename(columns={'invoice_amount': 'accounts_payable'})

    cf_df = pd.merge(cf_df, ar_monthly, on='month_start', how='left').fillna(0.0)
    cf_df = pd.merge(cf_df, ap_monthly, on='month_start', how='left').fillna(0.0)

    # Liquidity & Volatility Features
    cf_df['burn_rate_monthly'] = cf_df['cash_outflow'].round(2)
    cf_df['runway_months'] = np.where(
        cf_df['burn_rate_monthly'] > 0,
        (cf_df['closing_balance'] / cf_df['burn_rate_monthly']).round(2),
        99.0
    )

    # Lags & Rolling Features for Cash Inflow, Outflow, Net Cashflow, Closing Balance
    cf_df = add_time_lags_and_rolling(
        cf_df,
        group_col=None,
        value_cols=['cash_inflow', 'cash_outflow', 'net_cashflow', 'closing_balance'],
        time_col='month_start',
        lags=[1, 2, 3],
        windows=[3, 6]
    )

    # Future Cash Target (Target Closing Cash for Next Month: t+1)
    cf_df['target_future_closing_cash_next_month'] = cf_df['closing_balance'].shift(-1)

    return cf_df
