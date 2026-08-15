"""
BizPilot AI - Base Executive Interface.
Defines the standard abstract contract for all AI Executives (CFO, COO, CMO, CEO, and future roles).
"""

from abc import ABC, abstractmethod
from uuid import UUID
from typing import Dict, Any, List
from api.executives.schemas import ExecutiveContext, ExecutiveAnalysisResponse, ExecutiveQuestionResponse


class BaseExecutive(ABC):
    """Abstract base class for all AI Executives in BizPilot AI."""

    def __init__(self, executive_id: str, role: str, name: str, responsibilities: List[str]):
        self.executive_id = executive_id
        self.role = role
        self.name = name
        self.responsibilities = responsibilities

    @abstractmethod
    def build_context(self, company_id: UUID) -> ExecutiveContext:
        """Extract structured business context from PostgreSQL and Phase 4 services."""
        pass

    @abstractmethod
    def analyze(self, company_id: UUID) -> ExecutiveAnalysisResponse:
        """Perform executive analysis and generate structured output response."""
        pass

    @abstractmethod
    def ask_question(self, company_id: UUID, target_role: str, question: str) -> ExecutiveQuestionResponse:
        """Generate structured inter-executive question and answer."""
        pass
