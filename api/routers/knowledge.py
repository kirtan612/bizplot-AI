"""
BizPilot AI - FastAPI Router for Phase 10 Company Knowledge Layer.
Exposes organization-scoped REST endpoints for Summary, Profile, Documents, Entities,
Relationships, Conflicts, Sources, Health, and Build Triggering.
"""

from uuid import UUID
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from api.auth.dependencies import get_current_user, CurrentUser, get_db_session
from api.security.permissions import require_permission
from api.knowledge.schemas import (
    CompanyProfileSchema,
    CompanyKnowledgeItemDTO,
    KnowledgeRelationshipDTO,
    KnowledgeSourceDTO,
    KnowledgeConflictDTO,
    KnowledgeResolveConflictRequest,
    KnowledgeBuildReport,
    KnowledgeSummaryDTO,
    KnowledgeHealthDTO,
)
from api.knowledge.services import (
    get_or_create_company_profile,
    update_company_profile,
    build_company_knowledge,
    get_knowledge_summary,
    get_knowledge_health,
    resolve_knowledge_conflict,
)
from api.knowledge.provider import KnowledgeProvider
from src.db.models.knowledge import CompanyKnowledgeItem, KnowledgeRelationship, KnowledgeSource, KnowledgeConflict

router = APIRouter()


@router.get("/summary", response_model=KnowledgeSummaryDTO)
def get_summary(
    current_user: CurrentUser = Depends(require_permission("executives.view")),
    db: Session = Depends(get_db_session)
):
    """Retrieves high-level organization knowledge metrics."""
    return get_knowledge_summary(db, current_user.company_id)


@router.get("/health", response_model=KnowledgeHealthDTO)
def get_health(
    current_user: CurrentUser = Depends(require_permission("executives.view")),
    db: Session = Depends(get_db_session)
):
    """Retrieves company data health score and unclassified metrics."""
    return get_knowledge_health(db, current_user.company_id)


@router.get("/profile", response_model=CompanyProfileSchema)
def get_profile(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Retrieves company profile and business metadata."""
    return get_or_create_company_profile(db, current_user.company_id)


@router.put("/profile", response_model=CompanyProfileSchema)
def update_profile(
    profile_data: Dict[str, Any],
    current_user: CurrentUser = Depends(require_permission("dashboard.view")),
    db: Session = Depends(get_db_session)
):
    """Updates company profile settings."""
    return update_company_profile(db, current_user.company_id, profile_data)


@router.get("/documents", response_model=List[CompanyKnowledgeItemDTO])
def get_documents(
    current_user: CurrentUser = Depends(require_permission("executives.view")),
    db: Session = Depends(get_db_session)
):
    """Retrieves document library knowledge items (RBAC & tenant filtered)."""
    provider = KnowledgeProvider(db, current_user)
    return provider.get_current("Document")


@router.get("/entities", response_model=List[CompanyKnowledgeItemDTO])
def get_entities(
    current_user: CurrentUser = Depends(require_permission("executives.view")),
    db: Session = Depends(get_db_session)
):
    """Retrieves business entity knowledge items."""
    provider = KnowledgeProvider(db, current_user)
    items = db.query(CompanyKnowledgeItem).filter(
        CompanyKnowledgeItem.company_id == current_user.company_id,
        CompanyKnowledgeItem.knowledge_type == "BUSINESS_ENTITY"
    ).all()
    return items


@router.get("/relationships", response_model=List[KnowledgeRelationshipDTO])
def get_relationships(
    current_user: CurrentUser = Depends(require_permission("executives.view")),
    db: Session = Depends(get_db_session)
):
    """Retrieves knowledge relationships graph links."""
    return db.query(KnowledgeRelationship).filter(
        KnowledgeRelationship.company_id == current_user.company_id
    ).all()


@router.get("/conflicts", response_model=List[KnowledgeConflictDTO])
def get_conflicts(
    current_user: CurrentUser = Depends(require_permission("executives.view")),
    db: Session = Depends(get_db_session)
):
    """Retrieves detected knowledge conflicts."""
    return db.query(KnowledgeConflict).filter(
        KnowledgeConflict.company_id == current_user.company_id
    ).all()


@router.post("/conflicts/{conflict_id}/resolve", response_model=KnowledgeConflictDTO)
def resolve_conflict(
    conflict_id: UUID,
    req: KnowledgeResolveConflictRequest,
    current_user: CurrentUser = Depends(require_permission("executives.view")),
    db: Session = Depends(get_db_session)
):
    """Audited resolution handler for knowledge conflicts."""
    try:
        return resolve_knowledge_conflict(
            db=db,
            company_id=current_user.company_id,
            conflict_id=conflict_id,
            resolution_notes=req.resolution_notes,
            status_val=req.status,
            user_id=current_user.user_id
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/sources", response_model=List[KnowledgeSourceDTO])
def get_sources(
    current_user: CurrentUser = Depends(require_permission("executives.view")),
    db: Session = Depends(get_db_session)
):
    """Retrieves knowledge ingestion source health & priorities."""
    return db.query(KnowledgeSource).filter(
        KnowledgeSource.company_id == current_user.company_id
    ).all()


@router.post("/build", response_model=KnowledgeBuildReport)
def trigger_knowledge_build(
    current_user: CurrentUser = Depends(require_permission("executives.view")),
    db: Session = Depends(get_db_session)
):
    """Triggers incremental company knowledge build run."""
    job = build_company_knowledge(db, current_user.company_id)
    return job
