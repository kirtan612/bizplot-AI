"""
BizPilot AI - Cashflow Forecast & Liquidity Risk Service.
Handles multi-tenant cashflow feature extraction, model inference,
liquidity risk assessment against configurable safety thresholds,
projected deficit calculation, and deterministic working capital recommendations.
"""

from uuid import UUID
from typing import Dict, Any, List, Optional, Tuple
import pandas as pd
import numpy as np

from api.services.ai_model_loader import load_model, is_model_available
from api.services.ai_feature_service import generate_cashflow_forecasting_features
from api.schemas.ai_schemas import (
    ModelInfo, ProfitDriverItem, CashflowForecastResponse,
    CashflowRiskResponse, CashflowOverviewResponse
)

# Default configurable minimum cash safety threshold (INR 4.0 Crores)
DEFAULT_MIN_CASH_THRESHOLD = 40000000.0


def determine_cashflow_risk_level(
    current_cash: float, 
    predicted_cash: float, 
    min_threshold: float
) -> Tuple[str, float]:
    """
    Deterministic liquidity risk level classification:
      - CRITICAL: predicted_cash < min_threshold / 2.0 (severe deficit)
      - HIGH: predicted_cash < min_threshold (safety deficit)
      - MEDIUM: predicted_cash < current_cash (cash burn trend)
      - LOW: predicted_cash >= min_threshold and predicted_cash >= current_cash
    """
    projected_deficit = max(0.0, min_threshold - predicted_cash)

    if predicted_cash < (min_threshold / 2.0):
        return "CRITICAL", projected_deficit
    elif predicted_cash < min_threshold:
        return "HIGH", projected_deficit
    elif predicted_cash < current_cash:
        return "MEDIUM", projected_deficit
    else:
        return "LOW", projected_deficit


def generate_cashflow_recommendations(risk_level: str, deficit: float) -> List[str]:
    """
    Generates rule-based deterministic recommendations based on liquidity risk level.
    """
    if risk_level in ["CRITICAL", "HIGH"]:
        return [
            f"Accelerate collection of accounts receivable to address projected INR {deficit:,.2f} liquidity buffer deficit",
            "Review upcoming supplier payment due dates and request extended credit payment windows",
            "Defer discretionary capital expenditures and non-essential operating payments over next 30 days"
        ]
    elif risk_level == "MEDIUM":
        return [
            "Monitor weekly cash inflows vs outflows against bank ledger balances",
            "Optimize inventory stocking levels to reduce working capital tie-up in slow-moving pipe sizes"
        ]
    else:
        return [
            "Maintain current working capital management and cash collection practices",
            "Consider deploying surplus liquid cash into short-term yield instruments or supplier early-payment discounts"
        ]


def get_cashflow_forecast(
    company_id: UUID, 
    min_cash_threshold: float = DEFAULT_MIN_CASH_THRESHOLD
) -> CashflowForecastResponse:
    """
    Generates next-period cashflow forecast and liquidity risk analysis for company_id.
    """
    if not is_model_available("cashflow"):
        raise RuntimeError("Cashflow forecast model artifact unavailable.")

    model, meta = load_model("cashflow")
    model_info = ModelInfo(
        name=meta.get("model_name", "cashflow_forecasting"),
        version=meta.get("version", "1.0"),
        algorithm=meta.get("algorithm", "Random Forest Regressor"),
        status="production"
    )

    cf_df = generate_cashflow_forecasting_features(company_id)

    if cf_df.empty or len(cf_df) < 2:
        return CashflowForecastResponse(
            status="INSUFFICIENT_DATA",
            current_cash=0.0,
            predicted_cash=0.0,
            change_amount=0.0,
            change_percentage=0.0,
            risk_level="LOW",
            min_cash_threshold=min_cash_threshold,
            forecast_period="N/A",
            model=model_info,
            top_drivers=[],
            recommendations=["Accumulate at least 2-3 months of cashbook voucher transactions to enable cashflow forecasting."]
        )

    # Feature alignment
    feature_cols = meta.get("features", [])
    latest_row = cf_df.iloc[[-1]]
    X = pd.DataFrame(index=latest_row.index)
    for col in feature_cols:
        X[col] = latest_row[col] if col in latest_row.columns else 0.0

    X = X.fillna(0.0)

    # Prediction
    predicted_cash = float(model.predict(X)[0])
    current_cash = float(latest_row["closing_balance"].iloc[0])

    change_amt = predicted_cash - current_cash
    change_pct = round((change_amt / abs(current_cash)) * 100.0, 2) if current_cash != 0 else 0.0
    risk_lvl, deficit = determine_cashflow_risk_level(current_cash, predicted_cash, min_cash_threshold)

    # Top drivers
    top_drivers = []
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
        feat_imp_pairs = sorted(zip(feature_cols, importances), key=lambda x: x[1], reverse=True)
        for feat, imp in feat_imp_pairs[:5]:
            top_drivers.append(ProfitDriverItem(
                feature=feat,
                importance=round(float(imp), 4),
                description=f"Model-important liquidity driver '{feat}'"
            ))

    latest_date = pd.to_datetime(latest_row["month_start"].iloc[0])
    next_month_str = (latest_date + pd.DateOffset(months=1)).strftime("%Y-%m-01")

    recs = generate_cashflow_recommendations(risk_lvl, deficit)

    return CashflowForecastResponse(
        status="SUCCESS",
        current_cash=round(current_cash, 2),
        predicted_cash=round(predicted_cash, 2),
        change_amount=round(change_amt, 2),
        change_percentage=change_pct,
        risk_level=risk_lvl,
        min_cash_threshold=min_cash_threshold,
        forecast_period=next_month_str,
        model=model_info,
        top_drivers=top_drivers,
        recommendations=recs
    )


def get_cashflow_overview(company_id: UUID) -> CashflowOverviewResponse:
    """
    Generates high-level cashflow forecasting overview for organization company_id.
    """
    fc = get_cashflow_forecast(company_id)
    if fc.status == "INSUFFICIENT_DATA":
        return CashflowOverviewResponse(
            status="INSUFFICIENT_DATA",
            current_cash=0.0,
            predicted_cash=0.0,
            net_change=0.0,
            risk_level="LOW",
            model=fc.model
        )

    return CashflowOverviewResponse(
        status="SUCCESS",
        current_cash=fc.current_cash,
        predicted_cash=fc.predicted_cash,
        net_change=fc.change_amount,
        risk_level=fc.risk_level,
        model=fc.model
    )


def get_cashflow_risk(
    company_id: UUID, 
    min_cash_threshold: float = DEFAULT_MIN_CASH_THRESHOLD
) -> CashflowRiskResponse:
    """
    Generates detailed liquidity risk and projected deficit analysis for company_id.
    """
    fc = get_cashflow_forecast(company_id, min_cash_threshold=min_cash_threshold)
    if fc.status == "INSUFFICIENT_DATA":
        return CashflowRiskResponse(
            status="INSUFFICIENT_DATA",
            risk_level="LOW",
            current_cash=0.0,
            predicted_cash=0.0,
            projected_deficit=0.0,
            min_cash_threshold=min_cash_threshold,
            recommendations=fc.recommendations
        )

    _, deficit = determine_cashflow_risk_level(fc.current_cash, fc.predicted_cash, min_cash_threshold)

    return CashflowRiskResponse(
        status="SUCCESS",
        risk_level=fc.risk_level,
        current_cash=fc.current_cash,
        predicted_cash=fc.predicted_cash,
        projected_deficit=round(deficit, 2),
        min_cash_threshold=min_cash_threshold,
        recommendations=fc.recommendations
    )
