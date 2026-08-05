"""
Master Data Role-Stripped Schemas for BizPilot AI.
Strips confidential credit fields (credit_period_days, credit_limit) for Staff roles.
"""

from uuid import UUID
from decimal import Decimal
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

from src.schemas.supplier_master import IndianState, SupplierTier
from src.schemas.customer_master import CustomerType, PaymentBehaviorTier


# ==========================================
# Supplier Response Schemas
# ==========================================

class SupplierAdminResponse(BaseModel):
    """Full Supplier response schema for Admin role (includes credit_period_days)."""
    supplier_id: UUID
    supplier_code: str
    supplier_name: str
    supplier_tier: SupplierTier
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: IndianState
    pincode: str
    gstin: str
    pan: str
    contact_person: str
    contact_phone: str
    contact_email: str
    credit_period_days: int
    brands_supplied: List[str]
    categories_supplied: List[str]
    active: bool
    onboarding_date: date
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, use_enum_values=True)


class SupplierStaffResponse(BaseModel):
    """Role-stripped Supplier response schema for Staff role (omits credit_period_days)."""
    supplier_id: UUID
    supplier_code: str
    supplier_name: str
    supplier_tier: SupplierTier
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: IndianState
    pincode: str
    gstin: str
    pan: str
    contact_person: str
    contact_phone: str
    contact_email: str
    brands_supplied: List[str]
    categories_supplied: List[str]
    active: bool
    onboarding_date: date
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, use_enum_values=True)


# ==========================================
# Customer Response Schemas
# ==========================================

class CustomerAdminResponse(BaseModel):
    """Full Customer response schema for Admin role (includes credit_limit & credit_period_days)."""
    customer_id: UUID
    customer_code: str
    customer_name: str
    customer_type: CustomerType
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: IndianState
    pincode: str
    gst_registered: bool
    gstin: Optional[str] = None
    pan: str
    contact_person: str
    contact_phone: str
    contact_email: str
    credit_limit: Decimal
    credit_period_days: int
    payment_behavior_tier: PaymentBehaviorTier
    active: bool
    onboarding_date: date
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, use_enum_values=True)


class CustomerStaffResponse(BaseModel):
    """Role-stripped Customer response schema for Staff role (omits credit_limit & credit_period_days)."""
    customer_id: UUID
    customer_code: str
    customer_name: str
    customer_type: CustomerType
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: IndianState
    pincode: str
    gst_registered: bool
    gstin: Optional[str] = None
    pan: str
    contact_person: str
    contact_phone: str
    contact_email: str
    payment_behavior_tier: PaymentBehaviorTier
    active: bool
    onboarding_date: date
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, use_enum_values=True)
