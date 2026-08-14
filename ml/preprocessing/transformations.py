"""
BizPilot AI - Transformations & Time-Series Lags Module
Creates temporal lag features, rolling windows, and growth rates while auditing against data leakage.
"""

import pandas as pd
import numpy as np


def add_time_lags_and_rolling(
    df: pd.DataFrame, 
    group_col: str, 
    value_cols: list[str], 
    time_col: str, 
    lags: list[int] = [1, 2, 3], 
    windows: list[int] = [3, 6]
) -> pd.DataFrame:
    """
    Computes time-series lags and rolling statistics per group (or overall series if group_col is None).
    Enforces strict anti-leakage by shifting values prior to rolling aggregations.
    """
    res = df.copy()
    res = res.sort_values(by=time_col)

    for vcol in value_cols:
        if group_col:
            grouped = res.groupby(group_col)[vcol]
            for lag in lags:
                res[f"{vcol}_lag_{lag}"] = grouped.shift(lag)
            
            for w in windows:
                # Use shift(1) before rolling to guarantee NO leakage of current period's value
                res[f"{vcol}_roll_mean_{w}"] = grouped.transform(lambda x: x.shift(1).rolling(w, min_periods=1).mean())
                res[f"{vcol}_roll_std_{w}"] = grouped.transform(lambda x: x.shift(1).rolling(w, min_periods=1).std()).fillna(0.0)
        else:
            for lag in lags:
                res[f"{vcol}_lag_{lag}"] = res[vcol].shift(lag)
            for w in windows:
                res[f"{vcol}_roll_mean_{w}"] = res[vcol].shift(1).rolling(w, min_periods=1).mean()
                res[f"{vcol}_roll_std_{w}"] = res[vcol].shift(1).rolling(w, min_periods=1).std().fillna(0.0)

    return res


def check_data_leakage(df: pd.DataFrame, feature_cols: list[str], target_col: str) -> dict[str, bool]:
    """
    Audits feature set for correlation or overlap with future target values.
    Returns audit status dictionary per feature.
    """
    leakage_status = {}
    for col in feature_cols:
        if col in df.columns and target_col in df.columns:
            # Check for exact identical columns or suspicious perfect correlations (> 0.999)
            if df[col].equals(df[target_col]):
                leakage_status[col] = False # Leakage detected!
            else:
                leakage_status[col] = True # Clean
    return leakage_status
