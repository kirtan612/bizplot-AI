"""
AI Predictions FastAPI Router for BizPilot AI.
Endpoints (Runtime Gated until Milestone 4 ML models are trained):
  GET /api/predictions/price/{product_id}
  GET /api/predictions/demand/{product_id}
  GET /api/anomalies
  GET /api/models/metadata (ADMIN ONLY)

When model files are missing from models/ directory, returns HTTP 503 Service Unavailable
with contract-defined status payload. ZERO fabricated numbers are returned.
"""

from typing import Optional
from uuid import UUID
from datetime import date
from fastapi import APIRouter, Depends, Query, status, Response
from fastapi.responses import JSONResponse

from api.services.model_registry import check_model_availability, get_model_unavailable_payload
from api.auth.dependencies import get_current_user, require_role, CurrentUser

router = APIRouter()


@router.get(
    "/predictions/price/{product_id}",
    summary="Get ML price prediction for a product SKU (Gated 503 until model trained)",
    responses={
        503: {
            "description": "Model not yet available",
            "content": {
                "application/json": {
                    "example": {
                        "status": "unavailable",
                        "model_name": "price_prediction",
                        "message": "'price_prediction' prediction model not yet trained or available for this product.",
                        "product_id": "11111111-1111-1111-1111-111111111111"
                    }
                }
            }
        }
    }
)
def get_price_prediction(
    product_id: UUID,
    horizon_days: int = Query(30, ge=1, le=365, description="Prediction horizon in days"),
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Price forecast endpoint for product SKU.
    Runtime checks models/ directory for trained model artifact. Returns 503 when model is unavailable.
    """
    model_name = "price_prediction"
    is_available = check_model_availability(model_name, product_id=product_id)

    if not is_available:
        payload = get_model_unavailable_payload(model_name, product_id=product_id)
        payload["message"] = f"'{model_name}' prediction model not yet trained or available for product {product_id}."
        return JSONResponse(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, content=payload)

    # Note: Milestone 4 will execute inference here once model artifact exists.
    # Currently unreachable because check_model_availability returns False.
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content=get_model_unavailable_payload(model_name, product_id=product_id)
    )


@router.get(
    "/predictions/demand/{product_id}",
    summary="Get ML demand forecast for a product SKU (Gated 503 until model trained)",
    responses={
        503: {
            "description": "Model not yet available",
            "content": {
                "application/json": {
                    "example": {
                        "status": "unavailable",
                        "model_name": "demand_forecasting",
                        "message": "'demand_forecasting' prediction model not yet trained or available for this product.",
                        "product_id": "11111111-1111-1111-1111-111111111111"
                    }
                }
            }
        }
    }
)
def get_demand_prediction(
    product_id: UUID,
    horizon_days: int = Query(30, ge=1, le=365, description="Prediction horizon in days"),
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Demand forecasting endpoint for product SKU.
    Runtime checks models/ directory for trained model artifact. Returns 503 when model is unavailable.
    """
    model_name = "demand_forecasting"
    is_available = check_model_availability(model_name, product_id=product_id)

    if not is_available:
        payload = get_model_unavailable_payload(model_name, product_id=product_id)
        payload["message"] = f"'{model_name}' prediction model not yet trained or available for product {product_id}."
        return JSONResponse(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, content=payload)

    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content=get_model_unavailable_payload(model_name, product_id=product_id)
    )


@router.get(
    "/anomalies",
    summary="List detected business transaction anomalies (Gated 503 until model trained)",
    responses={
        503: {
            "description": "Anomaly model not yet available",
            "content": {
                "application/json": {
                    "example": {
                        "status": "unavailable",
                        "model_name": "anomaly_detection",
                        "message": "'anomaly_detection' prediction model not yet trained or available."
                    }
                }
            }
        }
    }
)
def list_anomalies(
    date_from: Optional[date] = Query(None, description="Start date filter (YYYY-MM-DD)"),
    date_to: Optional[date] = Query(None, description="End date filter (YYYY-MM-DD)"),
    severity: Optional[str] = Query(None, description="Filter by anomaly severity (low, medium, high)"),
    page: int = Query(1, ge=1, description="Page index (1-based)"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Anomaly detection endpoint.
    Runtime checks models/ directory for trained model artifact. Returns 503 when model is unavailable.
    """
    model_name = "anomaly_detection"
    is_available = check_model_availability(model_name)

    if not is_available:
        payload = get_model_unavailable_payload(model_name)
        payload["message"] = f"'{model_name}' prediction model not yet trained or available."
        return JSONResponse(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, content=payload)

    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content=get_model_unavailable_payload(model_name)
    )


@router.get(
    "/models/metadata",
    summary="Get ML model metadata registry (ADMIN ONLY - Gated 503 until models trained)",
    responses={
        503: {
            "description": "Model registry metadata not yet available",
            "content": {
                "application/json": {
                    "example": {
                        "status": "unavailable",
                        "model_name": "model_registry",
                        "message": "No trained ML model artifacts found in model registry."
                    }
                }
            }
        }
    }
)
def get_models_metadata(
    current_user: CurrentUser = Depends(require_role(["admin", "Admin"]))
):
    """
    Admin-only ML model metadata registry endpoint.
    Runtime checks models/ directory. Returns 503 when no model artifacts exist.
    """
    model_name = "model_registry"
    is_available = check_model_availability("price_prediction") or check_model_availability("demand_forecasting")

    if not is_available:
        payload = get_model_unavailable_payload(model_name)
        payload["message"] = "No trained ML model artifacts found in model registry."
        return JSONResponse(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, content=payload)

    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content=get_model_unavailable_payload(model_name)
    )
