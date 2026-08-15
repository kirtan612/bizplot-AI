"""
BizPilot AI - LLM Reasoning & Hallucination Guardrails Service.
Executes structured executive analysis with strict schema validation.
Provides deterministic fallback if LLM provider/key is unconfigured or fails.
"""

import json
import logging
from typing import Dict, Any, Optional
from api.executives.schemas import (
    ExecutiveContext,
    ExecutiveAnalysisResponse,
    ExecutiveStatus,
    RiskLevel,
    PriorityItem,
    RecommendationItem,
    QuestionItem,
    ExecutiveModelInfo
)

logger = logging.getLogger(__name__)


def generate_cfo_deterministic_analysis(context: ExecutiveContext) -> ExecutiveAnalysisResponse:
    """Deterministic fallback analysis for AI CFO."""
    fin = context.financial
    risk = fin.profit_risk

    status = ExecutiveStatus.CRITICAL_RISK if risk == RiskLevel.CRITICAL else (
        ExecutiveStatus.ATTENTION_REQUIRED if risk in [RiskLevel.HIGH, RiskLevel.MEDIUM] else ExecutiveStatus.OPTIMAL
    )

    summary = (
        f"Operating profit is forecast at ₹{fin.predicted_profit:,.2f} ({fin.profit_change_pct:+.1f}% MoM). "
        f"Cash reserves sit at ₹{fin.current_cash:,.2f} against a safety threshold of ₹{fin.min_cash_threshold:,.2f}."
    )

    key_findings = [
        f"Operating profit trajectory risk is assessed at {risk.value} priority.",
        f"Model-important profit drivers include: {', '.join(fin.top_profit_drivers) if fin.top_profit_drivers else 'COGS volatility'}.",
        f"Current cash balance of ₹{fin.current_cash:,.2f} requires liquidity pacing oversight."
    ]

    priorities = [
        PriorityItem(
            priority=risk,
            title="Cost Structure & COGS Audit",
            reason=f"Operating profit change is projected at {fin.profit_change_pct:+.1f}% next month."
        ),
        PriorityItem(
            priority=fin.cashflow_risk,
            title="Treasury Working Capital Reserve",
            reason=f"Cashflow liquidity risk is categorized as {fin.cashflow_risk.value}."
        )
    ]

    recommendations = [
        RecommendationItem(
            title="Audit Raw Material & Vendor Pricing",
            reason="COGS roll stability is the primary model-important profit driver.",
            source="profit_forecast_model_v1",
            area="FINANCIAL"
        ),
        RecommendationItem(
            title="Accelerate Past-Due Invoice Collections",
            reason="Protects liquidity buffer above the ₹4.0Cr minimum threshold.",
            source="cashflow_risk_model_v1",
            area="TREASURY"
        )
    ]

    questions = [
        QuestionItem(
            to_executive="COO",
            question="COGS overhead has risen. What specific inventory or supplier cost factors are driving supplier invoice totals?"
        )
    ]

    return ExecutiveAnalysisResponse(
        executive="CFO",
        name="AI Chief Financial Officer",
        status=status,
        risk_level=risk,
        summary=summary,
        key_findings=key_findings,
        priorities=priorities,
        recommendations=recommendations,
        questions_for_executives=questions,
        model_info=ExecutiveModelInfo(name="AI CFO Financial Analyst", version="1.0")
    )


def generate_coo_deterministic_analysis(context: ExecutiveContext) -> ExecutiveAnalysisResponse:
    """Deterministic fallback analysis for AI COO."""
    ops = context.operations
    fin = context.financial

    low_stock = ops.products_below_reorder
    risk = RiskLevel.HIGH if low_stock > 10 else (RiskLevel.MEDIUM if low_stock > 0 else RiskLevel.LOW)
    status = ExecutiveStatus.ATTENTION_REQUIRED if low_stock > 0 else ExecutiveStatus.OPTIMAL

    summary = (
        f"Operational throughput recorded ₹{ops.sales_last_30_days:,.2f} in 30-day sales against ₹{ops.purchases_last_30_days:,.2f} in purchase procurement. "
        f"{low_stock} product SKUs are currently below reorder threshold."
    )

    key_findings = [
        f"{low_stock} of {ops.total_active_products} active product SKUs require stock replenishment.",
        f"Estimated 30-day COGS procurement budget stands at ₹{ops.cogs_estimate_30_days:,.2f}.",
        "Supplier purchase register shows consistent order fulfillment pacing."
    ]

    priorities = [
        PriorityItem(
            priority=risk,
            title="Replenish Low-Stock SKUs",
            reason=f"{low_stock} items are below configured safety reorder thresholds."
        ),
        PriorityItem(
            priority=RiskLevel.MEDIUM,
            title="Optimize Freight & Logistics Dispatch",
            reason="Reduces warehouse storage overhead and transport cycle times."
        )
    ]

    recommendations = [
        RecommendationItem(
            title="Consolidate Raw Steel Supplier Purchase Orders",
            reason="Bulk procurement optimizes tier pricing discounts and lowers COGS.",
            source="operational_inventory_telemetry",
            area="OPERATIONS"
        ),
        RecommendationItem(
            title="Prioritize Reorder for High-Velocity MS Pipes",
            reason="Prevents stockout risk on fast-moving industrial catalog lines.",
            source="inventory_reorder_telemetry",
            area="SUPPLY_CHAIN"
        )
    ]

    questions = [
        QuestionItem(
            to_executive="CFO",
            question="Will the proposed inventory reorder allocation fit within next month's projected cashflow liquidity reserve?"
        )
    ]

    return ExecutiveAnalysisResponse(
        executive="COO",
        name="AI Chief Operating Officer",
        status=status,
        risk_level=risk,
        summary=summary,
        key_findings=key_findings,
        priorities=priorities,
        recommendations=recommendations,
        questions_for_executives=questions,
        model_info=ExecutiveModelInfo(name="AI COO Operations Analyst", version="1.0")
    )


def generate_cmo_deterministic_analysis(context: ExecutiveContext) -> ExecutiveAnalysisResponse:
    """Deterministic fallback analysis for AI CMO."""
    cust = context.customers

    high_risk = cust.high_risk_count
    risk = RiskLevel.CRITICAL if high_risk > 10 else (RiskLevel.HIGH if high_risk > 0 else RiskLevel.LOW)
    status = ExecutiveStatus.ATTENTION_REQUIRED if high_risk > 0 else ExecutiveStatus.OPTIMAL

    summary = (
        f"Customer portfolio telemetry monitors {cust.total_customers} active accounts. "
        f"{cust.high_risk_count} accounts show elevated churn risk with an overall portfolio churn rate of {cust.overall_churn_rate_pct:.1f}%."
    )

    key_findings = [
        f"{cust.high_risk_count} key customer accounts are flagged in high churn risk tier.",
        f"Portfolio churn probability averages {cust.overall_churn_rate_pct:.1f}%.",
        f"Top risk accounts include: {', '.join([c.get('customer_name', '') for c in cust.top_risk_customers]) if cust.top_risk_customers else 'None'}."
    ]

    priorities = [
        PriorityItem(
            priority=risk,
            title="Retention Outreach for High-Risk Accounts",
            reason=f"{cust.high_risk_count} distributor accounts have order gap acceleration."
        ),
        PriorityItem(
            priority=RiskLevel.MEDIUM,
            title="Distributor Volume Incentive Program",
            reason="Protects recurring order volume across Tier A distributor accounts."
        )
    ]

    recommendations = [
        RecommendationItem(
            title="Dispatch Personal Relationship Executive to Top Churn Accounts",
            reason="Direct intervention recovers accounts showing 45+ day purchase gaps.",
            source="customer_retention_model_v1",
            area="RETENTION"
        ),
        RecommendationItem(
            title="Offer Special Volume Tier Rebates on GI Pipes",
            reason="Incentivizes immediate reorder placement for price-sensitive distributors.",
            source="customer_order_telemetry",
            area="MARKETING"
        )
    ]

    questions = [
        QuestionItem(
            to_executive="CFO",
            question="Can we approve a temporary 2% volume rebate margin tier for at-risk accounts without triggering margin erosion?"
        )
    ]

    return ExecutiveAnalysisResponse(
        executive="CMO",
        name="AI Chief Marketing Officer",
        status=status,
        risk_level=risk,
        summary=summary,
        key_findings=key_findings,
        priorities=priorities,
        recommendations=recommendations,
        questions_for_executives=questions,
        model_info=ExecutiveModelInfo(name="AI CMO Retention Analyst", version="1.0")
    )


def generate_ceo_deterministic_analysis(
    context: ExecutiveContext,
    cfo_analysis: ExecutiveAnalysisResponse,
    coo_analysis: ExecutiveAnalysisResponse,
    cmo_analysis: ExecutiveAnalysisResponse
) -> ExecutiveAnalysisResponse:
    """Deterministic strategic synthesis for AI CEO based on CFO, COO, CMO inputs."""
    top_risk = max(
        [cfo_analysis.risk_level, coo_analysis.risk_level, cmo_analysis.risk_level],
        key=lambda r: {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1}[r.value]
    )

    status = ExecutiveStatus.CRITICAL_RISK if top_risk == RiskLevel.CRITICAL else (
        ExecutiveStatus.ATTENTION_REQUIRED if top_risk in [RiskLevel.HIGH, RiskLevel.MEDIUM] else ExecutiveStatus.OPTIMAL
    )

    summary = (
        f"Executive Boardroom Synthesis: The company faces a overall business risk level of {top_risk.value}. "
        f"CFO reports profit risk at {cfo_analysis.risk_level.value}; COO reports {coo_analysis.risk_level.value} operational risk; "
        f"CMO monitors {cmo_analysis.risk_level.value} customer churn risk."
    )

    key_findings = [
        f"Financial: {cfo_analysis.summary}",
        f"Operations: {coo_analysis.summary}",
        f"Customers: {cmo_analysis.summary}"
    ]

    priorities = [
        PriorityItem(
            priority=top_risk,
            title="Align Cross-Functional Margin & Retention Plan",
            reason="Resolves profit pressure while defending high-value customer accounts."
        ),
        PriorityItem(
            priority=cfo_analysis.risk_level,
            title="Maintain Working Capital Liquidity Buffer",
            reason="Guarantees operating reserves remain above threshold."
        )
    ]

    recommendations = [
        RecommendationItem(
            title="Authorize CFO & COO COGS renegotiation squad",
            reason="Directly targets primary profit driver identified by ML Regressor.",
            source="ceo_executive_synthesis",
            area="STRATEGY"
        ),
        RecommendationItem(
            title="Approve Targeted Retention Rebates for High-Risk Accounts",
            reason="Protects core recurring revenue stream.",
            source="ceo_executive_synthesis",
            area="STRATEGY"
        )
    ]

    questions = [
        QuestionItem(
            to_executive="CFO",
            question="Confirm final Q2 operating budget allocation after COGS and retention adjustments."
        )
    ]

    return ExecutiveAnalysisResponse(
        executive="CEO",
        name="AI Chief Executive Officer",
        status=status,
        risk_level=top_risk,
        summary=summary,
        key_findings=key_findings,
        priorities=priorities,
        recommendations=recommendations,
        questions_for_executives=questions,
        model_info=ExecutiveModelInfo(name="AI CEO Executive Strategist", version="1.0")
    )
