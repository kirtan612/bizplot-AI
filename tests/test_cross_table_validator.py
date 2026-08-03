import uuid
from decimal import Decimal
from datetime import date, timedelta
# pyrefly: ignore [missing-import]
import pytest

from src.validators.cross_table_validator import (
    validate_x1_sales_within_stock,
    validate_x2_sales_not_before_purchases,
    validate_x3_prices_trace_to_history,
    validate_x4_payment_status_sync,
    validate_x5_inventory_running_balance,
    validate_x6_reorder_flag_logic,
    validate_x7_reorder_level_flatness,
    validate_x8_steel_index_continuity,
    validate_x9_gst_logic_at_scale,
)

PROD_ID = uuid.uuid4()


def test_x1_sales_within_stock_pass():
    inv_rows = [{
        "product_id": str(PROD_ID),
        "snapshot_date": "2024-04-01",
        "opening_qty_pcs": 100,
        "purchased_qty_pcs": 50,
        "sold_qty_pcs": 80,
        "closing_qty_pcs": 70,
    }]
    sales_rows = [{
        "invoice_number": "INV-SAL-001",
        "product_id": str(PROD_ID),
        "sales_date": "2024-04-01",
        "quantity_pcs": 80,
    }]
    res = validate_x1_sales_within_stock(sales_rows, inv_rows)
    assert len(res) == 1
    assert res[0].passed is True


def test_x1_sales_within_stock_fail():
    inv_rows = [{
        "product_id": str(PROD_ID),
        "snapshot_date": "2024-04-01",
        "opening_qty_pcs": 10,
        "purchased_qty_pcs": 0,
        "sold_qty_pcs": 50,
        "closing_qty_pcs": -40,
    }]
    sales_rows = [{
        "invoice_number": "INV-SAL-002",
        "product_id": str(PROD_ID),
        "sales_date": "2024-04-01",
        "quantity_pcs": 50,
    }]
    res = validate_x1_sales_within_stock(sales_rows, inv_rows)
    assert len(res) == 1
    assert res[0].passed is False


def test_x2_sales_not_before_purchases_pass():
    sales = [{"product_id": str(PROD_ID), "sales_date": "2024-04-10"}]
    purchases = [{"product_id": str(PROD_ID), "purchase_date": "2024-04-01"}]
    res = validate_x2_sales_not_before_purchases(sales, purchases)
    assert len(res) == 1
    assert res[0].passed is True


def test_x2_sales_not_before_purchases_fail():
    sales = [{"product_id": str(PROD_ID), "sales_date": "2024-04-01"}]
    purchases = [{"product_id": str(PROD_ID), "purchase_date": "2024-04-10"}]
    res = validate_x2_sales_not_before_purchases(sales, purchases)
    assert len(res) == 1
    assert res[0].passed is False


def test_x3_prices_trace_to_history_pass():
    ph = [{
        "product_id": str(PROD_ID),
        "effective_date": "2024-04-01",
        "effective_purchase_price_per_kg": "60.00",
        "effective_sales_price_per_kg": "70.00",
    }]
    pur = [{
        "invoice_number": "INV-PUR-001",
        "product_id": str(PROD_ID),
        "purchase_date": "2024-04-01",
        "unit_price_per_kg": "60.00",
    }]
    sal = [{
        "invoice_number": "INV-SAL-001",
        "product_id": str(PROD_ID),
        "sales_date": "2024-04-01",
        "unit_price_per_kg": "70.00",
    }]
    res = validate_x3_prices_trace_to_history(sal, pur, ph)
    assert all(r.passed for r in res)


def test_x3_prices_trace_to_history_fail():
    ph = [{
        "product_id": str(PROD_ID),
        "effective_date": "2024-04-01",
        "effective_purchase_price_per_kg": "60.00",
        "effective_sales_price_per_kg": "70.00",
    }]
    pur = [{
        "invoice_number": "INV-PUR-001",
        "product_id": str(PROD_ID),
        "purchase_date": "2024-04-01",
        "unit_price_per_kg": "65.00",  # Mismatch
    }]
    res = validate_x3_prices_trace_to_history([], pur, ph)
    assert len(res) == 1
    assert res[0].passed is False


def test_x4_payment_status_sync_pass():
    pur = [{"invoice_number": "INV-PUR-100", "payment_status": "Paid"}]
    sal = [{"invoice_number": "INV-SAL-100", "payment_status": "Unpaid"}]
    cb = [{
        "entry_id": uuid.uuid4(),
        "transaction_type": "Payment",
        "party_type": "Supplier",
        "reference_invoice_number": "INV-PUR-100",
    }]
    res = validate_x4_payment_status_sync(sal, pur, cb)
    assert all(r.passed for r in res)


def test_x4_payment_status_sync_fail():
    pur = [{"invoice_number": "INV-PUR-100", "payment_status": "Paid"}]
    sal = []
    cb = []  # Paid purchase invoice missing from cashbook
    res = validate_x4_payment_status_sync(sal, pur, cb)
    assert any(not r.passed for r in res)


def test_x5_inventory_running_balance_pass():
    inv_rows = [
        {
            "product_id": str(PROD_ID),
            "snapshot_date": "2024-04-01",
            "closing_qty_pcs": 100,
            "closing_weight_kg": "1000.00",
        },
        {
            "product_id": str(PROD_ID),
            "snapshot_date": "2024-04-05",
            "opening_qty_pcs": 100,
            "opening_weight_kg": "1000.00",
        },
    ]
    res = validate_x5_inventory_running_balance(inv_rows)
    assert len(res) == 1
    assert res[0].passed is True


def test_x5_inventory_running_balance_fail():
    inv_rows = [
        {
            "product_id": str(PROD_ID),
            "snapshot_date": "2024-04-01",
            "closing_qty_pcs": 100,
            "closing_weight_kg": "1000.00",
        },
        {
            "product_id": str(PROD_ID),
            "snapshot_date": "2024-04-05",
            "opening_qty_pcs": 80,  # Mismatch
            "opening_weight_kg": "1000.00",
        },
    ]
    res = validate_x5_inventory_running_balance(inv_rows)
    assert len(res) == 1
    assert res[0].passed is False


def test_x6_reorder_flag_logic():
    inv_rows = [
        {
            "inventory_id": str(uuid.uuid4()),
            "product_id": str(PROD_ID),
            "snapshot_date": "2024-04-01",
            "closing_qty_pcs": 100,
            "reorder_level_pcs": 150,
            "reorder_flag": True,  # 100 <= 150
        },
        {
            "inventory_id": str(uuid.uuid4()),
            "product_id": str(PROD_ID),
            "snapshot_date": "2024-04-02",
            "closing_qty_pcs": 200,
            "reorder_level_pcs": 150,
            "reorder_flag": False,  # 200 > 150
        },
    ]
    res = validate_x6_reorder_flag_logic(inv_rows)
    assert len(res) == 2
    assert all(r.passed for r in res)


def test_x7_reorder_level_flatness():
    inv_rows = [
        {"product_id": "P1", "reorder_level_pcs": 150},
        {"product_id": "P2", "reorder_level_pcs": 150},
    ]
    res = validate_x7_reorder_level_flatness(inv_rows)
    assert len(res) == 1
    assert "flat (150)" in res[0].message


def test_x8_steel_index_continuity_pass():
    rows = [
        {"index_id": "1", "region_label": "Raipur/CG", "effective_date": "2024-04-01"},
        {"index_id": "2", "region_label": "Raipur/CG", "effective_date": "2024-04-08"},
        {"index_id": "3", "region_label": "Raipur/CG", "effective_date": "2024-04-15"},
    ]
    res = validate_x8_steel_index_continuity(rows)
    assert len(res) == 2
    assert all(r.passed for r in res)


def test_x8_steel_index_continuity_gap():
    rows = [
        {"index_id": "1", "region_label": "Raipur/CG", "effective_date": "2024-04-01"},
        {"index_id": "2", "region_label": "Raipur/CG", "effective_date": "2024-04-15"},  # 14-day gap
    ]
    res = validate_x8_steel_index_continuity(rows)
    assert len(res) == 1
    assert res[0].passed is False


def test_x9_gst_logic_at_scale():
    purchases = [{
        "purchase_id": str(uuid.uuid4()),
        "invoice_number": "INV-PUR-001",
        "is_interstate": False,
        "taxable_value": "1000.00",
        "cgst_rate": "9.00",
        "cgst_amount": "90.00",
        "sgst_rate": "9.00",
        "sgst_amount": "90.00",
        "igst_rate": "0.00",
        "igst_amount": "0.00",
        "total_gst": "180.00",
        "invoice_amount": "1180.00",
    }]
    sales = [{
        "sales_id": str(uuid.uuid4()),
        "invoice_number": "INV-SAL-001",
        "is_interstate": True,
        "taxable_value": "2000.00",
        "cgst_rate": "0.00",
        "cgst_amount": "0.00",
        "sgst_rate": "0.00",
        "sgst_amount": "0.00",
        "igst_rate": "18.00",
        "igst_amount": "360.00",
        "total_gst": "360.00",
        "invoice_amount": "2360.00",
    }]
    res = validate_x9_gst_logic_at_scale(sales, purchases)
    assert len(res) == 2
    assert all(r.passed for r in res)
