"""
Master Data Generator
Generates Product Master, Supplier Master, Customer Master, and Company Master.
Domain: GI / MS Steel Pipe Distribution
"""

import uuid
import random
from datetime import datetime, date, timezone
from decimal import Decimal
from typing import Dict, List, Tuple

from src.schemas.product_master import ProductMasterModel, Brand, Category, Shape, WeightClass, StandardRef
from src.schemas.supplier_master import SupplierMasterModel, SupplierTier, IndianState
from src.schemas.customer_master import CustomerMasterModel, CustomerType, PaymentBehaviorTier
from src.schemas.company_master import CompanyMasterModel, CompanyType

from src.utils.formulas import (
    ROUND_SIZES,
    HOLLOW_THICKNESS,
    calculate_weight_per_meter,
    generate_product_code,
    parse_hollow_size,
)

from src.validators import product_master_validator
from src.validators import supplier_master_validator
from src.validators import customer_master_validator
from src.validators import company_master_validator


def generate_products(rng: random.Random) -> List[ProductMasterModel]:
    """Generates ~140 deterministic Product Master records adhering to BRS rules."""
    products: List[ProductMasterModel] = []
    
    # Target brand distribution: APL Apollo (56), Hi-Tech (49), Local Mills (35) = 140
    brand_counts = [
        (Brand.APL_APOLLO, 56),
        (Brand.HI_TECH, 49),
        (Brand.LOCAL_MILLS, 35),
    ]

    hollow_sizes_list = ["20x20", "25x25", "50x50", "40x20"]

    seen_codes = set()
    for brand, count in brand_counts:
        generated = 0
        attempts = 0
        while generated < count and attempts < 1000:
            attempts += 1
            # Category distribution: GI (50%), MS (40%), GP (10%)
            if brand == Brand.LOCAL_MILLS:
                category = rng.choices([Category.GI, Category.MS], weights=[55, 45])[0]
            else:
                category = rng.choices([Category.GI, Category.MS, Category.GP], weights=[50, 40, 10])[0]

            # Shape conditioning: GI skews Round, MS skews Square/Rectangle, GP includes Round/Square/Rect
            if category == Category.GI:
                shape = rng.choices([Shape.ROUND, Shape.SQUARE, Shape.RECTANGLE], weights=[80, 10, 10])[0]
            elif category == Category.MS:
                shape = rng.choices([Shape.ROUND, Shape.SQUARE, Shape.RECTANGLE], weights=[30, 45, 25])[0]
            else:  # GP
                shape = rng.choices([Shape.ROUND, Shape.SQUARE, Shape.RECTANGLE], weights=[40, 35, 25])[0]

            # Weight class distribution: Medium (~60%), Light (~20%), Heavy (~20%)
            weight_class = rng.choices([WeightClass.LIGHT, WeightClass.MEDIUM, WeightClass.HEAVY], weights=[20, 60, 20])[0]

            length = Decimal("6.00")
            
            if shape == Shape.ROUND:
                standard_ref = StandardRef.IS1239
                # Pick round size matching weight_class if available, or random size
                matching_round_keys = [k for k in ROUND_SIZES.keys() if k[1] == weight_class.value]
                if matching_round_keys:
                    (size, _w_class) = rng.choice(matching_round_keys)
                else:
                    (size, _w_class) = rng.choice(list(ROUND_SIZES.keys()))
                    weight_class = WeightClass(_w_class)

                od, wall_th = ROUND_SIZES[(size, weight_class.value)]
                width = None
                height = None
                od_dec = Decimal(str(od))
                th_dec = Decimal(str(wall_th))
            else:
                standard_ref = StandardRef.IS4923
                if shape == Shape.SQUARE:
                    size = rng.choice(["20x20", "25x25", "50x50"])
                else:
                    size = "40x20"
                
                w_mm, h_mm = parse_hollow_size(size)
                wall_th = HOLLOW_THICKNESS.get((size, weight_class.value), 2.6)
                
                od_dec = None
                width = Decimal(str(w_mm))
                height = Decimal(str(h_mm))
                th_dec = Decimal(str(wall_th))

            # Calculate weight
            wt_per_m = Decimal(str(round(calculate_weight_per_meter(shape.value, size, weight_class.value), 3)))
            total_wt = round(wt_per_m * length, 2)

            code = generate_product_code(
                brand.value, category.value, shape.value, weight_class.value, size, float(length)
            )

            if code in seen_codes:
                continue
            seen_codes.add(code)
            generated += 1

            p_model = ProductMasterModel(
                product_id=uuid.UUID(int=rng.getrandbits(128)),
                product_code=code,
                brand=brand,
                category=category,
                shape=shape,
                size=size,
                weight_class=weight_class,
                weight_per_meter=wt_per_m,
                length=length,
                gst=Decimal("18.00"),
                hsn_code="7306",
                standard_ref=standard_ref,
                active=True,
                created_at=datetime(2024, 1, 1, 0, 0, 0, tzinfo=timezone.utc),
                updated_at=datetime(2024, 1, 1, 0, 0, 0, tzinfo=timezone.utc),
            )
            products.append(p_model)

    # Validate batch
    res = product_master_validator.validate_batch(products)
    fails = [r for r in res if not r.passed]
    if fails:
        raise ValueError(f"Product Master generation failed validation: {[f.message for f in fails]}")

    return products


def generate_suppliers(rng: random.Random) -> List[SupplierMasterModel]:
    """Generates 14 deterministic Supplier Master records matching standard BRS distribution."""
    supplier_data = [
        ("SUP-MILL-001", "APL Apollo Tubes Ltd.", SupplierTier.MILL, "Mohali", IndianState.PUNJAB, "03AAACA1234A1Z5", "AAACA1234A", 45, [Brand.APL_APOLLO], [Category.GI, Category.MS, Category.GP]),
        ("SUP-MILL-002", "Hi-Tech Pipes Ltd.", SupplierTier.MILL, "Surat", IndianState.GUJARAT, "24AABCH5678B1Z3", "AABCH5678B", 40, [Brand.HI_TECH], [Category.GI, Category.MS, Category.GP]),
        ("SUP-MILL-003", "Bharat Steel Mills", SupplierTier.MILL, "Mandi Gobindgarh", IndianState.PUNJAB, "03AACBS9012C1Z8", "AACBS9012C", 30, [Brand.LOCAL_MILLS], [Category.GI, Category.MS]),
        ("SUP-DIST-001", "Prime Steel Distributors", SupplierTier.DISTRIBUTOR, "Mumbai", IndianState.MAHARASHTRA, "27AADPS3456D1Z1", "AADPS3456D", 30, [Brand.APL_APOLLO], [Category.GI, Category.MS, Category.GP]),
        ("SUP-DIST-002", "Vardhman Pipe Co.", SupplierTier.DISTRIBUTOR, "Delhi", IndianState.DELHI, "07AAFVC7890E1Z4", "AAFVC7890E", 25, [Brand.HI_TECH], [Category.GI, Category.MS]),
        ("SUP-DIST-003", "Shree Ganesh Traders", SupplierTier.DISTRIBUTOR, "Ahmedabad", IndianState.GUJARAT, "24AAESG2345F1Z6", "AAESG2345F", 28, [Brand.HI_TECH, Brand.LOCAL_MILLS], [Category.GI]),
        ("SUP-DIST-004", "Rajasthan Steel Agency", SupplierTier.DISTRIBUTOR, "Jaipur", IndianState.RAJASTHAN, "08AARRA6789G1Z2", "AARRA6789G", 22, [Brand.APL_APOLLO], [Category.GI, Category.MS]),
        ("SUP-TRDR-001", "Kumar Enterprises", SupplierTier.TRADER, "Ludhiana", IndianState.PUNJAB, "03AABKE4567H1Z9", "AABKE4567H", 20, [Brand.HI_TECH, Brand.LOCAL_MILLS], [Category.GI, Category.MS]),
        ("SUP-TRDR-002", "Balaji Trading Co.", SupplierTier.TRADER, "Chennai", IndianState.TAMIL_NADU, "33AACBT8901I1Z7", "AACBT8901I", 18, [Brand.APL_APOLLO, Brand.HI_TECH], [Category.GI]),
        ("SUP-TRDR-003", "Mehta Brothers", SupplierTier.TRADER, "Pune", IndianState.MAHARASHTRA, "27AADMB1234J1Z3", "AADMB1234J", 15, [Brand.HI_TECH, Brand.LOCAL_MILLS], [Category.GI, Category.MS]),
        ("SUP-TRDR-004", "City Steel Mart", SupplierTier.TRADER, "Nagpur", IndianState.MAHARASHTRA, "27AAFCS5678K1Z5", "AAFCS5678K", 22, [Brand.APL_APOLLO, Brand.LOCAL_MILLS], [Category.MS]),
        ("SUP-TRDR-005", "United Pipe Suppliers", SupplierTier.TRADER, "Kanpur", IndianState.UTTAR_PRADESH, "09AAGUP9012L1Z1", "AAGUP9012L", 17, [Brand.HI_TECH], [Category.GI, Category.MS, Category.GP]),
        ("SUP-DIST-005", "Steel World Pvt Ltd", SupplierTier.DISTRIBUTOR, "Bangalore", IndianState.KARNATAKA, "29AAHSW2345M1Z8", "AAHSW2345M", 26, [Brand.APL_APOLLO, Brand.HI_TECH], [Category.GI, Category.MS, Category.GP]),
        ("SUP-TRDR-006", "Arora Metals", SupplierTier.TRADER, "Chandigarh", IndianState.CHANDIGARH, "04AABAM6789N1Z4", "AABAM6789N", 20, [Brand.LOCAL_MILLS], [Category.GI]),
    ]

    suppliers: List[SupplierMasterModel] = []
    for code, name, tier, city, state, gstin, pan, credit, brands, cats in supplier_data:
        s_model = SupplierMasterModel(
            supplier_id=uuid.UUID(int=rng.getrandbits(128)),
            supplier_code=code,
            supplier_name=name,
            supplier_tier=tier,
            address_line1="Industrial Area Road 1",
            address_line2=None,
            city=city,
            state=state,
            pincode="380001" if state == IndianState.GUJARAT else "141001",
            gstin=gstin,
            pan=pan,
            contact_person="Procurement Manager",
            contact_phone="9876543210",
            contact_email=f"sales@{code.lower()}.com",
            credit_period_days=credit,
            brands_supplied=brands,
            categories_supplied=cats,
            active=True,
            onboarding_date=date(2024, 1, 1),
            created_at=datetime(2024, 1, 1, 0, 0, 0, tzinfo=timezone.utc),
            updated_at=datetime(2024, 1, 1, 0, 0, 0, tzinfo=timezone.utc),
        )
        suppliers.append(s_model)

    res = supplier_master_validator.validate_batch(suppliers)
    fails = [r for r in res if not r.passed]
    if fails:
        raise ValueError(f"Supplier Master generation failed validation: {[f.message for f in fails]}")

    return suppliers


def generate_customers(rng: random.Random) -> List[CustomerMasterModel]:
    """Generates 50 deterministic Customer Master records matching standard BRS distribution."""
    # Target breakdown: Retailer (23), Fabricator (12), Contractor (8), Distributor (7) = 50
    types_plan = [
        (CustomerType.RETAILER, 23, "RETL"),
        (CustomerType.FABRICATOR, 12, "FABR"),
        (CustomerType.CONTRACTOR, 8, "CONT"),
        (CustomerType.DISTRIBUTOR, 7, "DIST"),
    ]

    states_pool = [
        (IndianState.PUNJAB, "03"),
        (IndianState.PUNJAB, "03"),
        (IndianState.PUNJAB, "03"),  # Punjab local skew (~60%)
        (IndianState.HARYANA, "06"),
        (IndianState.DELHI, "07"),
        (IndianState.UTTAR_PRADESH, "09"),
        (IndianState.MAHARASHTRA, "27"),
        (IndianState.GUJARAT, "24"),
        (IndianState.RAJASTHAN, "08"),
    ]

    cities_map = {
        IndianState.PUNJAB: ["Ludhiana", "Amritsar", "Jalandhar", "Mohali", "Patiala"],
        IndianState.HARYANA: ["Gurgaon", "Rohtak", "Faridabad", "Panipat"],
        IndianState.DELHI: ["Delhi", "New Delhi"],
        IndianState.UTTAR_PRADESH: ["Noida", "Ghaziabad", "Kanpur", "Lucknow"],
        IndianState.MAHARASHTRA: ["Mumbai", "Pune", "Nagpur"],
        IndianState.GUJARAT: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
        IndianState.RAJASTHAN: ["Jaipur", "Jodhpur"],
    }

    customers: List[CustomerMasterModel] = []
    seq_counters = {"RETL": 1, "FABR": 1, "CONT": 1, "DIST": 1}

    for c_type, count, type_code in types_plan:
        for _ in range(count):
            seq = seq_counters[type_code]
            seq_counters[type_code] += 1
            code = f"CUST-{type_code}-{seq:03d}"

            state, st_prefix = rng.choice(states_pool)
            city = rng.choice(cities_map.get(state, ["Ludhiana"]))

            # Registration rules
            if c_type in [CustomerType.DISTRIBUTOR, CustomerType.CONTRACTOR]:
                registered = True
            elif c_type == CustomerType.RETAILER:
                registered = (rng.random() < 0.80)
            else:  # Fabricator
                registered = (rng.random() < 0.40)

            # PAN & GSTIN
            pan_letters = "".join(rng.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ", k=5))
            pan_digits = f"{rng.randint(1000, 9999)}"
            pan_last = rng.choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
            pan = f"{pan_letters}{pan_digits}{pan_last}"

            if registered:
                gstin = f"{st_prefix}{pan}1Z{rng.choice('123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ')}"
            else:
                gstin = None

            # Credit limits & period
            if c_type == CustomerType.DISTRIBUTOR:
                limit = Decimal(str(rng.randint(2500, 5000) * 1000))
                credit_days = rng.choice([30, 45])
                tier = rng.choices([PaymentBehaviorTier.PROMPT, PaymentBehaviorTier.SLOW], weights=[80, 20])[0]
            elif c_type == CustomerType.RETAILER:
                limit = Decimal(str(rng.randint(500, 1500) * 1000))
                credit_days = rng.choice([15, 30])
                tier = rng.choices([PaymentBehaviorTier.PROMPT, PaymentBehaviorTier.SLOW, PaymentBehaviorTier.IRREGULAR], weights=[60, 30, 10])[0]
            elif c_type == CustomerType.FABRICATOR:
                limit = Decimal(str(rng.randint(50, 200) * 1000))
                credit_days = rng.choice([0, 7])
                tier = rng.choices([PaymentBehaviorTier.PROMPT, PaymentBehaviorTier.SLOW, PaymentBehaviorTier.IRREGULAR], weights=[50, 30, 20])[0]
            else:  # Contractor
                limit = Decimal(str(rng.randint(1000, 3000) * 1000))
                credit_days = rng.choice([45, 60])
                tier = rng.choices([PaymentBehaviorTier.PROMPT, PaymentBehaviorTier.SLOW, PaymentBehaviorTier.IRREGULAR], weights=[40, 40, 20])[0]

            if not registered:
                limit = round(limit * Decimal("0.50"), 2)

            name = f"{city} {c_type.value} {seq}"

            c_model = CustomerMasterModel(
                customer_id=uuid.UUID(int=rng.getrandbits(128)),
                customer_code=code,
                customer_name=name,
                customer_type=c_type,
                address_line1="Main Market Road",
                address_line2=None,
                city=city,
                state=state,
                pincode="380015" if state == IndianState.GUJARAT else "141008",
                gst_registered=registered,
                gstin=gstin,
                pan=pan,
                contact_person="Purchase Manager",
                contact_phone=f"98{rng.randint(10000000, 99999999)}",
                contact_email=f"contact@{code.lower()}.com",
                credit_limit=limit,
                credit_period_days=credit_days,
                payment_behavior_tier=tier,
                active=True,
                onboarding_date=date(2024, 1, 1),
                created_at=datetime(2024, 1, 1, 0, 0, 0, tzinfo=timezone.utc),
                updated_at=datetime(2024, 1, 1, 0, 0, 0, tzinfo=timezone.utc),
            )
            customers.append(c_model)

    res = customer_master_validator.validate_batch(customers)
    fails = [r for r in res if not r.passed]
    if fails:
        raise ValueError(f"Customer Master generation failed validation: {[f.message for f in fails]}")

    return customers


def generate_company(rng: random.Random) -> List[CompanyMasterModel]:
    """Generates single Company Master record (Gujarat home state)."""
    comp = CompanyMasterModel(
        company_id=uuid.UUID(int=rng.getrandbits(128)),
        company_code="COMP-001",
        legal_name="Apex Steel Distributors Pvt. Ltd.",
        trade_name="Apex Steel",
        company_type=CompanyType.PRIVATE_LIMITED,
        address_line1="Plot No. 45, Phase III",
        address_line2="Focal Point",
        city="Ahmedabad",
        state=IndianState.GUJARAT,
        pincode="380015",
        gstin="24AAACA9876C1Z4",
        pan="AAACA9876C",
        cin="U28910GJ2015PTC038123",
        contact_person="Gurmukh Singh",
        contact_phone="9876543210",
        contact_email="finance@apexsteel.co.in",
        financial_year_start="04-01",
        current_fy="FY 2024-25",
        opening_balance_date=date(2024, 4, 1),
        bank_name="HDFC Bank",
        bank_account_number="50200012345678",
        bank_ifsc="HDFC0000057",
        created_at=datetime(2024, 1, 1, 0, 0, 0, tzinfo=timezone.utc),
        updated_at=datetime(2024, 1, 1, 0, 0, 0, tzinfo=timezone.utc),
    )

    res = company_master_validator.validate_batch([comp])
    fails = [r for r in res if not r.passed]
    if fails:
        raise ValueError(f"Company Master generation failed validation: {[f.message for f in fails]}")

    return [comp]
