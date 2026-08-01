"""
Chronological Event Simulator (Orchestrator)
Generates all 10 modules through day-by-day simulation.
Domain: GI / MS Steel Pipe Distribution
"""

import sys
import os
import argparse
import random
import yaml
import csv
import uuid
from datetime import datetime, date, timedelta, timezone
from decimal import Decimal
from typing import Dict, List, Any, Optional

from src.schemas.product_master import ProductMasterModel, Brand, Category, Shape
from src.schemas.supplier_master import SupplierMasterModel
from src.schemas.customer_master import CustomerMasterModel
from src.schemas.company_master import CompanyMasterModel
from src.schemas.steel_market_index import SteelMarketIndexModel
from src.schemas.price_history import PriceHistoryModel
from src.schemas.purchase_register import PurchaseRegisterModel, PaymentStatus
from src.schemas.inventory import InventoryModel
from src.schemas.sales_register import SalesRegisterModel
from src.schemas.cashbook import CashbookModel, TransactionType, PartyType, PaymentMode

from src.validators import (
    product_master_validator,
    supplier_master_validator,
    customer_master_validator,
    company_master_validator,
    steel_market_index_validator,
    price_history_validator,
    purchase_register_validator,
    inventory_validator,
    sales_register_validator,
    cashbook_validator,
)

from src.generators import master_generator, index_generator, reporter

COMPANY_HOME_STATE = "Gujarat"


def load_settings(config_path: str = "config/settings.yaml") -> dict:
    """Loads configuration settings from YAML file."""
    if not os.path.exists(config_path):
        config_path = "config/settings.example.yaml"
    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def get_active_index_record(
    index_series: List[SteelMarketIndexModel], target_date: date
) -> SteelMarketIndexModel:
    """Finds the most recent Steel Market Index record effective on or before target_date."""
    active = index_series[0]
    for idx in index_series:
        if idx.effective_date <= target_date:
            active = idx
        else:
            break
    return active


def export_to_csv(models: List[Any], file_path: str):
    """Exports a list of Pydantic models to a CSV file."""
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    if not models:
        return

    # Extract dict representation
    dicts = [m.model_dump(mode="json") if hasattr(m, "model_dump") else m.__dict__ for m in models]
    fieldnames = list(dicts[0].keys())

    with open(file_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(dicts)


def run_simulation(is_smoke_test: bool = True, settings_path: str = "config/settings.yaml"):
    """Main simulation entry point."""
    settings = load_settings(settings_path)
    seed = settings.get("seed", 42)
    rng = random.Random(seed)

    if is_smoke_test:
        date_cfg = settings.get("smoke_test_range", {})
        start_date = date.fromisoformat(date_cfg.get("start_date", "2024-04-01"))
        end_date = date.fromisoformat(date_cfg.get("end_date", "2024-05-15"))
        output_dir = "data/samples"
    else:
        date_cfg = settings.get("date_range", {})
        start_date = date.fromisoformat(date_cfg.get("start_date", "2024-04-01"))
        end_date = date.fromisoformat(date_cfg.get("end_date", "2026-03-31"))
        output_dir = "data/generated"

    print(f"--- Starting Chronological Event Simulation ---")
    print(f"Mode: {'Smoke Test' if is_smoke_test else 'Full Scale'}")
    print(f"Window: {start_date} to {end_date}")
    print(f"Random Seed: {seed}")
    print(f"Target Output Directory: {output_dir}\n")

    # 1. Master Data Generation
    print("Generating Master Data...")
    products = master_generator.generate_products(rng)
    suppliers = master_generator.generate_suppliers(rng)
    customers = master_generator.generate_customers(rng)
    company = master_generator.generate_company(rng)

    product_map = {str(p.product_id): p for p in products}
    supplier_map = {str(s.supplier_id): s for s in suppliers}
    customer_map = {str(c.customer_id): c for c in customers}

    # 2. Steel Market Index Generation
    print("Generating Steel Market Index time series...")
    indices = index_generator.generate_index_series(start_date, end_date, rng)

    # 3. Initialize Chronological State
    print("Initializing chronological state engine...")
    inventory_state: Dict[str, dict] = {}
    for p in products:
        # Initial opening stock (some products have stock, some start 0)
        init_qty = rng.choice([0, 100, 200, 300])
        init_wt = round(Decimal(str(init_qty)) * (p.weight_per_meter * p.length), 2)
        inventory_state[str(p.product_id)] = {
            "product_code": p.product_code,
            "closing_qty_pcs": init_qty,
            "closing_weight_kg": init_wt,
            "unit_cost_per_kg": Decimal("58.00"),
            "reorder_level_pcs": 150,
        }

    purchases: List[PurchaseRegisterModel] = []
    sales: List[SalesRegisterModel] = []
    price_history: List[PriceHistoryModel] = []
    inventory_snapshots: List[InventoryModel] = []
    cashbook_entries: List[CashbookModel] = []
    outstanding_invoices: List[dict] = []
    seen_price_history = set()

    cashbook_balance = Decimal("1000000.00")  # Starting bank balance 1,000,000 ₹

    pur_seq = 1
    sal_seq = 1
    vou_seq = 1

    current_date = start_date

    # 4. Daily Chronological Loop
    while current_date <= end_date:
        is_business_day = current_date.weekday() < 6  # Mon - Sat
        active_idx = get_active_index_record(indices, current_date)

        # Track daily opening inventory per product for continuity
        daily_opening = {pid: dict(state) for pid, state in inventory_state.items()}

        if is_business_day:
            # --- A. PURCHASE EVENTS ---
            # Check products needing replenishment or random purchase chance
            for p in products:
                pid = str(p.product_id)
                st = inventory_state[pid]

                # Trigger purchase if stock <= reorder level or random procurement
                if st["closing_qty_pcs"] <= st["reorder_level_pcs"] or rng.random() < 0.04:
                    # Find capable suppliers
                    capable_sups = [
                        s for s in suppliers
                        if p.brand in s.brands_supplied and p.category in s.categories_supplied
                    ]
                    if not capable_sups:
                        continue
                    supplier = rng.choice(capable_sups)

                    # Determine base rate
                    base_rate = (
                        active_idx.regional_rate_per_kg
                        if p.brand == Brand.LOCAL_MILLS
                        else active_idx.national_rate_per_kg
                    )
                    
                    # Brand multiplier & category adjustment
                    b_mult = Decimal("1.15") if p.brand == Brand.APL_APOLLO else (Decimal("1.08") if p.brand == Brand.HI_TECH else Decimal("1.00"))
                    c_adj = Decimal("8.00") if p.category == Category.GI else (Decimal("5.00") if p.category == Category.GP else Decimal("0.00"))
                    
                    list_price = round((base_rate * b_mult) + c_adj, 2)
                    disc_pct = Decimal(str(round(rng.uniform(3.0, 7.0), 2)))
                    unit_price = round(list_price * (Decimal("1.00") - (disc_pct / Decimal("100.00"))), 2)

                    pur_qty = rng.choice([200, 300, 500])
                    pur_wt = round(Decimal(str(pur_qty)) * (p.weight_per_meter * p.length), 2)
                    taxable = round(pur_wt * unit_price, 2)

                    is_interstate = (supplier.state != COMPANY_HOME_STATE)
                    cgst_r = Decimal("0.00") if is_interstate else Decimal("9.00")
                    sgst_r = Decimal("0.00") if is_interstate else Decimal("9.00")
                    igst_r = Decimal("18.00") if is_interstate else Decimal("0.00")

                    cgst_amt = round(taxable * (cgst_r / Decimal("100.00")), 2)
                    sgst_amt = round(taxable * (sgst_r / Decimal("100.00")), 2)
                    igst_amt = round(taxable * (igst_r / Decimal("100.00")), 2)
                    tot_gst = cgst_amt + sgst_amt + igst_amt
                    inv_amt = taxable + tot_gst

                    due_date = current_date + timedelta(days=supplier.credit_period_days)
                    inv_num = f"INV-PUR-{current_date.strftime('%Y%m')}-{pur_seq:03d}"
                    pur_seq += 1

                    pur_model = PurchaseRegisterModel(
                        purchase_id=uuid.UUID(int=rng.getrandbits(128)),
                        invoice_number=inv_num,
                        purchase_date=current_date,
                        supplier_id=supplier.supplier_id,
                        supplier_code=supplier.supplier_code,
                        product_id=p.product_id,
                        product_code=p.product_code,
                        quantity_pcs=pur_qty,
                        total_weight_kg=pur_wt,
                        unit_price_per_kg=unit_price,
                        taxable_value=taxable,
                        is_interstate=is_interstate,
                        cgst_rate=cgst_r,
                        cgst_amount=cgst_amt,
                        sgst_rate=sgst_r,
                        sgst_amount=sgst_amt,
                        igst_rate=igst_r,
                        igst_amount=igst_amt,
                        total_gst=tot_gst,
                        invoice_amount=inv_amt,
                        payment_status=PaymentStatus.UNPAID,
                        payment_due_date=due_date,
                        created_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
                        updated_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
                    )

                    # Validate purchase row immediately
                    p_res = purchase_register_validator.validate_batch([pur_model], supplier_map, product_map)
                    p_fails = [r for r in p_res if not r.passed]
                    if p_fails:
                        raise ValueError(f"Purchase validation failed on {current_date}: {[f.message for f in p_fails]}")

                    purchases.append(pur_model)

                    # Price History record for Purchase
                    ph_key = (current_date, str(p.product_id))
                    if ph_key not in seen_price_history:
                        seen_price_history.add(ph_key)
                        default_margin = Decimal("10.00")
                        eff_sal = round(list_price * (Decimal("1.00") + (default_margin / Decimal("100.00"))), 2)
                        ph_pur = PriceHistoryModel(
                            price_id=uuid.UUID(int=rng.getrandbits(128)),
                            effective_date=current_date,
                            product_id=p.product_id,
                            product_code=p.product_code,
                            index_id=active_idx.index_id,
                            base_index_rate=base_rate,
                            brand_multiplier=b_mult,
                            category_adjustment=c_adj,
                            calculated_list_price_per_kg=list_price,
                            purchase_discount_pct=disc_pct,
                            effective_purchase_price_per_kg=unit_price,
                            sales_margin_pct=default_margin,
                            effective_sales_price_per_kg=eff_sal,
                            created_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
                            updated_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
                        )
                        price_history.append(ph_pur)

                    # Update Inventory running state
                    old_wt = st["closing_weight_kg"]
                    old_cost = st["unit_cost_per_kg"]
                    new_wt = old_wt + pur_wt
                    new_cost = round(((old_wt * old_cost) + (pur_wt * unit_price)) / new_wt, 2) if new_wt > Decimal("0.00") else unit_price

                    st["closing_qty_pcs"] += pur_qty
                    st["closing_weight_kg"] = new_wt
                    st["unit_cost_per_kg"] = new_cost

                    # Register for Cashbook payment
                    outstanding_invoices.append({
                        "type": "PURCHASE",
                        "inv_num": inv_num,
                        "party_id": supplier.supplier_id,
                        "party_name": supplier.supplier_name,
                        "party_type": PartyType.SUPPLIER,
                        "amount": inv_amt,
                        "due_date": due_date,
                        "status": "UNPAID",
                    })

            # --- B. SALES EVENTS ---
            # Random sale event chance on business days
            if rng.random() < 0.65:
                # Pick product with AVAILABLE RUNNING STOCK
                available_products = [
                    p for p in products
                    if inventory_state[str(p.product_id)]["closing_qty_pcs"] > 0
                ]
                if available_products:
                    p = rng.choice(available_products)
                    pid = str(p.product_id)
                    st = inventory_state[pid]

                    customer = rng.choice(customers)

                    # Quantity limited to AVAILABLE STOCK
                    req_qty = rng.choice([50, 100, 150, 200])
                    sal_qty = min(req_qty, st["closing_qty_pcs"])

                    sal_wt = round(Decimal(str(sal_qty)) * (p.weight_per_meter * p.length), 2)

                    # Price calculation
                    base_rate = (
                        active_idx.regional_rate_per_kg
                        if p.brand == Brand.LOCAL_MILLS
                        else active_idx.national_rate_per_kg
                    )
                    b_mult = Decimal("1.15") if p.brand == Brand.APL_APOLLO else (Decimal("1.08") if p.brand == Brand.HI_TECH else Decimal("1.00"))
                    c_adj = Decimal("8.00") if p.category == Category.GI else (Decimal("5.00") if p.category == Category.GP else Decimal("0.00"))
                    list_price = round((base_rate * b_mult) + c_adj, 2)

                    sales_margin = Decimal(str(round(rng.uniform(8.0, 15.0), 2)))
                    unit_price = round(list_price * (Decimal("1.00") + (sales_margin / Decimal("100.00"))), 2)
                    taxable = round(sal_wt * unit_price, 2)

                    # Check credit limit rule V14
                    if taxable <= customer.credit_limit:
                        is_interstate = (customer.state != COMPANY_HOME_STATE)
                        cgst_r = Decimal("0.00") if is_interstate else Decimal("9.00")
                        sgst_r = Decimal("0.00") if is_interstate else Decimal("9.00")
                        igst_r = Decimal("18.00") if is_interstate else Decimal("0.00")

                        cgst_amt = round(taxable * (cgst_r / Decimal("100.00")), 2)
                        sgst_amt = round(taxable * (sgst_r / Decimal("100.00")), 2)
                        igst_amt = round(taxable * (igst_r / Decimal("100.00")), 2)
                        tot_gst = cgst_amt + sgst_amt + igst_amt
                        inv_amt = taxable + tot_gst

                        due_date = current_date + timedelta(days=customer.credit_period_days)
                        inv_num = f"INV-SAL-{current_date.strftime('%Y%m')}-{sal_seq:03d}"
                        sal_seq += 1

                        sal_model = SalesRegisterModel(
                            sales_id=uuid.UUID(int=rng.getrandbits(128)),
                            invoice_number=inv_num,
                            sales_date=current_date,
                            customer_id=customer.customer_id,
                            customer_code=customer.customer_code,
                            product_id=p.product_id,
                            product_code=p.product_code,
                            quantity_pcs=sal_qty,
                            total_weight_kg=sal_wt,
                            unit_price_per_kg=unit_price,
                            taxable_value=taxable,
                            is_interstate=is_interstate,
                            cgst_rate=cgst_r,
                            cgst_amount=cgst_amt,
                            sgst_rate=sgst_r,
                            sgst_amount=sgst_amt,
                            igst_rate=igst_r,
                            igst_amount=igst_amt,
                            total_gst=tot_gst,
                            invoice_amount=inv_amt,
                            payment_status=PaymentStatus.UNPAID,
                            payment_due_date=due_date,
                            created_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
                            updated_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
                        )

                        # Validate sale row immediately
                        s_res = sales_register_validator.validate_batch([sal_model], customer_map, product_map)
                        s_fails = [r for r in s_res if not r.passed]
                        if s_fails:
                            raise ValueError(f"Sales validation failed on {current_date}: {[f.message for f in s_fails]}")

                        sales.append(sal_model)

                        # Price History record for Sale
                        ph_key = (current_date, str(p.product_id))
                        if ph_key not in seen_price_history:
                            seen_price_history.add(ph_key)
                            default_disc = Decimal("5.00")
                            eff_pur = round(list_price * (Decimal("1.00") - (default_disc / Decimal("100.00"))), 2)
                            ph_sal = PriceHistoryModel(
                                price_id=uuid.UUID(int=rng.getrandbits(128)),
                                effective_date=current_date,
                                product_id=p.product_id,
                                product_code=p.product_code,
                                index_id=active_idx.index_id,
                                base_index_rate=base_rate,
                                brand_multiplier=b_mult,
                                category_adjustment=c_adj,
                                calculated_list_price_per_kg=list_price,
                                purchase_discount_pct=default_disc,
                                effective_purchase_price_per_kg=eff_pur,
                                sales_margin_pct=sales_margin,
                                effective_sales_price_per_kg=unit_price,
                                created_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
                                updated_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
                            )
                            price_history.append(ph_sal)

                        # Update Inventory running state (decrease stock)
                        st["closing_qty_pcs"] -= sal_qty
                        st["closing_weight_kg"] = round(st["closing_weight_kg"] - sal_wt, 2)

                        # Register for Cashbook receipt
                        outstanding_invoices.append({
                            "type": "SALE",
                            "inv_num": inv_num,
                            "party_id": customer.customer_id,
                            "party_name": customer.customer_name,
                            "party_type": PartyType.CUSTOMER,
                            "amount": inv_amt,
                            "due_date": due_date,
                            "status": "UNPAID",
                        })

        # --- C. DAILY INVENTORY SNAPSHOT ---
        # Generate daily inventory snapshot for every product
        for p in products:
            pid = str(p.product_id)
            d_open = daily_opening[pid]
            d_close = inventory_state[pid]

            pur_pcs = d_close["closing_qty_pcs"] - d_open["closing_qty_pcs"] + (0 if d_close["closing_qty_pcs"] >= d_open["closing_qty_pcs"] else 0)
            # Calculate daily flow accurately
            # Get daily purchases & sales for this product on current_date
            day_purs = [x for x in purchases if x.product_id == p.product_id and x.purchase_date == current_date]
            day_sals = [x for x in sales if x.product_id == p.product_id and x.sales_date == current_date]

            day_pur_pcs = sum(x.quantity_pcs for x in day_purs)
            day_pur_wt = sum(x.total_weight_kg for x in day_purs)

            day_sal_pcs = sum(x.quantity_pcs for x in day_sals)
            day_sal_wt = sum(x.total_weight_kg for x in day_sals)

            close_pcs = d_open["closing_qty_pcs"] + day_pur_pcs - day_sal_pcs
            close_wt = round(d_open["closing_weight_kg"] + day_pur_wt - day_sal_wt, 2)
            unit_cost = d_close["unit_cost_per_kg"]
            val = round(close_wt * unit_cost, 2)
            reorder_flag = (close_pcs <= d_close["reorder_level_pcs"])

            inv_snap = InventoryModel(
                inventory_id=uuid.UUID(int=rng.getrandbits(128)),
                snapshot_date=current_date,
                product_id=p.product_id,
                product_code=p.product_code,
                opening_qty_pcs=d_open["closing_qty_pcs"],
                opening_weight_kg=d_open["closing_weight_kg"],
                purchased_qty_pcs=day_pur_pcs,
                purchased_weight_kg=day_pur_wt,
                sold_qty_pcs=day_sal_pcs,
                sold_weight_kg=day_sal_wt,
                closing_qty_pcs=close_pcs,
                closing_weight_kg=close_wt,
                unit_cost_per_kg=unit_cost,
                inventory_valuation=val,
                reorder_level_pcs=d_close["reorder_level_pcs"],
                reorder_flag=reorder_flag,
                created_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
                updated_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
            )
            inventory_snapshots.append(inv_snap)

        # --- D. CASHBOOK SETTLEMENTS ---
        # 1. Process due Customer Receipts first (increasing cash balance)
        due_sales = [inv for inv in outstanding_invoices if inv["type"] == "SALE" and inv["due_date"] <= current_date and inv["status"] == "UNPAID"]
        for inv in due_sales:
            vou_num = f"VOU-{current_date.strftime('%Y%m')}-{vou_seq:03d}"
            vou_seq += 1
            open_bal = cashbook_balance
            close_bal = round(open_bal + inv["amount"], 2)
            cashbook_balance = close_bal

            cb_model = CashbookModel(
                entry_id=uuid.UUID(int=rng.getrandbits(128)),
                entry_date=current_date,
                voucher_number=vou_num,
                transaction_type=TransactionType.RECEIPT,
                party_type=PartyType.CUSTOMER,
                party_id=inv["party_id"],
                party_name=inv["party_name"],
                payment_mode=rng.choice([PaymentMode.BANK_TRANSFER, PaymentMode.CHEQUE, PaymentMode.UPI]),
                amount=inv["amount"],
                reference_invoice_number=inv["inv_num"],
                opening_balance=open_bal,
                closing_balance=close_bal,
                narration=f"Receipt against sales invoice {inv['inv_num']}",
                created_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
                updated_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
            )
            cashbook_entries.append(cb_model)
            inv["status"] = "PAID"

        # 2. Process due Supplier Payments second (decreasing cash balance)
        due_purchases = [inv for inv in outstanding_invoices if inv["type"] == "PURCHASE" and inv["due_date"] <= current_date and inv["status"] == "UNPAID"]
        for inv in due_purchases:
            # Inject capital infusion if cash balance is insufficient to prevent overdraft
            if cashbook_balance < inv["amount"]:
                cap_num = f"VOU-{current_date.strftime('%Y%m')}-{vou_seq:03d}"
                vou_seq += 1
                needed = inv["amount"] - cashbook_balance
                cap_amt = max(Decimal("1000000.00"), round(needed + Decimal("500000.00"), 2))
                cap_open = cashbook_balance
                cap_close = round(cap_open + cap_amt, 2)
                cashbook_balance = cap_close

                cb_cap = CashbookModel(
                    entry_id=uuid.UUID(int=rng.getrandbits(128)),
                    entry_date=current_date,
                    voucher_number=cap_num,
                    transaction_type=TransactionType.RECEIPT,
                    party_type=PartyType.CAPITAL,
                    party_id=None,
                    party_name="Director Capital Infusion",
                    payment_mode=PaymentMode.BANK_TRANSFER,
                    amount=cap_amt,
                    reference_invoice_number=None,
                    opening_balance=cap_open,
                    closing_balance=cap_close,
                    narration="Capital infusion for liquidity management",
                    created_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
                    updated_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
                )
                cashbook_entries.append(cb_cap)

            vou_num = f"VOU-{current_date.strftime('%Y%m')}-{vou_seq:03d}"
            vou_seq += 1
            open_bal = cashbook_balance
            close_bal = round(open_bal - inv["amount"], 2)
            cashbook_balance = close_bal

            cb_model = CashbookModel(
                entry_id=uuid.UUID(int=rng.getrandbits(128)),
                entry_date=current_date,
                voucher_number=vou_num,
                transaction_type=TransactionType.PAYMENT,
                party_type=PartyType.SUPPLIER,
                party_id=inv["party_id"],
                party_name=inv["party_name"],
                payment_mode=rng.choice([PaymentMode.BANK_TRANSFER, PaymentMode.CHEQUE, PaymentMode.UPI]),
                amount=inv["amount"],
                reference_invoice_number=inv["inv_num"],
                opening_balance=open_bal,
                closing_balance=close_bal,
                narration=f"Payment against purchase invoice {inv['inv_num']}",
                created_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
                updated_at=datetime.combine(current_date, datetime.min.time(), tzinfo=timezone.utc),
            )
            cashbook_entries.append(cb_model)
            inv["status"] = "PAID"

        # Step date
        current_date += timedelta(days=1)

    print("Chronological Event Simulation completed successfully!")

    # 5. Export Datasets
    print(f"Exporting datasets to '{output_dir}'...")
    export_to_csv(products, f"{output_dir}/01_Product_Master.csv")
    export_to_csv(suppliers, f"{output_dir}/02_Supplier_Master.csv")
    export_to_csv(customers, f"{output_dir}/03_Customer_Master.csv")
    export_to_csv(company, f"{output_dir}/04_Company_Master.csv")
    export_to_csv(indices, f"{output_dir}/05_Steel_Market_Index.csv")
    export_to_csv(price_history, f"{output_dir}/06_Price_History.csv")
    export_to_csv(purchases, f"{output_dir}/07_Purchase_Register.csv")
    export_to_csv(inventory_snapshots, f"{output_dir}/08_Inventory.csv")
    export_to_csv(sales, f"{output_dir}/09_Sales_Register.csv")
    export_to_csv(cashbook_entries, f"{output_dir}/10_Cashbook.csv")

    # 6. Generate Validation Report & Run Summary
    print("Generating validation report and run summary...")
    reporter.generate_reports(
        output_dir=output_dir,
        seed=seed,
        start_date=start_date,
        end_date=end_date,
        datasets={
            "Product Master": products,
            "Supplier Master": suppliers,
            "Customer Master": customers,
            "Company Master": company,
            "Steel Market Index": indices,
            "Price History": price_history,
            "Purchase Register": purchases,
            "Inventory": inventory_snapshots,
            "Sales Register": sales,
            "Cashbook": cashbook_entries,
        },
        product_map=product_map,
        supplier_map=supplier_map,
        customer_map=customer_map,
    )
    print(f"--- Simulation Run Completed cleanly for '{output_dir}' ---\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Chronological Event Simulator")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--smoke-test", action="store_true", help="Run 6-week smoke test simulation (output to data/samples/)")
    group.add_argument("--full", action="store_true", help="Run full-scale 2-year simulation (output to data/generated/)")
    args = parser.parse_args()

    run_simulation(is_smoke_test=args.smoke_test)
