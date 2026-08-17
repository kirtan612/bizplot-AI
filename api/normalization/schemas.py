"""
BizPilot AI - Phase 8 Data Normalization Pydantic Schemas.
Defines schemas for type normalization, entity matching confidence,
quality classification, normalization reports, and canonical entity DTOs.
"""

from enum import Enum
from datetime import date, datetime
from uuid import UUID
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class DataQualityState(str, Enum):
    VALID = "VALID"
    INVALID = "INVALID"
    SUSPICIOUS = "SUSPICIOUS"
    REQUIRES_REVIEW = "REQUIRES_REVIEW"


class MatchingConfidence(str, Enum):
    HIGH_CONFIDENCE = "HIGH_CONFIDENCE"
    MEDIUM_CONFIDENCE = "MEDIUM_CONFIDENCE"
    LOW_CONFIDENCE = "LOW_CONFIDENCE"
    UNMATCHED = "UNMATCHED"


class ReviewQueueStatus(str, Enum):
    REQUIRES_REVIEW = "REQUIRES_REVIEW"
    MERGED = "MERGED"
    KEEP_SEPARATE = "KEEP_SEPARATE"
    IGNORED = "IGNORED"


class NormalizationReport(BaseModel):
    job_id: str
    organization_id: str
    ingestion_id: str
    status: str
    records_received: int
    records_processed: int
    records_created: int
    records_updated: int
    records_duplicates: int
    records_skipped: int
    records_review_required: int
    records_failed: int
    valid_pct: float
    duplicate_pct: float
    started_at: str
    completed_at: str
    summary_message: str


class ColumnMappingPreview(BaseModel):
    source_column: str
    mapped_canonical_field: str
    confidence: MatchingConfidence
    data_type: str


class NormalizationPreviewResponse(BaseModel):
    ingestion_id: str
    detected_entity_type: str
    column_mappings: List[ColumnMappingPreview]
    total_rows_previewed: int
    sample_normalized_records: List[Dict[str, Any]]


class CanonicalCustomerDTO(BaseModel):
    id: Optional[str] = None
    organization_id: str
    external_reference: Optional[str] = None
    customer_code: str
    customer_name: str
    customer_type: str = "DISTRIBUTOR"
    contact_person: str = "Owner"
    contact_phone: str = "N/A"
    contact_email: str = "N/A"
    city: str = "Unspecified"
    state: str = "Unspecified"
    gstin: Optional[str] = None
    quality_state: DataQualityState = DataQualityState.VALID


class CanonicalSupplierDTO(BaseModel):
    id: Optional[str] = None
    organization_id: str
    external_reference: Optional[str] = None
    supplier_code: str
    supplier_name: str
    supplier_tier: str = "TIER_A"
    contact_person: str = "Manager"
    contact_phone: str = "N/A"
    contact_email: str = "N/A"
    city: str = "Unspecified"
    state: str = "Unspecified"
    gstin: Optional[str] = None
    quality_state: DataQualityState = DataQualityState.VALID


class CanonicalInvoiceDTO(BaseModel):
    id: Optional[str] = None
    organization_id: str
    external_reference: Optional[str] = None
    invoice_number: str
    invoice_type: str = "SALE"
    customer_id: Optional[str] = None
    supplier_id: Optional[str] = None
    invoice_date: str
    due_date: Optional[str] = None
    currency: str = "INR"
    subtotal: float = 0.0
    tax: float = 0.0
    discount: float = 0.0
    total: float = 0.0
    status: str = "PAID"
    source_type: str = "INGESTION"
