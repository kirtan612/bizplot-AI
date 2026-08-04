"""
Authentication & Multi-Tenant Scaffolding Models
BizPilot AI Database Schema
"""

import uuid
from typing import Optional, List
from sqlalchemy import String, Boolean, ForeignKey, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base, AuditMixin


class Company(Base, AuditMixin):
    """Multi-tenant organization entity."""
    
    __tablename__ = "companies"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    members: Mapped[List["CompanyMember"]] = relationship(
        "CompanyMember", back_populates="company", cascade="all, delete-orphan", foreign_keys="CompanyMember.company_id"
    )
    import_jobs: Mapped[List["ImportJob"]] = relationship(
        "ImportJob", back_populates="company", cascade="all, delete-orphan", foreign_keys="ImportJob.company_id"
    )


class User(Base, AuditMixin):
    """User account entity."""
    
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    email: Mapped[Optional[str]] = mapped_column(String(255), unique=True, nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    company_memberships: Mapped[List["CompanyMember"]] = relationship(
        "CompanyMember", back_populates="user", cascade="all, delete-orphan", foreign_keys="CompanyMember.user_id"
    )


class Role(Base, AuditMixin):
    """System RBAC role entity (e.g., 'admin', 'staff')."""
    
    __tablename__ = "roles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    memberships: Mapped[List["CompanyMember"]] = relationship(
        "CompanyMember", back_populates="role", foreign_keys="CompanyMember.role_id"
    )


class CompanyMember(Base, AuditMixin):
    """Associative entity linking users to companies with specific roles."""
    
    __tablename__ = "company_members"
    __table_args__ = (
        UniqueConstraint("company_id", "user_id", name="uq_company_user_membership"),
    )

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
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    role_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("roles.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )

    # Relationships
    company: Mapped["Company"] = relationship("Company", back_populates="members", foreign_keys=[company_id])
    user: Mapped["User"] = relationship("User", back_populates="company_memberships", foreign_keys=[user_id])
    role: Mapped["Role"] = relationship("Role", back_populates="memberships", foreign_keys=[role_id])
