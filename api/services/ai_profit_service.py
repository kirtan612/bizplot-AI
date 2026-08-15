"""
BizPilot AI - Financial Profit Forecasting Service.
Handles multi-tenant organization financial feature extraction, model inference,
profit change calculation, trend risk level classification, model-important driver attribution,
and deterministic business recommendations.
"""

from uuid import UUID
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np

from api.services.ai_model_loader import load_model, is_model_available
from api.services.ai_feature_service import generate_financial_forecasting_features
from api.schemas.ai_schemas import (
    ModelInfo, ProfitDriverItem, ProfitForecastResponse, ProfitOverviewResponse
)


def determine_profit_risk_level(current_profit: float, predicted_profit: float, change_pct: float) -> str:
    """
    Deterministic trend risk classification for profit forecast:
      - CRITICAL: predicted_profit < 0 or change_pct <= -25.0
      - HIGH: change_pct <= -10.0
      - MEDIUM: change_pct < 0.0
      - LOW: change_pct >= 0.0
    """
    if predicted_profit < 0 or change_pct <= -25.0:
        return "CRITICAL"
    elif change_pct <= -10.0:
        return "HIGH"
    elif change_pct < 0.0:
        return "MEDIUM"
    else:
        return "LOW"


def generate_profit_recommendations(risk_level: str, change_amount: float, change_pct: float) -> List[str]:
    """
    Generates rule-based deterministic recommendations based on profit trend forecast.
    """
    if risk_level in ["CRITICAL", "HIGH"]:
        return [
            "Review cost of goods sold (COGS) and negotiate volume discounts with raw material suppliers",
            "Audit distributor freight, warehousing, and operating expenses to reduce overhead",
            "Analyze product category profit margins and prioritize higher-margin GI/MS pipe SKUs"
        ]
    elif risk_level == "MEDIUM":
        return [
            "Monitor operating margin trends over upcoming monthly billing cycles",
            "Evaluate selective price adjustments on high-demand steel product lines"
        ]
    else:
        return [
            "Maintain current purchasing efficiency and inventory turnover strategies",
            "Capitalize on positive profit momentum by expanding high-margin customer accounts"
        ]


def get_profit_forecast(company_id: UUID) -> ProfitForecastResponse:
    """
    Generates next-period profit forecast and drivers for organization company_id.
    """
    if not is_model_available("profit"):
        raise RuntimeError("Profit forecast model artifact unavailable.")

    model, meta = load_model("profit")
    model_info = ModelInfo(
        name=meta.get("model_name", "profit_forecasting"),
        version=meta.get("version", "1.0"),
        algorithm=meta.get("algorithm", "Random Forest Regressor"),
        status="production"
    )

    fin_df = generate_financial_forecasting_features(company_id)

    if fin_df.empty or len(fin_df) < 2:
        return ProfitForecastResponse(
            status="INSUFFICIENT_DATA",
            current_profit=0.0,
            predicted_profit=0.0,
            change_amount=0.0,
            change_percentage=0.0,
            risk_level="LOW",
            forecast_period="N/A",
            model=model_info,
            top_drivers=[],
            recommendations=["Accumulate at least 2-3 months of sales and purchase transactions to enable AI profit forecasting."]
        )

    # Feature alignment
    feature_cols = meta.get("features", [])
    latest_row = fin_df.iloc[[-1]]
    X = pd.DataFrame(index=latest_row.index)
    for col in feature_cols:
        X[col] = latest_row[col] if col in latest_row.columns else 0.0

    X = X.fillna(0.0)

    # Prediction
    predicted_profit = float(model.predict(X)[0])
    current_profit = float(latest_row["net_profit"].iloc[0])
    
    change_amt = predicted_profit - current_profit
    change_pct = round((change_amt / abs(current_profit)) * 100.0, 2) if current_profit != 0 else 0.0
    risk_lvl = determine_profit_risk_level(current_profit, predicted_profit, change_pct)

    # Calculate drivers
    top_drivers = []
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
        feat_imp_pairs = sorted(zip(feature_cols, importances), key=lambda x: x[1], reverse=True)
        for feat, imp in feat_imp_pairs[:5]:
            top_drivers.append(ProfitDriverItem(
                feature=feat,
                importance=round(float(imp), 4),
                description=f"Model-important driver '{feat}'"
            ))

    # Forecast target month string
    latest_date = pd.to_datetime(latest_row["month_start"].iloc[0])
    next_month_str = (latest_date + pd.DateOffset(months=1)).strftime("%Y-%m-01")

    recs = generate_profit_recommendations(risk_lvl, change_amt, change_pct)

    return ProfitForecastResponse(
        status="SUCCESS",
        current_profit=round(current_profit, 2),
        predicted_profit=round(predicted_profit, 2),
        change_amount=round(change_amt, 2),
        change_percentage=change_pct,
        risk_level=risk_lvl,
        forecast_period=next_month_str,
        model=model_info,
        top_drivers=top_drivers,
        recommendations=recs
    )


def get_profit_overview(company_id: UUID) -> ProfitOverviewResponse:
    """
    Generates high-level profit forecasting overview response for organization company_id.
    """
    fc = get_profit_forecast(company_id)
    if fc.status == "INSUFFICIENT_DATA":
        return ProfitOverviewResponse(
            status="INSUFFICIENT_DATA",
            current_profit=0.0,
            predicted_profit=0.0,
            change_amount=0.0,
            change_percentage=0.0,
            risk_level="LOW",
            historical_periods_count=0,
            model=fc.model
        )

    fin_df = generate_financial_forecasting_features(company_id)
    return ProfitOverviewResponse(
        status="SUCCESS",
        current_profit=fc.current_profit,
        predicted_profit=fc.predicted_profit,
        change_amount=fc.change_amount,
        change_percentage=fc.change_percentage,
        risk_level=fc.risk_level,
        historical_periods_count=len(fin_df),
        model=fc.model
    )


def get_profit_drivers(company_id: UUID) -> List[ProfitDriverItem]:
    """
    Returns model-important driver list for profit forecasting.
    """
    fc = get_profit_forecast(company_id)
    return fc.top_drivers
