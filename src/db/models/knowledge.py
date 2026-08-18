"""
BizPilot AI - Company Knowledge Layer Database Models.
Defines standardized SQLAlchemy 2.0 ORM entities for Phase 10 Knowledge:
CompanyProfile, CompanyKnowledgeItem, KnowledgeRelationship, KnowledgeSource,
KnowledgeConflict, and KnowledgeBuildJob.
"""

import uuid
from datetime import date, datetime
from typing import Optional, List
from sqlalchemy import String, Boolean, Integer, Numeric, Date, DateTime, Text, ForeignKey, UniqueConstraint, text
from sqlalchemy.types import JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base, AuditMixin


class CompanyProfile(Base, AuditMixin):
    """Company profile and organizational knowledge configuration."""
    
    __tablename__ = "company_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    industry: Mapped[str] = mapped_column(String(100), nullable=False, default="Steel Distribution & Manufacturing")
    business_type: Mapped[str] = mapped_column(String(100), nullable=False, default="B2B Distributor")
    primary_market: Mapped[str] = mapped_column(String(100), nullable=False, default="National / Regional")
    company_size: Mapped[str] = mapped_column(String(50), nullable=False, default="SMB (50-200 employees)")
    fiscal_year: Mapped[str] = mapped_column(String(20), nullable=False, default="April - March (FY)")
    default_currency: Mapped[str] = mapped_column(String(10), nullable=False, default="INR")
    timezone: Mapped[str] = mapped_column(String(50), nullable=False, default="Asia/Kolkata")
    business_description: Mapped[str] = mapped_column(Text, nullable=False, default="Steel pipe manufacturing & distribution operating system.")


class CompanyKnowledgeItem(Base, AuditMixin):
    """Unified knowledge item entity referencing canonical entities or documents."""
    
    __tablename__ = "company_knowledge"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    knowledge_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)  # BUSINESS_ENTITY, BUSINESS_FACT, DOCUMENT, TRANSACTION, POLICY
    entity_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)  # Customer, Supplier, Invoice, Product, Order, Document
    entity_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Text] = mapped_column(Text, nullable=False)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False, default="CANONICAL")
    source_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    ingestion_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    visibility: Mapped[str] = mapped_column(String(50), nullable=False, default="INTERNAL", index=True)  # PUBLIC_TO_ORG, INTERNAL, CONFIDENTIAL, RESTRICTED
    confidence: Mapped[str] = mapped_column(String(20), nullable=False, default="HIGH")  # HIGH, MEDIUM, LOW
    valid_from: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    valid_until: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, index=True)
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    metadata_json: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)


class KnowledgeRelationship(Base, AuditMixin):
    """Connects related knowledge items (e.g. Customer -> Order -> Invoice)."""
    
    __tablename__ = "knowledge_relationships"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    source_knowledge_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("company_knowledge.id", ondelete="CASCADE"), nullable=False, index=True)
    relationship_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)  # PLACED_ORDER, INVOICED_BY, SETTLED_BY, REFERENCES_DOCUMENT
    target_knowledge_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("company_knowledge.id", ondelete="CASCADE"), nullable=False, index=True)
    confidence: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, default=1.0)


class KnowledgeSource(Base, AuditMixin):
    """Tracks state and priorities of knowledge ingestion & normalization sources."""
    
    __tablename__ = "knowledge_sources"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    source_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    source_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_ingested_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    last_normalized_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    last_knowledge_build_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    priority: Mapped[int] = mapped_column(Integer, nullable=False, default=1)  # 1 = Highest
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="HEALTHY")


class KnowledgeConflict(Base, AuditMixin):
    """Tracks detected conflicts between distinct data sources for human resolution."""
    
    __tablename__ = "knowledge_conflicts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    fact_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    source_a_type: Mapped[str] = mapped_column(String(50), nullable=False)
    value_a: Mapped[str] = mapped_column(Text, nullable=False)
    source_b_type: Mapped[str] = mapped_column(String(50), nullable=False)
    value_b: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="OPEN", index=True)  # OPEN, RESOLVED, IGNORED
    resolution_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    resolved_by_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), nullable=True)


class KnowledgeBuildJob(Base, AuditMixin):
    """Tracks knowledge build execution runs."""
    
    __tablename__ = "knowledge_build_jobs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="PROCESSING", index=True)
    records_processed: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    knowledge_items_created: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    relationships_created: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    conflicts_detected: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    error_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
