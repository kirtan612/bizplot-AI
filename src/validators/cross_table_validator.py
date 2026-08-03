"""
Cross-Table Validator
Reads complete generated datasets across all 10 tables and validates relationships
spanning module boundaries (Step 7).
Domain: GI / MS Steel Pipe Distribution
"""

import os
import csv
from datetime import datetime, date, timedelta
from decimal import Decimal
from typing import List, Dict, Any, Tuple, Optional, Set
from collections import defaultdict

from src.validators.base import ValidationResult


def get_val(obj: Any, key: str) -> Any:
    """Helper to extract attribute from Pydantic model or dict."""
    if isinstance(obj, dict):
        return obj.get(key)
    return getattr(obj, key, None)


def parse_date(val: Any) -> date:
    """Parse date from date instance or string."""
    if isinstance(val, date) and not isinstance(val, datetime):
        return val
    if isinstance(val, datetime):
        return val.date()
    s = str(val).split("T")[0].split(" ")[0].strip()
    return datetime.strptime(s, "%Y-%m-%d").date()


def validate_x1_sales_within_stock(sales_rows: List[Any], inventory_rows: List[Any]) -> List[ValidationResult]:
    """
    X1: No sale exceeds available stock at the time it happened.
    For every Sales Register row, reconstruct the Inventory balance for that product_id
    as of that sales_date (using event-driven Inventory rows - forward-fill from prior snapshot)
    and confirm quantity_pcs sold does not exceed what was on hand.
    """
    results: List[ValidationResult] = []

    # Group inventory rows by product_id and sort by snapshot_date
    inv_by_product: Dict[str, List[Tuple[date, Any]]] = defaultdict(list)
    for inv in inventory_rows:
        pid = str(get_val(inv, "product_id"))
        s_date = parse_date(get_val(inv, "snapshot_date") or get_val(inv, "inventory_date"))
        inv_by_product[pid].append((s_date, inv))

    for pid in inv_by_product:
        inv_by_product[pid].sort(key=lambda x: x[0])

    # Group sales rows by product_id and sales_date
    sales_by_prod_date: Dict[Tuple[str, date], List[Any]] = defaultdict(list)
    for s in sales_rows:
        pid = str(get_val(s, "product_id"))
        s_date = parse_date(get_val(s, "sales_date"))
        sales_by_prod_date[(pid, s_date)].append(s)

    # For each product and sales_date, track stock and validate
    for (pid, s_date), s_list in sales_by_prod_date.items():
        snapshots = inv_by_product.get(pid, [])

        # Find snapshot on s_date or most recent prior snapshot
        same_day_snap = None
        prior_snap = None
        for d, snap in snapshots:
            if d == s_date:
                same_day_snap = snap
                break
            elif d < s_date:
                prior_snap = snap

        if same_day_snap is not None:
            # Stock available on s_date before sales = opening_qty_pcs + purchased_qty_pcs
            open_pcs = int(get_val(same_day_snap, "opening_qty_pcs"))
            pur_pcs = int(get_val(same_day_snap, "purchased_qty_pcs"))
            stock_on_hand = open_pcs + pur_pcs
        elif prior_snap is not None:
            # Forward-fill closing_qty_pcs from prior snapshot
            stock_on_hand = int(get_val(prior_snap, "closing_qty_pcs"))
        else:
            stock_on_hand = 0

        current_stock = stock_on_hand
        for sale in s_list:
            inv_num = get_val(sale, "invoice_number")
            qty_sold = int(get_val(sale, "quantity_pcs"))
            passed = (qty_sold <= current_stock)

            if passed:
                current_stock -= qty_sold
                msg = f"Sale {inv_num} quantity ({qty_sold} pcs) is within available stock ({stock_on_hand} pcs on {s_date})."
            else:
                msg = (
                    f"Sale {inv_num} quantity ({qty_sold} pcs) exceeds available stock "
                    f"({current_stock} pcs remaining of {stock_on_hand} pcs on {s_date}) for product {pid}."
                )

            results.append(ValidationResult(
                rule_id="X1",
                passed=passed,
                message=msg,
                row_reference={"invoice_number": inv_num, "product_id": pid, "sales_date": str(s_date), "quantity_pcs": qty_sold}
            ))

    return results


def validate_x2_sales_not_before_purchases(sales_rows: List[Any], purchase_rows: List[Any]) -> List[ValidationResult]:
    """
    X2: No sale predates the purchase(s) that stocked it.
    For every product_id, the first Sales Register row's date must not be earlier
    than the first Purchase Register row's date for that same product.
    """
    results: List[ValidationResult] = []

    min_sales_date: Dict[str, date] = {}
    for s in sales_rows:
        pid = str(get_val(s, "product_id"))
        s_date = parse_date(get_val(s, "sales_date"))
        if pid not in min_sales_date or s_date < min_sales_date[pid]:
            min_sales_date[pid] = s_date

    min_pur_date: Dict[str, date] = {}
    for p in purchase_rows:
        pid = str(get_val(p, "product_id"))
        p_date = parse_date(get_val(p, "purchase_date"))
        if pid not in min_pur_date or p_date < min_pur_date[pid]:
            min_pur_date[pid] = p_date

    for pid, s_date in min_sales_date.items():
        p_date = min_pur_date.get(pid)
        if p_date is None:
            passed = False
            msg = f"Product {pid} was sold on {s_date} but has no purchases in Purchase Register."
        elif s_date < p_date:
            passed = False
            msg = f"First sale date ({s_date}) predates first purchase date ({p_date}) for product {pid}."
        else:
            passed = True
            msg = f"First sale date ({s_date}) is on or after first purchase date ({p_date}) for product {pid}."

        results.append(ValidationResult(
            rule_id="X2",
            passed=passed,
            message=msg,
            row_reference={"product_id": pid, "first_sales_date": str(s_date), "first_purchase_date": str(p_date) if p_date else None}
        ))

    return results


def validate_x3_prices_trace_to_history(sales_rows: List[Any], purchase_rows: List[Any], price_history_rows: List[Any]) -> List[ValidationResult]:
    """
    X3: Every transaction rate traces to Price History for that exact (product_id, date).
    Re-run across FULL dataset. Target: 0 mismatches.
    """
    results: List[ValidationResult] = []

    # Map (product_id, effective_date) -> (effective_purchase_price, effective_sales_price)
    ph_map: Dict[Tuple[str, date], Tuple[Decimal, Decimal]] = {}
    for ph in price_history_rows:
        pid = str(get_val(ph, "product_id"))
        eff_date = parse_date(get_val(ph, "effective_date"))
        pur_price = Decimal(str(get_val(ph, "effective_purchase_price_per_kg")))
        sal_price = Decimal(str(get_val(ph, "effective_sales_price_per_kg")))
        ph_map[(pid, eff_date)] = (pur_price, sal_price)

    # Check Purchase Register rows
    for p in purchase_rows:
        inv_num = get_val(p, "invoice_number")
        pid = str(get_val(p, "product_id"))
        p_date = parse_date(get_val(p, "purchase_date"))
        unit_price = Decimal(str(get_val(p, "unit_price_per_kg")))

        key = (pid, p_date)
        if key not in ph_map:
            results.append(ValidationResult(
                rule_id="X3",
                passed=False,
                message=f"Purchase invoice {inv_num} rate on {p_date} has no Price History record for product {pid}.",
                row_reference={"invoice_number": inv_num, "product_id": pid, "date": str(p_date)}
            ))
        else:
            expected_pur_price = ph_map[key][0]
            passed = (unit_price == expected_pur_price)
            results.append(ValidationResult(
                rule_id="X3",
                passed=passed,
                message=f"Purchase invoice {inv_num} unit price ({unit_price}) matches Price History ({expected_pur_price})." if passed
                else f"Purchase invoice {inv_num} unit price ({unit_price}) mismatch vs Price History ({expected_pur_price}).",
                row_reference={"invoice_number": inv_num, "product_id": pid, "date": str(p_date), "purchase_price": str(unit_price), "expected": str(expected_pur_price)}
            ))

    # Check Sales Register rows
    for s in sales_rows:
        inv_num = get_val(s, "invoice_number")
        pid = str(get_val(s, "product_id"))
        s_date = parse_date(get_val(s, "sales_date"))
        unit_price = Decimal(str(get_val(s, "unit_price_per_kg")))

        key = (pid, s_date)
        if key not in ph_map:
            results.append(ValidationResult(
                rule_id="X3",
                passed=False,
                message=f"Sales invoice {inv_num} rate on {s_date} has no Price History record for product {pid}.",
                row_reference={"invoice_number": inv_num, "product_id": pid, "date": str(s_date)}
            ))
        else:
            expected_sal_price = ph_map[key][1]
            passed = (unit_price == expected_sal_price)
            results.append(ValidationResult(
                rule_id="X3",
                passed=passed,
                message=f"Sales invoice {inv_num} unit price ({unit_price}) matches Price History ({expected_sal_price})." if passed
                else f"Sales invoice {inv_num} unit price ({unit_price}) mismatch vs Price History ({expected_sal_price}).",
                row_reference={"invoice_number": inv_num, "product_id": pid, "date": str(s_date), "sales_price": str(unit_price), "expected": str(expected_sal_price)}
            ))

    return results


def validate_x4_payment_status_sync(sales_rows: List[Any], purchase_rows: List[Any], cashbook_rows: List[Any]) -> List[ValidationResult]:
    """
    X4: payment_status stays in sync with Cashbook across the full run.
    Every 'Paid' row in Purchase/Sales Register has a matching Cashbook entry;
    every Cashbook entry referencing an invoice has that invoice marked 'Paid'.
    """
    results: List[ValidationResult] = []

    # Sets of invoice numbers referenced in Cashbook
    cb_purchase_invoices: Set[str] = set()
    cb_sales_invoices: Set[str] = set()

    for c in cashbook_rows:
        ref_num = get_val(c, "reference_invoice_number") or get_val(c, "reference_number")
        if not ref_num:
            continue
        ref_num = str(ref_num).strip()
        t_type = str(get_val(c, "transaction_type")).strip().upper()
        p_type = str(get_val(c, "party_type")).strip().upper()

        if ref_num.startswith("INV-PUR-") or t_type == "PAYMENT" or p_type == "SUPPLIER":
            cb_purchase_invoices.add(ref_num)
        elif ref_num.startswith("INV-SAL-") or t_type == "RECEIPT" or p_type == "CUSTOMER":
            cb_sales_invoices.add(ref_num)

    pur_by_num: Dict[str, Any] = {}
    for p in purchase_rows:
        inv_num = str(get_val(p, "invoice_number")).strip()
        status = str(get_val(p, "payment_status")).strip().upper()
        pur_by_num[inv_num] = p
        in_cb = inv_num in cb_purchase_invoices

        if status == "PAID" and not in_cb:
            passed = False
            msg = f"Purchase invoice {inv_num} is marked Paid but has no Cashbook payment record."
        elif status == "UNPAID" and in_cb:
            passed = False
            msg = f"Purchase invoice {inv_num} is marked Unpaid but has a Cashbook payment record."
        else:
            passed = True
            msg = f"Purchase invoice {inv_num} payment status ({status}) is synchronized with Cashbook."

        results.append(ValidationResult(
            rule_id="X4",
            passed=passed,
            message=msg,
            row_reference={"invoice_number": inv_num, "status": status, "in_cashbook": in_cb}
        ))

    sal_by_num: Dict[str, Any] = {}
    for s in sales_rows:
        inv_num = str(get_val(s, "invoice_number")).strip()
        status = str(get_val(s, "payment_status")).strip().upper()
        sal_by_num[inv_num] = s
        in_cb = inv_num in cb_sales_invoices

        if status == "PAID" and not in_cb:
            passed = False
            msg = f"Sales invoice {inv_num} is marked Paid but has no Cashbook receipt record."
        elif status == "UNPAID" and in_cb:
            passed = False
            msg = f"Sales invoice {inv_num} is marked Unpaid but has a Cashbook receipt record."
        else:
            passed = True
            msg = f"Sales invoice {inv_num} payment status ({status}) is synchronized with Cashbook."

        results.append(ValidationResult(
            rule_id="X4",
            passed=passed,
            message=msg,
            row_reference={"invoice_number": inv_num, "status": status, "in_cashbook": in_cb}
        ))

    # Verify Cashbook references originate from valid paid invoices
    for c in cashbook_rows:
        ref_num = get_val(c, "reference_invoice_number") or get_val(c, "reference_number")
        if not ref_num:
            continue
        ref_num = str(ref_num).strip()
        e_id = str(get_val(c, "entry_id"))

        if ref_num.startswith("INV-PUR-"):
            if ref_num not in pur_by_num:
                results.append(ValidationResult(
                    rule_id="X4",
                    passed=False,
                    message=f"Cashbook entry {e_id} references purchase invoice {ref_num} which does not exist.",
                    row_reference={"entry_id": e_id, "reference_invoice_number": ref_num}
                ))
            else:
                p_status = str(get_val(pur_by_num[ref_num], "payment_status")).strip().upper()
                passed = (p_status == "PAID")
                results.append(ValidationResult(
                    rule_id="X4",
                    passed=passed,
                    message=f"Cashbook entry {e_id} references purchase invoice {ref_num} marked {p_status}.",
                    row_reference={"entry_id": e_id, "reference_invoice_number": ref_num, "status": p_status}
                ))
        elif ref_num.startswith("INV-SAL-"):
            if ref_num not in sal_by_num:
                results.append(ValidationResult(
                    rule_id="X4",
                    passed=False,
                    message=f"Cashbook entry {e_id} references sales invoice {ref_num} which does not exist.",
                    row_reference={"entry_id": e_id, "reference_invoice_number": ref_num}
                ))
            else:
                s_status = str(get_val(sal_by_num[ref_num], "payment_status")).strip().upper()
                passed = (s_status == "PAID")
                results.append(ValidationResult(
                    rule_id="X4",
                    passed=passed,
                    message=f"Cashbook entry {e_id} references sales invoice {ref_num} marked {s_status}.",
                    row_reference={"entry_id": e_id, "reference_invoice_number": ref_num, "status": s_status}
                ))

    return results


def validate_x5_inventory_running_balance(inventory_rows: List[Any]) -> List[ValidationResult]:
    """
    X5: Inventory's own running balance is internally consistent.
    For every product_id, walk its Inventory rows in date order and confirm
    closing_qty_pcs(row N) == opening_qty_pcs(row N+1) for the next row that exists.
    """
    results: List[ValidationResult] = []

    inv_by_product: Dict[str, List[Any]] = defaultdict(list)
    for inv in inventory_rows:
        pid = str(get_val(inv, "product_id"))
        inv_by_product[pid].append(inv)

    for pid, rows in inv_by_product.items():
        sorted_rows = sorted(
            rows,
            key=lambda r: parse_date(get_val(r, "snapshot_date") or get_val(r, "inventory_date"))
        )

        for i in range(len(sorted_rows) - 1):
            curr_r = sorted_rows[i]
            next_r = sorted_rows[i + 1]

            curr_d = parse_date(get_val(curr_r, "snapshot_date") or get_val(curr_r, "inventory_date"))
            next_d = parse_date(get_val(next_r, "snapshot_date") or get_val(next_r, "inventory_date"))

            curr_close_pcs = int(get_val(curr_r, "closing_qty_pcs"))
            next_open_pcs = int(get_val(next_r, "opening_qty_pcs"))

            curr_close_wt = Decimal(str(get_val(curr_r, "closing_weight_kg")))
            next_open_wt = Decimal(str(get_val(next_r, "opening_weight_kg")))

            pcs_match = (curr_close_pcs == next_open_pcs)
            wt_match = (abs(curr_close_wt - next_open_wt) <= Decimal("0.01"))
            passed = pcs_match and wt_match

            if passed:
                msg = f"Product {pid} stock carryforward clean from {curr_d} ({curr_close_pcs} pcs) to {next_d} ({next_open_pcs} pcs)."
            else:
                msg = (
                    f"Product {pid} stock carryforward mismatch from {curr_d} to {next_d}: "
                    f"closing_qty_pcs={curr_close_pcs} vs next opening_qty_pcs={next_open_pcs}, "
                    f"closing_wt={curr_close_wt} vs next opening_wt={next_open_wt}."
                )

            results.append(ValidationResult(
                rule_id="X5",
                passed=passed,
                message=msg,
                row_reference={"product_id": pid, "curr_date": str(curr_d), "next_date": str(next_d)}
            ))

    return results


def validate_x6_reorder_flag_logic(inventory_rows: List[Any]) -> List[ValidationResult]:
    """
    X6: reorder_flag reflects CLOSING stock, not opening stock.
    Confirm reorder_flag is computed from closing_qty_pcs (post-purchase, post-sale).
    """
    results: List[ValidationResult] = []

    for inv in inventory_rows:
        inv_id = str(get_val(inv, "inventory_id"))
        pid = str(get_val(inv, "product_id"))
        s_date = parse_date(get_val(inv, "snapshot_date") or get_val(inv, "inventory_date"))
        close_pcs = int(get_val(inv, "closing_qty_pcs"))
        reorder_lvl = int(get_val(inv, "reorder_level_pcs"))

        expected_flag = (close_pcs <= reorder_lvl)
        raw_flag = get_val(inv, "reorder_flag")
        actual_flag = True if str(raw_flag).lower() in ("true", "1") else False

        passed = (actual_flag == expected_flag)
        if passed:
            msg = f"Inventory row {inv_id} on {s_date}: reorder_flag ({actual_flag}) correctly matches closing stock <= reorder level ({close_pcs} <= {reorder_lvl})."
        else:
            msg = f"Inventory row {inv_id} on {s_date}: reorder_flag is {actual_flag}, but closing stock ({close_pcs}) vs reorder level ({reorder_lvl}) expects {expected_flag}."

        results.append(ValidationResult(
            rule_id="X6",
            passed=passed,
            message=msg,
            row_reference={"inventory_id": inv_id, "product_id": pid, "snapshot_date": str(s_date), "closing_qty_pcs": close_pcs, "reorder_level_pcs": reorder_lvl, "reorder_flag": actual_flag}
        ))

    return results


def validate_x7_reorder_level_flatness(inventory_rows: List[Any]) -> List[ValidationResult]:
    """
    X7: reorder_level_pcs is currently flat (150) across all 140 products regardless of product size/velocity.
    Flag this in the report as a data-quality note / open item for user decision.
    """
    reorder_levels_by_prod: Dict[str, Set[int]] = defaultdict(set)
    all_levels: Set[int] = set()

    for inv in inventory_rows:
        pid = str(get_val(inv, "product_id"))
        lvl = int(get_val(inv, "reorder_level_pcs"))
        reorder_levels_by_prod[pid].add(lvl)
        all_levels.add(lvl)

    is_flat = (len(all_levels) == 1)
    flat_val = list(all_levels)[0] if is_flat else None

    msg = (
        f"ADVISORY NOTE: reorder_level_pcs is flat ({flat_val}) across all {len(reorder_levels_by_prod)} products. "
        "Recommend scaling reorder levels by SKU sales velocity or size tier (e.g., 15NB vs 150NB) per open item in 08_Inventory.md."
        if is_flat else
        f"reorder_level_pcs varies across products (found levels: {sorted(list(all_levels))})."
    )

    return [ValidationResult(
        rule_id="X7",
        passed=True,  # Non-blocker advisory flag
        message=msg,
        row_reference={"unique_products": len(reorder_levels_by_prod), "reorder_levels_found": sorted(list(all_levels))}
    )]


def validate_x8_steel_index_continuity(steel_index_rows: List[Any]) -> List[ValidationResult]:
    """
    X8: Steel Market Index continuity.
    No gap in the weekly index series across full 2-year window; no duplicated (effective_date, region_label) pairs.
    """
    results: List[ValidationResult] = []

    by_region: Dict[str, List[Tuple[date, Any]]] = defaultdict(list)
    seen_pairs: Set[Tuple[str, date]] = set()

    for idx in steel_index_rows:
        idx_id = str(get_val(idx, "index_id"))
        region = str(get_val(idx, "region_label"))
        eff_date = parse_date(get_val(idx, "effective_date"))

        pair = (region, eff_date)
        if pair in seen_pairs:
            results.append(ValidationResult(
                rule_id="X8",
                passed=False,
                message=f"Duplicate Steel Market Index entry for region '{region}' on date {eff_date}.",
                row_reference={"index_id": idx_id, "region_label": region, "effective_date": str(eff_date)}
            ))
        else:
            seen_pairs.add(pair)
            by_region[region].append((eff_date, idx))

    for region, entries in by_region.items():
        sorted_entries = sorted(entries, key=lambda x: x[0])

        for i in range(len(sorted_entries) - 1):
            curr_d = sorted_entries[i][0]
            next_d = sorted_entries[i + 1][0]
            delta_days = (next_d - curr_d).days

            if delta_days == 7:
                passed = True
                msg = f"Steel Index weekly interval clean for region '{region}': {curr_d} to {next_d} (7 days)."
            else:
                passed = False
                msg = f"Steel Index gap/anomaly for region '{region}': {curr_d} to {next_d} is {delta_days} days (expected 7)."

            results.append(ValidationResult(
                rule_id="X8",
                passed=passed,
                message=msg,
                row_reference={"region_label": region, "curr_date": str(curr_d), "next_date": str(next_d), "delta_days": delta_days}
            ))

    return results


def validate_x9_gst_logic_at_scale(sales_rows: List[Any], purchase_rows: List[Any]) -> List[ValidationResult]:
    """
    X9: GST logic holds at full scale.
    Re-verify CGST+SGST (9+9) for intra-Gujarat transactions and IGST (18) for interstate ones,
    across complete Purchase and Sales Registers.
    """
    results: List[ValidationResult] = []

    def check_gst(row: Any, register_name: str, id_field: str) -> ValidationResult:
        row_id = get_val(row, id_field)
        inv_num = get_val(row, "invoice_number")
        is_interstate = str(get_val(row, "is_interstate")).lower() in ("true", "1")

        taxable = Decimal(str(get_val(row, "taxable_value")))
        cgst_r = Decimal(str(get_val(row, "cgst_rate")))
        sgst_r = Decimal(str(get_val(row, "sgst_rate")))
        igst_r = Decimal(str(get_val(row, "igst_rate")))

        cgst_a = Decimal(str(get_val(row, "cgst_amount")))
        sgst_a = Decimal(str(get_val(row, "sgst_amount")))
        igst_a = Decimal(str(get_val(row, "igst_amount")))
        tot_gst = Decimal(str(get_val(row, "total_gst")))
        inv_amt = Decimal(str(get_val(row, "invoice_amount")))

        if is_interstate:
            exp_cgst_r, exp_sgst_r, exp_igst_r = Decimal("0.00"), Decimal("0.00"), Decimal("18.00")
            exp_cgst_a, exp_sgst_a = Decimal("0.00"), Decimal("0.00")
            exp_igst_a = round(taxable * Decimal("0.18"), 2)
        else:
            exp_cgst_r, exp_sgst_r, exp_igst_r = Decimal("9.00"), Decimal("9.00"), Decimal("0.00")
            exp_cgst_a = round(taxable * Decimal("0.09"), 2)
            exp_sgst_a = round(taxable * Decimal("0.09"), 2)
            exp_igst_a = Decimal("0.00")

        exp_tot_gst = exp_cgst_a + exp_sgst_a + exp_igst_a
        exp_inv_amt = taxable + exp_tot_gst

        rate_ok = (cgst_r == exp_cgst_r and sgst_r == exp_sgst_r and igst_r == exp_igst_r)
        amt_ok = (abs(cgst_a - exp_cgst_a) <= Decimal("0.01") and
                  abs(sgst_a - exp_sgst_a) <= Decimal("0.01") and
                  abs(igst_a - exp_igst_a) <= Decimal("0.01"))
        tot_ok = (abs(tot_gst - exp_tot_gst) <= Decimal("0.01") and abs(inv_amt - exp_inv_amt) <= Decimal("0.01"))

        passed = rate_ok and amt_ok and tot_ok
        if passed:
            msg = f"{register_name} invoice {inv_num} GST logic valid (interstate={is_interstate}, taxable={taxable}, total_gst={tot_gst})."
        else:
            msg = (
                f"{register_name} invoice {inv_num} GST mismatch: interstate={is_interstate}, taxable={taxable}, "
                f"actual rates=({cgst_r}, {sgst_r}, {igst_r}) vs expected=({exp_cgst_r}, {exp_sgst_r}, {exp_igst_r}), "
                f"actual gst={tot_gst} vs expected={exp_tot_gst}."
            )

        return ValidationResult(
            rule_id="X9",
            passed=passed,
            message=msg,
            row_reference={"register": register_name, "invoice_number": inv_num, "row_id": str(row_id)}
        )

    for p in purchase_rows:
        results.append(check_gst(p, "Purchase Register", "purchase_id"))

    for s in sales_rows:
        results.append(check_gst(s, "Sales Register", "sales_id"))

    return results


def read_csv_as_dicts(file_path: str) -> List[Dict[str, str]]:
    """Helper to read CSV into list of dicts."""
    if not os.path.exists(file_path):
        return []
    with open(file_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)


def run_cross_table_validation(data_dir: str, output_report_path: Optional[str] = None) -> Dict[str, List[ValidationResult]]:
    """
    Reads all 10 CSV tables from data_dir, executes X1-X9 checks,
    and optionally writes cross_table_validation_report.md.
    """
    # Load CSV datasets
    steel_index_rows = read_csv_as_dicts(os.path.join(data_dir, "05_Steel_Market_Index.csv"))
    price_history_rows = read_csv_as_dicts(os.path.join(data_dir, "06_Price_History.csv"))
    purchase_rows = read_csv_as_dicts(os.path.join(data_dir, "07_Purchase_Register.csv"))
    inventory_rows = read_csv_as_dicts(os.path.join(data_dir, "08_Inventory.csv"))
    sales_rows = read_csv_as_dicts(os.path.join(data_dir, "09_Sales_Register.csv"))
    cashbook_rows = read_csv_as_dicts(os.path.join(data_dir, "10_Cashbook.csv"))

    all_results: Dict[str, List[ValidationResult]] = {}

    all_results["X1"] = validate_x1_sales_within_stock(sales_rows, inventory_rows)
    all_results["X2"] = validate_x2_sales_not_before_purchases(sales_rows, purchase_rows)
    all_results["X3"] = validate_x3_prices_trace_to_history(sales_rows, purchase_rows, price_history_rows)
    all_results["X4"] = validate_x4_payment_status_sync(sales_rows, purchase_rows, cashbook_rows)
    all_results["X5"] = validate_x5_inventory_running_balance(inventory_rows)
    all_results["X6"] = validate_x6_reorder_flag_logic(inventory_rows)
    all_results["X7"] = validate_x7_reorder_level_flatness(inventory_rows)
    all_results["X8"] = validate_x8_steel_index_continuity(steel_index_rows)
    all_results["X9"] = validate_x9_gst_logic_at_scale(sales_rows, purchase_rows)

    if output_report_path is None:
        output_report_path = os.path.join(data_dir, "cross_table_validation_report.md")

    write_report(all_results, output_report_path, data_dir)
    return all_results


def write_report(results_by_rule: Dict[str, List[ValidationResult]], output_path: str, data_dir: str):
    """Formats and writes cross_table_validation_report.md."""
    rule_descriptions = {
        "X1": "No sale exceeds available stock at transaction time",
        "X2": "No sale predates purchase(s) stocking that SKU",
        "X3": "Transaction rates trace to Price History for (product_id, date)",
        "X4": "payment_status synchronized with Cashbook entries",
        "X5": "Inventory running balance closing == next opening",
        "X6": "reorder_flag reflects post-activity closing stock",
        "X7": "reorder_level_pcs evaluation across SKUs (Advisory)",
        "X8": "Steel Market Index weekly continuity without gaps",
        "X9": "GST calculation & rate logic at full scale",
    }

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("# Cross-Table End-to-End Validation Report\n\n")
        f.write(f"**Target Directory**: `{data_dir}`  \n")
        f.write(f"**Generated Date**: `{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}`  \n\n")

        f.write("## Executive Summary\n\n")
        f.write("| Rule ID | Rule Description | Total Checks | Passed | Failed | Status |\n")
        f.write("| :--- | :--- | :--- | :--- | :--- | :--- |\n")

        overall_passed = True
        for rule_id in ["X1", "X2", "X3", "X4", "X5", "X6", "X7", "X8", "X9"]:
            res_list = results_by_rule.get(rule_id, [])
            total = len(res_list)
            passed_cnt = sum(1 for r in res_list if r.passed)
            failed_cnt = total - passed_cnt
            status = "✅ PASS" if failed_cnt == 0 else "❌ FAIL"
            if failed_cnt > 0 and rule_id != "X7":
                overall_passed = False

            desc = rule_descriptions.get(rule_id, "")
            f.write(f"| `{rule_id}` | {desc} | {total} | {passed_cnt} | {failed_cnt} | {status} |\n")

        f.write("\n---\n\n")
        f.write("## Generator Behavior & Rule Specific Audits\n\n")

        # X6 status details
        x6_res = results_by_rule.get("X6", [])
        x6_failed = [r for r in x6_res if not r.passed]
        f.write("### Rule X6 — Reorder Flag Logic Audit\n")
        if not x6_failed:
            f.write("> **Status**: ✅ **Confirmed Fixed Post-Smoke-Test**. `reorder_flag` correctly evaluates post-activity `closing_qty_pcs` across all inventory records.\n\n")
        else:
            f.write(f"> **Status**: ❌ **Failures Detected**: {len(x6_failed)} rows failed reorder_flag check.\n\n")

        # X7 status details
        x7_res = results_by_rule.get("X7", [])
        if x7_res:
            f.write("### Rule X7 — Reorder Level Flatness Advisory Note\n")
            f.write(f"> [!NOTE]\n> {x7_res[0].message}\n\n")

        f.write("---\n\n")
        f.write("## Detailed Failure Log\n\n")

        total_failures = 0
        for rule_id in ["X1", "X2", "X3", "X4", "X5", "X6", "X7", "X8", "X9"]:
            res_list = results_by_rule.get(rule_id, [])
            failures = [r for r in res_list if not r.passed]
            if failures:
                total_failures += len(failures)
                f.write(f"### Rule `{rule_id}` Failures ({len(failures)})\n\n")
                for fail in failures:
                    f.write(f"- **Message**: {fail.message}\n")
                    if fail.row_reference:
                        f.write(f"  - **Reference**: `{fail.row_reference}`\n")
                f.write("\n")

        if total_failures == 0:
            f.write("> ✅ **Zero Failures**: All structural cross-table integrity rules passed with 0 errors across the complete dataset.\n\n")


if __name__ == "__main__":
    target_dir = os.path.join("data", "generated")
    print(f"Executing Cross-Table Validation against '{target_dir}'...")
    results = run_cross_table_validation(target_dir)
    print("Cross-Table Validation complete. Written to 'data/generated/cross_table_validation_report.md'.")
