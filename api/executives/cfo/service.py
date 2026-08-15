"""
BizPilot AI - AI CFO Service.
Analyzes financial health, operating profit forecasts, COGS, and cashflow risk.
"""

from uuid import UUID
from typing import List
from api.executives.base import BaseExecutive
from api.executives.context import build_executive_context
from api.executives.schemas import ExecutiveContext, ExecutiveAnalysisResponse, ExecutiveQuestionResponse
from api.executives.llm_client import generate_cfo_deterministic_analysis


class CFOExecutive(BaseExecutive):
    def __init__(self):
        super().__init__(
            executive_id="ai-cfo",
            role="CFO",
            name="AI Chief Financial Officer",
            responsibilities=[
                "Financial health analysis",
                "Profit forecasting interpretation",
                "Cashflow liquidity analysis",
                "COGS and margin structure oversight",
                "Treasury and working capital risk identification"
            ]
        )

    def build_context(self, company_id: UUID) -> ExecutiveContext:
        return build_executive_context(company_id)

    def analyze(self, company_id: UUID) -> ExecutiveAnalysisResponse:
        context = self.build_context(company_id)
        return generate_cfo_deterministic_analysis(context)

    def ask_question(self, company_id: UUID, asking_role: str, question: str) -> ExecutiveQuestionResponse:
        context = self.build_context(company_id)
        fin = context.financial
        ops = context.operations

        answer = (
            f"Financial analysis shows current monthly operating profit at ₹{fin.current_profit:,.2f} "
            f"with projected profit of ₹{fin.predicted_profit:,.2f} ({fin.profit_change_pct:+.1f}% MoM). "
            f"COGS estimate for the past 30 days is ₹{ops.cogs_estimate_30_days:,.2f} against purchase order total of ₹{ops.purchases_last_30_days:,.2f}."
        )

        return ExecutiveQuestionResponse(
            from_role=asking_role,
            to_role=self.role,
            question=question,
            answer=answer,
            supporting_findings=[
                f"Profit risk tier: {fin.profit_risk.value}",
                f"Top drivers: {', '.join(fin.top_profit_drivers)}",
                f"Cash position: ₹{fin.current_cash:,.2f}"
            ]
        )
