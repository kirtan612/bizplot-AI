"""
Data Import Tracking Models
BizPilot AI Database Schema
"""

import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, Text, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base, AuditMixin


class ImportJob(Base, AuditMixin):
    """Job record tracking data ingestion runs per company."""
    
    __tablename__ = "import_jobs"

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
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="pending", index=True)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    finished_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    company: Mapped["Company"] = relationship("Company", back_populates="import_jobs", foreign_keys=[company_id])
    files: Mapped[List["ImportFile"]] = relationship(
        "ImportFile", back_populates="import_job", cascade="all, delete-orphan", foreign_keys="ImportFile.import_job_id"
    )
    logs: Mapped[List["ImportLog"]] = relationship(
        "ImportLog", back_populates="import_job", cascade="all, delete-orphan", foreign_keys="ImportLog.import_job_id"
    )


class ImportFile(Base, AuditMixin):
    """Track individual file metadata associated with an import job."""
    
    __tablename__ = "import_files"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    import_job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("import_jobs.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    row_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    checksum: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

    # Relationships
    import_job: Mapped["ImportJob"] = relationship("ImportJob", back_populates="files", foreign_keys=[import_job_id])


class ImportLog(Base, AuditMixin):
    """Granular error, warning, and progress logs for an import job."""
    
    __tablename__ = "import_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    import_job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("import_jobs.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    level: Mapped[str] = mapped_column(String(20), nullable=False, default="INFO")
    message: Mapped[str] = mapped_column(Text, nullable=False)
    row_ref: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Relationships
    import_job: Mapped["ImportJob"] = relationship("ImportJob", back_populates="logs", foreign_keys=[import_job_id])
