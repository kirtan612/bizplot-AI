"""
BizPilot AI - Customer Retention Feature Engineering Module
Builds customer-level analytical features and calculates data-driven churn target definitions.
"""

import pandas as pd
import numpy as np


def build_customer_retention_dataset(
    customers_df: pd.DataFrame, 
    sales_df: pd.DataFrame,
    anchor_date: pd.Timestamp = None
) -> tuple[pd.DataFrame, dict]:
    """
    Builds customer-level feature dataset and defines data-driven churn target.
    """
    if anchor_date is None:
        anchor_date = sales_df['sales_date'].max()

    # Sort sales by customer and date
    sales_sorted = sales_df.sort_values(by=['customer_id', 'sales_date'])

    # Calculate days between consecutive orders per customer
    sales_sorted['prev_order_date'] = sales_sorted.groupby('customer_id')['sales_date'].shift(1)
    sales_sorted['days_since_prev_order'] = (sales_sorted['sales_date'] - sales_sorted['prev_order_date']).dt.days

    # Customer interval distribution (P50, P75, P90) across all repeat orders
    valid_gaps = sales_sorted['days_since_prev_order'].dropna()
    p50_gap = float(valid_gaps.quantile(0.50)) if len(valid_gaps) > 0 else 30.0
    p75_gap = float(valid_gaps.quantile(0.75)) if len(valid_gaps) > 0 else 45.0
    p90_gap = float(valid_gaps.quantile(0.90)) if len(valid_gaps) > 0 else 60.0

    # Aggregate sales metrics per customer
    customer_agg = sales_sorted.groupby('customer_id').agg(
        first_purchase_date=('sales_date', 'min'),
        last_purchase_date=('sales_date', 'max'),
        total_orders=('sales_id', 'nunique'),
        total_spend=('invoice_amount', 'sum'),
        total_weight_kg=('total_weight_kg', 'sum'),
        unique_products=('product_id', 'nunique'),
        mean_days_between_orders=('days_since_prev_order', 'mean')
    ).reset_index()

    customer_agg['average_order_value'] = (customer_agg['total_spend'] / customer_agg['total_orders']).round(2)
    customer_agg['mean_days_between_orders'] = customer_agg['mean_days_between_orders'].fillna(5.0).round(1)

    # Days since last purchase (Recency)
    customer_agg['days_since_last_purchase'] = (anchor_date - customer_agg['last_purchase_date']).dt.days

    # Lifetime in months
    customer_agg['customer_lifetime_months'] = (
        (customer_agg['last_purchase_date'] - customer_agg['first_purchase_date']).dt.days / 30.44
    ).round(1)

    # Purchase frequency per month
    customer_agg['purchase_frequency_per_month'] = np.where(
        customer_agg['customer_lifetime_months'] > 0,
        (customer_agg['total_orders'] / customer_agg['customer_lifetime_months']).round(2),
        customer_agg['total_orders']
    )

    # Churn threshold: Account recency > 1.5 * customer's mean_days_between_orders (min 14 days)
    customer_agg['churn_threshold_days'] = customer_agg['mean_days_between_orders'].apply(lambda g: max(14.0, float(np.round(1.5 * g))))
    
    print(f"--- CUSTOMER PURCHASE INTERVAL ANALYSIS ---")
    print(f"  P50 Gap: {p50_gap:.1f} days | P75 Gap: {p75_gap:.1f} days | P90 Gap: {p90_gap:.1f} days")
    print(f"  Dynamic Churn Threshold (1.5x customer mean gap, min 14 days)")

    # Merge customer master data
    merged = pd.merge(customers_df, customer_agg, on='customer_id', how='left')

    # Fill non-purchasing customers
    merged['total_orders'] = merged['total_orders'].fillna(0).astype(int)
    merged['total_spend'] = merged['total_spend'].fillna(0.0)
    merged['total_weight_kg'] = merged['total_weight_kg'].fillna(0.0)
    merged['average_order_value'] = merged['average_order_value'].fillna(0.0)
    merged['unique_products'] = merged['unique_products'].fillna(0).astype(int)
    merged['days_since_last_purchase'] = merged['days_since_last_purchase'].fillna(999).astype(int)
    merged['mean_days_between_orders'] = merged['mean_days_between_orders'].fillna(0.0)
    merged['purchase_frequency_per_month'] = merged['purchase_frequency_per_month'].fillna(0.0)
    merged['churn_threshold_days'] = merged['churn_threshold_days'].fillna(14.0)

    # Define binary churn target
    merged['churned'] = (merged['days_since_last_purchase'] > merged['churn_threshold_days']).astype(int)

    return merged, {
        "p50_gap_days": p50_gap,
        "p75_gap_days": p75_gap,
        "p90_gap_days": p90_gap,
        "churn_threshold_strategy": "1.5x mean purchase gap (min 14 days)",
        "anchor_date": str(anchor_date)
    }
