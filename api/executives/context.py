"""
BizPilot AI - Structured Business Context Builder.
Queries PostgreSQL tables and Phase 4 AI Services (Profit, Cashflow, Retention)
to build strongly-typed, organization-isolated ExecutiveContext.
"""

from uuid import UUID
import pandas as pd
from sqlalchemy import text
from ml.data.extract import get_db_engine

from api.services.ai_profit_service import get_profit_forecast, get_profit_drivers
from api.services.ai_cashflow_service import get_cashflow_forecast, get_cashflow_risk
from api.services.ai_retention_service import get_retention_overview
from api.executives.schemas import (
    ExecutiveContext,
    OrganizationContext,
    FinancialContext,
    CustomerContext,
    OperationalContext,
    RiskLevel
)


def build_executive_context(company_id: UUID) -> ExecutiveContext:
    """
    Build structured, organization-scoped executive context from PostgreSQL and Phase 4 ML Services.
    Guarantees deterministic numbers with zero LLM hallucination.
    """
    engine = get_db_engine()

    # 1. Organization Context
    org_name = "APL Apollo Steel Distribution Ltd."
    org_type = "Steel & Metal Infrastructure Distribution"
    with engine.connect() as conn:
        res = conn.execute(text("SELECT name FROM companies WHERE id = :cid"), {"cid": str(company_id)}).fetchone()
        if res:
            org_name = res[0]

    org_ctx = OrganizationContext(id=str(company_id), name=org_name, type=org_type)

    # 2. Financial Context (from Phase 4 Profit & Cashflow Services)
    profit_resp = get_profit_forecast(company_id)
    profit_drivers_resp = get_profit_drivers(company_id)
    cash_resp = get_cashflow_forecast(company_id, min_cash_threshold=40000000.0)

    driver_names = [d.feature if hasattr(d, 'feature') else d.get("feature", "") for d in profit_drivers_resp[:3]] if profit_drivers_resp else []

    fin_ctx = FinancialContext(
        current_profit=profit_resp.current_profit if hasattr(profit_resp, 'current_profit') else profit_resp.get("current_profit", 0.0),
        predicted_profit=profit_resp.predicted_profit if hasattr(profit_resp, 'predicted_profit') else profit_resp.get("predicted_profit", 0.0),
        profit_change_pct=profit_resp.change_percentage if hasattr(profit_resp, 'change_percentage') else profit_resp.get("change_percentage", 0.0),
        profit_risk=RiskLevel(profit_resp.risk_level if hasattr(profit_resp, 'risk_level') else profit_resp.get("risk_level", "MEDIUM")),
        current_cash=cash_resp.current_cash if hasattr(cash_resp, 'current_cash') else cash_resp.get("current_cash", 0.0),
        predicted_cash=cash_resp.predicted_cash if hasattr(cash_resp, 'predicted_cash') else cash_resp.get("predicted_cash", 0.0),
        cashflow_risk=RiskLevel(cash_resp.risk_level if hasattr(cash_resp, 'risk_level') else cash_resp.get("risk_level", "MEDIUM")),
        min_cash_threshold=cash_resp.min_cash_threshold if hasattr(cash_resp, 'min_cash_threshold') else cash_resp.get("min_cash_threshold", 40000000.0),
        top_profit_drivers=driver_names
    )

    # 3. Customer Context (from Phase 4 Retention Service)
    ret_resp = get_retention_overview(company_id)
    high_risk_custs = ret_resp.high_risk_customers if hasattr(ret_resp, 'high_risk_customers') else ret_resp.get("high_risk_customers", [])
    high_risk_list = [c.dict() if hasattr(c, 'dict') else c for c in high_risk_custs[:3]]

    cust_ctx = CustomerContext(
        total_customers=ret_resp.total_customers if hasattr(ret_resp, 'total_customers') else ret_resp.get("total_customers", 0),
        high_risk_count=ret_resp.high_risk_count if hasattr(ret_resp, 'high_risk_count') else ret_resp.get("high_risk_count", 0),
        medium_risk_count=ret_resp.medium_risk_count if hasattr(ret_resp, 'medium_risk_count') else ret_resp.get("medium_risk_count", 0),
        low_risk_count=ret_resp.low_risk_count if hasattr(ret_resp, 'low_risk_count') else ret_resp.get("low_risk_count", 0),
        overall_churn_rate_pct=ret_resp.overall_churn_rate_pct if hasattr(ret_resp, 'overall_churn_rate_pct') else ret_resp.get("overall_churn_rate_pct", 0.0),
        top_risk_customers=high_risk_list
    )

    # 4. Operational Context (from PostgreSQL inventory, sales, purchases)
    total_skus = 0
    low_stock = 0
    sales_30d = 0.0
    purchases_30d = 0.0

    with engine.connect() as conn:
        prod_res = conn.execute(text("SELECT COUNT(DISTINCT product_id), COALESCE(SUM(CASE WHEN reorder_flag = true THEN 1 ELSE 0 END), 0) FROM inventory_snapshots WHERE company_id = :cid AND deleted_at IS NULL"), {"cid": str(company_id)}).fetchone()
        if prod_res:
            total_skus = prod_res[0] or 0
            low_stock = int(prod_res[1] or 0)

        sales_res = conn.execute(text("SELECT COALESCE(SUM(invoice_amount), 0) FROM sales WHERE company_id = :cid AND sales_date >= NOW() - INTERVAL '30 days' AND deleted_at IS NULL"), {"cid": str(company_id)}).fetchone()
        if sales_res:
            sales_30d = float(sales_res[0])

        purch_res = conn.execute(text("SELECT COALESCE(SUM(invoice_amount), 0) FROM purchases WHERE company_id = :cid AND purchase_date >= NOW() - INTERVAL '30 days' AND deleted_at IS NULL"), {"cid": str(company_id)}).fetchone()
        if purch_res:
            purchases_30d = float(purch_res[0])

    cogs_est = purchases_30d * 0.85

    ops_ctx = OperationalContext(
        total_active_products=total_skus,
        products_below_reorder=low_stock,
        sales_last_30_days=sales_30d,
        purchases_last_30_days=purchases_30d,
        cogs_estimate_30_days=cogs_est
    )

    return ExecutiveContext(
        organization=org_ctx,
        financial=fin_ctx,
        customers=cust_ctx,
        operations=ops_ctx
    )
