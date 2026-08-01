"""
Inventory Schema
Generated from: 08_Inventory.md, Status: Draft v1.0
Domain: GI / MS Steel Pipe Distribution
"""

import uuid
from decimal import Decimal
from datetime import datetime, date
from pydantic import BaseModel, Field, ConfigDict


class InventoryModel(BaseModel):
    """Schema for periodic stock snapshot and valuation records."""
    
    inventory_id: uuid.UUID = Field(
        description="System-generated unique identifier, primary key"
    )
    snapshot_date: date = Field(
        description="Date of inventory snapshot (daily or monthly)"
    )
    product_id: uuid.UUID = Field(
        description="Foreign key referencing Product Master"
    )
    product_code: str = Field(
        description="Foreign key referencing Product Master"
    )
    opening_qty_pcs: int = Field(
        description="Stock quantity in pieces at beginning of snapshot period"
    )
    opening_weight_kg: Decimal = Field(
        description="Stock weight in kg at beginning of snapshot period"
    )
    purchased_qty_pcs: int = Field(
        description="Quantity in pieces added via purchases during period"
    )
    purchased_weight_kg: Decimal = Field(
        description="Weight in kg added via purchases during period"
    )
    sold_qty_pcs: int = Field(
        description="Quantity in pieces reduced via sales during period"
    )
    sold_weight_kg: Decimal = Field(
        description="Weight in kg reduced via sales during period"
    )
    closing_qty_pcs: int = Field(
        description="Calculated closing stock in pieces = opening + purchased - sold"
    )
    closing_weight_kg: Decimal = Field(
        description="Calculated closing stock in kg = opening + purchased - sold"
    )
    unit_cost_per_kg: Decimal = Field(
        description="Weighted average purchase cost per kg"
    )
    inventory_valuation: Decimal = Field(
        description="Total monetary value of closing stock = closing_weight_kg * unit_cost_per_kg"
    )
    reorder_level_pcs: int = Field(
        description="Minimum threshold stock quantity in pieces to trigger replenishment"
    )
    reorder_flag: bool = Field(
        description="True if closing_qty_pcs <= reorder_level_pcs, false otherwise"
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
