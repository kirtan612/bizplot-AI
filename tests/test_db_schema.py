"""
Unit Tests for Database Models & Schema Metadata
BizPilot AI Database
"""

import pytest
from sqlalchemy import create_engine, inspect
from src.db.models import (
    Base,
    Company,
    User,
    Role,
    CompanyMember,
    ImportJob,
    ImportFile,
    ImportLog,
    CompanyMaster,
    Product,
    Supplier,
    Customer,
    SteelIndex,
    PriceHistory,
    Purchase,
    Sale,
    Cashbook,
    InventorySnapshot,
)
from scripts.seed_company_and_users import seed_database, verify_password


def test_all_tables_in_metadata():
    """Verify all 17 scaffolding and business tables are defined in SQLAlchemy metadata."""
    expected_tables = {
        "companies",
        "users",
        "roles",
        "company_members",
        "import_jobs",
        "import_files",
        "import_logs",
        "company_master",
        "products",
        "suppliers",
        "customers",
        "steel_index",
        "price_history",
        "purchases",
        "sales",
        "inventory_snapshots",
        "cashbook",
    }
    registered_tables = set(Base.metadata.tables.keys())
    assert expected_tables.issubset(registered_tables), (
        f"Missing tables in metadata: {expected_tables - registered_tables}"
    )


def test_unique_constraints():
    """Verify multi-tenant compound unique constraints on business tables."""
    products_table = Base.metadata.tables["products"]
    purchases_table = Base.metadata.tables["purchases"]
    sales_table = Base.metadata.tables["sales"]
    cashbook_table = Base.metadata.tables["cashbook"]

    # Check products (company_id, product_code)
    prod_uqs = [c.name for c in products_table.constraints if hasattr(c, "columns")]
    assert "uq_company_product_code" in prod_uqs

    # Check purchases (company_id, invoice_number)
    pur_uqs = [c.name for c in purchases_table.constraints if hasattr(c, "columns")]
    assert "uq_company_purchase_invoice" in pur_uqs

    # Check sales (company_id, invoice_number)
    sal_uqs = [c.name for c in sales_table.constraints if hasattr(c, "columns")]
    assert "uq_company_sales_invoice" in sal_uqs

    # Check cashbook (company_id, voucher_number)
    cb_uqs = [c.name for c in cashbook_table.constraints if hasattr(c, "columns")]
    assert "uq_company_cashbook_voucher" in cb_uqs


def test_in_memory_db_seeding():
    """Test seeding company, roles, and demo users using an in-memory SQLite database."""
    engine = create_engine("sqlite:///:memory:")
    passwords = seed_database(engine=engine)

    assert "admin_demo" in passwords
    assert "staff_demo" in passwords
    assert len(passwords["admin_demo"]) >= 12
    assert len(passwords["staff_demo"]) >= 12

    # Verify database contents
    from sqlalchemy.orm import sessionmaker
    session = sessionmaker(bind=engine)()

    companies = session.query(Company).all()
    assert len(companies) == 1
    assert companies[0].code == "COMP-001"

    roles = session.query(Role).all()
    role_names = {r.name for r in roles}
    assert {"admin", "staff"}.issubset(role_names)

    users = session.query(User).all()
    assert len(users) == 2
    for user in users:
        # Verify passwords are bcrypt hashed, not plaintext
        assert user.password_hash.startswith("$2b$") or user.password_hash.startswith("$2a$")
        # Verify password verification works
        raw_pass = passwords[user.username]
        assert verify_password(raw_pass, user.password_hash)

    members = session.query(CompanyMember).all()
    assert len(members) == 2

    session.close()
