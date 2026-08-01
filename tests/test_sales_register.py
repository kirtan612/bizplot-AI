import uuid
from decimal import Decimal
from datetime import datetime, date, timedelta, timezone
import pytest

from src.schemas.sales_register import SalesRegisterModel
from src.validators.sales_register_validator import validate_batch

CUST_1_ID = uuid.uuid4()
CUST_2_ID = uuid.uuid4()
PROD_1_ID = uuid.uuid4()
PROD_2_ID = uuid.uuid4()

VALID_CUSTOMERS = {
    str(CUST_1_ID): {
        "customer_id": str(CUST_1_ID),
        "customer_code": "CUST-CONT-001",
        "state": "Delhi",
        "credit_period_days": 60,
        "credit_limit": Decimal("2500000.00"),
    },
    str(CUST_2_ID): {
        "customer_id": str(CUST_2_ID),
        "customer_code": "CUST-CONT-003",
        "state": "Gujarat",
        "credit_period_days": 60,
        "credit_limit": Decimal("2000000.00"),
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
    # 1. Intrastate sale (Gujarat customer CUST-CONT-003)
    {
        "sales_id": uuid.uuid4(),
        "invoice_number": "INV-SAL-202404-001",
        "sales_date": date(2024, 4, 12),
        "customer_id": CUST_2_ID,
        "customer_code": "CUST-CONT-003",
        "product_id": PROD_2_ID,
        "product_code": "PROD-002",
        "quantity_pcs": 200,
        "total_weight_kg": Decimal("2000.00"),
        "unit_price_per_kg": Decimal("65.00"),
        "taxable_value": Decimal("130000.00"),
        "is_interstate": False,
        "cgst_rate": Decimal("9.00"),
        "cgst_amount": Decimal("11700.00"),
        "sgst_rate": Decimal("9.00"),
        "sgst_amount": Decimal("11700.00"),
        "igst_rate": Decimal("0.00"),
        "igst_amount": Decimal("0.00"),
        "total_gst": Decimal("23400.00"),
        "invoice_amount": Decimal("153400.00"),
        "payment_status": "Paid",
        "payment_due_date": date(2024, 6, 11),  # 2024-04-12 + 60 days
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    # 2. Interstate sale (Delhi customer CUST-CONT-001)
    {
        "sales_id": uuid.uuid4(),
        "invoice_number": "INV-SAL-202404-002",
        "sales_date": date(2024, 4, 18),
        "customer_id": CUST_1_ID,
        "customer_code": "CUST-CONT-001",
        "product_id": PROD_1_ID,
        "product_code": "PROD-001",
        "quantity_pcs": 400,
        "total_weight_kg": Decimal("4000.00"),
        "unit_price_per_kg": Decimal("75.00"),
        "taxable_value": Decimal("300000.00"),
        "is_interstate": True,
        "cgst_rate": Decimal("0.00"),
        "cgst_amount": Decimal("0.00"),
        "sgst_rate": Decimal("0.00"),
        "sgst_amount": Decimal("0.00"),
        "igst_rate": Decimal("18.00"),
        "igst_amount": Decimal("54000.00"),
        "total_gst": Decimal("54000.00"),
        "invoice_amount": Decimal("354000.00"),
        "payment_status": "Unpaid",
        "payment_due_date": date(2024, 6, 17),  # 2024-04-18 + 60 days
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
]


def test_positive_sample_records():
    """Verify that all valid sales records pass validation."""
    results = validate_batch(SAMPLE_RECORDS, VALID_CUSTOMERS, VALID_PRODUCTS)
    failures = [r for r in results if not r.passed]
    assert len(failures) == 0, f"Expected zero failures, but got: {[f.message for f in failures]}"


def test_v1_duplicate_sales_id():
    """Verify V1: Duplicate sales_id is flagged."""
    dup_records = [
        dict(SAMPLE_RECORDS[0]),
        dict(SAMPLE_RECORDS[0])
    ]
    dup_records[0]["sales_id"] = uuid.uuid4()
    dup_records[1]["sales_id"] = dup_records[0]["sales_id"]
    
    results = validate_batch(dup_records, VALID_CUSTOMERS, VALID_PRODUCTS)
    v1_fails = [r for r in results if r.rule_id == "V1" and not r.passed]
    assert len(v1_fails) == 2


def test_v2_invalid_invoice_number():
    """Verify V2: Non-matching sales invoice pattern is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["sales_id"] = uuid.uuid4()
    record["invoice_number"] = "SAL-202404-001"  # Missing INV- prefix
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_PRODUCTS)
    v2_fails = [r for r in results if r.rule_id == "V2" and not r.passed]
    assert len(v2_fails) == 1
    assert "does not match standard pattern" in v2_fails[0].message


def test_v3_invalid_customer_fk():
    """Verify V3: Unknown customer ID is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["sales_id"] = uuid.uuid4()
    record["customer_id"] = uuid.uuid4()  # Unknown ID
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_PRODUCTS)
    v3_fails = [r for r in results if r.rule_id == "V3" and not r.passed]
    assert len(v3_fails) == 1
    assert "does not exist in Customer Master" in v3_fails[0].message


def test_v4_invalid_product_fk():
    """Verify V4: Unknown product ID is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["sales_id"] = uuid.uuid4()
    record["product_id"] = uuid.uuid4()  # Unknown ID
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_PRODUCTS)
    v4_fails = [r for r in results if r.rule_id == "V4" and not r.passed]
    assert len(v4_fails) == 1
    assert "does not exist in Product Master" in v4_fails[0].message


def test_v5_invalid_quantity_or_weight():
    """Verify V5: Zero quantity or weight is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["sales_id"] = uuid.uuid4()
    record["quantity_pcs"] = 0
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_PRODUCTS)
    v5_fails = [r for r in results if r.rule_id == "V5" and not r.passed]
    assert len(v5_fails) == 1
    assert "must be strictly greater than zero" in v5_fails[0].message


def test_v6_invalid_unit_price():
    """Verify V6: Zero unit price is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["sales_id"] = uuid.uuid4()
    record["unit_price_per_kg"] = Decimal("0.00")
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_PRODUCTS)
    v6_fails = [r for r in results if r.rule_id == "V6" and not r.passed]
    assert len(v6_fails) == 1


def test_v7_taxable_value_math_error():
    """Verify V7: Taxable value math error is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["sales_id"] = uuid.uuid4()
    record["taxable_value"] = Decimal("100000.00")  # Incorrect, should be 130,000
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_PRODUCTS)
    v7_fails = [r for r in results if r.rule_id == "V7" and not r.passed]
    assert len(v7_fails) == 1
    assert "does not match expected result" in v7_fails[0].message


def test_v8_interstate_mismatch():
    """Verify V8: Mismatched is_interstate flag relative to Gujarat company state is flagged."""
    # Gujarat customer CUST-CONT-003 marked as is_interstate = True
    record = dict(SAMPLE_RECORDS[0])
    record["sales_id"] = uuid.uuid4()
    record["is_interstate"] = True
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_PRODUCTS)
    v8_fails = [r for r in results if r.rule_id == "V8" and not r.passed]
    assert len(v8_fails) == 1
    assert "expects False" in v8_fails[0].message or "expects" in v8_fails[0].message


def test_v9_gst_rates_mismatch():
    """Verify V9: GST rates mismatch for intrastate sale is flagged."""
    record = dict(SAMPLE_RECORDS[0])  # Intrastate sale
    record["sales_id"] = uuid.uuid4()
    record["igst_rate"] = Decimal("18.00")  # Should be 0.00
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_PRODUCTS)
    v9_fails = [r for r in results if r.rule_id == "V9" and not r.passed]
    assert len(v9_fails) == 1
    assert "Intrastate sales expects CGST=9%, SGST=9%, IGST=0%" in v9_fails[0].message


def test_v10_gst_amount_math_error():
    """Verify V10: CGST amount math error is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["sales_id"] = uuid.uuid4()
    record["cgst_amount"] = Decimal("10000.00")  # Incorrect, should be 11,700
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_PRODUCTS)
    v10_fails = [r for r in results if r.rule_id == "V10" and not r.passed]
    assert len(v10_fails) == 1
    assert "does not match expected" in v10_fails[0].message


def test_v11_invoice_amount_math_error():
    """Verify V11: Invoice amount math error is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["sales_id"] = uuid.uuid4()
    record["invoice_amount"] = Decimal("130000.00")  # Incorrect, should be 153,400
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_PRODUCTS)
    v11_fails = [r for r in results if r.rule_id == "V11" and not r.passed]
    assert len(v11_fails) == 1
    assert "does not match taxable_value + total_gst" in v11_fails[0].message


def test_v12_due_date_misalignment():
    """Verify V12: Payment due date calculation mismatch is flagged."""
    record = dict(SAMPLE_RECORDS[0])  # Credit period is 60 days
    record["sales_id"] = uuid.uuid4()
    record["payment_due_date"] = date(2024, 5, 12)  # Incorrect (30 days instead of 60)
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_PRODUCTS)
    v12_fails = [r for r in results if r.rule_id == "V12" and not r.passed]
    assert len(v12_fails) == 1
    assert "does not match expected date" in v12_fails[0].message


def test_v13_future_sales_date():
    """Verify V13: Sales date in the future is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["sales_id"] = uuid.uuid4()
    record["sales_date"] = date(2030, 1, 1)
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_PRODUCTS)
    v13_fails = [r for r in results if r.rule_id == "V13" and not r.passed]
    assert len(v13_fails) == 1
    assert "is in the future" in v13_fails[0].message


def test_v14_credit_limit_exceeded():
    """Verify V14: Invoice amount exceeding customer credit limit is flagged."""
    record = dict(SAMPLE_RECORDS[0])  # Customer credit limit is 2,000,000.00
    record["sales_id"] = uuid.uuid4()
    record["invoice_amount"] = Decimal("3000000.00")  # Exceeds limit
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_PRODUCTS)
    v14_fails = [r for r in results if r.rule_id == "V14" and not r.passed]
    assert len(v14_fails) == 1
    assert "exceeds customer credit limit" in v14_fails[0].message
