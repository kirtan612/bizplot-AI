"""
BizPilot AI - FastAPI Router for Phase 12 Advanced Multi-Agent Intelligence.
Exposes organization-isolated endpoints for Executive Queries, Boardroom Meetings, Findings, and Recommendations.
"""

from uuid import UUID
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from api.auth.dependencies import get_current_user, CurrentUser, get_db_session
from api.security.permissions import require_permission
from api.executives.orchestrator import ExecutiveOrchestrator
from src.db.models.executives import ExecutiveMeeting, ExecutiveFinding, ExecutiveRecommendation


router = APIRouter(prefix="/executives", tags=["Advanced Multi-Agent Intelligence"])


class MultiAgentQueryRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=1000)
    mode: str = Field(default="MULTI_AGENT", description="SINGLE_AGENT, MULTI_AGENT, EXECUTIVE_REVIEW")


@router.post("/query")
def execute_multi_agent_query(
    req: MultiAgentQueryRequest,
    current_user: CurrentUser = Depends(require_permission("executives.view")),
    db: Session = Depends(get_db_session)
):
    """Executes multi-agent query across CFO, COO, CMO, and CEO agents."""
    orchestrator = ExecutiveOrchestrator(db, current_user)
    return orchestrator.run_multi_agent_session(query_text=req.query, mode=req.mode)


@router.post("/meetings")
@router.post("/executive-meetings")
def create_executive_meeting(
    req: MultiAgentQueryRequest,
    current_user: CurrentUser = Depends(require_permission("executives.view")),
    db: Session = Depends(get_db_session)
):
    """Creates and executes an Executive Boardroom Meeting."""
    orchestrator = ExecutiveOrchestrator(db, current_user)
    return orchestrator.run_multi_agent_session(query_text=req.query, mode=req.mode)


@router.get("/meetings")
@router.get("/executive-meetings")
def list_executive_meetings(
    current_user: CurrentUser = Depends(require_permission("executives.view")),
    db: Session = Depends(get_db_session)
):
    """Lists organization-scoped executive boardroom meetings."""
    meetings = db.query(ExecutiveMeeting).filter(ExecutiveMeeting.company_id == current_user.company_id).all()
    return [
        {
            "id": str(m.id),
            "title": m.title,
            "status": m.status,
            "mode": m.mode,
            "agenda": m.agenda,
            "started_at": m.started_at.isoformat(),
            "completed_at": m.completed_at.isoformat() if m.completed_at else None
        }
        for m in meetings
    ]


@router.get("/meetings/{meeting_id}")
@router.get("/executive-meetings/{meeting_id}")
def get_executive_meeting_details(
    meeting_id: UUID,
    current_user: CurrentUser = Depends(require_permission("executives.view")),
    db: Session = Depends(get_db_session)
):
    """Gets details for a specific executive meeting."""
    meeting = db.query(ExecutiveMeeting).filter(
        ExecutiveMeeting.id == meeting_id,
        ExecutiveMeeting.company_id == current_user.company_id
    ).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Executive meeting not found")

    return {
        "id": str(meeting.id),
        "title": meeting.title,
        "status": meeting.status,
        "mode": meeting.mode,
        "agenda": meeting.agenda,
        "summary": meeting.summary,
        "started_at": meeting.started_at.isoformat(),
        "completed_at": meeting.completed_at.isoformat() if meeting.completed_at else None
    }


@router.get("/meetings/{meeting_id}/findings")
@router.get("/executive-meetings/{meeting_id}/findings")
def get_executive_meeting_findings(
    meeting_id: UUID,
    current_user: CurrentUser = Depends(require_permission("executives.view")),
    db: Session = Depends(get_db_session)
):
    """Gets evidence-backed findings for a specific meeting."""
    findings = db.query(ExecutiveFinding).filter(
        ExecutiveFinding.meeting_id == meeting_id,
        ExecutiveFinding.company_id == current_user.company_id
    ).all()
    return [
        {
            "id": str(f.id),
            "agent_role": f.agent_role,
            "finding_type": f.finding_type,
            "title": f.title,
            "description": f.description,
            "evidence": f.evidence,
            "confidence": f.confidence,
            "sources": f.sources_json
        }
        for f in findings
    ]


@router.get("/meetings/{meeting_id}/recommendations")
@router.get("/executive-meetings/{meeting_id}/recommendations")
def get_executive_meeting_recommendations(
    meeting_id: UUID,
    current_user: CurrentUser = Depends(require_permission("executives.view")),
    db: Session = Depends(get_db_session)
):
    """Gets strategic recommendations for a specific meeting."""
    recs = db.query(ExecutiveRecommendation).filter(
        ExecutiveRecommendation.meeting_id == meeting_id,
        ExecutiveRecommendation.company_id == current_user.company_id
    ).all()
    return [
        {
            "id": str(r.id),
            "agent_role": r.agent_role,
            "title": r.title,
            "reason": r.reason,
            "priority": r.priority,
            "owner": r.owner,
            "expected_impact": r.expected_impact,
            "risk": r.risk,
            "status": r.status
        }
        for r in recs
    ]
