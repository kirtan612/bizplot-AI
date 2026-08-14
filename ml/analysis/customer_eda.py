"""
BizPilot AI - Customer Retention Exploratory Data Analysis (EDA) Module
Generates statistical distribution insights, correlations, and visual EDA charts.
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


def run_customer_eda(customer_retention_df: pd.DataFrame) -> dict:
    """
    Executes EDA on customer retention dataset and exports plots.
    """
    df = customer_retention_df.copy()
    
    total_customers = len(df)
    repeat_customers = len(df[df['total_orders'] > 1])
    churned_customers = len(df[df['churned'] == 1])
    churn_rate_pct = round((churned_customers / total_customers * 100), 2) if total_customers > 0 else 0.0

    mean_spend = float(df['total_spend'].mean())
    median_spend = float(df['total_spend'].median())
    mean_recency = float(df['days_since_last_purchase'].mean())
    median_recency = float(df['days_since_last_purchase'].median())

    # Generate EDA Figures
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle("BizPilot AI — Customer Retention & Purchasing EDA", fontsize=14, fontweight='bold')

    # 1. Recency Distribution (Days Since Last Purchase)
    sns.histplot(df['days_since_last_purchase'], kde=True, ax=axes[0, 0], color='purple', bins=20)
    axes[0, 0].set_title("Customer Recency Distribution (Days)")
    axes[0, 0].set_xlabel("Days Since Last Purchase")

    # 2. Total Spend Distribution (Monetary Value)
    sns.histplot(df['total_spend'] / 1e5, kde=True, ax=axes[0, 1], color='teal', bins=20)
    axes[0, 1].set_title("Customer Total Spend Distribution (₹ Lakhs)")
    axes[0, 1].set_xlabel("Total Spend (₹ Lakhs)")

    # 3. Total Orders vs Total Spend
    sns.scatterplot(data=df, x='total_orders', y=df['total_spend'] / 1e5, hue='churned', palette={0: 'green', 1: 'red'}, ax=axes[1, 0], s=70)
    axes[1, 0].set_title("Orders vs Total Spend (Color = Churn Status)")
    axes[1, 0].set_xlabel("Total Orders")
    axes[1, 0].set_ylabel("Total Spend (₹ Lakhs)")

    # 4. Churn Target Distribution
    sns.countplot(data=df, x='churned', hue='churned', palette=['skyblue', 'salmon'], ax=axes[1, 1], legend=False)
    axes[1, 1].set_title(f"Target Distribution: Active (0) vs Churned (1) [Rate: {churn_rate_pct}%]")
    axes[1, 1].set_xticklabels(['Active (0)', 'Churned (1)'])

    plt.tight_layout()
    plot_path = os.path.join(PLOTS_DIR, "customer_retention_eda.png")
    plt.savefig(plot_path, dpi=200)
    plt.close()

    findings = {
        "total_customers": total_customers,
        "repeat_customers": repeat_customers,
        "repeat_customer_pct": round((repeat_customers / total_customers * 100), 2) if total_customers > 0 else 0.0,
        "churned_customers": churned_customers,
        "churn_rate_pct": churn_rate_pct,
        "mean_spend_inr": round(mean_spend, 2),
        "median_spend_inr": round(median_spend, 2),
        "mean_recency_days": round(mean_recency, 1),
        "median_recency_days": round(median_recency, 1),
        "plot_saved_to": plot_path,
    }
    return findings
