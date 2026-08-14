"""
BizPilot AI - Cashflow Risk Exploratory Data Analysis (EDA) Module
Generates cash inflow, outflow, net cashflow, closing cash balance, and deficit period insights.
"""

import os
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

PLOTS_DIR = os.path.join(os.path.dirname(__file__), "plots")
os.makedirs(PLOTS_DIR, exist_ok=True)


def run_cashflow_eda(cashflow_df: pd.DataFrame) -> dict:
    """
    Executes EDA on monthly cashflow forecasting dataset and exports plots.
    """
    df = cashflow_df.copy()
    if 'month_start' in df.columns:
        df['month_str'] = pd.to_datetime(df['month_start']).dt.strftime('%Y-%m')
    else:
        df['month_str'] = df.index.astype(str)

    total_months = len(df)
    total_inflow = float(df['cash_inflow'].sum())
    total_outflow = float(df['cash_outflow'].sum())
    net_total_cashflow = float(df['net_cashflow'].sum())
    min_closing_cash = float(df['closing_balance'].min())
    max_closing_cash = float(df['closing_balance'].max())
    
    # Identify deficit months (Inflow < Outflow)
    deficit_df = df[df['net_cashflow'] < 0]
    deficit_months_count = len(deficit_df)

    # Generate EDA Figures
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle("BizPilot AI — Cashflow Volatility & Deficit Risk EDA", fontsize=14, fontweight='bold')

    # 1. Cash Inflows vs Cash Outflows Trend
    axes[0, 0].plot(df['month_str'], df['cash_inflow'] / 1e5, marker='o', label='Cash Inflow (Receipts)', color='green', linewidth=2)
    axes[0, 0].plot(df['month_str'], df['cash_outflow'] / 1e5, marker='s', label='Cash Outflow (Payments)', color='crimson', linewidth=2)
    axes[0, 0].set_title("Monthly Cash Inflows vs Outflows (₹ Lakhs)")
    axes[0, 0].set_xlabel("Month")
    axes[0, 0].set_ylabel("₹ Lakhs")
    axes[0, 0].tick_params(axis='x', rotation=45)
    axes[0, 0].legend()

    # 2. Net Cashflow Bar Chart (Color Coded: Surplus vs Deficit)
    colors = ['seagreen' if val >= 0 else 'coral' for val in df['net_cashflow']]
    axes[0, 1].bar(df['month_str'], df['net_cashflow'] / 1e5, color=colors)
    axes[0, 1].axhline(y=0, color='black', linestyle='--', linewidth=1)
    axes[0, 1].set_title("Net Monthly Cashflow (₹ Lakhs)")
    axes[0, 1].set_xlabel("Month")
    axes[0, 1].set_ylabel("₹ Lakhs")
    axes[0, 1].tick_params(axis='x', rotation=45)

    # 3. Closing Cash Balance & Runway Trend
    axes[1, 0].plot(df['month_str'], df['closing_balance'] / 1e5, marker='D', color='darkblue', linewidth=2.5, label='Closing Cash')
    axes[1, 0].set_title("Closing Cash Balance Trend (₹ Lakhs)")
    axes[1, 0].set_xlabel("Month")
    axes[1, 0].set_ylabel("₹ Lakhs")
    axes[1, 0].tick_params(axis='x', rotation=45)
    axes[1, 0].legend()

    # 4. Accounts Receivable vs Accounts Payable Pending Dues
    if 'accounts_receivable' in df.columns and 'accounts_payable' in df.columns:
        axes[1, 1].plot(df['month_str'], df['accounts_receivable'] / 1e5, marker='o', label='Receivables (Customer Dues)', color='darkcyan', linewidth=2)
        axes[1, 1].plot(df['month_str'], df['accounts_payable'] / 1e5, marker='x', label='Payables (Supplier Dues)', color='darkmagenta', linewidth=2)
        axes[1, 1].set_title("Accounts Receivable vs Accounts Payable (₹ Lakhs)")
        axes[1, 1].set_xlabel("Month")
        axes[1, 1].set_ylabel("₹ Lakhs")
        axes[1, 1].tick_params(axis='x', rotation=45)
        axes[1, 1].legend()

    plt.tight_layout()
    plot_path = os.path.join(PLOTS_DIR, "cashflow_forecasting_eda.png")
    plt.savefig(plot_path, dpi=200)
    plt.close()

    findings = {
        "total_months_analyzed": total_months,
        "total_inflow_inr": round(total_inflow, 2),
        "total_outflow_inr": round(total_outflow, 2),
        "net_total_cashflow_inr": round(net_total_cashflow, 2),
        "min_closing_cash_inr": round(min_closing_cash, 2),
        "max_closing_cash_inr": round(max_closing_cash, 2),
        "deficit_months_count": deficit_months_count,
        "plot_saved_to": plot_path,
    }
    return findings
