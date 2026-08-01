import uuid
from decimal import Decimal
from datetime import datetime, date, timezone
import pytest

from src.schemas.inventory import InventoryModel
from src.validators.inventory_validator import validate_batch

PROD_1_ID = uuid.uuid4()
PROD_2_ID = uuid.uuid4()

VALID_PRODUCTS = {
    str(PROD_1_ID): {
        "product_id": str(PROD_1_ID),
        "product_code": "PROD-001",
        "brand": "APL Apollo",
        "category": "GI",
    },
    str(PROD_2_ID): {
        "product_id": str(PROD_2_ID),
        "product_code": "PROD-002",
        "brand": "Hi-Tech",
        "category": "MS",
    },
}

SAMPLE_RECORDS = [
    # Snapshot 1 (2024-04-30) for PROD-001
    {
        "inventory_id": uuid.uuid4(),
        "snapshot_date": date(2024, 4, 30),
        "product_id": PROD_1_ID,
        "product_code": "PROD-001",
        "opening_qty_pcs": 100,
        "opening_weight_kg": Decimal("1000.00"),
        "purchased_qty_pcs": 200,
        "purchased_weight_kg": Decimal("2000.00"),
        "sold_qty_pcs": 150,
        "sold_weight_kg": Decimal("1500.00"),
        "closing_qty_pcs": 150,
        "closing_weight_kg": Decimal("1500.00"),
        "unit_cost_per_kg": Decimal("65.00"),
        "inventory_valuation": Decimal("97500.00"),
        "reorder_level_pcs": 200,
        "reorder_flag": True,  # 150 <= 200
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    # Snapshot 2 (2024-05-31) for PROD-001 (Continuous with Snapshot 1)
    {
        "inventory_id": uuid.uuid4(),
        "snapshot_date": date(2024, 5, 31),
        "product_id": PROD_1_ID,
        "product_code": "PROD-001",
        "opening_qty_pcs": 150,
        "opening_weight_kg": Decimal("1500.00"),
        "purchased_qty_pcs": 500,
        "purchased_weight_kg": Decimal("5000.00"),
        "sold_qty_pcs": 300,
        "sold_weight_kg": Decimal("3000.00"),
        "closing_qty_pcs": 350,
        "closing_weight_kg": Decimal("3500.00"),
        "unit_cost_per_kg": Decimal("66.00"),
        "inventory_valuation": Decimal("231000.00"),
        "reorder_level_pcs": 200,
        "reorder_flag": False,  # 350 > 200
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
]


def test_positive_sample_records():
    """Verify that valid inventory records pass validation."""
    results = validate_batch(SAMPLE_RECORDS, VALID_PRODUCTS)
    failures = [r for r in results if not r.passed]
    assert len(failures) == 0, f"Expected zero failures, but got: {[f.message for f in failures]}"


def test_v1_duplicate_date_product():
    """Verify V1: Duplicate snapshot date and product ID is flagged."""
    dup_records = [
        dict(SAMPLE_RECORDS[0]),
        dict(SAMPLE_RECORDS[0])
    ]
    dup_records[0]["inventory_id"] = uuid.uuid4()
    dup_records[1]["inventory_id"] = uuid.uuid4()
    
    results = validate_batch(dup_records, VALID_PRODUCTS)
    v1_fails = [r for r in results if r.rule_id == "V1" and not r.passed]
    assert len(v1_fails) == 2


def test_v2_invalid_product_fk():
    """Verify V2: Unknown product ID is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["inventory_id"] = uuid.uuid4()
    record["product_id"] = uuid.uuid4()  # Unknown ID
    
    results = validate_batch([record], VALID_PRODUCTS)
    v2_fails = [r for r in results if r.rule_id == "V2" and not r.passed]
    assert len(v2_fails) == 1
    assert "does not exist in Product Master" in v2_fails[0].message


def test_v3_negative_quantity():
    """Verify V3: Negative stock quantity is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["inventory_id"] = uuid.uuid4()
    record["opening_qty_pcs"] = -10
    
    results = validate_batch([record], VALID_PRODUCTS)
    v3_fails = [r for r in results if r.rule_id == "V3" and not r.passed]
    assert len(v3_fails) == 1
    assert "must be non-negative" in v3_fails[0].message


def test_v4_negative_weight():
    """Verify V4: Negative stock weight is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["inventory_id"] = uuid.uuid4()
    record["opening_weight_kg"] = Decimal("-50.00")
    
    results = validate_batch([record], VALID_PRODUCTS)
    v4_fails = [r for r in results if r.rule_id == "V4" and not r.passed]
    assert len(v4_fails) == 1


def test_v5_closing_quantity_math_error():
    """Verify V5: Closing quantity math error is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["inventory_id"] = uuid.uuid4()
    record["closing_qty_pcs"] = 200  # Incorrect, should be 150 (100 + 200 - 150)
    
    results = validate_batch([record], VALID_PRODUCTS)
    v5_fails = [r for r in results if r.rule_id == "V5" and not r.passed]
    assert len(v5_fails) == 1
    assert "does not match expected formula result" in v5_fails[0].message


def test_v6_closing_weight_math_error():
    """Verify V6: Closing weight math error is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["inventory_id"] = uuid.uuid4()
    record["closing_weight_kg"] = Decimal("2000.00")  # Incorrect, should be 1500.00
    
    results = validate_batch([record], VALID_PRODUCTS)
    v6_fails = [r for r in results if r.rule_id == "V6" and not r.passed]
    assert len(v6_fails) == 1
    assert "does not match expected formula result" in v6_fails[0].message


def test_v7_invalid_unit_cost():
    """Verify V7: Zero or negative unit cost per kg is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["inventory_id"] = uuid.uuid4()
    record["unit_cost_per_kg"] = Decimal("0.00")
    
    results = validate_batch([record], VALID_PRODUCTS)
    v7_fails = [r for r in results if r.rule_id == "V7" and not r.passed]
    assert len(v7_fails) == 1


def test_v8_valuation_math_error():
    """Verify V8: Inventory valuation math error is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["inventory_id"] = uuid.uuid4()
    record["inventory_valuation"] = Decimal("50000.00")  # Incorrect, should be 97500.00
    
    results = validate_batch([record], VALID_PRODUCTS)
    v8_fails = [r for r in results if r.rule_id == "V8" and not r.passed]
    assert len(v8_fails) == 1
    assert "does not match expected result" in v8_fails[0].message


def test_v9_negative_reorder_level():
    """Verify V9: Negative reorder level is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["inventory_id"] = uuid.uuid4()
    record["reorder_level_pcs"] = -5
    
    results = validate_batch([record], VALID_PRODUCTS)
    v9_fails = [r for r in results if r.rule_id == "V9" and not r.passed]
    assert len(v9_fails) == 1


def test_v10_reorder_flag_mismatch():
    """Verify V10: Reorder flag mismatch relative to closing quantity is flagged."""
    record = dict(SAMPLE_RECORDS[0])  # closing_qty is 150, reorder_level is 200 -> reorder_flag should be True
    record["inventory_id"] = uuid.uuid4()
    record["reorder_flag"] = False
    
    results = validate_batch([record], VALID_PRODUCTS)
    v10_fails = [r for r in results if r.rule_id == "V10" and not r.passed]
    assert len(v10_fails) == 1
    assert "Reorder flag is False" in v10_fails[0].message


def test_v11_future_snapshot_date():
    """Verify V11: Snapshot date in the future is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["inventory_id"] = uuid.uuid4()
    record["snapshot_date"] = date(2030, 1, 1)
    
    results = validate_batch([record], VALID_PRODUCTS)
    v11_fails = [r for r in results if r.rule_id == "V11" and not r.passed]
    assert len(v11_fails) == 1
    assert "is in the future" in v11_fails[0].message


def test_v12_cross_snapshot_discontinuity():
    """Verify V12: Discontinuity between consecutive period snapshots is flagged."""
    batch = [
        dict(SAMPLE_RECORDS[0]),
        dict(SAMPLE_RECORDS[1])
    ]
    # In Snapshot 1, closing_qty is 150. If Snapshot 2 opening_qty is set to 100:
    batch[1]["opening_qty_pcs"] = 100
    batch[1]["closing_qty_pcs"] = 300  # Adjust to satisfy V5 internal math (100 + 500 - 300 = 300)
    batch[1]["closing_weight_kg"] = Decimal("3000.00")
    batch[1]["inventory_valuation"] = Decimal("198000.00")
    
    results = validate_batch(batch, VALID_PRODUCTS)
    v12_fails = [r for r in results if r.rule_id == "V12" and not r.passed]
    assert len(v12_fails) == 1
    assert "does not match previous closing quantity" in v12_fails[0].message
