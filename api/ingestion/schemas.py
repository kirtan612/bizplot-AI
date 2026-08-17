"""
BizPilot AI - Phase 7 Ingestion Pydantic Schemas.
Defines data structures for ingestion sources, status tracking, upload requests, and responses.
"""

from enum import Enum
from datetime import datetime
from uuid import UUID
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class IngestionSourceType(str, Enum):
    FILE_UPLOAD = "FILE_UPLOAD"
    EXCEL = "EXCEL"
    CSV = "CSV"
    PDF = "PDF"
    BANK_STATEMENT = "BANK_STATEMENT"
    CRM_EXPORT = "CRM_EXPORT"
    EMAIL = "EMAIL"
    ERP = "ERP"
    TALLY = "TALLY"
    GST = "GST"


class IngestionStatus(str, Enum):
    PENDING = "PENDING"
    VALIDATING = "VALIDATING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    PARTIAL = "PARTIAL"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    TEXT_EXTRACTION_REQUIRED = "TEXT_EXTRACTION_REQUIRED"
    OCR_REQUIRED = "OCR_REQUIRED"


class DuplicatePolicy(str, Enum):
    REJECT = "REJECT"
    ALLOW = "ALLOW"
    NEW_VERSION = "NEW_VERSION"


class IngestionSheetMetadata(BaseModel):
    name: str
    rows: int
    columns: int
    headers: List[str] = Field(default_factory=list)


class IngestionJobResponse(BaseModel):
    id: str
    organization_id: str
    source_type: IngestionSourceType
    source_name: str
    status: IngestionStatus
    file_name: str
    file_size_bytes: int
    content_hash: Optional[str] = None
    record_count: int = 0
    sheets: List[IngestionSheetMetadata] = Field(default_factory=list)
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    created_at: str
    error_message: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class IngestionListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[IngestionJobResponse]


class ConnectorStatusInfo(BaseModel):
    id: str
    name: str
    category: str
    source_type: IngestionSourceType
    status: str  # CONNECTED | AVAILABLE | DEVELOPMENT CONNECTOR | COMING SOON
    description: str
    is_live: bool
