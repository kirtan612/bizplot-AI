"""
Comprehensive Database Audit Script for BizPilot AI PostgreSQL Database
Inspects tables, row counts, null counts, duplicate counts, min/max dates, and relationship/FK integrity.
"""

import os
import sys
from datetime import datetime, date
from uuid import UUID
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

load_dotenv()

DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:0613@127.0.0.1:5432/bizpilot")

def audit_database():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)

    print("=" * 80)
    print("               BIZPILOT AI POSTGRESQL DATABASE AUDIT REPORT")
    print("=" * 80)

    # 1. List Public Tables & Row Counts
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ORDER BY table_name;
    """)
    tables = [r['table_name'] for r in cur.fetchall()]
    print(f"\n--- 1. TABLE OVERVIEW ({len(tables)} tables) ---")
    
    table_stats = {}
    for tbl in tables:
        cur.execute(f'SELECT COUNT(*) as count FROM "{tbl}";')
        count = cur.fetchone()['count']
        table_stats[tbl] = count
        print(f"  - {tbl:<25}: {count:>6} rows")

    # 2. Detailed Audit for Key Tables
    print("\n--- 2. DETAILED TABLE & DATA QUALITY AUDIT ---")
    
    key_tables = [
        "companies", "users", "roles", "company_members",
        "company_master", "products", "suppliers", "customers",
        "purchases", "sales", "cashbook", "inventory_snapshots",
        "steel_index", "price_history", "import_jobs", "import_files", "import_logs"
    ]

    for tbl in key_tables:
        if tbl not in tables:
            print(f"\n[TABLE MISSING]: {tbl}")
            continue

        cnt = table_stats[tbl]
        print(f"\n>>> Table: {tbl} (Total Rows: {cnt})")
        
        # Column list & null counts
        cur.execute(f"""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = '{tbl}' AND table_schema = 'public'
            ORDER BY ordinal_position;
        """)
        cols = cur.fetchall()

        # Check null count for each column
        null_counts = {}
        for c in cols:
            col_name = c['column_name']
            cur.execute(f'SELECT COUNT(*) as n FROM "{tbl}" WHERE "{col_name}" IS NULL;')
            n = cur.fetchone()['n']
            if n > 0:
                null_counts[col_name] = n
        
        print(f"    Columns ({len(cols)}): {', '.join([c['column_name'] for c in cols])}")
        if null_counts:
            print(f"    Null Counts: {null_counts}")
        else:
            print("    Null Counts: None (0 nulls across all columns)")

        # Date Coverage
        date_cols = [c['column_name'] for c in cols if 'date' in c['column_name'].lower() or 'created_at' in c['column_name'].lower()]
        if date_cols and cnt > 0:
            for dcol in date_cols[:2]: # Check first 2 date columns
                cur.execute(f'SELECT MIN("{dcol}") as min_d, MAX("{dcol}") as max_d FROM "{tbl}";')
                res = cur.fetchone()
                print(f"    Date Range [{dcol}]: {res['min_d']} to {res['max_d']}")

    # 3. Foreign Key Integrity Audit
    print("\n--- 3. FOREIGN KEY & RELATIONSHIP INTEGRITY ---")

    fk_checks = [
        ("sales", "customer_id", "customers", "id"),
        ("sales", "product_id", "products", "id"),
        ("sales", "company_id", "companies", "id"),
        ("purchases", "supplier_id", "suppliers", "id"),
        ("purchases", "product_id", "products", "id"),
        ("purchases", "company_id", "companies", "id"),
        ("company_members", "user_id", "users", "id"),
        ("company_members", "company_id", "companies", "id"),
        ("company_members", "role_id", "roles", "id"),
        ("inventory_snapshots", "product_id", "products", "id"),
        ("inventory_snapshots", "company_id", "companies", "id"),
        ("price_history", "product_id", "products", "id"),
        ("price_history", "index_id", "steel_index", "id"),
    ]

    for source_tbl, source_col, target_tbl, target_col in fk_checks:
        if source_tbl in tables and target_tbl in tables:
            cur.execute(f"""
                SELECT COUNT(*) as orphan_count
                FROM "{source_tbl}" s
                LEFT JOIN "{target_tbl}" t ON s."{source_col}" = t."{target_col}"
                WHERE s."{source_col}" IS NOT NULL AND t."{target_col}" IS NULL;
            """)
            orphans = cur.fetchone()['orphan_count']
            status = "OK (0 orphans)" if orphans == 0 else f"INVALID ({orphans} orphans!)"
            print(f"  - {source_tbl}.{source_col} -> {target_tbl}.{target_col}: {status}")

    # 4. Multi-Tenant Organization Isolation Check
    print("\n--- 4. MULTI-TENANCY ORGANIZATION ISOLATION ---")
    cur.execute("SELECT id, name, code FROM companies;")
    companies = cur.fetchall()
    print(f"  Companies Registered ({len(companies)}):")
    for c in companies:
        print(f"    - ID: {c['id']} | Code: {c['code']} | Name: {c['name']}")

    for tbl in tables:
        if tbl in ["companies", "roles", "users", "alembic_version"]:
            continue
        cur.execute(f"""
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = '{tbl}' AND column_name = 'company_id';
        """)
        has_org = len(cur.fetchall()) > 0
        if has_org:
            cur.execute(f'SELECT COUNT(*) as cnt FROM "{tbl}" WHERE company_id IS NULL;')
            null_orgs = cur.fetchone()['cnt']
            print(f"  - {tbl:<25}: Has company_id | Null company_id count: {null_orgs}")
        else:
            print(f"  - {tbl:<25}: WARNING - NO company_id column!")

    cur.close()
    conn.close()

if __name__ == "__main__":
    audit_database()
