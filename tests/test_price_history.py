import uuid
from decimal import Decimal
from datetime import datetime, date, timezone
import pytest

from src.schemas.price_history import PriceHistoryModel
from src.validators.price_history_validator import validate_batch

# Mock Product Master and Steel Market Index context dictionaries
PROD_1_ID = uuid.uuid4()
PROD_2_ID = uuid.uuid4()
PROD_3_ID = uuid.uuid4()
INDEX_1_ID = uuid.uuid4()

VALID_PRODUCTS = {
    str(PROD_1_ID): {"product_id": str(PROD_1_ID), "product_code": "PROD-001", "brand": "APL Apollo", "category": "GI"},
    str(PROD_2_ID): {"product_id": str(PROD_2_ID), "product_code": "PROD-002", "brand": "Hi-Tech", "category": "MS"},
    str(PROD_3_ID): {"product_id": str(PROD_3_ID), "product_code": "PROD-003", "brand": "Local Mills", "category": "GP"},
}

VALID_INDICES = {
    str(INDEX_1_ID): {
        "index_id": str(INDEX_1_ID),
        "effective_date": date(2026, 6, 1),
        "national_rate_per_kg": Decimal("56.50"),
        "regional_rate_per_kg": Decimal("50.50"),
    }
}

SAMPLE_RECORDS = [
    {
        "price_id": uuid.uuid4(),
        "effective_date": date(2026, 6, 1),
        "product_id": PROD_1_ID,
        "product_code": "PROD-001",
        "index_id": INDEX_1_ID,
        "base_index_rate": Decimal("56.50"),
        "brand_multiplier": Decimal("1.15"),
        "category_adjustment": Decimal("8.00"),
        "calculated_list_price_per_kg": Decimal("72.98"),
        "purchase_discount_pct": Decimal("5.00"),
        "effective_purchase_price_per_kg": Decimal("69.33"),
        "sales_margin_pct": Decimal("6.00"),
        "effective_sales_price_per_kg": Decimal("77.36"),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "price_id": uuid.uuid4(),
        "effective_date": date(2026, 6, 1),
        "product_id": PROD_2_ID,
        "product_code": "PROD-002",
        "index_id": INDEX_1_ID,
        "base_index_rate": Decimal("56.50"),
        "brand_multiplier": Decimal("1.08"),
        "category_adjustment": Decimal("0.00"),
        "calculated_list_price_per_kg": Decimal("61.02"),
        "purchase_discount_pct": Decimal("6.00"),
        "effective_purchase_price_per_kg": Decimal("57.36"),
        "sales_margin_pct": Decimal("5.00"),
        "effective_sales_price_per_kg": Decimal("64.07"),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "price_id": uuid.uuid4(),
        "effective_date": date(2026, 6, 1),
        "product_id": PROD_3_ID,
        "product_code": "PROD-003",
        "index_id": INDEX_1_ID,
        "base_index_rate": Decimal("50.50"),
        "brand_multiplier": Decimal("1.00"),
        "category_adjustment": Decimal("5.00"),
        "calculated_list_price_per_kg": Decimal("55.50"),
        "purchase_discount_pct": Decimal("8.00"),
        "effective_purchase_price_per_kg": Decimal("51.06"),
        "sales_margin_pct": Decimal("7.00"),
        "effective_sales_price_per_kg": Decimal("59.39"),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
]


def test_positive_sample_records():
    """Verify that all positive price history records pass validation."""
    results = validate_batch(SAMPLE_RECORDS, VALID_PRODUCTS, VALID_INDICES)
    failures = [r for r in results if not r.passed]
    assert len(failures) == 0, f"Expected zero failures, but got: {[f.message for f in failures]}"


def test_v1_duplicate_date_product():
    """Verify V1: Duplicate effective_date and product_id is flagged."""
    dup_records = [
        dict(SAMPLE_RECORDS[0]),
        dict(SAMPLE_RECORDS[0])
    ]
    dup_records[0]["price_id"] = uuid.uuid4()
    dup_records[1]["price_id"] = uuid.uuid4()
    
    results = validate_batch(dup_records, VALID_PRODUCTS, VALID_INDICES)
    v1_fails = [r for r in results if r.rule_id == "V1" and not r.passed]
    assert len(v1_fails) == 2


def test_v2_invalid_product_fk():
    """Verify V2: Non-existent product ID or mismatched product code is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["price_id"] = uuid.uuid4()
    record["product_id"] = uuid.uuid4()  # Unknown ID
    
    results = validate_batch([record], VALID_PRODUCTS, VALID_INDICES)
    v2_fails = [r for r in results if r.rule_id == "V2" and not r.passed]
    assert len(v2_fails) == 1
    assert "does not exist in Product Master" in v2_fails[0].message


def test_v3_invalid_index_fk():
    """Verify V3: Non-existent index ID is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["price_id"] = uuid.uuid4()
    record["index_id"] = uuid.uuid4()  # Unknown index ID
    
    results = validate_batch([record], VALID_PRODUCTS, VALID_INDICES)
    v3_fails = [r for r in results if r.rule_id == "V3" and not r.passed]
    assert len(v3_fails) == 1
    assert "does not exist in Steel Market Index" in v3_fails[0].message


def test_v4_base_index_rate_mismatch():
    """Verify V4: Local Mills using national rate instead of regional rate is flagged."""
    record = dict(SAMPLE_RECORDS[2])  # Local Mills product (PROD-003)
    record["price_id"] = uuid.uuid4()
    record["base_index_rate"] = Decimal("56.50")  # Used national rate instead of regional 50.50
    
    results = validate_batch([record], VALID_PRODUCTS, VALID_INDICES)
    v4_fails = [r for r in results if r.rule_id == "V4" and not r.passed]
    assert len(v4_fails) == 1
    assert "does not match expected Local Mills index rate" in v4_fails[0].message


def test_v5_brand_multiplier_mismatch():
    """Verify V5: Mismatched brand multiplier is flagged."""
    record = dict(SAMPLE_RECORDS[0])  # APL Apollo
    record["price_id"] = uuid.uuid4()
    record["brand_multiplier"] = Decimal("1.20")  # Should be 1.15
    
    results = validate_batch([record], VALID_PRODUCTS, VALID_INDICES)
    v5_fails = [r for r in results if r.rule_id == "V5" and not r.passed]
    assert len(v5_fails) == 1
    assert "does not match expected 1.15 for brand 'APL Apollo'" in v5_fails[0].message


def test_v6_category_adjustment_mismatch():
    """Verify V6: Mismatched category adjustment is flagged."""
    record = dict(SAMPLE_RECORDS[0])  # GI category
    record["price_id"] = uuid.uuid4()
    record["category_adjustment"] = Decimal("0.00")  # Should be 8.00
    
    results = validate_batch([record], VALID_PRODUCTS, VALID_INDICES)
    v6_fails = [r for r in results if r.rule_id == "V6" and not r.passed]
    assert len(v6_fails) == 1
    assert "does not match expected 8.00 for category 'GI'" in v6_fails[0].message


def test_v7_list_price_math_error():
    """Verify V7: List price calculation mismatch is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["price_id"] = uuid.uuid4()
    record["calculated_list_price_per_kg"] = Decimal("80.00")  # Incorrect, should be 72.98
    
    results = validate_batch([record], VALID_PRODUCTS, VALID_INDICES)
    v7_fails = [r for r in results if r.rule_id == "V7" and not r.passed]
    assert len(v7_fails) == 1
    assert "does not match expected formula result" in v7_fails[0].message


def test_v8_purchase_price_math_error():
    """Verify V8: Effective purchase price calculation mismatch is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["price_id"] = uuid.uuid4()
    record["effective_purchase_price_per_kg"] = Decimal("60.00")  # Incorrect, should be 69.33
    
    results = validate_batch([record], VALID_PRODUCTS, VALID_INDICES)
    v8_fails = [r for r in results if r.rule_id == "V8" and not r.passed]
    assert len(v8_fails) == 1
    assert "does not match expected formula result" in v8_fails[0].message


def test_v9_sales_price_math_error():
    """Verify V9: Effective sales price calculation mismatch is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["price_id"] = uuid.uuid4()
    record["effective_sales_price_per_kg"] = Decimal("85.00")  # Incorrect, should be 77.36
    
    results = validate_batch([record], VALID_PRODUCTS, VALID_INDICES)
    v9_fails = [r for r in results if r.rule_id == "V9" and not r.passed]
    assert len(v9_fails) == 1
    assert "does not match expected formula result" in v9_fails[0].message


def test_v10_negative_gross_margin():
    """Verify V10: Sales price <= purchase price is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["price_id"] = uuid.uuid4()
    record["effective_sales_price_per_kg"] = Decimal("65.00")  # Less than purchase price 69.33
    
    results = validate_batch([record], VALID_PRODUCTS, VALID_INDICES)
    v10_fails = [r for r in results if r.rule_id == "V10" and not r.passed]
    assert len(v10_fails) == 1
    assert "is not greater than purchase price" in v10_fails[0].message


def test_v11_invalid_purchase_discount():
    """Verify V11: Purchase discount percentage outside [0.00, 15.00] is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["price_id"] = uuid.uuid4()
    record["purchase_discount_pct"] = Decimal("20.00")
    
    results = validate_batch([record], VALID_PRODUCTS, VALID_INDICES)
    v11_fails = [r for r in results if r.rule_id == "V11" and not r.passed]
    assert len(v11_fails) == 1
    assert "outside allowed range" in v11_fails[0].message


def test_v12_invalid_sales_margin():
    """Verify V12: Sales margin percentage outside [2.00, 20.00] is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["price_id"] = uuid.uuid4()
    record["sales_margin_pct"] = Decimal("1.00")
    
    results = validate_batch([record], VALID_PRODUCTS, VALID_INDICES)
    v12_fails = [r for r in results if r.rule_id == "V12" and not r.passed]
    assert len(v12_fails) == 1
    assert "outside allowed range" in v12_fails[0].message
