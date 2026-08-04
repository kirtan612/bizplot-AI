"""
Transaction Models (Purchases, Sales, Cashbook)
BizPilot AI Database Schema
Matching shapes from Milestone 2 Pydantic schemas.
"""

import uuid
from datetime import date
from typing import Optional
from sqlalchemy import String, Boolean, Integer, Numeric, Date, Text, ForeignKey, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from src.db.base import Base, AuditMixin


class Purchase(Base, AuditMixin):
    """Purchase transaction record from a supplier."""
    
    __tablename__ = "purchases"
    __table_args__ = (
        UniqueConstraint("company_id", "invoice_number", name="uq_company_purchase_invoice"),
    )

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
    invoice_number: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    purchase_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    supplier_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("suppliers.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    supplier_code: Mapped[str] = mapped_column(String(50), nullable=False)
    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    product_code: Mapped[str] = mapped_column(String(100), nullable=False)
    quantity_pcs: Mapped[int] = mapped_column(Integer, nullable=False)
    total_weight_kg: Mapped[float] = mapped_column(Numeric(12, 4), nullable=False)
    unit_price_per_kg: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    taxable_value: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    is_interstate: Mapped[bool] = mapped_column(Boolean, nullable=False)
    cgst_rate: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    cgst_amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    sgst_rate: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    sgst_amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    igst_rate: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    igst_amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    total_gst: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    invoice_amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    payment_status: Mapped[str] = mapped_column(String(20), nullable=False)
    payment_due_date: Mapped[date] = mapped_column(Date, nullable=False)


class Sale(Base, AuditMixin):
    """Sales transaction record to a customer."""
    
    __tablename__ = "sales"
    __table_args__ = (
        UniqueConstraint("company_id", "invoice_number", name="uq_company_sales_invoice"),
    )

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
    invoice_number: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    sales_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    customer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("customers.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    customer_code: Mapped[str] = mapped_column(String(50), nullable=False)
    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    product_code: Mapped[str] = mapped_column(String(100), nullable=False)
    quantity_pcs: Mapped[int] = mapped_column(Integer, nullable=False)
    total_weight_kg: Mapped[float] = mapped_column(Numeric(12, 4), nullable=False)
    unit_price_per_kg: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    taxable_value: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    is_interstate: Mapped[bool] = mapped_column(Boolean, nullable=False)
    cgst_rate: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    cgst_amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    sgst_rate: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    sgst_amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    igst_rate: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    igst_amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    total_gst: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    invoice_amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    payment_status: Mapped[str] = mapped_column(String(20), nullable=False)
    payment_due_date: Mapped[date] = mapped_column(Date, nullable=False)


class Cashbook(Base, AuditMixin):
    """Cash or bank receipt/payment entry."""
    
    __tablename__ = "cashbook"
    __table_args__ = (
        UniqueConstraint("company_id", "voucher_number", name="uq_company_cashbook_voucher"),
    )

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
    entry_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    voucher_number: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    transaction_type: Mapped[str] = mapped_column(String(20), nullable=False)
    party_type: Mapped[str] = mapped_column(String(20), nullable=False)
    party_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), nullable=True)
    party_name: Mapped[str] = mapped_column(String(255), nullable=False)
    payment_mode: Mapped[str] = mapped_column(String(50), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    reference_invoice_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    opening_balance: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    closing_balance: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    narration: Mapped[str] = mapped_column(Text, nullable=False)
