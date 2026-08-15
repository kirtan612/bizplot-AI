"""
BizPilot AI - Customer Retention Service.
Handles multi-tenant organization isolation, feature extraction, model inference,
risk level classification, model-important explanations, and deterministic business recommendations.
"""

from uuid import UUID
from typing import Dict, Any, List, Optional, Tuple
import pandas as pd
import numpy as np

from api.services.ai_model_loader import load_model, is_model_available
from api.services.ai_feature_service import generate_customer_retention_features
from api.schemas.ai_schemas import (
    ModelInfo, FactorContribution, RetentionCustomerItem,
    RetentionPredictionResponse, RetentionOverviewResponse
)


def determine_retention_risk_level(prob: float) -> str:
    """
    Deterministic business threshold classification for customer retention:
      - LOW: prob < 0.25
      - MEDIUM: 0.25 <= prob < 0.50
      - HIGH: prob >= 0.50
    """
    if prob >= 0.50:
        return "HIGH"
    elif prob >= 0.25:
        return "MEDIUM"
    else:
        return "LOW"


def generate_retention_recommendation(risk_level: str, cust_name: str) -> List[str]:
    """
    Generates rule-based deterministic recommendations based on retention risk level.
    """
    if risk_level == "HIGH":
        return [
            f"Schedule priority outreach with key account manager for {cust_name}",
            "Review recent purchasing order gap and invoice payment delays",
            "Evaluate personalized volume rebate or credit term adjustments to retain account"
        ]
    elif risk_level == "MEDIUM":
        return [
            f"Monitor {cust_name}'s ordering behavior over the next 14 days",
            "Verify product stock availability for customer's preferred pipe SKUs"
        ]
    else:
        return [
            f"Maintain standard sales engagement schedule for {cust_name}",
            "Explore cross-selling opportunities in higher-margin fittings and accessories"
        ]


def get_retention_predictions_for_company(company_id: UUID) -> Tuple[pd.DataFrame, ModelInfo]:
    """
    Runs model inference for all active customers in company_id.
    """
    if not is_model_available("retention"):
        raise RuntimeError("Retention model artifact unavailable.")

    model, meta = load_model("retention")
    raw_df, enc_df = generate_customer_retention_features(company_id)

    if raw_df.empty or enc_df.empty:
        return pd.DataFrame(), ModelInfo(
            name=meta.get("model_name", "customer_retention"),
            version=meta.get("version", "1.0"),
            algorithm=meta.get("algorithm", "Random Forest"),
            status="production"
        )

    feature_cols = meta.get("features", [])
    # Align feature columns with training features
    X = pd.DataFrame(index=enc_df.index)
    for col in feature_cols:
        X[col] = enc_df[col] if col in enc_df.columns else 0.0

    X = X.fillna(0.0)

    # In-memory prediction
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(X)[:, 1]
    else:
        probs = model.predict(X)

    raw_df["churn_probability"] = np.round(probs, 4)
    raw_df["predicted_class"] = (raw_df["churn_probability"] >= 0.50).astype(int)
    raw_df["risk_level"] = raw_df["churn_probability"].apply(determine_retention_risk_level)

    model_info = ModelInfo(
        name=meta.get("model_name", "customer_retention"),
        version=meta.get("version", "1.0"),
        algorithm=meta.get("algorithm", "Random Forest"),
        status="production"
    )

    return raw_df, model_info


def get_retention_overview(company_id: UUID) -> RetentionOverviewResponse:
    """
    Builds portfolio-level retention metrics overview for organization company_id.
    """
    df, model_info = get_retention_predictions_for_company(company_id)

    if df.empty:
        return RetentionOverviewResponse(
            total_customers=0,
            high_risk_count=0,
            medium_risk_count=0,
            low_risk_count=0,
            overall_churn_rate_pct=0.0,
            high_risk_customers=[],
            model=model_info
        )

    total_count = len(df)
    high_df = df[df["risk_level"] == "HIGH"].sort_values(by="churn_probability", ascending=False)
    med_df = df[df["risk_level"] == "MEDIUM"]
    low_df = df[df["risk_level"] == "LOW"]

    high_items = []
    for _, row in high_df.head(10).iterrows():
        high_items.append(RetentionCustomerItem(
            customer_id=UUID(str(row["customer_id"])),
            customer_code=str(row["customer_code"]),
            customer_name=str(row["customer_name"]),
            churn_probability=float(row["churn_probability"]),
            predicted_class=int(row["predicted_class"]),
            risk_level=str(row["risk_level"]),
            days_since_last_purchase=int(row["days_since_last_purchase"])
        ))

    overall_churn_pct = round((len(high_df) / total_count) * 100.0, 2) if total_count > 0 else 0.0

    return RetentionOverviewResponse(
        total_customers=total_count,
        high_risk_count=len(high_df),
        medium_risk_count=len(med_df),
        low_risk_count=len(low_df),
        overall_churn_rate_pct=overall_churn_pct,
        high_risk_customers=high_items,
        model=model_info
    )


def get_retention_customers(
    company_id: UUID, 
    page: int = 1, 
    page_size: int = 20, 
    risk_filter: Optional[str] = None
) -> Dict[str, Any]:
    """
    Returns paginated customer retention list with risk predictions for company_id.
    """
    df, model_info = get_retention_predictions_for_company(company_id)

    if df.empty:
        return {
            "total": 0,
            "page": page,
            "page_size": page_size,
            "items": [],
            "model": model_info
        }

    if risk_filter:
        df = df[df["risk_level"].str.upper() == risk_filter.upper()]

    df = df.sort_values(by="churn_probability", ascending=False)
    total = len(df)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paged_df = df.iloc[start_idx:end_idx]

    items = []
    for _, row in paged_df.iterrows():
        items.append(RetentionCustomerItem(
            customer_id=UUID(str(row["customer_id"])),
            customer_code=str(row["customer_code"]),
            customer_name=str(row["customer_name"]),
            churn_probability=float(row["churn_probability"]),
            predicted_class=int(row["predicted_class"]),
            risk_level=str(row["risk_level"]),
            days_since_last_purchase=int(row["days_since_last_purchase"])
        ))

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": items,
        "model": model_info
    }


def get_retention_customer_detail(company_id: UUID, customer_id: UUID) -> Optional[RetentionPredictionResponse]:
    """
    Generates detailed retention prediction, feature importance factor breakdown,
    and business recommendations for a single customer. Validates company ownership.
    """
    df, model_info = get_retention_predictions_for_company(company_id)

    if df.empty:
        return None

    df["cust_id_str"] = df["customer_id"].astype(str)
    cust_row = df[df["cust_id_str"] == str(customer_id)]

    if cust_row.empty:
        return None

    row = cust_row.iloc[0]
    prob = float(row["churn_probability"])
    risk_level = str(row["risk_level"])
    cust_name = str(row["customer_name"])

    # Extract model-important factor contributions
    _, meta = load_model("retention")
    model, _ = load_model("retention")

    feature_cols = meta.get("features", [])
    top_factors = []

    # Get feature importances if available
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
        feat_imp_pairs = sorted(zip(feature_cols, importances), key=lambda x: x[1], reverse=True)
        for feat, imp in feat_imp_pairs[:5]:
            val = float(row.get(feat, 0.0))
            impact_str = "HIGH" if imp >= 0.15 else ("MEDIUM" if imp >= 0.05 else "LOW")
            top_factors.append(FactorContribution(
                feature=feat,
                value=round(val, 2),
                importance=round(float(imp), 4),
                impact=impact_str
            ))

    recs = generate_retention_recommendation(risk_level, cust_name)

    return RetentionPredictionResponse(
        customer_id=customer_id,
        customer_code=str(row["customer_code"]),
        customer_name=cust_name,
        churn_probability=prob,
        predicted_class=int(row["predicted_class"]),
        risk_level=risk_level,
        model=model_info,
        top_factors=top_factors,
        recommendation=recs
    )
