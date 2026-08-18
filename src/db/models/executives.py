"""
BizPilot AI - Phase 12 Advanced Multi-Agent Intelligence Database Models.
Defines standardized SQLAlchemy 2.0 ORM entities:
ExecutiveAgent, ExecutiveMeeting, ExecutiveParticipant, ExecutiveMessage,
ExecutiveFinding, ExecutiveRecommendation, and ExecutiveConflict.
"""

import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Boolean, Integer, Numeric, DateTime, Text, ForeignKey, text
from sqlalchemy.types import JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from src.db.base import Base, AuditMixin


class ExecutiveAgent(Base, AuditMixin):
    """Registered specialized AI Executive agent instance."""
    
    __tablename__ = "executive_agents"

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
    agent_role: Mapped[str] = mapped_column(String(20), nullable=False, index=True)  # CFO, COO, CMO, CEO
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    capabilities_json: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="IDLE", index=True)


class ExecutiveMeeting(Base, AuditMixin):
    """Executive Boardroom meeting session record."""
    
    __tablename__ = "executive_meetings"

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
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="CREATED", index=True)  # CREATED, PLANNED, RUNNING, ANALYSIS, DISCUSSION, SYNTHESIS, COMPLETED, PARTIAL, FAILED
    mode: Mapped[str] = mapped_column(String(50), nullable=False, default="MULTI_AGENT")  # SINGLE_AGENT, MULTI_AGENT, EXECUTIVE_REVIEW
    agenda: Mapped[str] = mapped_column(Text, nullable=False, default="Quarterly Business & Operational Review")
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_by_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), nullable=True)


class ExecutiveParticipant(Base, AuditMixin):
    """Executive agent participating in a specific meeting session."""
    
    __tablename__ = "executive_participants"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    meeting_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("executive_meetings.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    agent_role: Mapped[str] = mapped_column(String(20), nullable=False)  # CFO, COO, CMO, CEO
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="ANALYZING")  # ANALYZING, COMPLETED, FAILED, UNAVAILABLE
    execution_time_ms: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.0)


class ExecutiveMessage(Base, AuditMixin):
    """Structured inter-agent communication message in a meeting."""
    
    __tablename__ = "executive_messages"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    meeting_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("executive_meetings.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    from_agent: Mapped[str] = mapped_column(String(20), nullable=False)
    to_agent: Mapped[str] = mapped_column(String(20), nullable=False)
    message_type: Mapped[str] = mapped_column(String(50), nullable=False, default="FINDING")  # REQUEST, FINDING, QUESTION, CHALLENGE, EVIDENCE, RECOMMENDATION, WARNING, CONFLICT, SUMMARY
    topic: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    confidence: Mapped[str] = mapped_column(String(20), nullable=False, default="HIGH")  # HIGH, MEDIUM, LOW
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)


class ExecutiveFinding(Base, AuditMixin):
    """Evidence-backed analytical finding produced by an executive agent."""
    
    __tablename__ = "executive_findings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    meeting_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("executive_meetings.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    agent_role: Mapped[str] = mapped_column(String(20), nullable=False)
    finding_type: Mapped[str] = mapped_column(String(50), nullable=False, default="FACT")  # FACT, PREDICTION, INTERPRETATION, RECOMMENDATION
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    evidence: Mapped[str] = mapped_column(Text, nullable=False)
    confidence: Mapped[str] = mapped_column(String(20), nullable=False, default="HIGH")
    sources_json: Mapped[dict] = mapped_column(JSON, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)


class ExecutiveRecommendation(Base, AuditMixin):
    """Structured strategic recommendation proposed by an executive agent."""
    
    __tablename__ = "executive_recommendations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    meeting_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("executive_meetings.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    agent_role: Mapped[str] = mapped_column(String(20), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    priority: Mapped[str] = mapped_column(String(20), nullable=False, default="HIGH")  # HIGH, MEDIUM, LOW
    owner: Mapped[str] = mapped_column(String(20), nullable=False, default="CFO")
    expected_impact: Mapped[str] = mapped_column(String(255), nullable=False, default="Impact not quantified")
    risk: Mapped[str] = mapped_column(String(255), nullable=False, default="Minimal operational disruption")
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="PROPOSED")  # PROPOSED, APPROVED, REJECTED, COMPLETED
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)


class ExecutiveConflict(Base, AuditMixin):
    """Detected disagreement between two executive agents with evidence comparison."""
    
    __tablename__ = "executive_conflicts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    meeting_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("executive_meetings.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    topic: Mapped[str] = mapped_column(String(255), nullable=False)
    agent_a: Mapped[str] = mapped_column(String(20), nullable=False)
    agent_b: Mapped[str] = mapped_column(String(20), nullable=False)
    claim_a: Mapped[str] = mapped_column(Text, nullable=False)
    claim_b: Mapped[str] = mapped_column(Text, nullable=False)
    evidence_a: Mapped[str] = mapped_column(Text, nullable=False)
    evidence_b: Mapped[str] = mapped_column(Text, nullable=False)
    resolution: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="OPEN")  # OPEN, RESOLVED, IGNORED
    resolved_by: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
