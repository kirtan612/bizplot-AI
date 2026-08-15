"""
BizPilot AI - AI CMO Service.
Analyzes customer retention telemetry, churn probability, distributor tiers, and purchase frequency.
"""

from uuid import UUID
from typing import List
from api.executives.base import BaseExecutive
from api.executives.context import build_executive_context
from api.executives.schemas import ExecutiveContext, ExecutiveAnalysisResponse, ExecutiveQuestionResponse
from api.executives.llm_client import generate_cmo_deterministic_analysis


class CMOExecutive(BaseExecutive):
    def __init__(self):
        super().__init__(
            executive_id="ai-cmo",
            role="CMO",
            name="AI Chief Marketing Officer",
            responsibilities=[
                "Customer health and relationship management",
                "Customer retention and churn risk reduction",
                "Order frequency acceleration",
                "Distributor volume tier incentives",
                "Key account relationship management"
            ]
        )

    def build_context(self, company_id: UUID) -> ExecutiveContext:
        return build_executive_context(company_id)

    def analyze(self, company_id: UUID) -> ExecutiveAnalysisResponse:
        context = self.build_context(company_id)
        return generate_cmo_deterministic_analysis(context)

    def ask_question(self, company_id: UUID, asking_role: str, question: str) -> ExecutiveQuestionResponse:
        context = self.build_context(company_id)
        cust = context.customers

        answer = (
            f"Customer retention telemetry tracks {cust.total_customers} distributor accounts. "
            f"{cust.high_risk_count} accounts show high churn risk ({cust.overall_churn_rate_pct:.1f}% portfolio churn rate). "
            f"Key risk accounts show purchase order gaps exceeding 45 days."
        )

        return ExecutiveQuestionResponse(
            from_role=asking_role,
            to_role=self.role,
            question=question,
            answer=answer,
            supporting_findings=[
                f"{cust.high_risk_count} accounts in HIGH churn risk tier",
                f"Overall portfolio churn rate: {cust.overall_churn_rate_pct:.1f}%",
                f"Top risk accounts: {', '.join([c.get('customer_name', '') for c in cust.top_risk_customers])}"
            ]
        )
