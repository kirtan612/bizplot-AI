"""
BizPilot AI - Data Extraction Module
Extracts multi-tenant business data from PostgreSQL for company_id.
"""

import os
import sys
from typing import Dict, Optional
import pandas as pd

from sqlalchemy import create_engine

# Ensure project root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:0613@127.0.0.1:5432/bizpilot")


def get_db_engine():
    """Returns SQLAlchemy engine for PostgreSQL database."""
    return create_engine(DB_URL)


def extract_company_info(company_id: str, engine=None) -> pd.DataFrame:
    """Extract master organization company record."""
    if engine is None:
        engine = get_db_engine()
    query = """
        SELECT * FROM company_master
        WHERE company_id = %(company_id)s AND deleted_at IS NULL;
    """
    return pd.read_sql_query(query, engine, params={"company_id": company_id})


def extract_customers(company_id: str, engine=None) -> pd.DataFrame:
    """Extract active customers for specified organization."""
    if engine is None:
        engine = get_db_engine()
    query = """
        SELECT 
            id AS customer_id,
            company_id,
            customer_code,
            customer_name,
            customer_type,
            city,
            state,
            pincode,
            gst_registered,
            credit_limit,
            credit_period_days,
            payment_behavior_tier,
            active,
            onboarding_date,
            created_at
        FROM customers
        WHERE company_id = %(company_id)s AND deleted_at IS NULL;
    """
    df = pd.read_sql_query(query, engine, params={"company_id": company_id})
    df['onboarding_date'] = pd.to_datetime(df['onboarding_date'])
    return df


def extract_suppliers(company_id: str, engine=None) -> pd.DataFrame:
    """Extract active suppliers for specified organization."""
    if engine is None:
        engine = get_db_engine()
    query = """
        SELECT 
            id AS supplier_id,
            company_id,
            supplier_code,
            supplier_name,
            supplier_tier,
            city,
            state,
            credit_period_days,
            active,
            onboarding_date
        FROM suppliers
        WHERE company_id = %(company_id)s AND deleted_at IS NULL;
    """
    df = pd.read_sql_query(query, engine, params={"company_id": company_id})
    df['onboarding_date'] = pd.to_datetime(df['onboarding_date'])
    return df


def extract_products(company_id: str, engine=None) -> pd.DataFrame:
    """Extract product SKU master catalog for specified organization."""
    if engine is None:
        engine = get_db_engine()
    query = """
        SELECT 
            id AS product_id,
            company_id,
            product_code,
            brand,
            category,
            shape,
            size,
            weight_class,
            weight_per_meter,
            length,
            gst,
            hsn_code,
            standard_ref,
            active
        FROM products
        WHERE company_id = %(company_id)s AND deleted_at IS NULL;
    """
    return pd.read_sql_query(query, engine, params={"company_id": company_id})


def extract_sales(company_id: str, engine=None, start_date: Optional[str] = None, end_date: Optional[str] = None) -> pd.DataFrame:
    """Extract sales transactions for specified organization."""
    if engine is None:
        engine = get_db_engine()
    
    query = """
        SELECT 
            id AS sales_id,
            company_id,
            invoice_number,
            sales_date,
            customer_id,
            customer_code,
            product_id,
            product_code,
            quantity_pcs,
            total_weight_kg,
            unit_price_per_kg,
            taxable_value,
            is_interstate,
            cgst_amount,
            sgst_amount,
            igst_amount,
            total_gst,
            invoice_amount,
            payment_status,
            payment_due_date,
            created_at
        FROM sales
        WHERE company_id = %(company_id)s AND deleted_at IS NULL
    """
    params = {"company_id": company_id}
    if start_date:
        query += " AND sales_date >= %(start_date)s"
        params["start_date"] = start_date
    if end_date:
        query += " AND sales_date <= %(end_date)s"
        params["end_date"] = end_date
        
    query += " ORDER BY sales_date ASC;"
    
    df = pd.read_sql_query(query, engine, params=params)
    df['sales_date'] = pd.to_datetime(df['sales_date'])
    df['payment_due_date'] = pd.to_datetime(df['payment_due_date'])
    return df


def extract_purchases(company_id: str, engine=None, start_date: Optional[str] = None, end_date: Optional[str] = None) -> pd.DataFrame:
    """Extract purchase transactions for specified organization."""
    if engine is None:
        engine = get_db_engine()
        
    query = """
        SELECT 
            id AS purchase_id,
            company_id,
            invoice_number,
            purchase_date,
            supplier_id,
            supplier_code,
            product_id,
            product_code,
            quantity_pcs,
            total_weight_kg,
            unit_price_per_kg,
            taxable_value,
            is_interstate,
            cgst_amount,
            sgst_amount,
            igst_amount,
            total_gst,
            invoice_amount,
            payment_status,
            payment_due_date,
            created_at
        FROM purchases
        WHERE company_id = %(company_id)s AND deleted_at IS NULL
    """
    params = {"company_id": company_id}
    if start_date:
        query += " AND purchase_date >= %(start_date)s"
        params["start_date"] = start_date
    if end_date:
        query += " AND purchase_date <= %(end_date)s"
        params["end_date"] = end_date
        
    query += " ORDER BY purchase_date ASC;"
    
    df = pd.read_sql_query(query, engine, params=params)
    df['purchase_date'] = pd.to_datetime(df['purchase_date'])
    df['payment_due_date'] = pd.to_datetime(df['payment_due_date'])
    return df


def extract_cashbook(company_id: str, engine=None, start_date: Optional[str] = None, end_date: Optional[str] = None) -> pd.DataFrame:
    """Extract cashbook vouchers for specified organization."""
    if engine is None:
        engine = get_db_engine()
        
    query = """
        SELECT 
            id AS entry_id,
            company_id,
            entry_date,
            voucher_number,
            transaction_type,
            party_type,
            party_id,
            party_name,
            payment_mode,
            amount,
            reference_invoice_number,
            opening_balance,
            closing_balance,
            narration,
            created_at
        FROM cashbook
        WHERE company_id = %(company_id)s AND deleted_at IS NULL
    """
    params = {"company_id": company_id}
    if start_date:
        query += " AND entry_date >= %(start_date)s"
        params["start_date"] = start_date
    if end_date:
        query += " AND entry_date <= %(end_date)s"
        params["end_date"] = end_date
        
    query += " ORDER BY entry_date ASC, created_at ASC;"
    
    df = pd.read_sql_query(query, engine, params=params)
    df['entry_date'] = pd.to_datetime(df['entry_date'])
    return df


def extract_inventory_snapshots(company_id: str, engine=None) -> pd.DataFrame:
    """Extract stock snapshots and valuations for specified organization."""
    if engine is None:
        engine = get_db_engine()
    query = """
        SELECT 
            id AS inventory_id,
            company_id,
            snapshot_date,
            product_id,
            product_code,
            opening_qty_pcs,
            opening_weight_kg,
            purchased_qty_pcs,
            purchased_weight_kg,
            sold_qty_pcs,
            sold_weight_kg,
            closing_qty_pcs,
            closing_weight_kg,
            unit_cost_per_kg,
            inventory_valuation,
            reorder_level_pcs,
            reorder_flag
        FROM inventory_snapshots
        WHERE company_id = %(company_id)s AND deleted_at IS NULL
        ORDER BY snapshot_date ASC;
    """
    df = pd.read_sql_query(query, engine, params={"company_id": company_id})
    df['snapshot_date'] = pd.to_datetime(df['snapshot_date'])
    return df


def extract_steel_index(company_id: str, engine=None) -> pd.DataFrame:
    """Extract steel raw material market index points."""
    if engine is None:
        engine = get_db_engine()
    query = """
        SELECT 
            id AS index_id,
            company_id,
            effective_date,
            national_rate_per_kg,
            regional_rate_per_kg,
            region_label,
            source_type,
            change_reason
        FROM steel_index
        WHERE company_id = %(company_id)s AND deleted_at IS NULL
        ORDER BY effective_date ASC;
    """
    df = pd.read_sql_query(query, engine, params={"company_id": company_id})
    df['effective_date'] = pd.to_datetime(df['effective_date'])
    return df


def extract_all_raw_data(company_id: str) -> Dict[str, pd.DataFrame]:
    """Extract complete dataset dictionary for specified organization."""
    engine = get_db_engine()
    return {
        "company": extract_company_info(company_id, engine),
        "customers": extract_customers(company_id, engine),
        "suppliers": extract_suppliers(company_id, engine),
        "products": extract_products(company_id, engine),
        "sales": extract_sales(company_id, engine),
        "purchases": extract_purchases(company_id, engine),
        "cashbook": extract_cashbook(company_id, engine),
        "inventory": extract_inventory_snapshots(company_id, engine),
        "steel_index": extract_steel_index(company_id, engine),
    }
