import uuid
from decimal import Decimal
from datetime import datetime, date, timedelta, timezone
import pytest

from src.schemas.purchase_register import PurchaseRegisterModel
from src.validators.purchase_register_validator import validate_batch

SUP_1_ID = uuid.uuid4()
SUP_2_ID = uuid.uuid4()
PROD_1_ID = uuid.uuid4()
PROD_2_ID = uuid.uuid4()

VALID_SUPPLIERS = {
    str(SUP_1_ID): {
        "supplier_id": str(SUP_1_ID),
        "supplier_code": "SUP-MILL-001",
        "state": "Punjab",
        "credit_period_days": 45,
        "brands_supplied": ["APL Apollo"],
        "categories_supplied": ["GI", "MS", "GP"],
    },
    str(SUP_2_ID): {
        "supplier_id": str(SUP_2_ID),
        "supplier_code": "SUP-MILL-002",
        "state": "Gujarat",
        "credit_period_days": 40,
        "brands_supplied": ["Hi-Tech"],
        "categories_supplied": ["GI", "MS", "GP"],
    },
}

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
    # 1. Intrastate purchase (Gujarat supplier SUP-MILL-002)
    {
        "purchase_id": uuid.uuid4(),
        "invoice_number": "INV-PUR-202404-001",
        "purchase_date": date(2024, 4, 10),
        "supplier_id": SUP_2_ID,
        "supplier_code": "SUP-MILL-002",
        "product_id": PROD_2_ID,
        "product_code": "PROD-002",
        "quantity_pcs": 500,
        "total_weight_kg": Decimal("5000.00"),
        "unit_price_per_kg": Decimal("60.00"),
        "taxable_value": Decimal("300000.00"),
        "is_interstate": False,
        "cgst_rate": Decimal("9.00"),
        "cgst_amount": Decimal("27000.00"),
        "sgst_rate": Decimal("9.00"),
        "sgst_amount": Decimal("27000.00"),
        "igst_rate": Decimal("0.00"),
        "igst_amount": Decimal("0.00"),
        "total_gst": Decimal("54000.00"),
        "invoice_amount": Decimal("354000.00"),
        "payment_status": "Paid",
        "payment_due_date": date(2024, 5, 20),  # 2024-04-10 + 40 days
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    # 2. Interstate purchase (Punjab supplier SUP-MILL-001)
    {
        "purchase_id": uuid.uuid4(),
        "invoice_number": "INV-PUR-202404-002",
        "purchase_date": date(2024, 4, 15),
        "supplier_id": SUP_1_ID,
        "supplier_code": "SUP-MILL-001",
        "product_id": PROD_1_ID,
        "product_code": "PROD-001",
        "quantity_pcs": 1000,
        "total_weight_kg": Decimal("10000.00"),
        "unit_price_per_kg": Decimal("70.00"),
        "taxable_value": Decimal("700000.00"),
        "is_interstate": True,
        "cgst_rate": Decimal("0.00"),
        "cgst_amount": Decimal("0.00"),
        "sgst_rate": Decimal("0.00"),
        "sgst_amount": Decimal("0.00"),
        "igst_rate": Decimal("18.00"),
        "igst_amount": Decimal("126000.00"),
        "total_gst": Decimal("126000.00"),
        "invoice_amount": Decimal("826000.00"),
        "payment_status": "Unpaid",
        "payment_due_date": date(2024, 5, 30),  # 2024-04-15 + 45 days
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
]


def test_positive_sample_records():
    """Verify that all valid purchase records pass validation."""
    results = validate_batch(SAMPLE_RECORDS, VALID_SUPPLIERS, VALID_PRODUCTS)
    failures = [r for r in results if not r.passed]
    assert len(failures) == 0, f"Expected zero failures, but got: {[f.message for f in failures]}"


def test_v1_duplicate_purchase_id():
    """Verify V1: Duplicate purchase_id is flagged."""
    dup_records = [
        dict(SAMPLE_RECORDS[0]),
        dict(SAMPLE_RECORDS[0])
    ]
    dup_records[0]["purchase_id"] = uuid.uuid4()
    dup_records[1]["purchase_id"] = dup_records[0]["purchase_id"]
    
    results = validate_batch(dup_records, VALID_SUPPLIERS, VALID_PRODUCTS)
    v1_fails = [r for r in results if r.rule_id == "V1" and not r.passed]
    assert len(v1_fails) == 2


def test_v2_invalid_invoice_number():
    """Verify V2: Non-matching invoice pattern is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["purchase_id"] = uuid.uuid4()
    record["invoice_number"] = "PUR-202404-001"  # Missing INV- prefix
    
    results = validate_batch([record], VALID_SUPPLIERS, VALID_PRODUCTS)
    v2_fails = [r for r in results if r.rule_id == "V2" and not r.passed]
    assert len(v2_fails) == 1
    assert "does not match standard pattern" in v2_fails[0].message


def test_v3_invalid_supplier_fk():
    """Verify V3: Unknown supplier ID is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["purchase_id"] = uuid.uuid4()
    record["supplier_id"] = uuid.uuid4()  # Unknown ID
    
    results = validate_batch([record], VALID_SUPPLIERS, VALID_PRODUCTS)
    v3_fails = [r for r in results if r.rule_id == "V3" and not r.passed]
    assert len(v3_fails) == 1
    assert "does not exist in Supplier Master" in v3_fails[0].message


def test_v4_invalid_product_fk():
    """Verify V4: Unknown product ID is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["purchase_id"] = uuid.uuid4()
    record["product_id"] = uuid.uuid4()  # Unknown ID
    
    results = validate_batch([record], VALID_SUPPLIERS, VALID_PRODUCTS)
    v4_fails = [r for r in results if r.rule_id == "V4" and not r.passed]
    assert len(v4_fails) == 1
    assert "does not exist in Product Master" in v4_fails[0].message


def test_v5_invalid_quantity_or_weight():
    """Verify V5: Zero quantity or weight is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["purchase_id"] = uuid.uuid4()
    record["quantity_pcs"] = 0
    
    results = validate_batch([record], VALID_SUPPLIERS, VALID_PRODUCTS)
    v5_fails = [r for r in results if r.rule_id == "V5" and not r.passed]
    assert len(v5_fails) == 1
    assert "must be strictly greater than zero" in v5_fails[0].message


def test_v6_invalid_unit_price():
    """Verify V6: Zero unit price is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["purchase_id"] = uuid.uuid4()
    record["unit_price_per_kg"] = Decimal("0.00")
    
    results = validate_batch([record], VALID_SUPPLIERS, VALID_PRODUCTS)
    v6_fails = [r for r in results if r.rule_id == "V6" and not r.passed]
    assert len(v6_fails) == 1


def test_v7_taxable_value_math_error():
    """Verify V7: Taxable value math error is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["purchase_id"] = uuid.uuid4()
    record["taxable_value"] = Decimal("250000.00")  # Incorrect, should be 300,000
    
    results = validate_batch([record], VALID_SUPPLIERS, VALID_PRODUCTS)
    v7_fails = [r for r in results if r.rule_id == "V7" and not r.passed]
    assert len(v7_fails) == 1
    assert "does not match expected result" in v7_fails[0].message


def test_v8_interstate_mismatch():
    """Verify V8: Mismatched is_interstate flag relative to Gujarat company state is flagged."""
    # Gujarat supplier SUP-MILL-002 marked as is_interstate = True
    record = dict(SAMPLE_RECORDS[0])
    record["purchase_id"] = uuid.uuid4()
    record["is_interstate"] = True
    
    results = validate_batch([record], VALID_SUPPLIERS, VALID_PRODUCTS)
    v8_fails = [r for r in results if r.rule_id == "V8" and not r.passed]
    assert len(v8_fails) == 1
    assert "expects False" in v8_fails[0].message or "expects" in v8_fails[0].message


def test_v9_gst_rates_mismatch():
    """Verify V9: GST rates mismatch for intrastate purchase is flagged."""
    record = dict(SAMPLE_RECORDS[0])  # Intrastate purchase
    record["purchase_id"] = uuid.uuid4()
    record["igst_rate"] = Decimal("18.00")  # Should be 0.00
    
    results = validate_batch([record], VALID_SUPPLIERS, VALID_PRODUCTS)
    v9_fails = [r for r in results if r.rule_id == "V9" and not r.passed]
    assert len(v9_fails) == 1
    assert "Intrastate purchase expects CGST=9%, SGST=9%, IGST=0%" in v9_fails[0].message


def test_v10_gst_amount_math_error():
    """Verify V10: CGST amount math error is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["purchase_id"] = uuid.uuid4()
    record["cgst_amount"] = Decimal("20000.00")  # Incorrect, should be 27,000
    
    results = validate_batch([record], VALID_SUPPLIERS, VALID_PRODUCTS)
    v10_fails = [r for r in results if r.rule_id == "V10" and not r.passed]
    assert len(v10_fails) == 1
    assert "does not match expected" in v10_fails[0].message


def test_v11_invoice_amount_math_error():
    """Verify V11: Invoice amount math error is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["purchase_id"] = uuid.uuid4()
    record["invoice_amount"] = Decimal("300000.00")  # Incorrect, should be 354,000
    
    results = validate_batch([record], VALID_SUPPLIERS, VALID_PRODUCTS)
    v11_fails = [r for r in results if r.rule_id == "V11" and not r.passed]
    assert len(v11_fails) == 1
    assert "does not match taxable_value + total_gst" in v11_fails[0].message


def test_v12_due_date_misalignment():
    """Verify V12: Payment due date calculation mismatch is flagged."""
    record = dict(SAMPLE_RECORDS[0])  # Credit period is 40 days
    record["purchase_id"] = uuid.uuid4()
    record["payment_due_date"] = date(2024, 5, 10)  # Incorrect (30 days instead of 40)
    
    results = validate_batch([record], VALID_SUPPLIERS, VALID_PRODUCTS)
    v12_fails = [r for r in results if r.rule_id == "V12" and not r.passed]
    assert len(v12_fails) == 1
    assert "does not match expected date" in v12_fails[0].message


def test_v13_future_purchase_date():
    """Verify V13: Purchase date in the future is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["purchase_id"] = uuid.uuid4()
    record["purchase_date"] = date(2030, 1, 1)
    
    results = validate_batch([record], VALID_SUPPLIERS, VALID_PRODUCTS)
    v13_fails = [r for r in results if r.rule_id == "V13" and not r.passed]
    assert len(v13_fails) == 1
    assert "is in the future" in v13_fails[0].message


def test_v14_supplier_capability_mismatch():
    """Verify V14: Supplier attempting to supply an unsupported brand is flagged."""
    # SUP-MILL-002 only supplies "Hi-Tech", try purchasing "APL Apollo" (PROD-001) from it
    record = dict(SAMPLE_RECORDS[0])
    record["purchase_id"] = uuid.uuid4()
    record["product_id"] = PROD_1_ID
    record["product_code"] = "PROD-001"
    
    results = validate_batch([record], VALID_SUPPLIERS, VALID_PRODUCTS)
    v14_fails = [r for r in results if r.rule_id == "V14" and not r.passed]
    assert len(v14_fails) == 1
    assert "does not supply brand 'APL Apollo'" in v14_fails[0].message
