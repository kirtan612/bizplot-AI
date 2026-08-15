"""
BizPilot AI - AI CEO Service.
Aggregates CFO, COO, and CMO executive summaries to generate strategic company decisions and action plans.
"""

from uuid import UUID
from typing import List
from api.executives.base import BaseExecutive
from api.executives.context import build_executive_context
from api.executives.schemas import ExecutiveContext, ExecutiveAnalysisResponse, ExecutiveQuestionResponse
from api.executives.llm_client import generate_ceo_deterministic_analysis
from api.executives.cfo.service import CFOExecutive
from api.executives.coo.service import COOExecutive
from api.executives.cmo.service import CMOExecutive


class CEOExecutive(BaseExecutive):
    def __init__(self):
        super().__init__(
            executive_id="ai-ceo",
            role="CEO",
            name="AI Chief Executive Officer",
            responsibilities=[
                "Executive board synthesis and strategic alignment",
                "Cross-functional risk assessment",
                "Strategic priorities formulation",
                "Executive action owner assignment",
                "Company-wide decision authorization"
            ]
        )
        self.cfo = CFOExecutive()
        self.coo = COOExecutive()
        self.cmo = CMOExecutive()

    def build_context(self, company_id: UUID) -> ExecutiveContext:
        return build_executive_context(company_id)

    def analyze(self, company_id: UUID) -> ExecutiveAnalysisResponse:
        context = self.build_context(company_id)
        cfo_res = self.cfo.analyze(company_id)
        coo_res = self.coo.analyze(company_id)
        cmo_res = self.cmo.analyze(company_id)

        return generate_ceo_deterministic_analysis(context, cfo_res, coo_res, cmo_res)

    def ask_question(self, company_id: UUID, asking_role: str, question: str) -> ExecutiveQuestionResponse:
        context = self.build_context(company_id)
        cfo_res = self.cfo.analyze(company_id)
        coo_res = self.coo.analyze(company_id)
        cmo_res = self.cmo.analyze(company_id)

        answer = (
            f"CEO Boardroom Directives: Prioritize resolving operating profit risk ({cfo_res.risk_level.value}) "
            f"while maintaining operational throughput ({coo_res.risk_level.value}) and distributor retention ({cmo_res.risk_level.value})."
        )

        return ExecutiveQuestionResponse(
            from_role=asking_role,
            to_role=self.role,
            question=question,
            answer=answer,
            supporting_findings=[
                f"CFO status: {cfo_res.status.value}",
                f"COO status: {coo_res.status.value}",
                f"CMO status: {cmo_res.status.value}"
            ]
        )
