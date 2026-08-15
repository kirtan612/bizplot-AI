"""
BizPilot AI - Combined Executive AI Insights & Prioritized Recommendations Service.

Aggregates structured predictions from Customer Retention, Profit Forecasting,
and Cashflow Liquidity Risk modules into a unified executive intelligence payload.
Zero LLM / zero synthetic data used. Every recommendation has a traceable source.
"""

from uuid import UUID
from typing import List, Dict, Any

from api.services.ai_retention_service import get_retention_overview
from api.services.ai_profit_service import get_profit_forecast
from api.services.ai_cashflow_service import get_cashflow_forecast
from api.schemas.ai_schemas import (
    FinancialInsightSummary, CashflowInsightSummary, CustomerInsightSummary,
    AIInsightResponse, AIRecommendationItem, AIRecommendationResponse
)


def get_ai_insights(company_id: UUID) -> AIInsightResponse:
    """
    Generates combined executive intelligence summary across Retention, Profit, and Cashflow.
    """
    ret_overview = get_retention_overview(company_id)
    prof_fc = get_profit_forecast(company_id)
    cf_fc = get_cashflow_forecast(company_id)

    prof_risk = prof_fc.risk_level if prof_fc.status == "SUCCESS" else "LOW"
    cf_risk = cf_fc.risk_level if cf_fc.status == "SUCCESS" else "LOW"
    high_churn_count = ret_overview.high_risk_count

    # Determine overall business priority
    if cf_risk == "CRITICAL" or prof_risk == "CRITICAL":
        overall_priority = "CRITICAL"
    elif cf_risk == "HIGH" or prof_risk == "HIGH" or high_churn_count >= 5:
        overall_priority = "HIGH"
    elif cf_risk == "MEDIUM" or prof_risk == "MEDIUM" or high_churn_count > 0:
        overall_priority = "MEDIUM"
    else:
        overall_priority = "LOW"

    return AIInsightResponse(
        financial=FinancialInsightSummary(
            profit_risk=prof_risk,
            predicted_profit_change_pct=prof_fc.change_percentage if prof_fc.status == "SUCCESS" else 0.0
        ),
        cashflow=CashflowInsightSummary(
            risk=cf_risk,
            predicted_cash_change_pct=cf_fc.change_percentage if cf_fc.status == "SUCCESS" else 0.0
        ),
        customers=CustomerInsightSummary(
            high_churn_customers=high_churn_count,
            overall_churn_rate_pct=ret_overview.overall_churn_rate_pct
        ),
        priority=overall_priority
    )


def get_ai_recommendations(company_id: UUID) -> AIRecommendationResponse:
    """
    Generates prioritized list of actionable business recommendations with traceable sources.
    """
    ret_overview = get_retention_overview(company_id)
    prof_fc = get_profit_forecast(company_id)
    cf_fc = get_cashflow_forecast(company_id)

    recommendations: List[AIRecommendationItem] = []

    # 1. Cashflow Recommendations
    if cf_fc.status == "SUCCESS":
        for rec_text in cf_fc.recommendations:
            prio = "HIGH" if cf_fc.risk_level in ["CRITICAL", "HIGH"] else ("MEDIUM" if cf_fc.risk_level == "MEDIUM" else "LOW")
            recommendations.append(AIRecommendationItem(
                priority=prio,
                area="CASHFLOW",
                title="Review Cash Obligations & Working Capital",
                reason=f"Cashflow model projects next-month cash position of INR {cf_fc.predicted_cash:,.2f} ({cf_fc.risk_level} Risk)",
                source="cashflow_forecast"
            ))

    # 2. Profit Recommendations
    if prof_fc.status == "SUCCESS":
        for rec_text in prof_fc.recommendations:
            prio = "HIGH" if prof_fc.risk_level in ["CRITICAL", "HIGH"] else ("MEDIUM" if prof_fc.risk_level == "MEDIUM" else "LOW")
            recommendations.append(AIRecommendationItem(
                priority=prio,
                area="PROFIT",
                title="Optimize COGS & Operating Overhead",
                reason=f"Profit model predicts next-month operating profit of INR {prof_fc.predicted_profit:,.2f} ({prof_fc.change_percentage}% MoM change)",
                source="profit_forecast"
            ))

    # 3. Retention Recommendations
    if ret_overview.high_risk_count > 0:
        recommendations.append(AIRecommendationItem(
            priority="HIGH",
            area="RETENTION",
            title=f"Priority Outreach for {ret_overview.high_risk_count} High-Risk Customer Accounts",
            reason=f"{ret_overview.high_risk_count} customer accounts detected with elevated churn risk (>50% probability)",
            source="retention_model"
        ))

    # Deduplicate items by title
    unique_recs = []
    seen_titles = set()
    for rec in recommendations:
        if rec.title not in seen_titles:
            seen_titles.add(rec.title)
            unique_recs.append(rec)

    # Sort by priority
    priority_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
    unique_recs.sort(key=lambda x: priority_order.get(x.priority, 4))

    return AIRecommendationResponse(
        total_count=len(unique_recs),
        recommendations=unique_recs
    )
