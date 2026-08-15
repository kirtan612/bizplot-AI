"""
BizPilot AI - FastAPI Router for Phase 6 AI Executive Layer.
Exposes REST endpoints for AI CFO, AI COO, AI CMO, AI CEO,
Inter-Executive Collaboration Q&A, and Boardroom Meetings.
Enforces JWT Authentication and Multi-Tenant Organization Isolation.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from typing import List, Dict, Any

from api.auth.dependencies import get_current_user, CurrentUser
from api.executives.cfo.service import CFOExecutive
from api.executives.coo.service import COOExecutive
from api.executives.cmo.service import CMOExecutive
from api.executives.ceo.service import CEOExecutive
from api.executives.collaboration import process_executive_question
from api.executives.meeting import run_executive_meeting
from api.executives.schemas import (
    ExecutiveAnalysisResponse,
    ExecutiveQuestionRequest,
    ExecutiveQuestionResponse,
    ExecutiveMeetingResponse
)

router = APIRouter(prefix="/executives", tags=["AI Executives"])

cfo = CFOExecutive()
coo = COOExecutive()
cmo = CMOExecutive()
ceo = CEOExecutive()


@router.get("", response_model=List[Dict[str, Any]])
def list_executives(current_user: CurrentUser = Depends(get_current_user)):
    """List available AI Executives and their primary responsibilities."""
    return [
        {"id": cfo.executive_id, "role": cfo.role, "name": cfo.name, "responsibilities": cfo.responsibilities},
        {"id": coo.executive_id, "role": coo.role, "name": coo.name, "responsibilities": coo.responsibilities},
        {"id": cmo.executive_id, "role": cmo.role, "name": cmo.name, "responsibilities": cmo.responsibilities},
        {"id": ceo.executive_id, "role": ceo.role, "name": ceo.name, "responsibilities": ceo.responsibilities},
    ]


@router.get("/cfo", response_model=ExecutiveAnalysisResponse)
def get_cfo_analysis(current_user: CurrentUser = Depends(get_current_user)):
    """Get structured financial health and profit forecast analysis from AI CFO."""
    return cfo.analyze(current_user.company_id)


@router.get("/coo", response_model=ExecutiveAnalysisResponse)
def get_coo_analysis(current_user: CurrentUser = Depends(get_current_user)):
    """Get structured operational throughput and stock reorder analysis from AI COO."""
    return coo.analyze(current_user.company_id)


@router.get("/cmo", response_model=ExecutiveAnalysisResponse)
def get_cmo_analysis(current_user: CurrentUser = Depends(get_current_user)):
    """Get structured customer health and churn risk analysis from AI CMO."""
    return cmo.analyze(current_user.company_id)


@router.get("/ceo", response_model=ExecutiveAnalysisResponse)
def get_ceo_analysis(current_user: CurrentUser = Depends(get_current_user)):
    """Get strategic company-wide synthesis from AI CEO."""
    return ceo.analyze(current_user.company_id)


@router.post("/collaboration/ask", response_model=ExecutiveQuestionResponse)
def ask_executive_question(req: ExecutiveQuestionRequest, current_user: CurrentUser = Depends(get_current_user)):
    """Execute inter-executive Q&A exchange (e.g. CFO asking COO about COGS)."""
    return process_executive_question(current_user.company_id, req)


@router.post("/meeting/start", response_model=ExecutiveMeetingResponse)
def start_executive_meeting(current_user: CurrentUser = Depends(get_current_user)):
    """Start an automated executive boardroom meeting (CFO -> COO -> CMO -> CEO synthesis)."""
    return run_executive_meeting(current_user.company_id)


@router.get("/meeting/latest", response_model=ExecutiveMeetingResponse)
def get_latest_executive_meeting(current_user: CurrentUser = Depends(get_current_user)):
    """Get latest executive boardroom meeting analysis and action items."""
    return run_executive_meeting(current_user.company_id)
