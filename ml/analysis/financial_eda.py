"""
BizPilot AI - Financial Profit & Margin Exploratory Data Analysis (EDA) Module
Generates monthly revenue, COGS, OpEx, profit trends, and driver analysis.
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


def run_financial_eda(financial_df: pd.DataFrame) -> dict:
    """
    Executes EDA on monthly financial forecasting dataset and exports plots.
    """
    df = financial_df.copy()
    if 'month_start' in df.columns:
        df['month_str'] = pd.to_datetime(df['month_start']).dt.strftime('%Y-%m')
    else:
        df['month_str'] = df.index.astype(str)

    total_months = len(df)
    total_revenue = float(df['revenue'].sum())
    total_cogs = float(df['cogs'].sum())
    total_opex = float(df['operating_expenses'].sum())
    total_profit = float(df['net_profit'].sum())
    avg_gross_margin = float(df['gross_margin_pct'].mean())

    # Generate EDA Figures
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle("BizPilot AI — Financial Performance & Profit Drivers EDA", fontsize=14, fontweight='bold')

    # 1. Monthly Revenue vs COGS vs Operating Expenses Trend
    axes[0, 0].plot(df['month_str'], df['revenue'] / 1e5, marker='o', label='Revenue', color='green', linewidth=2)
    axes[0, 0].plot(df['month_str'], df['cogs'] / 1e5, marker='s', label='COGS', color='orange', linewidth=2)
    axes[0, 0].plot(df['month_str'], df['operating_expenses'] / 1e5, marker='^', label='OpEx', color='red', linewidth=1.5)
    axes[0, 0].set_title("Monthly Revenue, COGS & OpEx (₹ Lakhs)")
    axes[0, 0].set_xlabel("Month")
    axes[0, 0].set_ylabel("₹ Lakhs")
    axes[0, 0].tick_params(axis='x', rotation=45)
    axes[0, 0].legend()

    # 2. Net Operating Profit Trend
    axes[0, 1].bar(df['month_str'], df['net_profit'] / 1e5, color=['teal' if p >= 0 else 'maroon' for p in df['net_profit']])
    axes[0, 1].set_title("Monthly Net Profit (₹ Lakhs)")
    axes[0, 1].set_xlabel("Month")
    axes[0, 1].set_ylabel("₹ Lakhs")
    axes[0, 1].tick_params(axis='x', rotation=45)

    # 3. Gross Margin Percentage Trend
    axes[1, 0].plot(df['month_str'], df['gross_margin_pct'], marker='d', color='navy', linewidth=2)
    axes[1, 0].axhline(y=avg_gross_margin, color='gray', linestyle='--', label=f'Avg Margin ({avg_gross_margin:.1f}%)')
    axes[1, 0].set_title("Gross Margin (%) Trend")
    axes[1, 0].set_xlabel("Month")
    axes[1, 0].set_ylabel("Margin %")
    axes[1, 0].tick_params(axis='x', rotation=45)
    axes[1, 0].legend()

    # 4. Revenue vs Net Profit Scatter
    sns.regplot(data=df, x=df['revenue'] / 1e5, y=df['net_profit'] / 1e5, ax=axes[1, 1], color='indigo')
    axes[1, 1].set_title("Revenue vs Net Profit Correlation")
    axes[1, 1].set_xlabel("Revenue (₹ Lakhs)")
    axes[1, 1].set_ylabel("Net Profit (₹ Lakhs)")

    plt.tight_layout()
    plot_path = os.path.join(PLOTS_DIR, "financial_forecasting_eda.png")
    plt.savefig(plot_path, dpi=200)
    plt.close()

    findings = {
        "total_months_analyzed": total_months,
        "total_revenue_inr": round(total_revenue, 2),
        "total_cogs_inr": round(total_cogs, 2),
        "total_opex_inr": round(total_opex, 2),
        "total_net_profit_inr": round(total_profit, 2),
        "avg_gross_margin_pct": round(avg_gross_margin, 2),
        "plot_saved_to": plot_path,
    }
    return findings
