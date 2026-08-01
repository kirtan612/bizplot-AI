import uuid
from decimal import Decimal
from datetime import datetime, date, timezone
import pytest

from src.schemas.cashbook import CashbookModel
from src.validators.cashbook_validator import validate_batch

CUST_1_ID = uuid.uuid4()
SUP_1_ID = uuid.uuid4()

VALID_CUSTOMERS = {
    str(CUST_1_ID): {
        "customer_id": str(CUST_1_ID),
        "customer_code": "CUST-CONT-001",
        "customer_name": "North Infra Projects",
    }
}

VALID_SUPPLIERS = {
    str(SUP_1_ID): {
        "supplier_id": str(SUP_1_ID),
        "supplier_code": "SUP-MILL-001",
        "supplier_name": "APL Apollo Tubes Ltd.",
    }
}

SAMPLE_RECORDS = [
    # 1. Customer Receipt
    {
        "entry_id": uuid.uuid4(),
        "entry_date": date(2024, 4, 10),
        "voucher_number": "VOU-202404-001",
        "transaction_type": "Receipt",
        "party_type": "Customer",
        "party_id": CUST_1_ID,
        "party_name": "North Infra Projects",
        "payment_mode": "Bank Transfer",
        "amount": Decimal("150000.00"),
        "reference_invoice_number": "INV-SAL-202404-001",
        "opening_balance": Decimal("500000.00"),
        "closing_balance": Decimal("650000.00"),
        "narration": "Customer invoice payment receipt",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    # 2. Supplier Payment (Continuous with Voucher 1)
    {
        "entry_id": uuid.uuid4(),
        "entry_date": date(2024, 4, 12),
        "voucher_number": "VOU-202404-002",
        "transaction_type": "Payment",
        "party_type": "Supplier",
        "party_id": SUP_1_ID,
        "party_name": "APL Apollo Tubes Ltd.",
        "payment_mode": "Bank Transfer",
        "amount": Decimal("200000.00"),
        "reference_invoice_number": "INV-PUR-202404-001",
        "opening_balance": Decimal("650000.00"),
        "closing_balance": Decimal("450000.00"),
        "narration": "Supplier invoice payment",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    # 3. Expense Payment (Continuous with Voucher 2)
    {
        "entry_id": uuid.uuid4(),
        "entry_date": date(2024, 4, 15),
        "voucher_number": "VOU-202404-003",
        "transaction_type": "Payment",
        "party_type": "Expense",
        "party_id": None,
        "party_name": "Office Rent",
        "payment_mode": "UPI",
        "amount": Decimal("25000.00"),
        "reference_invoice_number": None,
        "opening_balance": Decimal("450000.00"),
        "closing_balance": Decimal("425000.00"),
        "narration": "Office rent payment for April",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
]


def test_positive_sample_records():
    """Verify that all valid cashbook vouchers pass validation."""
    results = validate_batch(SAMPLE_RECORDS, VALID_CUSTOMERS, VALID_SUPPLIERS)
    failures = [r for r in results if not r.passed]
    assert len(failures) == 0, f"Expected zero failures, but got: {[f.message for f in failures]}"


def test_v1_duplicate_entry_id():
    """Verify V1: Duplicate entry_id is flagged."""
    dup_records = [
        dict(SAMPLE_RECORDS[0]),
        dict(SAMPLE_RECORDS[0])
    ]
    dup_records[0]["entry_id"] = uuid.uuid4()
    dup_records[1]["entry_id"] = dup_records[0]["entry_id"]
    
    results = validate_batch(dup_records, VALID_CUSTOMERS, VALID_SUPPLIERS)
    v1_fails = [r for r in results if r.rule_id == "V1" and not r.passed]
    assert len(v1_fails) == 2


def test_v2_invalid_voucher_number():
    """Verify V2: Non-matching voucher pattern is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["entry_id"] = uuid.uuid4()
    record["voucher_number"] = "VOUCH-202404-001"  # Invalid prefix
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_SUPPLIERS)
    v2_fails = [r for r in results if r.rule_id == "V2" and not r.passed]
    assert len(v2_fails) == 1
    assert "does not match standard pattern" in v2_fails[0].message


def test_v3_zero_amount():
    """Verify V3: Zero amount is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["entry_id"] = uuid.uuid4()
    record["amount"] = Decimal("0.00")
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_SUPPLIERS)
    v3_fails = [r for r in results if r.rule_id == "V3" and not r.passed]
    assert len(v3_fails) == 1
    assert "must be strictly greater than zero" in v3_fails[0].message


def test_v4_balance_math_error():
    """Verify V4: Closing balance calculation error is flagged."""
    # Receipt: 500,000 + 150,000 = 650,000. Set closing to 600,000
    record = dict(SAMPLE_RECORDS[0])
    record["entry_id"] = uuid.uuid4()
    record["closing_balance"] = Decimal("600000.00")
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_SUPPLIERS)
    v4_fails = [r for r in results if r.rule_id == "V4" and not r.passed]
    assert len(v4_fails) == 1
    assert "does not match expected result" in v4_fails[0].message


def test_v5_negative_closing_balance():
    """Verify V5: Negative closing balance (overdraft) is flagged."""
    record = dict(SAMPLE_RECORDS[1])  # Payment of 200,000
    record["entry_id"] = uuid.uuid4()
    record["opening_balance"] = Decimal("100000.00")
    record["closing_balance"] = Decimal("-100000.00")  # Math fits payment (-100k), but negative!
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_SUPPLIERS)
    v5_fails = [r for r in results if r.rule_id == "V5" and not r.passed]
    assert len(v5_fails) == 1
    assert "cannot be negative" in v5_fails[0].message


def test_v6_party_relationship_mismatch():
    """Verify V6: Missing party_id for Customer or non-null party_id for Expense is flagged."""
    # 1. Customer party without party_id
    record1 = dict(SAMPLE_RECORDS[0])
    record1["entry_id"] = uuid.uuid4()
    record1["party_id"] = None
    
    results = validate_batch([record1], VALID_CUSTOMERS, VALID_SUPPLIERS)
    v6_fails = [r for r in results if r.rule_id == "V6" and not r.passed]
    assert len(v6_fails) == 1
    assert "party_id is missing" in v6_fails[0].message

    # 2. Expense party with party_id provided
    record2 = dict(SAMPLE_RECORDS[2])  # Expense voucher
    record2["entry_id"] = uuid.uuid4()
    record2["party_id"] = uuid.uuid4()
    
    results = validate_batch([record2], VALID_CUSTOMERS, VALID_SUPPLIERS)
    v6_fails = [r for r in results if r.rule_id == "V6" and not r.passed]
    assert len(v6_fails) == 1
    assert "must be null for Expense/Capital" in v6_fails[0].message


def test_v7_reference_invoice_format():
    """Verify V7: Reference invoice format mismatch is flagged."""
    # Customer receipt referencing purchase invoice format
    record = dict(SAMPLE_RECORDS[0])
    record["entry_id"] = uuid.uuid4()
    record["reference_invoice_number"] = "INV-PUR-202404-001"
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_SUPPLIERS)
    v7_fails = [r for r in results if r.rule_id == "V7" and not r.passed]
    assert len(v7_fails) == 1
    assert "does not match sales invoice format" in v7_fails[0].message


def test_v9_future_entry_date():
    """Verify V9: Entry date in the future is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["entry_id"] = uuid.uuid4()
    record["entry_date"] = date(2030, 1, 1)
    
    results = validate_batch([record], VALID_CUSTOMERS, VALID_SUPPLIERS)
    v9_fails = [r for r in results if r.rule_id == "V9" and not r.passed]
    assert len(v9_fails) == 1
    assert "is in the future" in v9_fails[0].message


def test_v10_cross_entry_discontinuity():
    """Verify V10: Discontinuity between consecutive cashbook entries is flagged."""
    batch = [
        dict(SAMPLE_RECORDS[0]),  # Voucher 1 closing balance is 650,000
        dict(SAMPLE_RECORDS[1])   # Voucher 2 opening balance is set to 600,000
    ]
    batch[1]["entry_id"] = uuid.uuid4()
    batch[1]["opening_balance"] = Decimal("600000.00")
    batch[1]["closing_balance"] = Decimal("400000.00")  # Adjust to satisfy V4 (600k - 200k = 400k)
    
    results = validate_batch(batch, VALID_CUSTOMERS, VALID_SUPPLIERS)
    v10_fails = [r for r in results if r.rule_id == "V10" and not r.passed]
    assert len(v10_fails) == 1
    assert "does not match previous closing balance" in v10_fails[0].message
