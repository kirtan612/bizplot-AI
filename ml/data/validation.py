"""
BizPilot AI - Data Validation & Quality Audit Module
Validates datasets, checks schema, detects missing values, duplicates, and outliers.
"""

from typing import Dict, Any, List
import pandas as pd
import numpy as np


def audit_dataframe(df: pd.DataFrame, name: str) -> Dict[str, Any]:
    """Generates comprehensive quality report for a pandas DataFrame."""
    total_rows = len(df)
    total_cols = len(df.columns)
    null_summary = df.isnull().sum()
    null_fields = null_summary[null_summary > 0].to_dict()
    
    dup_count = df.duplicated().sum()
    
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    outliers_iqr = {}
    
    for col in numeric_cols:
        q1 = df[col].quantile(0.25)
        q3 = df[col].quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        outlier_mask = (df[col] < lower_bound) | (df[col] > upper_bound)
        count_outliers = outlier_mask.sum()
        if count_outliers > 0:
            outliers_iqr[col] = {
                "count": int(count_outliers),
                "pct": round(float(count_outliers / total_rows * 100), 2) if total_rows > 0 else 0.0,
                "lower_bound": float(lower_bound),
                "upper_bound": float(upper_bound),
                "min": float(df[col].min()),
                "max": float(df[col].max()),
            }

    date_cols = df.select_dtypes(include=['datetime64[ns]', 'datetime64[ns, UTC]']).columns.tolist()
    date_ranges = {}
    for col in date_cols:
        date_ranges[col] = {
            "min": str(df[col].min()),
            "max": str(df[col].max()),
        }

    return {
        "dataset_name": name,
        "total_rows": total_rows,
        "total_columns": total_cols,
        "columns": list(df.columns),
        "null_counts": {k: int(v) for k, v in null_fields.items()},
        "duplicate_rows": int(dup_count),
        "date_ranges": date_ranges,
        "outliers": outliers_iqr,
    }


def print_audit_report(raw_data: Dict[str, pd.DataFrame]):
    """Prints formatted Data Quality Report for all raw data tables."""
    print("=" * 80)
    print("                RAW DATASET QUALITY & STATISTICAL SNAPSHOT")
    print("=" * 80)
    
    for name, df in raw_data.items():
        res = audit_dataframe(df, name)
        print(f"\n>>> Table: {name.upper()} ({res['total_rows']} rows, {res['total_columns']} cols)")
        if res['date_ranges']:
            for dcol, drange in res['date_ranges'].items():
                print(f"    Date Range [{dcol}]: {drange['min']} to {drange['max']}")
        if res['null_counts']:
            print(f"    Missing Values: {res['null_counts']}")
        else:
            print("    Missing Values: None (0 nulls)")
        print(f"    Duplicates: {res['duplicate_rows']}")
        if res['outliers']:
            print(f"    Outliers Detected (IQR 1.5x): {list(res['outliers'].keys())}")
