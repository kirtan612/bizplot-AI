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
            # Capability rules: Local Mills cannot supply GP
            if brand == Brand.LOCAL_MILLS:
                category = rng.choice([Category.GI, Category.MS])
            else:
                category = rng.choice([Category.GI, Category.MS, Category.GP])

            # Shape rules: GP only in Square/Rectangle
            if category == Category.GP:
                shape = rng.choice([Shape.SQUARE, Shape.RECTANGLE])
            else:
                shape = rng.choice([Shape.ROUND, Shape.SQUARE, Shape.RECTANGLE])

            length = Decimal("6.00")
            weight_class = rng.choice([WeightClass.LIGHT, WeightClass.MEDIUM, WeightClass.HEAVY])
            
            if shape == Shape.ROUND:
                standard_ref = StandardRef.IS1239
                # Pick a key from ROUND_SIZES
                (size, _w_class), (od, wall_th) = rng.choice(list(ROUND_SIZES.items()))
                weight_class = WeightClass(_w_class)
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
    """Generates 15 deterministic Customer Master records matching standard BRS distribution."""
    customer_data = [
        ("CUST-DIST-001", "Punjab Steel Distributors", CustomerType.DISTRIBUTOR, "Ludhiana", IndianState.PUNJAB, True, "03AAACP1234D1Z5", "AAACP1234D", Decimal("4500000.00"), 45, PaymentBehaviorTier.PROMPT),
        ("CUST-RETL-001", "Grover Steel Traders", CustomerType.RETAILER, "Ludhiana", IndianState.PUNJAB, True, "03AABCG5678D1Z4", "AABCG5678D", Decimal("1200000.00"), 30, PaymentBehaviorTier.PROMPT),
        ("CUST-RETL-002", "Singhal Iron Store", CustomerType.RETAILER, "Mohali", IndianState.PUNJAB, True, "03AACCS9012D1Z9", "AACCS9012D", Decimal("800000.00"), 30, PaymentBehaviorTier.SLOW),
        ("CUST-RETL-003", "Janta Pipe House", CustomerType.RETAILER, "Ludhiana", IndianState.PUNJAB, False, None, "AABCP1234D", Decimal("400000.00"), 15, PaymentBehaviorTier.PROMPT),
        ("CUST-FABR-001", "Vishwakarma Welders", CustomerType.FABRICATOR, "Ludhiana", IndianState.PUNJAB, False, None, "AAKPV9876F", Decimal("50000.00"), 0, PaymentBehaviorTier.PROMPT),
        ("CUST-FABR-002", "Apex Grill Fabrication", CustomerType.FABRICATOR, "Jalandhar", IndianState.PUNJAB, True, "03AAFCA3456F1Z1", "AAFCA3456F", Decimal("150000.00"), 7, PaymentBehaviorTier.SLOW),
        ("CUST-CONT-001", "North Infra Projects", CustomerType.CONTRACTOR, "Delhi", IndianState.DELHI, True, "07AABCN7890G1Z6", "AABCN7890G", Decimal("2500000.00"), 60, PaymentBehaviorTier.SLOW),
        ("CUST-CONT-002", "Shivalik Construction", CustomerType.CONTRACTOR, "Shimla", IndianState.HIMACHAL_PRADESH, True, "02AAECS2345H1Z3", "AAECS2345H", Decimal("1500000.00"), 45, PaymentBehaviorTier.IRREGULAR),
        ("CUST-DIST-002", "Haryana Steel Agency", CustomerType.DISTRIBUTOR, "Rohtak", IndianState.HARYANA, True, "06AAFHA6789I1Z2", "AAFHA6789I", Decimal("3500000.00"), 30, PaymentBehaviorTier.PROMPT),
        ("CUST-RETL-004", "Balaji Iron Mart", CustomerType.RETAILER, "Gurgaon", IndianState.HARYANA, True, "06AABCB1234J1Z7", "AABCB1234J", Decimal("1000000.00"), 30, PaymentBehaviorTier.PROMPT),
        ("CUST-FABR-003", "Star Metal Craft", CustomerType.FABRICATOR, "Noida", IndianState.UTTAR_PRADESH, False, None, "AABCX9988G", Decimal("75000.00"), 7, PaymentBehaviorTier.IRREGULAR),
        ("CUST-RETL-005", "Gupta Hardware & Pipes", CustomerType.RETAILER, "Ghaziabad", IndianState.UTTAR_PRADESH, True, "09AAFGG5678K1Z3", "AAFGG5678K", Decimal("600000.00"), 15, PaymentBehaviorTier.SLOW),
        ("CUST-DIST-003", "Maharashtra Pipes", CustomerType.DISTRIBUTOR, "Mumbai", IndianState.MAHARASHTRA, True, "27AADMP9012L1Z5", "AADMP9012L", Decimal("5000000.00"), 45, PaymentBehaviorTier.PROMPT),
        ("CUST-CONT-003", "Western Grid Projects", CustomerType.CONTRACTOR, "Ahmedabad", IndianState.GUJARAT, True, "24AAGWP3456M1Z1", "AAGWP3456M", Decimal("2000000.00"), 60, PaymentBehaviorTier.IRREGULAR),
        ("CUST-RETL-006", "Royal Hardware Store", CustomerType.RETAILER, "Amritsar", IndianState.PUNJAB, True, "03AAHRS7890N1Z2", "AAHRS7890N", Decimal("900000.00"), 30, PaymentBehaviorTier.PROMPT),
    ]

    customers: List[CustomerMasterModel] = []
    for code, name, c_type, city, state, registered, gstin, pan, limit, credit_days, tier in customer_data:
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
            contact_phone="9812345670",
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
