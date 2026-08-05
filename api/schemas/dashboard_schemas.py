"""
Dashboard Schemas for BizPilot AI.
Includes role-aware KPI responses (Admin includes cash_position, Staff omits key completely)
and merged recent activity feed items.
"""

from uuid import UUID
from decimal import Decimal
from datetime import date
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class AdminKPIResponse(BaseModel):
    """Full Dashboard KPIs response for Admin role (includes cash_position)."""
    total_active_products: int = Field(description="Total count of active product SKUs")
    products_below_reorder: int = Field(description="Products with current stock below reorder level")
    sales_last_30_days: Decimal = Field(description="Total sales invoice monetary value in last 30 days")
    purchases_last_30_days: Decimal = Field(description="Total purchase invoice monetary value in last 30 days")
    cash_position: Decimal = Field(description="Current net cash/bank ledger closing balance (Admin Only)")

    model_config = ConfigDict(use_enum_values=True)


class StaffKPIResponse(BaseModel):
    """Role-aware Dashboard KPIs response for Staff role (cash_position key COMPLETELY omitted)."""
    total_active_products: int = Field(description="Total count of active product SKUs")
    products_below_reorder: int = Field(description="Products with current stock below reorder level")
    sales_last_30_days: Decimal = Field(description="Total sales invoice monetary value in last 30 days")
    purchases_last_30_days: Decimal = Field(description="Total purchase invoice monetary value in last 30 days")

    model_config = ConfigDict(use_enum_values=True)


class RecentActivityItem(BaseModel):
    """Unified schema for merged Purchases, Sales, and Cashbook feed items."""
    activity_type: str = Field(description="Activity classification: 'purchase', 'sale', or 'cashbook'")
    activity_id: UUID = Field(description="Primary key UUID of the transaction record")
    reference_number: str = Field(description="Invoice number or voucher number")
    activity_date: date = Field(description="Date of transaction")
    party_name: str = Field(description="Supplier name, Customer name, or Cashbook party name")
    amount: Decimal = Field(description="Monetary transaction amount in ₹")
    details: Optional[str] = Field(default=None, description="Product code, payment status, or narration")

    model_config = ConfigDict(use_enum_values=True)
