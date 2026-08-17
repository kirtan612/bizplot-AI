"""
BizPilot AI - Canonical Business Data Models.
Defines standardized SQLAlchemy 2.0 ORM entities for normalized enterprise data:
Orders, OrderItems, Invoices, InvoiceItems, Payments, Expenses, BankTransactions,
Employees, TaxRecords, Documents, SourceLineage, NormalizationJobs, and ReviewQueue.
"""

import uuid
from datetime import date, datetime
from typing import Optional, List
from sqlalchemy import String, Boolean, Integer, Numeric, Date, DateTime, Text, ForeignKey, UniqueConstraint, text
from sqlalchemy.types import JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base, AuditMixin


class CanonicalOrder(Base, AuditMixin):
    """Canonical Order entity (Sales Order / Purchase Order)."""
    
    __tablename__ = "orders"

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
    external_reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    order_number: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    customer_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("customers.id", ondelete="SET NULL"), nullable=True, index=True)
    supplier_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True, index=True)
    order_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    order_type: Mapped[str] = mapped_column(String(20), nullable=False, default="SALE")  # SALE / PURCHASE
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="COMPLETED")
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="INR")
    subtotal: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    tax: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    discount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    total: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False, default="INGESTION")
    ingestion_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)


class CanonicalOrderItem(Base, AuditMixin):
    """Line item entity associated with a Canonical Order."""
    
    __tablename__ = "order_items"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    order_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    product_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    unit_price: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    discount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    tax: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    total: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)


class CanonicalInvoice(Base, AuditMixin):
    """Canonical Invoice entity."""
    
    __tablename__ = "invoices"

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
    external_reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    invoice_number: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    invoice_type: Mapped[str] = mapped_column(String(20), nullable=False, default="SALE")  # SALE / PURCHASE
    customer_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("customers.id", ondelete="SET NULL"), nullable=True, index=True)
    supplier_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True, index=True)
    invoice_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="INR")
    subtotal: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    tax: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    discount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    total: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="PAID")
    source_type: Mapped[str] = mapped_column(String(50), nullable=False, default="INGESTION")
    ingestion_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)


class CanonicalInvoiceItem(Base, AuditMixin):
    """Line item entity associated with a Canonical Invoice."""
    
    __tablename__ = "invoice_items"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    invoice_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("invoices.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    product_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    unit_price: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    discount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    tax: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    total: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)


class CanonicalPayment(Base, AuditMixin):
    """Canonical Payment transaction entity."""
    
    __tablename__ = "payments"

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
    external_reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    customer_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("customers.id", ondelete="SET NULL"), nullable=True, index=True)
    supplier_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True, index=True)
    invoice_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("invoices.id", ondelete="SET NULL"), nullable=True, index=True)
    payment_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="INR")
    payment_method: Mapped[str] = mapped_column(String(50), nullable=False, default="BANK_TRANSFER")
    reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="COMPLETED")
    source_type: Mapped[str] = mapped_column(String(50), nullable=False, default="INGESTION")
    ingestion_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)


class CanonicalExpense(Base, AuditMixin):
    """Canonical Expense entity."""
    
    __tablename__ = "expenses"

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
    external_reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    expense_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False, default="OPERATIONAL")
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    supplier_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True)
    amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    tax: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="INR")
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="PAID")
    source_type: Mapped[str] = mapped_column(String(50), nullable=False, default="INGESTION")
    ingestion_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)


class CanonicalBankTransaction(Base, AuditMixin):
    """Canonical Bank Transaction entity."""
    
    __tablename__ = "bank_transactions"

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
    external_reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    transaction_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    debit: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    credit: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    balance: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="INR")
    reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    account_reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False, default="BANK_STATEMENT")
    ingestion_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)


class CanonicalEmployee(Base, AuditMixin):
    """Canonical Employee entity."""
    
    __tablename__ = "employees"

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
    external_reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    department: Mapped[str] = mapped_column(String(100), nullable=False, default="General")
    role: Mapped[str] = mapped_column(String(100), nullable=False, default="Employee")
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="ACTIVE")


class CanonicalTaxRecord(Base, AuditMixin):
    """Canonical Tax Record entity."""
    
    __tablename__ = "tax_records"

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
    external_reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    tax_type: Mapped[str] = mapped_column(String(50), nullable=False, default="GST")  # GST / GSTR-1 / GSTR-3B / TDS
    tax_period: Mapped[str] = mapped_column(String(20), nullable=False)
    tax_amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    taxable_amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False, default=0.0)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="FILED")
    source_type: Mapped[str] = mapped_column(String(50), nullable=False, default="GST")
    ingestion_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)


class CanonicalDocument(Base, AuditMixin):
    """Canonical Document metadata entity."""
    
    __tablename__ = "documents"

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
    ingestion_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    document_type: Mapped[str] = mapped_column(String(50), nullable=False, default="GENERAL")
    document_date: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="PROCESSED")
    doc_metadata: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)


class SourceLineage(Base, AuditMixin):
    """Tracks origin and lineage of normalized canonical records."""
    
    __tablename__ = "source_lineage"

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
    entity_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    entity_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False)
    source_record_id: Mapped[str] = mapped_column(String(100), nullable=False)
    ingestion_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    content_hash: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)


class NormalizationJob(Base, AuditMixin):
    """Tracks Phase 8 normalization execution runs."""
    
    __tablename__ = "normalization_jobs"

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
    ingestion_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="PROCESSING", index=True)
    records_received: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    records_processed: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    records_created: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    records_updated: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    records_skipped: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    records_failed: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    error_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class ReviewQueueItem(Base, AuditMixin):
    """Queue for low-confidence or ambiguous normalized records requiring human review."""
    
    __tablename__ = "review_queue"

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
    ingestion_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    entity_type: Mapped[str] = mapped_column(String(50), nullable=False)
    raw_data: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    confidence_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, default=0.5)
    match_candidates: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="REQUIRES_REVIEW", index=True)  # REQUIRES_REVIEW / MERGED / SEPARATE / IGNORED
    reason: Mapped[str] = mapped_column(String(255), nullable=False)
