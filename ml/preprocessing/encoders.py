"""
BizPilot AI - Encoding Module
Encodes categorical features (customer_type, payment_behavior_tier, region, product shape/category).
"""

import pandas as pd


def encode_categorical_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Applies ordinal mapping and one-hot encodings to categorical variables.
    """
    res = df.copy()

    # Ordinal mapping for payment behavior tier
    tier_map = {
        "Prompt": 3,
        "Healthy": 3,
        "Slow": 2,
        "Delayed": 1,
        "At Risk": 0,
        "High Risk": 0,
    }
    if "payment_behavior_tier" in res.columns:
        res["payment_tier_code"] = res["payment_behavior_tier"].map(tier_map).fillna(2).astype(int)

    # One-hot encode customer_type if present
    if "customer_type" in res.columns:
        dummies = pd.get_dummies(res["customer_type"], prefix="cust_type", dtype=int)
        res = pd.concat([res, dummies], axis=1)

    return res
