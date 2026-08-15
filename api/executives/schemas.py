"""
BizPilot AI - Pydantic Schemas for Phase 6 AI Executive Layer.
Defines strongly-typed schemas for Executive Contexts, Executive Analyses (CFO, COO, CMO, CEO),
Inter-Executive Collaboration Q&A, and Boardroom Executive Meetings.
"""

from uuid import UUID
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from enum import Enum


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class ExecutiveStatus(str, Enum):
    OPTIMAL = "OPTIMAL"
    ATTENTION_REQUIRED = "ATTENTION_REQUIRED"
    CRITICAL_RISK = "CRITICAL_RISK"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"


class PriorityItem(BaseModel):
    priority: RiskLevel
    title: str
    reason: str


class RecommendationItem(BaseModel):
    title: str
    reason: str
    source: str
    area: Optional[str] = None


class QuestionItem(BaseModel):
    to_executive: str = Field(..., description="Role of target executive (e.g. COO, CFO)")
    question: str = Field(..., description="Targeted cross-functional question")


class ExecutiveModelInfo(BaseModel):
    name: str
    version: str = "1.0"
    status: str = "production"


class OrganizationContext(BaseModel):
    id: str
    name: str
    type: Optional[str] = None


class FinancialContext(BaseModel):
    current_profit: float
    predicted_profit: float
    profit_change_pct: float
    profit_risk: RiskLevel
    current_cash: float
    predicted_cash: float
    cashflow_risk: RiskLevel
    min_cash_threshold: float = 40000000.0
    top_profit_drivers: List[str] = Field(default_factory=list)


class CustomerContext(BaseModel):
    total_customers: int
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    overall_churn_rate_pct: float
    top_risk_customers: List[Dict[str, Any]] = Field(default_factory=list)


class OperationalContext(BaseModel):
    total_active_products: int
    products_below_reorder: int
    sales_last_30_days: float
    purchases_last_30_days: float
    cogs_estimate_30_days: float


class ExecutiveContext(BaseModel):
    organization: OrganizationContext
    financial: FinancialContext
    customers: CustomerContext
    operations: OperationalContext


class ExecutiveAnalysisResponse(BaseModel):
    executive: str = Field(..., description="CFO, COO, CMO, or CEO")
    name: str
    status: ExecutiveStatus
    risk_level: RiskLevel
    summary: str
    key_findings: List[str]
    priorities: List[PriorityItem]
    recommendations: List[RecommendationItem]
    questions_for_executives: List[QuestionItem]
    model_info: ExecutiveModelInfo


class ExecutiveQuestionRequest(BaseModel):
    from_role: str = Field(..., description="CFO, COO, CMO, or CEO")
    to_role: str = Field(..., description="Target executive role")
    question: str


class ExecutiveQuestionResponse(BaseModel):
    from_role: str
    to_role: str
    question: str
    answer: str
    supporting_findings: List[str] = Field(default_factory=list)


class StrategicDecision(BaseModel):
    priority: RiskLevel
    decision: str
    reason: str


class ActionItem(BaseModel):
    owner: str = Field(..., description="Owner executive role: CFO, COO, or CMO")
    action: str
    target_timeline: str = "Immediate (30 Days)"


class BoardroomMessage(BaseModel):
    from_executive: str
    to_executive: str
    message: str
    timestamp: str


class ExecutiveMeetingResponse(BaseModel):
    meeting_id: str
    organization_id: str
    started_at: str
    company_status: ExecutiveStatus
    summary: str
    top_risks: List[str]
    executive_summaries: Dict[str, str]
    strategic_priorities: List[str]
    decisions: List[StrategicDecision]
    actions: List[ActionItem]
    messages: List[BoardroomMessage]
