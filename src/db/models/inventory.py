"""
Inventory Models (Stock Snapshots & Valuations)
BizPilot AI Database Schema
Matching shapes from Milestone 2 Pydantic schemas.
"""

import uuid
from datetime import date
from sqlalchemy import String, Boolean, Integer, Numeric, Date, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from src.db.base import Base, AuditMixin


class InventorySnapshot(Base, AuditMixin):
    """Periodic stock snapshot and valuation ledger record."""
    
    __tablename__ = "inventory_snapshots"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    snapshot_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    product_code: Mapped[str] = mapped_column(String(100), nullable=False)
    opening_qty_pcs: Mapped[int] = mapped_column(Integer, nullable=False)
    opening_weight_kg: Mapped[float] = mapped_column(Numeric(12, 4), nullable=False)
    purchased_qty_pcs: Mapped[int] = mapped_column(Integer, nullable=False)
    purchased_weight_kg: Mapped[float] = mapped_column(Numeric(12, 4), nullable=False)
    sold_qty_pcs: Mapped[int] = mapped_column(Integer, nullable=False)
    sold_weight_kg: Mapped[float] = mapped_column(Numeric(12, 4), nullable=False)
    closing_qty_pcs: Mapped[int] = mapped_column(Integer, nullable=False)
    closing_weight_kg: Mapped[float] = mapped_column(Numeric(12, 4), nullable=False)
    unit_cost_per_kg: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    inventory_valuation: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    reorder_level_pcs: Mapped[int] = mapped_column(Integer, nullable=False)
    reorder_flag: Mapped[bool] = mapped_column(Boolean, nullable=False)
