"""
BizPilot AI - Executive Context Service.
Builds permission-aware, organization-isolated executive context for CFO, COO, CMO, and CEO agents.
"""

from uuid import UUID
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from api.auth.dependencies import CurrentUser
from api.security.permissions import require_permission, has_permission
from api.executives.tools import ExecutiveTools
from api.services.knowledge_retrieval import KnowledgeRetrievalService
from api.executives.schemas import ExecutiveContext, OrganizationContext, FinancialContext, CustomerContext, OperationalContext, RiskLevel


class ExecutiveContextService:
    """Builds authorized, context-minimized inputs for specialized AI Executive agents."""

    def __init__(self, db: Session, user: CurrentUser):
        self.db = db
        self.user = user
        self.company_id = user.company_id
        self.tools = ExecutiveTools(db, user)
        self.rag_service = KnowledgeRetrievalService(db, user)

    def build_agent_context(self, agent_role: str, query_text: Optional[str] = None) -> Dict[str, Any]:
        """Constructs permission-filtered context dictionary for specific agent role."""
        org_context = {
            "id": str(self.company_id),
            "name": "BizPilot Enterprise",
            "role": self.user.role
        }

        agent_data: Dict[str, Any] = {
            "organization": org_context,
            "agent_role": agent_role,
            "structured_metrics": {},
            "rag_chunks": [],
            "ml_predictions": {}
        }

        # Query RAG context if query provided
        if query_text:
            chunks = self.rag_service.retrieve(query_text, top_k=3)
            agent_data["rag_chunks"] = [
                {
                    "content": c["chunk"].content[:200],
                    "document_id": str(c["chunk"].document_id) if c["chunk"].document_id else None,
                    "relevance_score": c["score"]
                }
                for c in chunks
            ]

        # Role-Specific Context Population
        if agent_role == "CFO":
            agent_data["structured_metrics"] = self.tools.get_cfo_financial_summary(agent_role)
            agent_data["ml_predictions"] = self.tools.get_cfo_cashflow_forecast(agent_role)

        elif agent_role == "COO":
            agent_data["structured_metrics"] = self.tools.get_coo_operational_metrics(agent_role)

        elif agent_role == "CMO":
            agent_data["structured_metrics"] = self.tools.get_cmo_customer_retention(agent_role)

        elif agent_role == "CEO":
            agent_data["structured_metrics"] = self.tools.get_ceo_cross_functional_summary(agent_role)
            # CEO receives synthesized summaries of CFO, COO, CMO
            agent_data["cfo_summary"] = self.tools.get_cfo_financial_summary("CFO")
            agent_data["coo_summary"] = self.tools.get_coo_operational_metrics("COO")
            agent_data["cmo_summary"] = self.tools.get_cmo_customer_retention("CMO")

        return agent_data
