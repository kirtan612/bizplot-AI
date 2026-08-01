"""
Sales Register Schema
Generated from: 09_Sales_Register.md, Status: Draft v1.0
Domain: GI / MS Steel Pipe Distribution
"""

import uuid
from decimal import Decimal
from datetime import datetime, date
from pydantic import BaseModel, Field, ConfigDict

from src.schemas.purchase_register import PaymentStatus


class SalesRegisterModel(BaseModel):
    """Schema for a sales transaction record to a customer."""
    
    sales_id: uuid.UUID = Field(
        description="System-generated unique identifier, primary key"
    )
    invoice_number: str = Field(
        description="Outbound sales invoice number (format: INV-SAL-{YYYY}{MM}-{SEQ})"
    )
    sales_date: date = Field(
        description="Date of invoice / stock dispatch"
    )
    customer_id: uuid.UUID = Field(
        description="Foreign key referencing Customer Master"
    )
    customer_code: str = Field(
        description="Foreign key referencing Customer Master"
    )
    product_id: uuid.UUID = Field(
        description="Foreign key referencing Product Master"
    )
    product_code: str = Field(
        description="Foreign key referencing Product Master"
    )
    quantity_pcs: int = Field(
        description="Number of pipe pieces sold"
    )
    total_weight_kg: Decimal = Field(
        description="Total weight of line item in kg"
    )
    unit_price_per_kg: Decimal = Field(
        description="Effective selling price per kg"
    )
    taxable_value: Decimal = Field(
        description="Total taxable value = total_weight_kg * unit_price_per_kg"
    )
    is_interstate: bool = Field(
        description="True if customer state != company state (Gujarat), false otherwise"
    )
    cgst_rate: Decimal = Field(
        description="Central GST rate (9.00 for intrastate, 0.00 for interstate)"
    )
    cgst_amount: Decimal = Field(
        description="CGST amount in ₹ = taxable_value * (cgst_rate / 100)"
    )
    sgst_rate: Decimal = Field(
        description="State GST rate (9.00 for intrastate, 0.00 for interstate)"
    )
    sgst_amount: Decimal = Field(
        description="SGST amount in ₹ = taxable_value * (sgst_rate / 100)"
    )
    igst_rate: Decimal = Field(
        description="Integrated GST rate (18.00 for interstate, 0.00 for intrastate)"
    )
    igst_amount: Decimal = Field(
        description="IGST amount in ₹ = taxable_value * (igst_rate / 100)"
    )
    total_gst: Decimal = Field(
        description="Total GST amount = cgst_amount + sgst_amount + igst_amount"
    )
    invoice_amount: Decimal = Field(
        description="Total customer invoice amount = taxable_value + total_gst"
    )
    payment_status: PaymentStatus = Field(
        description="Settlement status of sales invoice"
    )
    payment_due_date: date = Field(
        description="Calculated due date = sales_date + customer.credit_period_days"
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
