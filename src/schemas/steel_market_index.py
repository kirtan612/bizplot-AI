"""
Steel Market Index Schema
Generated from: 05_Steel_Market_Index.md, Status: Draft v2.0
Domain: GI / MS Steel Pipe Distribution
"""

import uuid
from decimal import Decimal
from datetime import datetime, date
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict


class ChangeReason(str, Enum):
    RAW_MATERIAL = "Raw Material Cost"
    IMPORT_DUTY = "Import Duty Change"
    SEASONAL_DEMAND = "Seasonal Construction Demand"
    CHINESE_PRESSURE = "Chinese Pricing Pressure"
    OTHER = "Other"
    NONE = "None"


class SteelMarketIndexModel(BaseModel):
    """Schema for the periodic steel raw material reference index."""
    
    index_id: uuid.UUID = Field(
        description="System-generated unique identifier, primary key"
    )
    effective_date: date = Field(
        description="Date on which the index reference rates are active (weekly cadence)"
    )
    national_rate_per_kg: Decimal = Field(
        description="Broader national market reference price for HR coil in ₹/kg"
    )
    regional_rate_per_kg: Decimal = Field(
        description="Regional reference price for Raipur/Chhattisgarh in ₹/kg"
    )
    region_label: str = Field(
        description="Regional identifier, constant value 'Raipur/CG'"
    )
    source_type: str = Field(
        description="Source of tracking data, constant value 'Mill Offer Tracking'"
    )
    change_reason: ChangeReason = Field(
        description="Primary cause of rate change"
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
