"""
BizPilot AI - Data Loader Module
Utility functions for loading extracted datasets and metadata.
"""

import os
import json
import pandas as pd
from typing import Dict, Any, Tuple

DATASETS_DIR = os.path.join(os.path.dirname(__file__), "../datasets")


def load_ml_dataset(name: str) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Loads ML-ready CSV dataset and its accompanying metadata JSON file.
    Example name: 'customer_retention', 'financial_forecasting', 'cashflow_forecasting'
    """
    csv_path = os.path.join(DATASETS_DIR, f"{name}.csv")
    meta_path = os.path.join(DATASETS_DIR, f"{name}_metadata.json")

    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset CSV file not found: {csv_path}")

    df = pd.read_csv(csv_path)
    metadata = {}
    if os.path.exists(meta_path):
        with open(meta_path, "r", encoding="utf-8") as f:
            metadata = json.load(f)

    return df, metadata
