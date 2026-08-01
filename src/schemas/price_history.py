"""
Price History Schema
Generated from: 06_Price_History.md, Status: Draft v1.0
Domain: GI / MS Steel Pipe Distribution
"""

import uuid
from decimal import Decimal
from datetime import datetime, date
from pydantic import BaseModel, Field, ConfigDict


class PriceHistoryModel(BaseModel):
    """Schema for historical product list and effective transaction prices."""
    
    price_id: uuid.UUID = Field(
        description="System-generated unique identifier, primary key"
    )
    effective_date: date = Field(
        description="Date from which these prices are effective (matches index effective_date)"
    )
    product_id: uuid.UUID = Field(
        description="Foreign key referencing Product Master"
    )
    product_code: str = Field(
        description="Foreign key referencing Product Master"
    )
    index_id: uuid.UUID = Field(
        description="Foreign key referencing Steel Market Index"
    )
    base_index_rate: Decimal = Field(
        description="Base rate per kg from Steel Market Index for active date and brand tier"
    )
    brand_multiplier: Decimal = Field(
        description="Multiplier based on brand tier (APL Apollo: 1.15, Hi-Tech: 1.08, Local Mills: 1.00)"
    )
    category_adjustment: Decimal = Field(
        description="Category adjustment in ₹/kg (MS: 0.00, GI: +8.00, GP: +5.00)"
    )
    calculated_list_price_per_kg: Decimal = Field(
        description="Derived list price per kg = (base_index_rate * brand_multiplier) + category_adjustment"
    )
    purchase_discount_pct: Decimal = Field(
        description="Standard distributor discount percentage from mill list price"
    )
    effective_purchase_price_per_kg: Decimal = Field(
        description="Calculated buying price per kg = calculated_list_price_per_kg * (1 - purchase_discount_pct / 100)"
    )
    sales_margin_pct: Decimal = Field(
        description="Standard sales margin percentage over list price"
    )
    effective_sales_price_per_kg: Decimal = Field(
        description="Calculated selling price per kg = calculated_list_price_per_kg * (1 + sales_margin_pct / 100)"
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
