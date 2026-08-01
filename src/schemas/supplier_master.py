"""
Supplier Master Schema
Generated from: 02_Supplier_Master.md, Status: Draft v1.0
Domain: GI / MS Steel Pipe Distribution
"""

import uuid
from datetime import datetime, date
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

from src.schemas.product_master import Brand, Category


class SupplierTier(str, Enum):
    MILL = "Mill"
    DISTRIBUTOR = "Authorized Distributor"
    TRADER = "Trader"


class IndianState(str, Enum):
    PUNJAB = "Punjab"
    HARYANA = "Haryana"
    DELHI = "Delhi"
    UTTAR_PRADESH = "Uttar Pradesh"
    MAHARASHTRA = "Maharashtra"
    GUJARAT = "Gujarat"
    RAJASTHAN = "Rajasthan"
    TAMIL_NADU = "Tamil Nadu"
    KARNATAKA = "Karnataka"
    WEST_BENGAL = "West Bengal"
    TELANGANA = "Telangana"
    ANDHRA_PRADESH = "Andhra Pradesh"
    CHANDIGARH = "Chandigarh"
    HIMACHAL_PRADESH = "Himachal Pradesh"


class SupplierMasterModel(BaseModel):
    """Schema for a vendor/supplier entity."""
    
    supplier_id: uuid.UUID = Field(
        description="System-generated unique identifier, primary key"
    )
    supplier_code: str = Field(
        description="Deterministic human-readable code (format: SUP-{TIER_CODE}-{SEQ})"
    )
    supplier_name: str = Field(
        description="Legal entity name (matches GSTIN registration)"
    )
    supplier_tier: SupplierTier = Field(
        description="Supplier tier classification"
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
    contact_person: str = Field(
        description="Primary procurement contact name"
    )
    contact_phone: str = Field(
        description="10-digit mobile number"
    )
    contact_email: str = Field(
        description="Primary contact email address"
    )
    credit_period_days: int = Field(
        description="Standard payment terms in days from invoice date"
    )
    brands_supplied: List[Brand] = Field(
        description="List of brands this supplier can provide"
    )
    categories_supplied: List[Category] = Field(
        description="List of categories this supplier can provide (GI, MS, GP)"
    )
    active: bool = Field(
        description="Whether supplier relationship is currently active"
    )
    onboarding_date: date = Field(
        description="Date supplier was added to vendor master"
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
