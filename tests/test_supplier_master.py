import uuid
from datetime import datetime, date, timezone
import pytest

from src.schemas.supplier_master import SupplierMasterModel, SupplierTier, IndianState
from src.validators.supplier_master_validator import validate_batch

# Positive fixtures representing the 14 sample records in 02_Supplier_Master.md Section 8
SAMPLE_RECORDS = [
    {
        "supplier_id": uuid.uuid4(),
        "supplier_code": "SUP-MILL-001",
        "supplier_name": "APL Apollo Tubes Ltd.",
        "supplier_tier": "Mill",
        "address_line1": "B-10, Sector 80",
        "address_line2": "Phase II Industrial Area",
        "city": "Mohali",
        "state": "Punjab",
        "pincode": "160055",
        "gstin": "03AAACA1234A1Z5",
        "pan": "AAACA1234A",
        "contact_person": "Rajesh Kumar",
        "contact_phone": "9876543210",
        "contact_email": "rajesh.k@aplapollo.com",
        "credit_period_days": 45,
        "brands_supplied": ["APL Apollo"],
        "categories_supplied": ["GI", "MS", "GP"],
        "active": True,
        "onboarding_date": date(2024, 1, 15),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "supplier_id": uuid.uuid4(),
        "supplier_code": "SUP-MILL-002",
        "supplier_name": "Hi-Tech Pipes Ltd.",
        "supplier_tier": "Mill",
        "address_line1": "123 Ring Road",
        "address_line2": None,
        "city": "Surat",
        "state": "Gujarat",
        "pincode": "395003",
        "gstin": "24AABCH5678B1Z3",
        "pan": "AABCH5678B",
        "contact_person": "Vimal Shah",
        "contact_phone": "9876543211",
        "contact_email": "vimal@hitechpipes.in",
        "credit_period_days": 40,
        "brands_supplied": ["Hi-Tech"],
        "categories_supplied": ["GI", "MS", "GP"],
        "active": True,
        "onboarding_date": date(2024, 2, 20),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "supplier_id": uuid.uuid4(),
        "supplier_code": "SUP-MILL-003",
        "supplier_name": "Bharat Steel Mills",
        "supplier_tier": "Mill",
        "address_line1": "Mandi Gobindgarh",
        "address_line2": None,
        "city": "Mandi Gobindgarh",
        "state": "Punjab",
        "pincode": "147301",
        "gstin": "03AACBS9012C1Z8",
        "pan": "AACBS9012C",
        "contact_person": "Gurpreet Singh",
        "contact_phone": "9876543212",
        "contact_email": "gurpreet@bharatsteel.com",
        "credit_period_days": 30,
        "brands_supplied": ["Local Mills"],
        "categories_supplied": ["GI", "MS"],
        "active": True,
        "onboarding_date": date(2024, 1, 10),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "supplier_id": uuid.uuid4(),
        "supplier_code": "SUP-DIST-001",
        "supplier_name": "Prime Steel Distributors",
        "supplier_tier": "Authorized Distributor",
        "address_line1": "Kalbadevi",
        "address_line2": None,
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400002",
        "gstin": "27AADPS3456D1Z1",
        "pan": "AADPS3456D",
        "contact_person": "Amit Patel",
        "contact_phone": "9876543213",
        "contact_email": "sales@primesteel.com",
        "credit_period_days": 30,
        "brands_supplied": ["APL Apollo"],
        "categories_supplied": ["GI", "MS", "GP"],
        "active": True,
        "onboarding_date": date(2024, 3, 1),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "supplier_id": uuid.uuid4(),
        "supplier_code": "SUP-DIST-002",
        "supplier_name": "Vardhman Pipe Co.",
        "supplier_tier": "Authorized Distributor",
        "address_line1": "Loha Mandi",
        "address_line2": "Hauz Qazi",
        "city": "Delhi",
        "state": "Delhi",
        "pincode": "110006",
        "gstin": "07AAFVC7890E1Z4",
        "pan": "AAFVC7890E",
        "contact_person": "Sanjay Jain",
        "contact_phone": "9876543214",
        "contact_email": "sanjay@vardhmanpipes.com",
        "credit_period_days": 25,
        "brands_supplied": ["Hi-Tech"],
        "categories_supplied": ["GI", "MS"],
        "active": True,
        "onboarding_date": date(2024, 3, 5),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "supplier_id": uuid.uuid4(),
        "supplier_code": "SUP-DIST-003",
        "supplier_name": "Shree Ganesh Traders",
        "supplier_tier": "Authorized Distributor",
        "address_line1": "GIDC Naroda",
        "address_line2": None,
        "city": "Ahmedabad",
        "state": "Gujarat",
        "pincode": "382330",
        "gstin": "24AAESG2345F1Z6",
        "pan": "AAESG2345F",
        "contact_person": "Girish Patel",
        "contact_phone": "9876543215",
        "contact_email": "girish@shreeganesh.com",
        "credit_period_days": 28,
        "brands_supplied": ["Hi-Tech", "Local Mills"],
        "categories_supplied": ["GI"],
        "active": True,
        "onboarding_date": date(2024, 4, 1),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "supplier_id": uuid.uuid4(),
        "supplier_code": "SUP-DIST-004",
        "supplier_name": "Rajasthan Steel Agency",
        "supplier_tier": "Authorized Distributor",
        "address_line1": "VKI Area",
        "address_line2": None,
        "city": "Jaipur",
        "state": "Rajasthan",
        "pincode": "302013",
        "gstin": "08AARRA6789G1Z2",
        "pan": "AARRA6789G",
        "contact_person": "Ramesh Sharma",
        "contact_phone": "9876543216",
        "contact_email": "ramesh@rajsteel.in",
        "credit_period_days": 22,
        "brands_supplied": ["APL Apollo"],
        "categories_supplied": ["GI", "MS"],
        "active": True,
        "onboarding_date": date(2024, 4, 15),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "supplier_id": uuid.uuid4(),
        "supplier_code": "SUP-TRDR-001",
        "supplier_name": "Kumar Enterprises",
        "supplier_tier": "Trader",
        "address_line1": "Gill Road",
        "address_line2": None,
        "city": "Ludhiana",
        "state": "Punjab",
        "pincode": "141003",
        "gstin": "03AABKE4567H1Z9",
        "pan": "AABKE4567H",
        "contact_person": "Vijay Kumar",
        "contact_phone": "9876543217",
        "contact_email": "vijay@kumarenterprises.com",
        "credit_period_days": 20,
        "brands_supplied": ["Hi-Tech", "Local Mills"],
        "categories_supplied": ["GI", "MS"],
        "active": True,
        "onboarding_date": date(2024, 5, 10),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "supplier_id": uuid.uuid4(),
        "supplier_code": "SUP-TRDR-002",
        "supplier_name": "Balaji Trading Co.",
        "supplier_tier": "Trader",
        "address_line1": "George Town",
        "address_line2": None,
        "city": "Chennai",
        "state": "Tamil Nadu",
        "pincode": "600001",
        "gstin": "33AACBT8901I1Z7",
        "pan": "AACBT8901I",
        "contact_person": "K. Balaji",
        "contact_phone": "9876543218",
        "contact_email": "balaji@balajitrading.co.in",
        "credit_period_days": 18,
        "brands_supplied": ["APL Apollo", "Hi-Tech"],
        "categories_supplied": ["GI"],
        "active": True,
        "onboarding_date": date(2024, 6, 12),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "supplier_id": uuid.uuid4(),
        "supplier_code": "SUP-TRDR-003",
        "supplier_name": "Mehta Brothers",
        "supplier_tier": "Trader",
        "address_line1": "Sadashiv Peth",
        "address_line2": None,
        "city": "Pune",
        "state": "Maharashtra",
        "pincode": "411030",
        "gstin": "27AADMB1234J1Z3",
        "pan": "AADMB1234J",
        "contact_person": "Sunil Mehta",
        "contact_phone": "9876543219",
        "contact_email": "sunil@mehtabrothers.com",
        "credit_period_days": 15,
        "brands_supplied": ["Hi-Tech", "Local Mills"],
        "categories_supplied": ["GI", "MS"],
        "active": True,
        "onboarding_date": date(2024, 6, 25),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "supplier_id": uuid.uuid4(),
        "supplier_code": "SUP-TRDR-004",
        "supplier_name": "City Steel Mart",
        "supplier_tier": "Trader",
        "address_line1": "Gandhibagh",
        "address_line2": None,
        "city": "Nagpur",
        "state": "Maharashtra",
        "pincode": "440002",
        "gstin": "27AAFCS5678K1Z5",
        "pan": "AAFCS5678K",
        "contact_person": "Rajesh Gupta",
        "contact_phone": "9876543220",
        "contact_email": "rajesh@citysteel.co.in",
        "credit_period_days": 22,
        "brands_supplied": ["APL Apollo", "Local Mills"],
        "categories_supplied": ["MS"],
        "active": True,
        "onboarding_date": date(2024, 7, 10),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "supplier_id": uuid.uuid4(),
        "supplier_code": "SUP-TRDR-005",
        "supplier_name": "United Pipe Suppliers",
        "supplier_tier": "Trader",
        "address_line1": "Transport Nagar",
        "address_line2": None,
        "city": "Kanpur",
        "state": "Uttar Pradesh",
        "pincode": "208023",
        "gstin": "09AAGUP9012L1Z1",
        "pan": "AAGUP9012L",
        "contact_person": "S. K. Pandey",
        "contact_phone": "9876543221",
        "contact_email": "sk@unitedpipes.com",
        "credit_period_days": 17,
        "brands_supplied": ["Hi-Tech"],
        "categories_supplied": ["GI", "MS", "GP"],
        "active": True,
        "onboarding_date": date(2024, 8, 5),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "supplier_id": uuid.uuid4(),
        "supplier_code": "SUP-DIST-005",
        "supplier_name": "Steel World Pvt Ltd",
        "supplier_tier": "Authorized Distributor",
        "address_line1": "Peenya Industrial Area",
        "address_line2": None,
        "city": "Bangalore",
        "state": "Karnataka",
        "pincode": "560058",
        "gstin": "29AAHSW2345M1Z8",
        "pan": "AAHSW2345M",
        "contact_person": "M. Krishna",
        "contact_phone": "9876543222",
        "contact_email": "krishna@steelworld.in",
        "credit_period_days": 26,
        "brands_supplied": ["APL Apollo", "Hi-Tech"],
        "categories_supplied": ["GI", "MS", "GP"],
        "active": True,
        "onboarding_date": date(2024, 8, 20),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "supplier_id": uuid.uuid4(),
        "supplier_code": "SUP-TRDR-006",
        "supplier_name": "Arora Metals",
        "supplier_tier": "Trader",
        "address_line1": "Industrial Area Phase I",
        "address_line2": None,
        "city": "Chandigarh",
        "state": "Chandigarh",
        "pincode": "160002",
        "gstin": "04AABAM6789N1Z4",
        "pan": "AABAM6789N",
        "contact_person": "S. P. Arora",
        "contact_phone": "9876543223",
        "contact_email": "arorametals@gmail.com",
        "credit_period_days": 20,
        "brands_supplied": ["Local Mills"],
        "categories_supplied": ["GI"],
        "active": False,
        "onboarding_date": date(2024, 9, 1),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
]


def test_positive_sample_records():
    """Verify that all 14 valid supplier records pass validation."""
    results = validate_batch(SAMPLE_RECORDS)
    failures = [r for r in results if not r.passed]
    assert len(failures) == 0, f"Expected zero failures, but got: {[f.message for f in failures]}"


def test_v1_duplicate_supplier_code():
    """Verify V1: Duplicate supplier_code is flagged."""
    dup_records = [
        dict(SAMPLE_RECORDS[0]),
        dict(SAMPLE_RECORDS[0])
    ]
    dup_records[0]["supplier_id"] = uuid.uuid4()
    dup_records[1]["supplier_id"] = uuid.uuid4()
    
    results = validate_batch(dup_records)
    v1_fails = [r for r in results if r.rule_id == "V1" and not r.passed]
    assert len(v1_fails) == 2
    assert "Duplicate supplier_code found" in v1_fails[0].message


def test_v2_invalid_gstin():
    """Verify V2: GSTIN state mismatch or incorrect format is flagged."""
    # 1. State mismatch: Punjab (03) state with Maharashtra (27) GSTIN prefix
    record = dict(SAMPLE_RECORDS[0])
    record["supplier_id"] = uuid.uuid4()
    record["gstin"] = "27AAACA1234A1Z5"
    record["pan"] = "AAACA1234A"  # Keep matching
    
    results = validate_batch([record])
    v2_fails = [r for r in results if r.rule_id == "V2" and not r.passed]
    assert len(v2_fails) == 1
    assert "does not match expected state prefix" in v2_fails[0].message


def test_v3_pan_mismatch():
    """Verify V3: Embedded PAN mismatch with PAN field is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["supplier_id"] = uuid.uuid4()
    record["pan"] = "BBBCB5678B"  # Differs from GSTIN "AAACA1234A"
    
    results = validate_batch([record])
    v3_fails = [r for r in results if r.rule_id == "V3" and not r.passed]
    assert len(v3_fails) == 1
    assert "does not match PAN field" in v3_fails[0].message


def test_v5_invalid_credit_period():
    """Verify V5: Credit period outside 7-60 days is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["supplier_id"] = uuid.uuid4()
    record["credit_period_days"] = 5  # Too low
    
    results = validate_batch([record])
    v5_fails = [r for r in results if r.rule_id == "V5" and not r.passed]
    assert len(v5_fails) == 1
    assert "outside standard 7-60 days range" in v5_fails[0].message


def test_v6_empty_brands():
    """Verify V6: Empty brands supplied is caught."""
    record = dict(SAMPLE_RECORDS[0])
    record["supplier_id"] = uuid.uuid4()
    record["brands_supplied"] = []
    
    results = validate_batch([record])
    # Pydantic schema validation will catch empty lists if enforced, or custom validator flags it
    v6_fails = [r for r in results if r.rule_id == "V6" and not r.passed]
    assert len(v6_fails) == 1


def test_v8_empty_categories():
    """Verify V8: Empty categories supplied is caught."""
    record = dict(SAMPLE_RECORDS[0])
    record["supplier_id"] = uuid.uuid4()
    record["categories_supplied"] = []
    
    results = validate_batch([record])
    v8_fails = [r for r in results if r.rule_id == "V8" and not r.passed]
    assert len(v8_fails) == 1


def test_v10_tier_brand_cardinality():
    """Verify V10: Mill tier having multiple brands is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["supplier_id"] = uuid.uuid4()
    record["brands_supplied"] = ["APL Apollo", "Hi-Tech"]  # 2 brands for a Mill
    
    results = validate_batch([record])
    v10_fails = [r for r in results if r.rule_id == "V10" and not r.passed]
    assert len(v10_fails) == 1
    assert "must supply exactly 1 brand" in v10_fails[0].message


def test_v11_contact_phone_format():
    """Verify V11: Phone number not 10 digits is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["supplier_id"] = uuid.uuid4()
    record["contact_phone"] = "98765432"  # 8 digits
    
    results = validate_batch([record])
    v11_fails = [r for r in results if r.rule_id == "V11" and not r.passed]
    assert len(v11_fails) == 1


def test_v12_contact_email_format():
    """Verify V12: Invalid email address format is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["supplier_id"] = uuid.uuid4()
    record["contact_email"] = "invalid_email.com"
    
    results = validate_batch([record])
    v12_fails = [r for r in results if r.rule_id == "V12" and not r.passed]
    assert len(v12_fails) == 1


def test_v13_invalid_pincode():
    """Verify V13: Pincode not 6 digits is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["supplier_id"] = uuid.uuid4()
    record["pincode"] = "12345"  # 5 digits
    
    results = validate_batch([record])
    v13_fails = [r for r in results if r.rule_id == "V13" and not r.passed]
    assert len(v13_fails) == 1


def test_v14_future_onboarding():
    """Verify V14: Onboarding date in the future is flagged."""
    record = dict(SAMPLE_RECORDS[0])
    record["supplier_id"] = uuid.uuid4()
    record["onboarding_date"] = date(2030, 1, 1)  # Future onboarding
    
    results = validate_batch([record])
    v14_fails = [r for r in results if r.rule_id == "V14" and not r.passed]
    assert len(v14_fails) == 1


def test_v15_supplier_code_format_and_tier():
    """Verify V15: Code format or tier code mismatch is flagged."""
    # 1. Invalid pattern
    record1 = dict(SAMPLE_RECORDS[0])
    record1["supplier_id"] = uuid.uuid4()
    record1["supplier_code"] = "SUPP-MILL-001"  # SUPP instead of SUP
    
    results = validate_batch([record1])
    v15_fails = [r for r in results if r.rule_id == "V15" and not r.passed]
    assert len(v15_fails) == 1
    assert "does not match standard pattern" in v15_fails[0].message

    # 2. Tier mismatch: Mill supplier with Trader code
    record2 = dict(SAMPLE_RECORDS[0])
    record2["supplier_id"] = uuid.uuid4()
    record2["supplier_code"] = "SUP-TRDR-001"  # Actual tier is Mill
    
    results = validate_batch([record2])
    v15_fails = [r for r in results if r.rule_id == "V15" and not r.passed]
    assert len(v15_fails) == 1
    assert "does not match actual tier" in v15_fails[0].message
