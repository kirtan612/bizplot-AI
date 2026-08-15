"""
BizPilot AI - AI Model Serving & Predictions FastAPI Router.

Provides secure REST APIs for Phase 3 machine learning models:
  - Customer Retention & Churn Risk
  - Monthly Profit Forecasting
  - Cashflow Liquidity Risk Forecasting
  - Combined Executive Insights & Actionable Recommendations

All endpoints require JWT authentication and strictly enforce multi-tenant organization isolation.
"""

from typing import Optional, List
from uuid import UUID
from fastapi import APIRouter, Depends, Query, HTTPException, status
from fastapi.responses import JSONResponse

from api.auth.dependencies import get_current_user, CurrentUser
from api.schemas.ai_schemas import (
    RetentionOverviewResponse, RetentionPredictionResponse,
    ProfitOverviewResponse, ProfitForecastResponse, ProfitDriverItem,
    CashflowOverviewResponse, CashflowForecastResponse, CashflowRiskResponse,
    AIInsightResponse, AIRecommendationResponse, InsufficientDataResponse
)
from api.services.ai_retention_service import (
    get_retention_overview, get_retention_customers, get_retention_customer_detail
)
from api.services.ai_profit_service import (
    get_profit_overview, get_profit_forecast, get_profit_drivers
)
from api.services.ai_cashflow_service import (
    get_cashflow_overview, get_cashflow_forecast, get_cashflow_risk
)
from api.services.ai_insight_service import (
    get_ai_insights, get_ai_recommendations
)

router = APIRouter()


# ==============================================================================
# CUSTOMER RETENTION ENDPOINTS
# ==============================================================================

@router.get(
    "/retention/overview",
    response_model=RetentionOverviewResponse,
    summary="Get Customer Retention Portfolio Overview"
)
def api_get_retention_overview(
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Returns aggregate churn risk metrics, portfolio risk distribution,
    and top high-risk accounts for authenticated user's organization.
    """
    try:
        return get_retention_overview(current_user.company_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating retention overview: {str(e)}"
        )


@router.get(
    "/retention/customers",
    summary="List Customer Retention Predictions with Filtering & Pagination"
)
def api_get_retention_customers(
    risk: Optional[str] = Query(None, description="Filter by risk tier ('LOW', 'MEDIUM', 'HIGH')"),
    page: int = Query(1, ge=1, description="Page index (1-based)"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Paginated list of customer churn risk predictions for authenticated organization.
    """
    try:
        return get_retention_customers(
            company_id=current_user.company_id,
            page=page,
            page_size=page_size,
            risk_filter=risk
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving retention customer list: {str(e)}"
        )


@router.get(
    "/retention/customers/{customer_id}",
    response_model=RetentionPredictionResponse,
    summary="Get Detailed Customer Retention Prediction & Model Factors"
)
def api_get_retention_customer_detail(
    customer_id: UUID,
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Returns churn prediction, model-important factor contributions,
    and deterministic recommendations for a specific customer. Enforces organization ownership.
    """
    try:
        res = get_retention_customer_detail(current_user.company_id, customer_id)
        if not res:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Customer '{customer_id}' not found or unauthorized for this organization."
            )
        return res
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error predicting retention for customer '{customer_id}': {str(e)}"
        )


# ==============================================================================
# PROFIT FORECASTING ENDPOINTS
# ==============================================================================

@router.get(
    "/profit/overview",
    response_model=ProfitOverviewResponse,
    summary="Get Financial Profit Forecast Overview"
)
def api_get_profit_overview(
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Returns high-level operating profit forecast summary for authenticated organization.
    """
    try:
        return get_profit_overview(current_user.company_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating profit overview: {str(e)}"
        )


@router.get(
    "/profit/forecast",
    response_model=ProfitForecastResponse,
    summary="Get Next-Month Operating Profit Forecast"
)
def api_get_profit_forecast(
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Returns next-month profit prediction, MoM percentage change, trend risk level,
    and model-important drivers for authenticated organization.
    """
    try:
        return get_profit_forecast(current_user.company_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating profit forecast: {str(e)}"
        )


@router.get(
    "/profit/drivers",
    response_model=List[ProfitDriverItem],
    summary="Get Model-Important Profit Drivers"
)
def api_get_profit_drivers(
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Exposes top model-important financial drivers influencing profit forecast.
    """
    try:
        return get_profit_drivers(current_user.company_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving profit drivers: {str(e)}"
        )


# ==============================================================================
# CASHFLOW FORECASTING ENDPOINTS
# ==============================================================================

@router.get(
    "/cashflow/overview",
    response_model=CashflowOverviewResponse,
    summary="Get Cashflow Forecasting Overview"
)
def api_get_cashflow_overview(
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Returns high-level cash position liquidity forecast summary for authenticated organization.
    """
    try:
        return get_cashflow_overview(current_user.company_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating cashflow overview: {str(e)}"
        )


@router.get(
    "/cashflow/forecast",
    response_model=CashflowForecastResponse,
    summary="Get Next-Month Cashflow Liquidity Forecast"
)
def api_get_cashflow_forecast(
    min_threshold: float = Query(40000000.0, ge=0.0, description="Minimum cash safety threshold in INR"),
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Returns next-month closing cash prediction, liquidity risk assessment,
    and working capital recommendations for authenticated organization.
    """
    try:
        return get_cashflow_forecast(current_user.company_id, min_cash_threshold=min_threshold)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating cashflow forecast: {str(e)}"
        )


@router.get(
    "/cashflow/risk",
    response_model=CashflowRiskResponse,
    summary="Get Detailed Cashflow Risk & Deficit Analysis"
)
def api_get_cashflow_risk(
    min_threshold: float = Query(40000000.0, ge=0.0, description="Minimum cash safety threshold in INR"),
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Returns projected cash deficit and prioritized liquidity management actions.
    """
    try:
        return get_cashflow_risk(current_user.company_id, min_cash_threshold=min_threshold)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating cashflow risk analysis: {str(e)}"
        )


# ==============================================================================
# COMBINED EXECUTIVE INSIGHTS & RECOMMENDATIONS
# ==============================================================================

@router.get(
    "/insights",
    response_model=AIInsightResponse,
    summary="Get Combined Executive AI Insights"
)
def api_get_ai_insights(
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Combines Customer Retention, Profit Forecast, and Cashflow Risk into
    a unified executive intelligence summary for authenticated organization.
    """
    try:
        return get_ai_insights(current_user.company_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating AI insights: {str(e)}"
        )


@router.get(
    "/recommendations",
    response_model=AIRecommendationResponse,
    summary="Get Prioritized Actionable AI Recommendations"
)
def api_get_ai_recommendations(
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Returns prioritized list of actionable recommendations with traceable model sources.
    """
    try:
        return get_ai_recommendations(current_user.company_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating AI recommendations: {str(e)}"
        )
