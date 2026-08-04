"""
Master Data Models
BizPilot AI Database Schema
Matching shapes from Milestone 2 Pydantic schemas.
"""

import uuid
from datetime import date
from typing import Optional, List
from sqlalchemy import String, Boolean, Integer, Numeric, Date, ForeignKey, UniqueConstraint, text
from sqlalchemy.types import JSON
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base, AuditMixin



class CompanyMaster(Base, AuditMixin):
    """Distributor company master details (single row per company)."""
    
    __tablename__ = "company_master"

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
    company_code: Mapped[str] = mapped_column(String(50), nullable=False, default="COMP-001")
    legal_name: Mapped[str] = mapped_column(String(255), nullable=False)
    trade_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    company_type: Mapped[str] = mapped_column(String(50), nullable=False)
    address_line1: Mapped[str] = mapped_column(String(255), nullable=False)
    address_line2: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    pincode: Mapped[str] = mapped_column(String(10), nullable=False)
    gstin: Mapped[str] = mapped_column(String(15), nullable=False)
    pan: Mapped[str] = mapped_column(String(10), nullable=False)
    cin: Mapped[Optional[str]] = mapped_column(String(21), nullable=True)
    contact_person: Mapped[str] = mapped_column(String(100), nullable=False)
    contact_phone: Mapped[str] = mapped_column(String(20), nullable=False)
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False)
    financial_year_start: Mapped[str] = mapped_column(String(10), nullable=False, default="04-01")
    current_fy: Mapped[str] = mapped_column(String(20), nullable=False, default="FY 2024-25")
    opening_balance_date: Mapped[date] = mapped_column(Date, nullable=False)
    bank_name: Mapped[str] = mapped_column(String(100), nullable=False)
    bank_account_number: Mapped[str] = mapped_column(String(50), nullable=False)
    bank_ifsc: Mapped[str] = mapped_column(String(20), nullable=False)


class Product(Base, AuditMixin):
    """Physical pipe product SKU entity."""
    
    __tablename__ = "products"
    __table_args__ = (
        UniqueConstraint("company_id", "product_code", name="uq_company_product_code"),
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
    product_code: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    brand: Mapped[str] = mapped_column(String(50), nullable=False)
    category: Mapped[str] = mapped_column(String(10), nullable=False)
    shape: Mapped[str] = mapped_column(String(20), nullable=False)
    size: Mapped[str] = mapped_column(String(50), nullable=False)
    weight_class: Mapped[str] = mapped_column(String(20), nullable=False)
    weight_per_meter: Mapped[float] = mapped_column(Numeric(10, 4), nullable=False)
    length: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    gst: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, default=18.00)
    hsn_code: Mapped[str] = mapped_column(String(10), nullable=False, default="7306")
    standard_ref: Mapped[str] = mapped_column(String(20), nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class Supplier(Base, AuditMixin):
    """Vendor/Supplier master entity."""
    
    __tablename__ = "suppliers"
    __table_args__ = (
        UniqueConstraint("company_id", "supplier_code", name="uq_company_supplier_code"),
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
    supplier_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    supplier_name: Mapped[str] = mapped_column(String(255), nullable=False)
    supplier_tier: Mapped[str] = mapped_column(String(50), nullable=False)
    address_line1: Mapped[str] = mapped_column(String(255), nullable=False)
    address_line2: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    pincode: Mapped[str] = mapped_column(String(10), nullable=False)
    gstin: Mapped[str] = mapped_column(String(15), nullable=False)
    pan: Mapped[str] = mapped_column(String(10), nullable=False)
    contact_person: Mapped[str] = mapped_column(String(100), nullable=False)
    contact_phone: Mapped[str] = mapped_column(String(20), nullable=False)
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False)
    credit_period_days: Mapped[int] = mapped_column(Integer, nullable=False)
    brands_supplied: Mapped[List[str]] = mapped_column(ARRAY(String(50)).with_variant(JSON, "sqlite"), nullable=False)
    categories_supplied: Mapped[List[str]] = mapped_column(ARRAY(String(10)).with_variant(JSON, "sqlite"), nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    onboarding_date: Mapped[date] = mapped_column(Date, nullable=False)


class Customer(Base, AuditMixin):
    """Customer entity."""
    
    __tablename__ = "customers"
    __table_args__ = (
        UniqueConstraint("company_id", "customer_code", name="uq_company_customer_code"),
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
    customer_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    customer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    customer_type: Mapped[str] = mapped_column(String(50), nullable=False)
    address_line1: Mapped[str] = mapped_column(String(255), nullable=False)
    address_line2: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    pincode: Mapped[str] = mapped_column(String(10), nullable=False)
    gst_registered: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    gstin: Mapped[Optional[str]] = mapped_column(String(15), nullable=True)
    pan: Mapped[str] = mapped_column(String(10), nullable=False)
    contact_person: Mapped[str] = mapped_column(String(100), nullable=False)
    contact_phone: Mapped[str] = mapped_column(String(20), nullable=False)
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False)
    credit_limit: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    credit_period_days: Mapped[int] = mapped_column(Integer, nullable=False)
    payment_behavior_tier: Mapped[str] = mapped_column(String(50), nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    onboarding_date: Mapped[date] = mapped_column(Date, nullable=False)


class SteelIndex(Base, AuditMixin):
    """Periodic steel raw material reference index."""
    
    __tablename__ = "steel_index"

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
    effective_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    national_rate_per_kg: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    regional_rate_per_kg: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    region_label: Mapped[str] = mapped_column(String(50), nullable=False, default="Raipur/CG")
    source_type: Mapped[str] = mapped_column(String(100), nullable=False, default="Mill Offer Tracking")
    change_reason: Mapped[str] = mapped_column(String(100), nullable=False)


class PriceHistory(Base, AuditMixin):
    """Historical product list and effective transaction prices."""
    
    __tablename__ = "price_history"

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
    effective_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    product_code: Mapped[str] = mapped_column(String(100), nullable=False)
    index_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("steel_index.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    base_index_rate: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    brand_multiplier: Mapped[float] = mapped_column(Numeric(6, 4), nullable=False)
    category_adjustment: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    calculated_list_price_per_kg: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    purchase_discount_pct: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    effective_purchase_price_per_kg: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    sales_margin_pct: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    effective_sales_price_per_kg: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
