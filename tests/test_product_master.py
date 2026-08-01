import uuid
from decimal import Decimal
from datetime import datetime, timezone
import pytest

from src.schemas.product_master import ProductMasterModel, Brand, Category, Shape, WeightClass, StandardRef
from src.validators.product_master_validator import validate_batch

# Positive fixtures representing the 15 sample records in 01_Product_Master.md Section 8
SAMPLE_RECORDS = [
    {
        "product_id": uuid.uuid4(),
        "product_code": "APL-GI-RD-MED-15NB-6M",
        "brand": "APL Apollo",
        "category": "GI",
        "shape": "Round",
        "size": "15NB",
        "weight_class": "Medium",
        "weight_per_meter": Decimal("1.220"),
        "length": Decimal("6.00"),
        "gst": Decimal("18.00"),
        "hsn_code": "7306",
        "standard_ref": "IS1239",
        "active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "product_id": uuid.uuid4(),
        "product_code": "APL-GI-RD-MED-25NB-6M",
        "brand": "APL Apollo",
        "category": "GI",
        "shape": "Round",
        "size": "25NB",
        "weight_class": "Medium",
        "weight_per_meter": Decimal("2.500"),
        "length": Decimal("6.00"),
        "gst": Decimal("18.00"),
        "hsn_code": "7306",
        "standard_ref": "IS1239",
        "active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "product_id": uuid.uuid4(),
        "product_code": "APL-GI-RD-HVY-50NB-6M",
        "brand": "APL Apollo",
        "category": "GI",
        "shape": "Round",
        "size": "50NB",
        "weight_class": "Heavy",
        "weight_per_meter": Decimal("6.720"),
        "length": Decimal("6.00"),
        "gst": Decimal("18.00"),
        "hsn_code": "7306",
        "standard_ref": "IS1239",
        "active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "product_id": uuid.uuid4(),
        "product_code": "APL-MS-SQ-MED-25X25-6M",
        "brand": "APL Apollo",
        "category": "MS",
        "shape": "Square",
        "size": "25x25",
        "weight_class": "Medium",
        "weight_per_meter": Decimal("1.850"),
        "length": Decimal("6.00"),
        "gst": Decimal("18.00"),
        "hsn_code": "7306",
        "standard_ref": "IS4923",
        "active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "product_id": uuid.uuid4(),
        "product_code": "APL-MS-RECT-MED-40X20-6M",
        "brand": "APL Apollo",
        "category": "MS",
        "shape": "Rectangle",
        "size": "40x20",
        "weight_class": "Medium",
        "weight_per_meter": Decimal("2.010"),
        "length": Decimal("6.00"),
        "gst": Decimal("18.00"),
        "hsn_code": "7306",
        "standard_ref": "IS4923",
        "active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "product_id": uuid.uuid4(),
        "product_code": "HTP-GI-RD-MED-20NB-6M",
        "brand": "Hi-Tech",
        "category": "GI",
        "shape": "Round",
        "size": "20NB",
        "weight_class": "Medium",
        "weight_per_meter": Decimal("1.650"),
        "length": Decimal("6.00"),
        "gst": Decimal("18.00"),
        "hsn_code": "7306",
        "standard_ref": "IS1239",
        "active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "product_id": uuid.uuid4(),
        "product_code": "HTP-GI-RD-MED-50NB-6M",
        "brand": "Hi-Tech",
        "category": "GI",
        "shape": "Round",
        "size": "50NB",
        "weight_class": "Medium",
        "weight_per_meter": Decimal("5.430"),
        "length": Decimal("6.00"),
        "gst": Decimal("18.00"),
        "hsn_code": "7306",
        "standard_ref": "IS1239",
        "active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "product_id": uuid.uuid4(),
        "product_code": "HTP-GI-RD-LT-32NB-6M",
        "brand": "Hi-Tech",
        "category": "GI",
        "shape": "Round",
        "size": "32NB",
        "weight_class": "Light",
        "weight_per_meter": Decimal("2.610"),
        "length": Decimal("6.00"),
        "gst": Decimal("18.00"),
        "hsn_code": "7306",
        "standard_ref": "IS1239",
        "active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "product_id": uuid.uuid4(),
        "product_code": "HTP-MS-SQ-MED-50X50-6M",
        "brand": "Hi-Tech",
        "category": "MS",
        "shape": "Square",
        "size": "50x50",
        "weight_class": "Medium",
        "weight_per_meter": Decimal("4.320"),
        "length": Decimal("6.00"),
        "gst": Decimal("18.00"),
        "hsn_code": "7306",
        "standard_ref": "IS4923",
        "active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "product_id": uuid.uuid4(),
        "product_code": "HTP-GP-RD-MED-40NB-6M",
        "brand": "Hi-Tech",
        "category": "GP",
        "shape": "Round",
        "size": "40NB",
        "weight_class": "Medium",
        "weight_per_meter": Decimal("3.180"),
        "length": Decimal("6.00"),
        "gst": Decimal("18.00"),
        "hsn_code": "7306",
        "standard_ref": "IS1239",
        "active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "product_id": uuid.uuid4(),
        "product_code": "LOC-GI-RD-MED-15NB-6M",
        "brand": "Local Mills",
        "category": "GI",
        "shape": "Round",
        "size": "15NB",
        "weight_class": "Medium",
        "weight_per_meter": Decimal("1.220"),
        "length": Decimal("6.00"),
        "gst": Decimal("18.00"),
        "hsn_code": "7306",
        "standard_ref": "IS1239",
        "active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "product_id": uuid.uuid4(),
        "product_code": "LOC-MS-SQ-MED-20X20-6M",
        "brand": "Local Mills",
        "category": "MS",
        "shape": "Square",
        "size": "20x20",
        "weight_class": "Medium",
        "weight_per_meter": Decimal("1.400"),
        "length": Decimal("6.00"),
        "gst": Decimal("18.00"),
        "hsn_code": "7306",
        "standard_ref": "IS4923",
        "active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "product_id": uuid.uuid4(),
        "product_code": "LOC-MS-RD-MED-25NB-6M",
        "brand": "Local Mills",
        "category": "MS",
        "shape": "Round",
        "size": "25NB",
        "weight_class": "Medium",
        "weight_per_meter": Decimal("2.500"),
        "length": Decimal("6.00"),
        "gst": Decimal("18.00"),
        "hsn_code": "7306",
        "standard_ref": "IS1239",
        "active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "product_id": uuid.uuid4(),
        "product_code": "LOC-MS-SQ-LT-25X25-6M",
        "brand": "Local Mills",
        "category": "MS",
        "shape": "Square",
        "size": "25x25",
        "weight_class": "Light",
        "weight_per_meter": Decimal("1.520"),
        "length": Decimal("6.00"),
        "gst": Decimal("18.00"),
        "hsn_code": "7306",
        "standard_ref": "IS4923",
        "active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "product_id": uuid.uuid4(),
        "product_code": "APL-GI-RD-MED-100NB-6M",
        "brand": "APL Apollo",
        "category": "GI",
        "shape": "Round",
        "size": "100NB",
        "weight_class": "Medium",
        "weight_per_meter": Decimal("13.900"),
        "length": Decimal("6.00"),
        "gst": Decimal("18.00"),
        "hsn_code": "7306",
        "standard_ref": "IS1239",
        "active": False,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
]


def test_positive_sample_records():
    """Verify that all 15 valid sample records pass validation."""
    results = validate_batch(SAMPLE_RECORDS)
    failures = [r for r in results if not r.passed]
    assert len(failures) == 0, f"Expected zero failures, but got: {[f.message for f in failures]}"


def test_v1_duplicate_product_code():
    """Verify V1: Duplicate product_code is flagged."""
    dup_records = [
        dict(SAMPLE_RECORDS[0]),
        dict(SAMPLE_RECORDS[0])
    ]
    # Give them unique IDs so they look like distinct rows
    dup_records[0]["product_id"] = uuid.uuid4()
    dup_records[1]["product_id"] = uuid.uuid4()
    
    results = validate_batch(dup_records)
    v1_fails = [r for r in results if r.rule_id == "V1" and not r.passed]
    assert len(v1_fails) == 2
    assert "Duplicate product_code found" in v1_fails[0].message


def test_v2_invalid_size():
    """Verify V2: Size not in standard list is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["product_id"] = uuid.uuid4()
    record["size"] = "999NB"  # Not a standard size
    record["product_code"] = "APL-GI-RD-MED-999NB-6M"  # Regenerated
    
    results = validate_batch([record])
    v2_fails = [r for r in results if r.rule_id == "V2" and not r.passed]
    assert len(v2_fails) == 1
    assert "not found in standard IS1239 round pipe dimensions" in v2_fails[0].message


def test_v4_invalid_weight():
    """Verify V4: Weight deviation > 5% is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["product_id"] = uuid.uuid4()
    record["weight_per_meter"] = Decimal("3.000")  # Standard for 15NB Medium is 1.199, 3.0 deviates > 100%
    
    results = validate_batch([record])
    v4_fails = [r for r in results if r.rule_id == "V4" and not r.passed]
    assert len(v4_fails) == 1
    assert "deviates from calculated formula" in v4_fails[0].message


def test_v5_brand_capability():
    """Verify V5: Local Mills supplying GP category is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["product_id"] = uuid.uuid4()
    record["brand"] = "Local Mills"
    record["category"] = "GP"
    record["product_code"] = "LOC-GP-RD-MED-15NB-6M"
    
    results = validate_batch([record])
    v5_fails = [r for r in results if r.rule_id == "V5" and not r.passed]
    assert len(v5_fails) == 1
    assert "not capable of supplying GP" in v5_fails[0].message


def test_v6_gst_rate():
    """Verify V6: GST not 18.00% is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["product_id"] = uuid.uuid4()
    record["gst"] = Decimal("12.00")
    
    results = validate_batch([record])
    v6_fails = [r for r in results if r.rule_id == "V6" and not r.passed]
    assert len(v6_fails) == 1
    assert "must be 18.00%" in v6_fails[0].message


def test_v7_hsn_code():
    """Verify V7: HSN code not 7306 is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["product_id"] = uuid.uuid4()
    record["hsn_code"] = "1234"
    
    results = validate_batch([record])
    v7_fails = [r for r in results if r.rule_id == "V7" and not r.passed]
    assert len(v7_fails) == 1
    assert "must be '7306'" in v7_fails[0].message


def test_v8_shape_dimensions():
    """Verify V8: Shape/size mismatch is flagged."""
    # 1. Square shape but non-equal sizes (e.g. 40x20)
    record1 = dict(SAMPLE_RECORDS[3])  # APL-MS-SQ-MED-25X25-6M
    record1["product_id"] = uuid.uuid4()
    record1["size"] = "40x20"
    record1["product_code"] = "APL-MS-SQ-MED-40X20-6M"
    
    results = validate_batch([record1])
    v8_fails = [r for r in results if r.rule_id == "V8" and not r.passed]
    assert len(v8_fails) == 1
    assert "must have equal width and height" in v8_fails[0].message

    # 2. Rectangle shape but equal sizes (e.g. 25x25)
    record2 = dict(SAMPLE_RECORDS[4])  # APL-MS-RECT-MED-40X20-6M
    record2["product_id"] = uuid.uuid4()
    record2["size"] = "25x25"
    record2["product_code"] = "APL-MS-RECT-MED-25X25-6M"
    
    results = validate_batch([record2])
    v8_fails = [r for r in results if r.rule_id == "V8" and not r.passed]
    assert len(v8_fails) == 1
    assert "must have unequal width and height" in v8_fails[0].message


def test_v9_code_regenerability():
    """Verify V9: product_code mismatches are flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["product_id"] = uuid.uuid4()
    record["product_code"] = "APL-GI-RD-MED-15NB-99M"  # Stored length 99M does not match length=6.00
    
    results = validate_batch([record])
    v9_fails = [r for r in results if r.rule_id == "V9" and not r.passed]
    assert len(v9_fails) == 1
    assert "does not match regenerated code" in v9_fails[0].message
