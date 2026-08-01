"""
Steel Market Index Generator
Generates weekly Steel Market Index records covering the simulation window.
Domain: GI / MS Steel Pipe Distribution
"""

import uuid
import random
from datetime import datetime, date, timedelta, timezone
from decimal import Decimal
from typing import List

from src.schemas.steel_market_index import SteelMarketIndexModel, ChangeReason
from src.validators import steel_market_index_validator


def generate_index_series(
    start_date: date,
    end_date: date,
    rng: random.Random,
    initial_national_rate: Decimal = Decimal("56.50")
) -> List[SteelMarketIndexModel]:
    """Generates weekly Steel Market Index records across the simulation timeframe."""
    records: List[SteelMarketIndexModel] = []
    
    current_date = start_date
    current_national = initial_national_rate
    
    # Move date to the first Monday if start_date is not Monday
    while current_date.weekday() != 0:
        current_date += timedelta(days=1)

    while current_date <= end_date:
        # Determine change reason
        if rng.random() < 0.10:
            change_reason = rng.choice([
                ChangeReason.IMPORT_DUTY,
                ChangeReason.RAW_MATERIAL,
                ChangeReason.SEASONAL_DEMAND,
                ChangeReason.CHINESE_PRESSURE,
            ])
            pct_change = Decimal(str(round(rng.uniform(3.0, 6.0) * rng.choice([-1, 1]), 2)))
        else:
            change_reason = ChangeReason.NONE
            pct_change = Decimal(str(round(rng.uniform(-2.5, 2.5), 2)))

        if len(records) > 0:
            prev_national = records[-1].national_rate_per_kg
            new_national = round(prev_national * (Decimal("1.00") + (pct_change / Decimal("100.00"))), 2)
            new_national = max(Decimal("45.00"), min(Decimal("75.00"), new_national))
        else:
            new_national = current_national

        # Regional discount spread: 5% to 12%
        discount_pct = Decimal(str(round(rng.uniform(6.0, 10.0), 2)))
        new_regional = round(new_national * (Decimal("1.00") - (discount_pct / Decimal("100.00"))), 2)

        idx_model = SteelMarketIndexModel(
            index_id=uuid.UUID(int=rng.getrandbits(128)),
            effective_date=current_date,
            national_rate_per_kg=new_national,
            regional_rate_per_kg=new_regional,
            region_label="Raipur/CG",
            source_type="Mill Offer Tracking",
            change_reason=change_reason,
            created_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
            updated_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
        )
        records.append(idx_model)

        # Advance 7 days to next week
        current_date += timedelta(days=7)

    # Validate batch
    res = steel_market_index_validator.validate_batch(records)
    fails = [r for r in res if not r.passed]
    if fails:
        raise ValueError(f"Steel Market Index generation failed validation: {[f.message for f in fails]}")

    return records
