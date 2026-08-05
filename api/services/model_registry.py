"""
ML Model Registry and Availability Verification Service for BizPilot AI.

This module provides runtime checks for trained machine learning models (Milestone 4).
When models are trained in Milestone 4, serialized artifacts (e.g. price_prediction.pkl,
demand_prediction.pkl, anomaly_detection.pkl) will be placed in the project root's models/
directory.

Until those artifacts exist, check_model_availability returns False, allowing prediction routes
to return HTTP 503 Service Unavailable with contract-defined payloads.
"""

import os
from typing import Optional, Dict, Any
from uuid import UUID
from pathlib import Path

# Base directory for trained model artifacts
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
MODELS_DIR = PROJECT_ROOT / "models"


def check_model_availability(model_name: str, product_id: Optional[UUID] = None) -> bool:
    """
    Verify if a trained model artifact exists and is ready for inference.

    Args:
        model_name: Identifier of the model ('price_prediction', 'demand_forecasting', 'anomaly_detection')
        product_id: Optional UUID of the target product SKU for product-specific models.

    Returns:
        True if trained model artifact exists under models/ and is valid; False otherwise.
    """
    if not MODELS_DIR.exists():
        return False

    # Check for specific product model or global model file
    model_filenames = []
    if product_id:
        model_filenames.append(f"{model_name}_{product_id}.pkl")
    model_filenames.append(f"{model_name}.pkl")

    for fname in model_filenames:
        model_path = MODELS_DIR / fname
        if model_path.exists() and model_path.stat().st_size > 0:
            return True

    return False


def get_model_unavailable_payload(
    model_name: str,
    product_id: Optional[UUID] = None,
    extra_context: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Construct the standard contract-defined JSON payload for 503 Unavailable responses.
    """
    payload: Dict[str, Any] = {
        "status": "unavailable",
        "model_name": model_name,
        "message": f"'{model_name}' prediction model not yet trained or available."
    }
    if product_id:
        payload["product_id"] = str(product_id)
    if extra_context:
        payload.update(extra_context)
    return payload
