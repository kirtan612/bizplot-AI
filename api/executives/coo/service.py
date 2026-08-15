"""
BizPilot AI - AI COO Service.
Analyzes operational health, inventory reorder levels, procurement COGS, and logistics.
"""

from uuid import UUID
from typing import List
from api.executives.base import BaseExecutive
from api.executives.context import build_executive_context
from api.executives.schemas import ExecutiveContext, ExecutiveAnalysisResponse, ExecutiveQuestionResponse
from api.executives.llm_client import generate_coo_deterministic_analysis


class COOExecutive(BaseExecutive):
    def __init__(self):
        super().__init__(
            executive_id="ai-coo",
            role="COO",
            name="AI Chief Operating Officer",
            responsibilities=[
                "Operational health and throughput",
                "Inventory stock level monitoring",
                "Purchase order procurement management",
                "Logistics and warehouse dispatch oversight",
                "Supplier pricing and COGS driver mitigation"
            ]
        )

    def build_context(self, company_id: UUID) -> ExecutiveContext:
        return build_executive_context(company_id)

    def analyze(self, company_id: UUID) -> ExecutiveAnalysisResponse:
        context = self.build_context(company_id)
        return generate_coo_deterministic_analysis(context)

    def ask_question(self, company_id: UUID, asking_role: str, question: str) -> ExecutiveQuestionResponse:
        context = self.build_context(company_id)
        ops = context.operations

        answer = (
            f"Operations telemetry shows {ops.products_below_reorder} product SKUs below reorder threshold "
            f"out of {ops.total_active_products} total catalog items. 30-day procurement total is ₹{ops.purchases_last_30_days:,.2f} "
            f"with estimated COGS of ₹{ops.cogs_estimate_30_days:,.2f}."
        )

        return ExecutiveQuestionResponse(
            from_role=asking_role,
            to_role=self.role,
            question=question,
            answer=answer,
            supporting_findings=[
                f"{ops.products_below_reorder} items need immediate supplier reorder",
                f"Sales throughput 30D: ₹{ops.sales_last_30_days:,.2f}",
                f"Purchases 30D: ₹{ops.purchases_last_30_days:,.2f}"
            ]
        )
