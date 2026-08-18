"""
BizPilot AI - Pydantic Schemas for Phase 10 Company Knowledge Layer.
"""

from uuid import UUID
from datetime import date, datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class CompanyProfileSchema(BaseModel):
    id: Optional[UUID] = None
    company_id: UUID
    company_name: str
    industry: str = "Steel Distribution & Manufacturing"
    business_type: str = "B2B Distributor"
    primary_market: str = "National / Regional"
    company_size: str = "SMB (50-200 employees)"
    fiscal_year: str = "April - March (FY)"
    default_currency: str = "INR"
    timezone: str = "Asia/Kolkata"
    business_description: str = "Steel pipe manufacturing & distribution operating system."

    class Config:
        from_attributes = True


class CompanyKnowledgeItemDTO(BaseModel):
    id: UUID
    company_id: UUID
    knowledge_type: str
    entity_type: str
    entity_id: Optional[str] = None
    title: str
    description: str
    source_type: str
    source_id: Optional[str] = None
    ingestion_id: Optional[str] = None
    visibility: str
    confidence: str
    valid_from: date
    valid_until: Optional[date] = None
    is_current: bool
    version: int
    metadata_json: Dict[str, Any] = {}
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class KnowledgeRelationshipDTO(BaseModel):
    id: UUID
    company_id: UUID
    source_knowledge_id: UUID
    relationship_type: str
    target_knowledge_id: UUID
    confidence: float
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class KnowledgeSourceDTO(BaseModel):
    id: UUID
    company_id: UUID
    source_type: str
    source_name: str
    last_ingested_at: Optional[datetime] = None
    last_normalized_at: Optional[datetime] = None
    last_knowledge_build_at: Optional[datetime] = None
    priority: int
    status: str

    class Config:
        from_attributes = True


class KnowledgeConflictDTO(BaseModel):
    id: UUID
    company_id: UUID
    fact_name: str
    source_a_type: str
    value_a: str
    source_b_type: str
    value_b: str
    status: str
    resolution_notes: Optional[str] = None
    resolved_by_user_id: Optional[UUID] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class KnowledgeResolveConflictRequest(BaseModel):
    resolution_notes: str = Field(..., min_length=3, max_length=1000)
    status: str = "RESOLVED"  # RESOLVED or IGNORED


class KnowledgeBuildReport(BaseModel):
    id: UUID
    company_id: UUID
    status: str
    records_processed: int
    knowledge_items_created: int
    relationships_created: int
    conflicts_detected: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    error_summary: Optional[str] = None

    class Config:
        from_attributes = True


class KnowledgeSummaryDTO(BaseModel):
    company_id: UUID
    company_name: str
    total_knowledge_items: int
    business_entities_count: int
    documents_count: int
    facts_count: int
    relationships_count: int
    knowledge_sources_count: int
    open_conflicts_count: int
    last_knowledge_build_at: Optional[datetime] = None


class KnowledgeHealthDTO(BaseModel):
    company_id: UUID
    overall_health_score: float  # 0.0 - 100.0%
    canonical_valid_pct: float
    documents_total: int
    unclassified_documents: int
    unresolved_relationships: int
    open_conflicts: int
    stale_sources: int
    last_updated: datetime
