"""
Product Master Schema
Generated from: 01_Product_Master.md, Status: Draft v1.0
Domain: GI / MS Steel Pipe Distribution
"""

import uuid
from decimal import Decimal
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict


class Brand(str, Enum):
    APL_APOLLO = "APL Apollo"
    HI_TECH = "Hi-Tech"
    LOCAL_MILLS = "Local Mills"


class Category(str, Enum):
    GI = "GI"
    MS = "MS"
    GP = "GP"


class Shape(str, Enum):
    ROUND = "Round"
    SQUARE = "Square"
    RECTANGLE = "Rectangle"


class WeightClass(str, Enum):
    LIGHT = "Light"
    MEDIUM = "Medium"
    HEAVY = "Heavy"


class StandardRef(str, Enum):
    IS1239 = "IS1239"
    IS4923 = "IS4923"


class ProductMasterModel(BaseModel):
    """Schema for a physical pipe product SKU."""
    
    product_id: uuid.UUID = Field(
        description="System-generated unique identifier, primary key"
    )
    product_code: str = Field(
        description="Deterministic human-readable code generated from attributes"
    )
    brand: Brand = Field(
        description="Product manufacturer brand"
    )
    category: Category = Field(
        description="Product category (GI, MS, or GP)"
    )
    shape: Shape = Field(
        description="Sectional shape of the pipe"
    )
    size: str = Field(
        description="Nominal bore (round) or dimensions (square/rectangle)"
    )
    weight_class: WeightClass = Field(
        description="Wall thickness/weight class designation"
    )
    weight_per_meter: Decimal = Field(
        description="Unit weight in kg/m (calculated from formulas)"
    )
    length: Decimal = Field(
        description="Standard piece length in meters"
    )
    gst: Decimal = Field(
        description="GST percentage applied (constant 18.00)"
    )
    hsn_code: str = Field(
        description="HSN tax classification code (constant '7306')"
    )
    standard_ref: StandardRef = Field(
        description="Governing Indian Standard reference"
    )
    active: bool = Field(
        description="Product status flag (true = active, false = archived)"
    )
    created_at: datetime = Field(
        description="Timestamp of record creation (timezone-aware UTC)"
    )
    updated_at: datetime = Field(
        description="Timestamp of record modification (timezone-aware UTC)"
    )

    model_config = ConfigDict(
        use_enum_values=True,
        json_schema_serialization_defaults_required=True
    )
