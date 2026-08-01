import uuid
from decimal import Decimal
from datetime import datetime, date, timezone
import pytest

from src.schemas.customer_master import CustomerMasterModel, CustomerType, PaymentBehaviorTier
from src.validators.customer_master_validator import validate_batch

# Positive fixtures representing the 15 sample records in 03_Customer_Master.md Section 8
SAMPLE_RECORDS = [
    {
        "customer_id": uuid.uuid4(),
        "customer_code": "CUST-DIST-001",
        "customer_name": "Punjab Steel Distributors",
        "customer_type": "Distributor",
        "address_line1": "Shop 4, Iron Market",
        "address_line2": "Loha Mandi",
        "city": "Ludhiana",
        "state": "Punjab",
        "pincode": "141008",
        "gst_registered": True,
        "gstin": "03AAACP1234D1Z5",
        "pan": "AAACP1234D",
        "contact_person": "Jaspal Singh",
        "contact_phone": "9812345670",
        "contact_email": "jaspal@punjabsteel.com",
        "credit_limit": Decimal("4500000.00"),
        "credit_period_days": 45,
        "payment_behavior_tier": "Prompt",
        "active": True,
        "onboarding_date": date(2024, 4, 1),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "customer_id": uuid.uuid4(),
        "customer_code": "CUST-RETL-001",
        "customer_name": "Grover Steel Traders",
        "customer_type": "Retailer",
        "address_line1": "Shop No. 12, Iron Market",
        "address_line2": "Loha Mandi",
        "city": "Ludhiana",
        "state": "Punjab",
        "pincode": "141008",
        "gst_registered": True,
        "gstin": "03AABCG5678D1Z4",
        "pan": "AABCG5678D",
        "contact_person": "Harpreet Singh",
        "contact_phone": "9812345671",
        "contact_email": "harpreet@groversteel.com",
        "credit_limit": Decimal("1200000.00"),
        "credit_period_days": 30,
        "payment_behavior_tier": "Prompt",
        "active": True,
        "onboarding_date": date(2024, 4, 1),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "customer_id": uuid.uuid4(),
        "customer_code": "CUST-RETL-002",
        "customer_name": "Singhal Iron Store",
        "customer_type": "Retailer",
        "address_line1": "SCF 23, Phase 5",
        "address_line2": None,
        "city": "Mohali",
        "state": "Punjab",
        "pincode": "160055",
        "gst_registered": True,
        "gstin": "03AACCS9012D1Z9",
        "pan": "AACCS9012D",
        "contact_person": "Ramesh Singhal",
        "contact_phone": "9812345672",
        "contact_email": "ramesh@singhaliron.com",
        "credit_limit": Decimal("800000.00"),
        "credit_period_days": 30,
        "payment_behavior_tier": "Slow",
        "active": True,
        "onboarding_date": date(2024, 4, 5),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "customer_id": uuid.uuid4(),
        "customer_code": "CUST-RETL-003",
        "customer_name": "Janta Pipe House",
        "customer_type": "Retailer",
        "address_line1": "Gill Road",
        "address_line2": None,
        "city": "Ludhiana",
        "state": "Punjab",
        "pincode": "141003",
        "gst_registered": False,
        "gstin": None,
        "pan": "AABCP1234D",
        "contact_person": "Vijay Kumar",
        "contact_phone": "9812345673",
        "contact_email": "vijay@jantapipe.com",
        "credit_limit": Decimal("400000.00"),
        "credit_period_days": 15,
        "payment_behavior_tier": "Prompt",
        "active": True,
        "onboarding_date": date(2024, 4, 10),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "customer_id": uuid.uuid4(),
        "customer_code": "CUST-FABR-001",
        "customer_name": "Vishwakarma Welders",
        "customer_type": "Fabricator",
        "address_line1": "Industrial Area Phase B",
        "address_line2": None,
        "city": "Ludhiana",
        "state": "Punjab",
        "pincode": "141003",
        "gst_registered": False,
        "gstin": None,
        "pan": "AAKPV9876F",
        "contact_person": "Ram Prasad",
        "contact_phone": "9812345674",
        "contact_email": "ram@vishwakarmaweld.com",
        "credit_limit": Decimal("50000.00"),
        "credit_period_days": 0,
        "payment_behavior_tier": "Prompt",
        "active": True,
        "onboarding_date": date(2024, 4, 12),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "customer_id": uuid.uuid4(),
        "customer_code": "CUST-FABR-002",
        "customer_name": "Apex Grill Fabrication",
        "customer_type": "Fabricator",
        "address_line1": "Near Railway Station",
        "address_line2": None,
        "city": "Jalandhar",
        "state": "Punjab",
        "pincode": "144001",
        "gst_registered": True,
        "gstin": "03AAFCA3456F1Z1",
        "pan": "AAFCA3456F",
        "contact_person": "Satish Kumar",
        "contact_phone": "9812345675",
        "contact_email": "satish@apexgrills.in",
        "credit_limit": Decimal("150000.00"),
        "credit_period_days": 7,
        "payment_behavior_tier": "Slow",
        "active": True,
        "onboarding_date": date(2024, 4, 15),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "customer_id": uuid.uuid4(),
        "customer_code": "CUST-CONT-001",
        "customer_name": "North Infra Projects",
        "customer_type": "Contractor",
        "address_line1": "Connaught Place",
        "address_line2": None,
        "city": "Delhi",
        "state": "Delhi",
        "pincode": "110001",
        "gst_registered": True,
        "gstin": "07AABCN7890G1Z6",
        "pan": "AABCN7890G",
        "contact_person": "Rajiv Khanna",
        "contact_phone": "9812345676",
        "contact_email": "khanna@northinfra.com",
        "credit_limit": Decimal("2500000.00"),
        "credit_period_days": 60,
        "payment_behavior_tier": "Slow",
        "active": True,
        "onboarding_date": date(2024, 4, 1),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "customer_id": uuid.uuid4(),
        "customer_code": "CUST-CONT-002",
        "customer_name": "Shivalik Construction",
        "customer_type": "Contractor",
        "address_line1": "Mall Road",
        "address_line2": None,
        "city": "Shimla",
        "state": "Himachal Pradesh",
        "pincode": "171001",
        "gst_registered": True,
        "gstin": "02AAECS2345H1Z3",
        "pan": "AAECS2345H",
        "contact_person": "Vikram Thakur",
        "contact_phone": "9812345677",
        "contact_email": "vikram@shivalikcon.in",
        "credit_limit": Decimal("1500000.00"),
        "credit_period_days": 45,
        "payment_behavior_tier": "Irregular",
        "active": True,
        "onboarding_date": date(2024, 4, 20),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "customer_id": uuid.uuid4(),
        "customer_code": "CUST-DIST-002",
        "customer_name": "Haryana Steel Agency",
        "customer_type": "Distributor",
        "address_line1": "Delhi Road",
        "address_line2": None,
        "city": "Rohtak",
        "state": "Haryana",
        "pincode": "124001",
        "gst_registered": True,
        "gstin": "06AAFHA6789I1Z2",
        "pan": "AAFHA6789I",
        "contact_person": "Sunil Hooda",
        "contact_phone": "9812345678",
        "contact_email": "hooda@haryanasteel.com",
        "credit_limit": Decimal("3500000.00"),
        "credit_period_days": 30,
        "payment_behavior_tier": "Prompt",
        "active": True,
        "onboarding_date": date(2024, 4, 1),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "customer_id": uuid.uuid4(),
        "customer_code": "CUST-RETL-004",
        "customer_name": "Balaji Iron Mart",
        "customer_type": "Retailer",
        "address_line1": "Sohna Road",
        "address_line2": None,
        "city": "Gurgaon",
        "state": "Haryana",
        "pincode": "122018",
        "gst_registered": True,
        "gstin": "06AABCB1234J1Z7",
        "pan": "AABCB1234J",
        "contact_person": "Sanjay Sharma",
        "contact_phone": "9812345679",
        "contact_email": "sanjay@balajiiron.in",
        "credit_limit": Decimal("1000000.00"),
        "credit_period_days": 30,
        "payment_behavior_tier": "Prompt",
        "active": True,
        "onboarding_date": date(2024, 5, 1),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "customer_id": uuid.uuid4(),
        "customer_code": "CUST-FABR-003",
        "customer_name": "Star Metal Craft",
        "customer_type": "Fabricator",
        "address_line1": "Sector 62",
        "address_line2": None,
        "city": "Noida",
        "state": "Uttar Pradesh",
        "pincode": "201301",
        "gst_registered": False,
        "gstin": None,
        "pan": "AABCX9988G",
        "contact_person": "Pradeep Yadav",
        "contact_phone": "9812345680",
        "contact_email": "pradeep@starmetal.in",
        "credit_limit": Decimal("75000.00"),
        "credit_period_days": 7,
        "payment_behavior_tier": "Irregular",
        "active": True,
        "onboarding_date": date(2024, 5, 15),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "customer_id": uuid.uuid4(),
        "customer_code": "CUST-RETL-005",
        "customer_name": "Gupta Hardware & Pipes",
        "customer_type": "Retailer",
        "address_line1": "Loha Mandi",
        "address_line2": None,
        "city": "Ghaziabad",
        "state": "Uttar Pradesh",
        "pincode": "201001",
        "gst_registered": True,
        "gstin": "09AAFGG5678K1Z3",
        "pan": "AAFGG5678K",
        "contact_person": "Alok Gupta",
        "contact_phone": "9812345681",
        "contact_email": "alok@guptahardware.com",
        "credit_limit": Decimal("600000.00"),
        "credit_period_days": 15,
        "payment_behavior_tier": "Slow",
        "active": True,
        "onboarding_date": date(2024, 5, 20),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "customer_id": uuid.uuid4(),
        "customer_code": "CUST-DIST-003",
        "customer_name": "Maharashtra Pipes",
        "customer_type": "Distributor",
        "address_line1": "Kalbadevi Road",
        "address_line2": None,
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400002",
        "gst_registered": True,
        "gstin": "27AADMP9012L1Z5",
        "pan": "AADMP9012L",
        "contact_person": "Ramesh Shah",
        "contact_phone": "9812345682",
        "contact_email": "sales@mahapipes.com",
        "credit_limit": Decimal("5000000.00"),
        "credit_period_days": 45,
        "payment_behavior_tier": "Prompt",
        "active": True,
        "onboarding_date": date(2024, 6, 1),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "customer_id": uuid.uuid4(),
        "customer_code": "CUST-CONT-003",
        "customer_name": "Western Grid Projects",
        "customer_type": "Contractor",
        "address_line1": "SG Highway",
        "address_line2": None,
        "city": "Ahmedabad",
        "state": "Gujarat",
        "pincode": "380015",
        "gst_registered": True,
        "gstin": "24AAGWP3456M1Z1",
        "pan": "AAGWP3456M",
        "contact_person": "Ketan Mehta",
        "contact_phone": "9812345683",
        "contact_email": "ketan@westerngrid.in",
        "credit_limit": Decimal("2000000.00"),
        "credit_period_days": 60,
        "payment_behavior_tier": "Irregular",
        "active": True,
        "onboarding_date": date(2024, 6, 15),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "customer_id": uuid.uuid4(),
        "customer_code": "CUST-RETL-006",
        "customer_name": "Royal Hardware Store",
        "customer_type": "Retailer",
        "address_line1": "Hall Bazaar",
        "address_line2": None,
        "city": "Amritsar",
        "state": "Punjab",
        "pincode": "143001",
        "gst_registered": True,
        "gstin": "03AAHRS7890N1Z2",
        "pan": "AAHRS7890N",
        "contact_person": "Simranjeet Singh",
        "contact_phone": "9812345684",
        "contact_email": "simran@royalhardware.in",
        "credit_limit": Decimal("900000.00"),
        "credit_period_days": 30,
        "payment_behavior_tier": "Prompt",
        "active": False,
        "onboarding_date": date(2024, 4, 1),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
]


def test_positive_sample_records():
    """Verify that all 15 valid customer records pass validation."""
    results = validate_batch(SAMPLE_RECORDS)
    failures = [r for r in results if not r.passed]
    assert len(failures) == 0, f"Expected zero failures, but got: {[f.message for f in failures]}"


def test_v1_duplicate_customer_code():
    """Verify V1: Duplicate customer_code is flagged."""
    dup_records = [
        dict(SAMPLE_RECORDS[0]),
        dict(SAMPLE_RECORDS[0])
    ]
    dup_records[0]["customer_id"] = uuid.uuid4()
    dup_records[1]["customer_id"] = uuid.uuid4()
    
    results = validate_batch(dup_records)
    v1_fails = [r for r in results if r.rule_id == "V1" and not r.passed]
    assert len(v1_fails) == 2


def test_v2_gstin_presence():
    """Verify V2: GSTIN presence based on registration is flagged."""
    # 1. Registered but GSTIN missing
    record1 = dict(SAMPLE_RECORDS[0])
    record1["customer_id"] = uuid.uuid4()
    record1["gstin"] = None
    
    results = validate_batch([record1])
    v2_fails = [r for r in results if r.rule_id == "V2" and not r.passed]
    assert len(v2_fails) == 1
    assert "GSTIN is missing" in v2_fails[0].message

    # 2. Unregistered but GSTIN provided
    record2 = dict(SAMPLE_RECORDS[3])  # CUST-RETL-003 is False
    record2["customer_id"] = uuid.uuid4()
    record2["gstin"] = "03AAACP1234D1Z5"
    
    results = validate_batch([record2])
    v2_fails = [r for r in results if r.rule_id == "V2" and not r.passed]
    assert len(v2_fails) == 1
    assert "was provided" in v2_fails[0].message


def test_v3_invalid_gstin_format():
    """Verify V3: Registered customer with incorrect GSTIN format or state code prefix is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["customer_id"] = uuid.uuid4()
    record["gstin"] = "24AAACP1234D1Z5"  # Gujarat (24) GSTIN prefix with Punjab (03) state
    record["pan"] = "AAACP1234D"  # Matches to bypass V4
    
    results = validate_batch([record])
    v3_fails = [r for r in results if r.rule_id == "V3" and not r.passed]
    assert len(v3_fails) == 1
    assert "does not match expected prefix" in v3_fails[0].message


def test_v4_pan_embedded_mismatch():
    """Verify V4: Registered customer with PAN mismatch is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["customer_id"] = uuid.uuid4()
    record["pan"] = "BBBCB5678B"  # Differs from GSTIN "AAACP1234D"
    
    results = validate_batch([record])
    v4_fails = [r for r in results if r.rule_id == "V4" and not r.passed]
    assert len(v4_fails) == 1
    assert "does not match PAN field" in v4_fails[0].message


def test_v5_invalid_pan_format():
    """Verify V5: PAN format is validated."""
    record = dict(SAMPLE_RECORDS[3])  # Unregistered RETL-003
    record["customer_id"] = uuid.uuid4()
    record["pan"] = "1234567890"  # Invalid format
    
    results = validate_batch([record])
    v5_fails = [r for r in results if r.rule_id == "V5" and not r.passed]
    assert len(v5_fails) == 1
    assert "does not match standard 10-character pattern" in v5_fails[0].message


def test_v6_invalid_credit_period():
    """Verify V6: Credit period outside 0-90 days is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["customer_id"] = uuid.uuid4()
    record["credit_period_days"] = 120  # Too high
    
    results = validate_batch([record])
    v6_fails = [r for r in results if r.rule_id == "V6" and not r.passed]
    assert len(v6_fails) == 1
    assert "outside standard 0-90 days range" in v6_fails[0].message


def test_v7_invalid_credit_limit():
    """Verify V7: Credit limit outside 0-10,000,000 range is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["customer_id"] = uuid.uuid4()
    record["credit_limit"] = Decimal("15000000.00")  # Too high
    
    results = validate_batch([record])
    v7_fails = [r for r in results if r.rule_id == "V7" and not r.passed]
    assert len(v7_fails) == 1
    assert "outside standard range" in v7_fails[0].message


def test_v9_contact_phone_format():
    """Verify V9: Phone number not 10 digits is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["customer_id"] = uuid.uuid4()
    record["contact_phone"] = "9812345"  # 7 digits
    
    results = validate_batch([record])
    v9_fails = [r for r in results if r.rule_id == "V9" and not r.passed]
    assert len(v9_fails) == 1


def test_v10_contact_email_format():
    """Verify V10: Invalid email format is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["customer_id"] = uuid.uuid4()
    record["contact_email"] = "invalid_email"
    
    results = validate_batch([record])
    v10_fails = [r for r in results if r.rule_id == "V10" and not r.passed]
    assert len(v10_fails) == 1


def test_v11_invalid_pincode():
    """Verify V11: Pincode not 6 digits is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["customer_id"] = uuid.uuid4()
    record["pincode"] = "12345"  # 5 digits
    
    results = validate_batch([record])
    v11_fails = [r for r in results if r.rule_id == "V11" and not r.passed]
    assert len(v11_fails) == 1


def test_v12_future_onboarding():
    """Verify V12: Onboarding date in the future is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["customer_id"] = uuid.uuid4()
    record["onboarding_date"] = date(2030, 1, 1)
    
    results = validate_batch([record])
    v12_fails = [r for r in results if r.rule_id == "V12" and not r.passed]
    assert len(v12_fails) == 1


def test_v13_customer_code_format_and_type():
    """Verify V13: Code format or type mismatch is flagged."""
    # 1. Format mismatch
    record1 = dict(SAMPLE_RECORDS[0])
    record1["customer_id"] = uuid.uuid4()
    record1["customer_code"] = "CUST-DISTR-001"  # DISTR instead of DIST
    
    results = validate_batch([record1])
    v13_fails = [r for r in results if r.rule_id == "V13" and not r.passed]
    assert len(v13_fails) == 1
    assert "does not match standard pattern" in v13_fails[0].message

    # 2. Type mismatch: Distributor customer with Retailer code
    record2 = dict(SAMPLE_RECORDS[0])
    record2["customer_id"] = uuid.uuid4()
    record2["customer_code"] = "CUST-RETL-001"  # Actual type is Distributor
    
    results = validate_batch([record2])
    v13_fails = [r for r in results if r.rule_id == "V13" and not r.passed]
    assert len(v13_fails) == 1
    assert "does not match actual type" in v13_fails[0].message
