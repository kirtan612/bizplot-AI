"""
Unit and Integration Tests for BizPilot AI Data Import Pipeline (scripts/load_to_db.py).
"""

import os
import sys
import csv
import uuid
import tempfile
# pyrefly: ignore [missing-import]
import pytest
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.db.models import Base, Company
from src.db.models.master_data import Product
from src.db.models.import_tracking import ImportJob, ImportFile, ImportLog
from scripts.load_to_db import process_import
from scripts.seed_company_and_users import seed_database


@pytest.fixture
def test_db_engine():
    """Create a temporary SQLite database for isolated pipeline testing."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    seed_database(engine=engine)
    yield engine
    engine.dispose()


def test_dry_run_leaves_db_unchanged(test_db_engine):
    """Test that --dry-run validates data but commits 0 domain rows."""
    SessionLocal = sessionmaker(bind=test_db_engine)
    session = SessionLocal()

    # Pre-check product count
    initial_product_cnt = session.query(Product).count()

    # Execute dry-run
    success = process_import(
        source_dir="data/generated/",
        dry_run=True,
        session=session
    )

    assert success is True
    # Verify no products were inserted into the DB session after dry-run
    final_product_cnt = session.query(Product).count()
    assert final_product_cnt == initial_product_cnt
    session.close()


def test_real_import_and_idempotency(test_db_engine):
    """Test first real load inserts rows and second load is idempotent (0 new inserts)."""
    SessionLocal = sessionmaker(bind=test_db_engine)
    session = SessionLocal()

    # Run 1: First real import
    success_run1 = process_import(
        source_dir="data/generated/",
        dry_run=False,
        session=session
    )
    assert success_run1 is True

    product_cnt_after_run1 = session.query(Product).count()
    assert product_cnt_after_run1 == 140

    jobs_after_run1 = session.query(ImportJob).all()
    assert len(jobs_after_run1) == 1
    assert jobs_after_run1[0].status == "completed"

    # Run 2: Second real import (Idempotency check)
    session2 = SessionLocal()
    success_run2 = process_import(
        source_dir="data/generated/",
        dry_run=False,
        session=session2
    )
    assert success_run2 is True

    product_cnt_after_run2 = session2.query(Product).count()
    assert product_cnt_after_run2 == 140  # No duplicate products added!

    jobs_after_run2 = session2.query(ImportJob).all()
    assert len(jobs_after_run2) == 2
    assert jobs_after_run2[1].status == "completed"

    session.close()
    session2.close()


def test_corrupted_row_is_skipped_and_logged(test_db_engine):
    """Test that a bad CSV row is logged to import_logs and skipped without failing valid rows."""
    SessionLocal = sessionmaker(bind=test_db_engine)
    session = SessionLocal()

    company = session.query(Company).first()

    with tempfile.TemporaryDirectory() as tmpdir:
        # Create 01_Product_Master.csv with 1 valid row and 1 invalid row (bad category enum)
        prod_csv = os.path.join(tmpdir, "01_Product_Master.csv")
        headers = [
            'product_id', 'product_code', 'brand', 'category', 'shape', 'size',
            'weight_class', 'weight_per_meter', 'length', 'gst', 'hsn_code',
            'standard_ref', 'active', 'created_at', 'updated_at'
        ]
        id1 = str(uuid.uuid4())
        id2 = str(uuid.uuid4())
        rows = [
            [
                id1, 'TEST-PROD-001', 'APL Apollo', 'GI',
                'Round', '15NB', 'Light', '1.2200', '6.00', '18.00', '7306', 'IS1239', 'True',
                '2024-04-01T00:00:00Z', '2024-04-01T00:00:00Z'
            ],
            [
                id2, 'TEST-PROD-002', 'APL Apollo', 'INVALID_CAT',
                'Round', '15NB', 'Light', '1.2200', '6.00', '18.00', '7306', 'IS1239', 'True',
                '2024-04-01T00:00:00Z', '2024-04-01T00:00:00Z'
            ]
        ]

        with open(prod_csv, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            writer.writerows(rows)

        # Run import against temp dir
        success = process_import(
            source_dir=tmpdir,
            dry_run=False,
            session=session
        )

        assert success is False  # Completed with errors due to row failure

        # Verify only 1 product was inserted
        inserted_product = session.query(Product).filter_by(product_code="TEST-PROD-001").first()
        assert inserted_product is not None

        failed_product = session.query(Product).filter_by(product_code="TEST-PROD-002").first()
        assert failed_product is None

        # Verify error log was written
        job = session.query(ImportJob).first()
        assert job.status == "completed_with_errors"

        err_log = session.query(ImportLog).filter_by(level="ERROR").first()
        assert err_log is not None
        assert "Schema Error" in err_log.message
        assert err_log.row_ref == 3  # Header is line 1, row 2 is line 3

    session.close()
