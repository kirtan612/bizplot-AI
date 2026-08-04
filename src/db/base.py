"""
SQLAlchemy Base & Audit Mixin Configuration
BizPilot AI Database Schema
"""

import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, ForeignKey, text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Declarative base class for all SQLAlchemy models."""
    pass


class AuditMixin:
    """
    Audit fields mixin applied to every business and scaffolding table.
    Enforces soft-deletes via deleted_at and tracks timestamp/user auditing.
    """
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        comment="Timestamp of record creation (UTC)"
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
        comment="Timestamp of last modification (UTC)"
    )
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        comment="User ID who created the record"
    )
    updated_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        comment="User ID who last modified the record"
    )
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None,
        index=True,
        comment="Timestamp of soft delete (NULL means active)"
    )
