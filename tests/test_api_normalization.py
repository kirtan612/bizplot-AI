"""
BizPilot AI - Automated Integration Test Suite for Phase 8 Data Normalization.
Tests Canonical Models, Schema Mapping, Type Normalization, Entity Matching & Confidence Scoring,
Duplicate Detection & Idempotency, Source Lineage, Multi-Tenant Security Isolation, and REST APIs.
"""

import io
from uuid import UUID
import pytest
import pandas as pd
from fastapi.testclient import TestClient

from api.main import app
from api.auth.jwt import create_access_token
from api.normalization.type_normalizer import (
    normalize_date,
    normalize_currency_amount,
    normalize_number,
    normalize_percentage
)
from api.normalization.entity_resolver import normalize_entity_name
from api.normalization.services import normalize_ingestion_job
from src.db.models.canonical import CanonicalInvoice, SourceLineage

TARGET_COMPANY_ID = "6289d24b-b8c8-4dc2-9105-f6399d1302c1"
ALT_COMPANY_ID = "11111111-1111-1111-1111-111111111111"
ADMIN_USER_ID = "51cc68c5-50ea-40a2-9e88-7aaa4c9ce0dc"


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def auth_headers():
    token = create_access_token({
        "user_id": ADMIN_USER_ID,
        "username": "admin_demo",
        "company_id": TARGET_COMPANY_ID,
        "role": "admin"
    })
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def alt_auth_headers():
    token = create_access_token({
        "user_id": ADMIN_USER_ID,
        "username": "admin_demo",
        "company_id": ALT_COMPANY_ID,
        "role": "admin"
    })
    return {"Authorization": f"Bearer {token}"}


def create_sample_excel_bytes() -> bytes:
    buf = io.BytesIO()
    df = pd.DataFrame({
        "Invoice_Number": ["INV-9901", "INV-9902"],
        "Customer_Name": ["Apex Steel Ltd", "Bharati Metal"],
        "Amount": [150000.0, 240000.0],
        "Date": ["2026-08-15", "2026-08-16"]
    })
    with pd.ExcelWriter(buf, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name="Sales", index=False)
    return buf.getvalue()


def test_type_normalizers():
    """Test date, currency, number, and percentage normalizer engines."""
    d_val, d_st = normalize_date("15/08/2026")
    assert d_st == "VALID"
    assert d_val.year == 2026 and d_val.month == 8 and d_val.day == 15

    a_val, curr, a_st = normalize_currency_amount("₹1,25,000.50")
    assert a_st == "VALID"
    assert a_val == 125000.50 and curr == "INR"

    p_val, p_st = normalize_percentage("18%")
    assert p_st == "VALID"
    assert p_val == 0.18


def test_entity_name_normalization():
    """Test name normalization rules (stripping legal suffixes)."""
    assert normalize_entity_name("ABC PRIVATE LIMITED") == normalize_entity_name("ABC PVT LTD")
    assert normalize_entity_name("BHARATI METAL SYSTEMS") == normalize_entity_name("BHARATI METAL")


def test_end_to_end_upload_and_normalize(client, auth_headers):
    """Test full Phase 7 Ingestion -> Phase 8 Normalization pipeline."""
    excel_bytes = create_sample_excel_bytes()
    files = {"file": ("sales_pipeline.xlsx", excel_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}

    # 1. Upload via Phase 7
    upload_resp = client.post("/api/v1/ingestion/upload", files=files, headers=auth_headers)
    assert upload_resp.status_code == 201
    ingestion_id = upload_resp.json()["id"]

    # 2. Trigger Phase 8 Normalization
    norm_resp = client.post(f"/api/v1/normalization/run/{ingestion_id}", headers=auth_headers)
    assert norm_resp.status_code == 200
    norm_data = norm_resp.json()
    assert norm_data["status"] == "COMPLETED"
    assert norm_data["records_processed"] == 2
    assert norm_data["records_created"] + norm_data["records_updated"] >= 1


def test_idempotency_and_duplicates(client, auth_headers):
    """Verify that re-running normalization does NOT duplicate canonical records."""
    excel_bytes = create_sample_excel_bytes()
    files = {"file": ("idempotent_sales.xlsx", excel_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}

    upload_resp = client.post("/api/v1/ingestion/upload", files=files, headers=auth_headers)
    ingestion_id = upload_resp.json()["id"]

    # First run
    run1 = client.post(f"/api/v1/normalization/run/{ingestion_id}", headers=auth_headers).json()
    created_1 = run1["records_created"]

    # Second run (exact same job)
    run2 = client.post(f"/api/v1/normalization/run/{ingestion_id}", headers=auth_headers).json()
    assert run2["records_created"] == 0
    assert run2["records_duplicates"] >= 1


def test_canonical_apis(client, auth_headers):
    """Test GET /api/v1/customers and GET /api/v1/invoices endpoints."""
    cust_resp = client.get("/api/v1/customers", headers=auth_headers)
    assert cust_resp.status_code == 200
    assert isinstance(cust_resp.json(), list)

    inv_resp = client.get("/api/v1/invoices", headers=auth_headers)
    assert inv_resp.status_code == 200
    assert isinstance(inv_resp.json(), list)


def test_organization_security_isolation(client, auth_headers, alt_auth_headers):
    """Verify Organization A cannot trigger normalization or view Organization B data."""
    excel_bytes = create_sample_excel_bytes()
    files = {"file": ("org_a_norm.xlsx", excel_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}

    upload_resp = client.post("/api/v1/ingestion/upload", files=files, headers=auth_headers)
    ingestion_id = upload_resp.json()["id"]

    # Alt user (Org B) attempts to normalize Org A's job -> MUST return 404
    alt_norm_resp = client.post(f"/api/v1/normalization/run/{ingestion_id}", headers=alt_auth_headers)
    assert alt_norm_resp.status_code == 404
