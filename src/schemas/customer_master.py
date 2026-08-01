"""
Customer Master Schema
Generated from: 03_Customer_Master.md, Status: Draft v1.0
Domain: GI / MS Steel Pipe Distribution
"""

import uuid
from decimal import Decimal
from datetime import datetime, date
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

from src.schemas.supplier_master import IndianState


class CustomerType(str, Enum):
    DISTRIBUTOR = "Distributor"
    RETAILER = "Retailer"
    FABRICATOR = "Fabricator"
    CONTRACTOR = "Contractor"


class PaymentBehaviorTier(str, Enum):
    PROMPT = "Prompt"
    SLOW = "Slow"
    IRREGULAR = "Irregular"


class CustomerMasterModel(BaseModel):
    """Schema for a customer entity."""
    
    customer_id: uuid.UUID = Field(
        description="System-generated unique identifier, primary key"
    )
    customer_code: str = Field(
        description="Deterministic human-readable code (format: CUST-{TYPE_CODE}-{SEQ})"
    )
    customer_name: str = Field(
        description="Registered legal entity or trade name"
    )
    customer_type: CustomerType = Field(
        description="Customer classification tier"
    )
    address_line1: str = Field(
        description="Business office or shop street address"
    )
    address_line2: Optional[str] = Field(
        default=None,
        description="Additional address detail (optional)"
    )
    city: str = Field(
        description="City of business registration"
    )
    state: IndianState = Field(
        description="Indian state of registration"
    )
    pincode: str = Field(
        description="6-digit postal code"
    )
    gst_registered: bool = Field(
        description="Whether customer is registered under GST (true/false)"
    )
    gstin: Optional[str] = Field(
        default=None,
        description="15-character GST identification number (null if unregistered)"
    )
    pan: str = Field(
        description="10-character PAN"
    )
    contact_person: str = Field(
        description="Primary contact person name"
    )
    contact_phone: str = Field(
        description="10-digit mobile number"
    )
    contact_email: str = Field(
        description="Primary contact email address"
    )
    credit_limit: Decimal = Field(
        description="Maximum allowed outstanding balance in ₹"
    )
    credit_period_days: int = Field(
        description="Standard payment terms in days from invoice date"
    )
    payment_behavior_tier: PaymentBehaviorTier = Field(
        description="Typical payment behavior (Prompt/Slow/Irregular)"
    )
    active: bool = Field(
        description="Whether customer is currently active for sales transactions"
    )
    onboarding_date: date = Field(
        description="Date customer was added to database"
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
