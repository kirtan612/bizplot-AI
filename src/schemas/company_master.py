"""
Company Master Schema
Generated from: 04_Company_Master.md, Status: Draft v1.0
Domain: GI / MS Steel Pipe Distribution
"""

import uuid
from datetime import datetime, date
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

from src.schemas.supplier_master import IndianState


class CompanyType(str, Enum):
    PROPRIETORSHIP = "Proprietorship"
    PARTNERSHIP = "Partnership"
    PRIVATE_LIMITED = "Private Limited"
    PUBLIC_LIMITED = "Public Limited"


class CompanyMasterModel(BaseModel):
    """Schema for the distributor company itself (single-row master)."""
    
    company_id: uuid.UUID = Field(
        description="System-generated unique identifier, primary key"
    )
    company_code: str = Field(
        description="Unique identifier, must be exactly 'COMP-001'"
    )
    legal_name: str = Field(
        description="Registered legal name (matches GSTIN registration)"
    )
    trade_name: Optional[str] = Field(
        default=None,
        description="Brand/Trade name (optional)"
    )
    company_type: CompanyType = Field(
        description="Legal constitution of business"
    )
    address_line1: str = Field(
        description="Registered office street address"
    )
    address_line2: Optional[str] = Field(
        default=None,
        description="Additional address detail (optional)"
    )
    city: str = Field(
        description="City of registration"
    )
    state: IndianState = Field(
        description="Indian state of registration"
    )
    pincode: str = Field(
        description="6-digit postal code"
    )
    gstin: str = Field(
        description="15-character GST identification number"
    )
    pan: str = Field(
        description="10-character PAN (embedded in GSTIN)"
    )
    cin: Optional[str] = Field(
        default=None,
        description="21-character Corporate Identity Number (required for PVT LTD/LTD)"
    )
    contact_person: str = Field(
        description="Primary operations contact name"
    )
    contact_phone: str = Field(
        description="10-digit mobile number"
    )
    contact_email: str = Field(
        description="Primary company contact email address"
    )
    financial_year_start: str = Field(
        description="Financial year starting month-day (format: MM-DD)"
    )
    current_fy: str = Field(
        description="Active financial year label (format: FY YYYY-YY)"
    )
    opening_balance_date: date = Field(
        description="Date of opening ledger balances (aligns with FY start)"
    )
    bank_name: str = Field(
        description="Primary clearing bank name"
    )
    bank_account_number: str = Field(
        description="Bank account number (10 to 18 digits)"
    )
    bank_ifsc: str = Field(
        description="11-character Indian Financial System Code"
    )
    created_at: datetime = Field(
        description="Row creation time (timezone-aware UTC)"
    )
    updated_at: datetime = Field(
        description="Last modification time (timezone-aware UTC)"
    )

    model_config = ConfigDict(
        use_enum_values=True,
        json_schema_serialization_defaults_required=True
    )
