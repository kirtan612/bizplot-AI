import uuid
from datetime import datetime, date, timezone
import pytest

from src.schemas.company_master import CompanyMasterModel, CompanyType
from src.validators.company_master_validator import validate_batch

SAMPLE_COMPANY = {
    "company_id": uuid.uuid4(),
    "company_code": "COMP-001",
    "legal_name": "Apex Steel Distributors Pvt. Ltd.",
    "trade_name": "Apex Steel",
    "company_type": "Private Limited",
    "address_line1": "Plot No. 45, Phase III",
    "address_line2": "Focal Point",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "pincode": "380015",
    "gstin": "24AAACA9876C1Z4",
    "pan": "AAACA9876C",
    "cin": "U28910GJ2015PTC038123",
    "contact_person": "Gurmukh Singh",
    "contact_phone": "9876543210",
    "contact_email": "finance@apexsteel.co.in",
    "financial_year_start": "04-01",
    "current_fy": "FY 2024-25",
    "opening_balance_date": date(2024, 4, 1),
    "bank_name": "HDFC Bank",
    "bank_account_number": "50200012345678",
    "bank_ifsc": "HDFC0000057",
    "created_at": datetime.now(timezone.utc),
    "updated_at": datetime.now(timezone.utc),
}


def test_positive_sample_record():
    """Verify that our valid company record passes validation."""
    results = validate_batch([SAMPLE_COMPANY])
    failures = [r for r in results if not r.passed]
    assert len(failures) == 0, f"Expected zero failures, but got: {[f.message for f in failures]}"


def test_v1_multiple_companies():
    """Verify V1: Multiple company records in a batch are rejected."""
    comp1 = dict(SAMPLE_COMPANY)
    comp2 = dict(SAMPLE_COMPANY)
    comp2["company_id"] = uuid.uuid4()
    comp2["company_code"] = "COMP-002"  # to avoid V2 block, but V1 will trigger
    
    results = validate_batch([comp1, comp2])
    v1_fails = [r for r in results if r.rule_id == "V1" and not r.passed]
    assert len(v1_fails) == 2
    assert "multiple company records" in v1_fails[0].message


def test_v2_invalid_company_code():
    """Verify V2: Code not COMP-001 is flagged."""
    record = dict(SAMPLE_COMPANY)
    record["company_code"] = "COMP-002"
    
    results = validate_batch([record])
    v2_fails = [r for r in results if r.rule_id == "V2" and not r.passed]
    assert len(v2_fails) == 1
    assert "must be COMP-001" in v2_fails[0].message


def test_v3_invalid_gstin_format():
    """Verify V3: Incorrect GSTIN state code prefix is flagged."""
    record = dict(SAMPLE_COMPANY)
    record["gstin"] = "03AAACA9876C1Z4"  # Punjab (03) prefix but company state is Gujarat
    record["pan"] = "AAACA9876C"  # Matches to bypass V4
    
    results = validate_batch([record])
    v3_fails = [r for r in results if r.rule_id == "V3" and not r.passed]
    assert len(v3_fails) == 1
    assert "does not match expected state prefix" in v3_fails[0].message


def test_v4_pan_mismatch():
    """Verify V4: PAN field differing from embedded GSTIN is flagged."""
    record = dict(SAMPLE_COMPANY)
    record["pan"] = "BBBCB1234B"
    
    results = validate_batch([record])
    v4_fails = [r for r in results if r.rule_id == "V4" and not r.passed]
    assert len(v4_fails) == 1
    assert "does not match PAN field" in v4_fails[0].message


def test_v6_corporate_cin_requirement():
    """Verify V6: Corporate company with missing CIN or Proprietorship with CIN is flagged."""
    # 1. Private Limited with missing CIN
    record1 = dict(SAMPLE_COMPANY)
    record1["cin"] = None
    
    results = validate_batch([record1])
    v6_fails = [r for r in results if r.rule_id == "V6" and not r.passed]
    assert len(v6_fails) == 1
    assert "CIN is missing" in v6_fails[0].message

    # 2. Proprietorship with corporate CIN
    record2 = dict(SAMPLE_COMPANY)
    record2["company_type"] = "Proprietorship"
    record2["cin"] = "U28910GJ2015PTC038123"
    
    results = validate_batch([record2])
    v6_fails = [r for r in results if r.rule_id == "V6" and not r.passed]
    assert len(v6_fails) == 1
    assert "was provided" in v6_fails[0].message


def test_v7_invalid_cin_format():
    """Verify V7: CIN format is checked."""
    record = dict(SAMPLE_COMPANY)
    record["cin"] = "INVALID1234567890123"  # Non-standard pattern
    
    results = validate_batch([record])
    v7_fails = [r for r in results if r.rule_id == "V7" and not r.passed]
    assert len(v7_fails) == 1
    assert "not in standard 21-character format" in v7_fails[0].message


def test_v8_invalid_pincode():
    """Verify V8: Pincode not 6 digits is flagged."""
    record = dict(SAMPLE_COMPANY)
    record["pincode"] = "38001"  # 5 digits
    
    results = validate_batch([record])
    v8_fails = [r for r in results if r.rule_id == "V8" and not r.passed]
    assert len(v8_fails) == 1


def test_v9_invalid_phone():
    """Verify V9: Contact phone not 10 digits is flagged."""
    record = dict(SAMPLE_COMPANY)
    record["contact_phone"] = "98765432"  # 8 digits
    
    results = validate_batch([record])
    v9_fails = [r for r in results if r.rule_id == "V9" and not r.passed]
    assert len(v9_fails) == 1


def test_v10_invalid_email():
    """Verify V10: Invalid email format is flagged."""
    record = dict(SAMPLE_COMPANY)
    record["contact_email"] = "finance_at_apexsteel"
    
    results = validate_batch([record])
    v10_fails = [r for r in results if r.rule_id == "V10" and not r.passed]
    assert len(v10_fails) == 1


def test_v11_invalid_fy_start():
    """Verify V11: FY start not MM-DD format is flagged."""
    record = dict(SAMPLE_COMPANY)
    record["financial_year_start"] = "04/01"  # Invalid separator
    
    results = validate_batch([record])
    v11_fails = [r for r in results if r.rule_id == "V11" and not r.passed]
    assert len(v11_fails) == 1


def test_v12_invalid_bank_account():
    """Verify V12: Bank account not 10-18 digits is flagged."""
    record = dict(SAMPLE_COMPANY)
    record["bank_account_number"] = "12345678"  # 8 digits
    
    results = validate_batch([record])
    v12_fails = [r for r in results if r.rule_id == "V12" and not r.passed]
    assert len(v12_fails) == 1


def test_v13_invalid_ifsc():
    """Verify V13: IFSC not meeting pattern is flagged."""
    record = dict(SAMPLE_COMPANY)
    record["bank_ifsc"] = "HDFC1000057"  # 5th character not 0
    
    results = validate_batch([record])
    v13_fails = [r for r in results if r.rule_id == "V13" and not r.passed]
    assert len(v13_fails) == 1


def test_v14_date_misalignment():
    """Verify V14: Opening balance date not aligned with FY start is flagged."""
    record = dict(SAMPLE_COMPANY)
    record["opening_balance_date"] = date(2024, 4, 15)  # Shifts by 14 days
    
    results = validate_batch([record])
    v14_fails = [r for r in results if r.rule_id == "V14" and not r.passed]
    assert len(v14_fails) == 1
    assert "does not align with financial year start" in v14_fails[0].message


def test_v15_invalid_fy_label():
    """Verify V15: Invalid FY label or non-consecutive years is flagged."""
    # 1. Invalid pattern
    record1 = dict(SAMPLE_COMPANY)
    record1["current_fy"] = "FY2024-25"  # Missing space
    
    results = validate_batch([record1])
    v15_fails = [r for r in results if r.rule_id == "V15" and not r.passed]
    assert len(v15_fails) == 1

    # 2. Non-consecutive years
    record2 = dict(SAMPLE_COMPANY)
    record2["current_fy"] = "FY 2024-26"  # Gap of 2 years
    
    results = validate_batch([record2])
    v15_fails = [r for r in results if r.rule_id == "V15" and not r.passed]
    assert len(v15_fails) == 1
    assert "years are not consecutive" in v15_fails[0].message
