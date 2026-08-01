import uuid
from decimal import Decimal
from datetime import datetime, date, timezone
import pytest

from src.schemas.steel_market_index import SteelMarketIndexModel, ChangeReason
from src.validators.steel_market_index_validator import validate_batch

# Positive fixtures representing the 12 sample records in 05_Steel_Market_Index.md Section 8
SAMPLE_RECORDS = [
    {
        "index_id": uuid.uuid4(),
        "effective_date": date(2026, 4, 1),
        "national_rate_per_kg": Decimal("56.00"),
        "regional_rate_per_kg": Decimal("50.40"),
        "region_label": "Raipur/CG",
        "source_type": "Mill Offer Tracking",
        "change_reason": "None",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "index_id": uuid.uuid4(),
        "effective_date": date(2026, 4, 8),
        "national_rate_per_kg": Decimal("56.50"),
        "regional_rate_per_kg": Decimal("50.85"),
        "region_label": "Raipur/CG",
        "source_type": "Mill Offer Tracking",
        "change_reason": "None",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "index_id": uuid.uuid4(),
        "effective_date": date(2026, 4, 15),
        "national_rate_per_kg": Decimal("56.30"),
        "regional_rate_per_kg": Decimal("50.67"),
        "region_label": "Raipur/CG",
        "source_type": "Mill Offer Tracking",
        "change_reason": "None",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "index_id": uuid.uuid4(),
        "effective_date": date(2026, 4, 22),
        "national_rate_per_kg": Decimal("55.80"),
        "regional_rate_per_kg": Decimal("50.22"),
        "region_label": "Raipur/CG",
        "source_type": "Mill Offer Tracking",
        "change_reason": "None",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "index_id": uuid.uuid4(),
        "effective_date": date(2026, 4, 29),
        "national_rate_per_kg": Decimal("55.40"),
        "regional_rate_per_kg": Decimal("49.86"),
        "region_label": "Raipur/CG",
        "source_type": "Mill Offer Tracking",
        "change_reason": "None",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "index_id": uuid.uuid4(),
        "effective_date": date(2026, 5, 6),
        "national_rate_per_kg": Decimal("55.20"),
        "regional_rate_per_kg": Decimal("49.40"),
        "region_label": "Raipur/CG",
        "source_type": "Mill Offer Tracking",
        "change_reason": "None",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "index_id": uuid.uuid4(),
        "effective_date": date(2026, 5, 13),
        "national_rate_per_kg": Decimal("54.90"),
        "regional_rate_per_kg": Decimal("49.00"),
        "region_label": "Raipur/CG",
        "source_type": "Mill Offer Tracking",
        "change_reason": "None",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "index_id": uuid.uuid4(),
        "effective_date": date(2026, 5, 20),
        "national_rate_per_kg": Decimal("60.50"),
        "regional_rate_per_kg": Decimal("54.45"),
        "region_label": "Raipur/CG",
        "source_type": "Mill Offer Tracking",
        "change_reason": "Import Duty Change",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "index_id": uuid.uuid4(),
        "effective_date": date(2026, 5, 27),
        "national_rate_per_kg": Decimal("60.80"),
        "regional_rate_per_kg": Decimal("54.72"),
        "region_label": "Raipur/CG",
        "source_type": "Mill Offer Tracking",
        "change_reason": "None",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "index_id": uuid.uuid4(),
        "effective_date": date(2026, 6, 3),
        "national_rate_per_kg": Decimal("60.40"),
        "regional_rate_per_kg": Decimal("54.00"),
        "region_label": "Raipur/CG",
        "source_type": "Mill Offer Tracking",
        "change_reason": "None",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "index_id": uuid.uuid4(),
        "effective_date": date(2026, 6, 10),
        "national_rate_per_kg": Decimal("59.80"),
        "regional_rate_per_kg": Decimal("53.20"),
        "region_label": "Raipur/CG",
        "source_type": "Mill Offer Tracking",
        "change_reason": "None",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "index_id": uuid.uuid4(),
        "effective_date": date(2026, 6, 17),
        "national_rate_per_kg": Decimal("59.20"),
        "regional_rate_per_kg": Decimal("52.60"),
        "region_label": "Raipur/CG",
        "source_type": "Mill Offer Tracking",
        "change_reason": "None",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
]


def test_positive_sample_records():
    """Verify that all 12 valid weekly index records pass validation."""
    results = validate_batch(SAMPLE_RECORDS)
    failures = [r for r in results if not r.passed]
    assert len(failures) == 0, f"Expected zero failures, but got: {[f.message for f in failures]}"


def test_v1_duplicate_date_region():
    """Verify V1: Duplicate date and region label is flagged."""
    dup_records = [
        dict(SAMPLE_RECORDS[0]),
        dict(SAMPLE_RECORDS[0])
    ]
    dup_records[0]["index_id"] = uuid.uuid4()
    dup_records[1]["index_id"] = uuid.uuid4()
    
    results = validate_batch(dup_records)
    v1_fails = [r for r in results if r.rule_id == "V1" and not r.passed]
    assert len(v1_fails) == 2
    assert "Duplicate effective_date and region_label" in v1_fails[0].message


def test_v2_regional_discount_out_of_bounds():
    """Verify V2: Regional discount outside 5-12% is flagged."""
    # 1. Discount too low: regional is 55.00, national is 56.00 (discount = 1.78%)
    record1 = dict(SAMPLE_RECORDS[0])
    record1["index_id"] = uuid.uuid4()
    record1["national_rate_per_kg"] = Decimal("56.00")
    record1["regional_rate_per_kg"] = Decimal("55.00")
    
    results = validate_batch([record1])
    v2_fails = [r for r in results if r.rule_id == "V2" and not r.passed]
    assert len(v2_fails) == 1
    assert "outside the allowed 5.00%–12.00% range" in v2_fails[0].message

    # 2. Discount too high: regional is 48.00, national is 56.00 (discount = 14.28%)
    record2 = dict(SAMPLE_RECORDS[0])
    record2["index_id"] = uuid.uuid4()
    record2["national_rate_per_kg"] = Decimal("56.00")
    record2["regional_rate_per_kg"] = Decimal("48.00")
    
    results = validate_batch([record2])
    v2_fails = [r for r in results if r.rule_id == "V2" and not r.passed]
    assert len(v2_fails) == 1


def test_v3_plausible_price_bounds():
    """Verify V3: Plausible rate bounds check."""
    record = dict(SAMPLE_RECORDS[0])
    record["index_id"] = uuid.uuid4()
    record["national_rate_per_kg"] = Decimal("75.00")  # too high
    
    results = validate_batch([record])
    v3_fails = [r for r in results if r.rule_id == "V3" and not r.passed]
    assert len(v3_fails) == 1
    assert "outside plausible range" in v3_fails[0].message


def test_v4_change_reason_mandatory_on_shock():
    """Verify V4: Rate change exceeds 8.00% but change_reason is 'None'."""
    # From Week 7 (54.90) to Week 8 (60.50) is a +10.20% increase.
    # If we alter Week 8 change_reason to 'None', it should fail.
    shock_batch = [dict(SAMPLE_RECORDS[6]), dict(SAMPLE_RECORDS[7])]
    shock_batch[1]["change_reason"] = "None"
    
    results = validate_batch(shock_batch)
    v4_fails = [r for r in results if r.rule_id == "V4" and not r.passed]
    assert len(v4_fails) == 1
    assert "exceeds 8.00%" in v4_fails[0].message


def test_v5_negative_rates():
    """Verify V5: Non-positive rates are flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["index_id"] = uuid.uuid4()
    record["national_rate_per_kg"] = Decimal("-5.00")
    
    results = validate_batch([record])
    v5_fails = [r for r in results if r.rule_id == "V5" and not r.passed]
    assert len(v5_fails) == 1
    assert "must be strictly greater than zero" in v5_fails[0].message


def test_v6_invalid_region_label():
    """Verify V6: Region label not 'Raipur/CG' is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["index_id"] = uuid.uuid4()
    record["region_label"] = "Mumbai/MH"
    
    results = validate_batch([record])
    v6_fails = [r for r in results if r.rule_id == "V6" and not r.passed]
    assert len(v6_fails) == 1
    assert "must be 'Raipur/CG'" in v6_fails[0].message


def test_v7_invalid_source_type():
    """Verify V7: Source type not 'Mill Offer Tracking' is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["index_id"] = uuid.uuid4()
    record["source_type"] = "Futures exchange feed"
    
    results = validate_batch([record])
    v7_fails = [r for r in results if r.rule_id == "V7" and not r.passed]
    assert len(v7_fails) == 1
    assert "must be 'Mill Offer Tracking'" in v7_fails[0].message


def test_v8_future_date():
    """Verify V8: Future effective date is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["index_id"] = uuid.uuid4()
    record["effective_date"] = date(2030, 1, 1)
    
    results = validate_batch([record])
    v8_fails = [r for r in results if r.rule_id == "V8" and not r.passed]
    assert len(v8_fails) == 1
    assert "is in the future" in v8_fails[0].message
